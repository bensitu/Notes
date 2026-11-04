# Apache Kafka fundamentals and practice :id=h-3176d392f10d

Learning objectives: understand event logs, partitions, consumer groups, and offsets, then verify reliable delivery and replayable processing. The example uses the official Apache Kafka 4.4.0 image, Confluent Python client 2.16.1, and a separate Python 3.14 environment.

[Document index](README.md) · [Kafka example guide](examples/kafka/README.md)

**Contents**

- [Kafka's model and its differences from RabbitMQ](#section-1)
- [Minimal environment and topic creation](#section-2)
- [Install the client, produce, and consume](#section-3)
- [Partitions and ordering](#section-4)
- [Offset commits, duplicates, and replay](#section-5)
- [Retries, bad messages, and the scope of exactly-once](#section-6)
- [Operational checks and verification](#section-7)
- [Official references](#section-8)

<a id="section-1"></a>

## Kafka's model and its differences from RabbitMQ :id=h-8b24fa95829a

Kafka appends records to partition logs in a topic; consumers retain their own read positions. Normal consumption and offset commits do not delete stored records. Cleanup is governed by retention / compaction and similar policies. retention removes old logs by age or size; compaction compacts old values by key to retain newer state for each key, rather than immediately deduplicating messages on arrival.

A broker is a service node that stores logs and handles reads and writes; a controller manages cluster metadata and leader election. KRaft uses Kafka's own consensus mechanism to manage this metadata, without a separate ZooKeeper deployment.

| Concept          | Meaning                                                       | Commonly misunderstood limit                                          |
| ---------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| topic            | A collection of logs for a kind of event                      | Not a database table or unique-key constraint                         |
| partition        | An independently ordered log within a topic                   | Ordering does not automatically span all partitions                   |
| key              | Bytes that can participate in partition selection             | The same key does not automatically reject duplicate events           |
| offset           | A record's position within a partition                        | Not a global event ID across partitions                               |
| consumer group   | A group of cooperating consumer instances                     | Different groups can each read the same records                       |
| committed offset | The record position from which a group resumes consumption    | Does not prove completion in an external business system              |
| lag              | Distance between the consumer position and the end of the log | Must also be interpreted alongside time and business processing speed |

In an ordinary consumer group, one consumer in the group owns a partition during a given assignment; more consumers than partitions leaves some instances idle. Independent processing by different groups is the normal way to broadcast or replay.

Classic RabbitMQ queues commonly use per-message acknowledgments and routing, whereas Kafka commonly uses partition logs, retention, and replay. Both handle various messaging scenarios; do not choose simply on claims that one is always faster.

<a id="section-2"></a>

## Minimal environment and topic creation :id=h-8f82493bb59b

First install Docker capable of running Linux containers, then enter the following directory from the repository root:

```powershell
Set-Location examples/kafka
docker compose config --quiet
docker compose up -d
docker compose ps
docker compose logs --tail 80 kafka
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --create --if-not-exists --topic notes.tasks.v1 --partitions 3 --replication-factor 1
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --describe --topic notes.tasks.v1
```

Wait until docker compose ps shows kafka as healthy, then run the topic-creation command. If it is not ready, inspect logs first.

The image digest has been verified and pinned. The environment uses single-node KRaft, with broker and controller combined and a static voter set containing only this node. This is not a highly available multi-node deployment.

The service is published only on local 127.0.0.1:9092, with no TLS / SASL configured. advertised.listeners is the address sent to clients for subsequent connections. Changing only bootstrap to a reachable address does not ensure later broker addresses are reachable.

<a id="section-3"></a>

## Install the client, produce, and consume :id=h-785615851e92

Run in the same project directory:

```powershell
uv sync --locked
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
```

This independent project pins Python 3.14 to match a precompiled client wheel available locally; it does not change the Python 3.15 environment used by other examples. The client is a Confluent-maintained open-source library and requires neither Confluent Cloud nor a hosted account.

The [complete client](examples/kafka/src/kafka_notes/demo.py) sends JSON containing schemaVersion, eventId, taskId, and title. taskId serves as the key; eventId is used for business deduplication. These serve different purposes.

A producer is a client that sends records; a consumer reads them. schemaVersion in JSON identifies the data format version so consumers can validate whether they understand it.

The producer explicitly enables idempotent delivery, acks=all, and delivery callbacks, and checks flush's remaining queue and callback errors. produce returning only means the record entered local delivery processing; do not immediately print “business operation completed.”

<a id="section-4"></a>

## Partitions and ordering :id=h-94358eb371eb

With fixed encoding and a fixed partitioning algorithm, a nonempty key normally maps to a stable partition. This example uses the Murmur2 partitioner compatible with the Java producer. Explicitly align algorithms across languages; do not assume every client's default is identical.

Changing the partition count or partitioner can change mappings. Multiple producers, business threads, and parallel consumption also affect observed order. Ordering by business entity requires constraints across the entire flow, not merely specifying a key.

Idempotency means repeating an operation produces no additional business effect. Specify whether the guarantee belongs to the delivery protocol or the business database. acks=all requires acknowledgments from replicas in the current in-sync replica set ISR; min.insync.replicas limits the minimum number of in-sync replicas for successful writes.

Replicas and partitions solve different problems: replicas provide fault tolerance, partitions distribute work and enable parallelism. This example has only one replica, so acks=all adds no redundant node; it does not establish high availability or protection against data loss under arbitrary failures.

<a id="section-5"></a>

## Offset commits, duplicates, and replay :id=h-cc7c3c366376

The client disables automatic commits and automatic offset storage. Processing order: parse and validate → record the effect and eventId in a SQLite transaction → synchronously commit the position after that message, checking returned partition-level errors.

If the database fails, do not commit the offset. A crash after database commit but before offset commit can replay the record. A database uniqueness constraint prevents the same effect for the same eventId from occurring twice; reusing ID with different content raises an error.

```powershell
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
uv run --locked notes-kafka consume --group replay-demo --limit 10
```

Publishing a second time is another application send, so Kafka may contain another record; the local effect should show new effect: False. Changing groups can reread retained records, but the same SQLite deduplication database is reused, so effects should not recur.

auto.offset.reset=earliest applies only when no usable committed position exists, the position is out of range, or similar conditions occur. It does not restart existing groups from the beginning every time. earliest is the earliest currently retained position; it does not guarantee permanent retention of all history.

<a id="section-6"></a>

## Retries, bad messages, and the scope of exactly-once :id=h-147bc650c8e1

This example stops on bad messages or database errors without committing the relevant position; it has no automatic dead-letter feature. Restarting may encounter the same issue again, requiring investigation, repair, or controlled isolation.

Production processing usually needs bounded retries, backoff, failure topics, stable event ID, and monitoring. Sending to a failure topic before committing an offset still leaves a failure window; do not skip records arbitrarily just to reduce lag.

Business deduplication must also distinguish processing responsibilities. Changing groups here replays the same business effect. Two independent business processors need separate deduplication namespaces; sharing a single global eventId record can incorrectly skip a different business operation.

Producer idempotency mainly reduces duplicates from protocol retries; it does not recognize every duplicate business request. Kafka transactions and read_committed provide applicable guarantees within suitable Kafka read/write flows, but do not automatically make SQLite, payments, or email globally exactly-once.

The effect in this example is only an event record in SQLite; external calls need their own idempotency and recovery design. For publishing across a database boundary, consider outbox / CDC and define how business commits connect to event publication.

<a id="section-7"></a>

## Operational checks and verification :id=h-f01999446568

```powershell
docker compose exec kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server 127.0.0.1:9092 --describe --group notes-demo
uv run --locked pytest
uv run --locked ruff check .
uv run --locked ruff format --check .
```

Inspect partitions, group assignments, committed positions, and lag alongside disk usage, retention policies, ISR, rebalancing, and processing time. Stop affected consumers and preview the plan before changing group offsets; replay triggers business processing again.

Six processing-boundary tests, Ruff, and Compose configuration validation currently pass locally. The test consumer is a stand-in; this does not establish that a real broker has produced, consumed, or rebalanced. See the [example guide](examples/kafka/README.md) for real integration steps.

| Symptom                                       | Check first                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| bootstrap connects, but sending fails         | advertised.listeners, network, topic, and permissions                       |
| More consumers do not improve speed           | Partition count, key distribution, and bottlenecks                          |
| The same record repeats indefinitely          | Failure position, commit results, and bad messages                          |
| Even a new group cannot read early records    | retention, compaction, and the actual starting position                     |
| Replay duplicates external effects            | eventId, deduplication records, and business side-effect boundaries         |
| Multiple producers show inconsistent ordering | Partitioning algorithm, partition count, concurrency, and business versions |

<a id="section-8"></a>

## Official references :id=h-34ded3f97d3a

- [Apache Kafka quickstart](https://kafka.apache.org/quickstart/)
- [Kafka broker configuration](https://kafka.apache.org/44/configuration/broker-configs/)
- [Kafka design](https://kafka.apache.org/44/design/design/)
- [Confluent Python API: commit results and partition errors](https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html)
- [Confluent Python client](https://docs.confluent.io/kafka-clients/python/current/overview.html)
- [librdkafka partitioning and configuration](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md)

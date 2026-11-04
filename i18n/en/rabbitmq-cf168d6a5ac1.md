# Message queue fundamentals and RabbitMQ practice :id=h-07acb114b631

Learning objectives: understand asynchronous decoupling, acknowledgments, redelivery, and idempotency; avoid treating “message sent” as “business operation completed.”

**Scope:** Teaching server: RabbitMQ 4.2; see the lockfile for the Python pika version. The example uses AMQP 0-9-1, durable topology, and manual acknowledgments. Start the middleware containers first.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [The steps a message passes through](#section-1)
- [Minimal run instructions](#section-2)
- [Acknowledgments and local business effects](#section-3)
- [Dead letters and failure handling](#section-4)
- [Consistency between the database and messages](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## The steps a message passes through :id=h-048e030c61d7

Producer → exchange routes by routing key → queue stores pending messages → consumer performs business processing → consumer acknowledges.

An exchange is not a queue. A publisher confirmation only means the broker has acknowledged the send as specified, not that consumer business processing completed. A consumer acknowledgment does not prove the producer received a receipt either.

| Mechanism           | Problem it solves                                                      | What it does not solve automatically        |
| ------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| Publisher confirm   | The sender knows whether the broker acknowledged                       | Whether consumption has completed           |
| mandatory / return  | Detecting unroutable messages                                          | Failures in later processing                |
| Manual ack          | Removing messages after processing                                     | Duplicates caused by consumer crash windows |
| Dead-letter routing | Isolating rejected messages or messages meeting dead-letter conditions | Unlimited retries and manual repair         |
| Idempotency         | Repeated arrival of the same event does not repeat its effect          | Atomic commits across all external systems  |

<a id="section-2"></a>

## Minimal run instructions :id=h-e67da6969aa8

First start from the running project directory:

```powershell
docker compose --env-file .env --profile tools up -d rabbit
```

Wait until you can log in to [http://127.0.0.1:15672](http://127.0.0.1:15672). Use the username and password from .env, not the default guest account restricted to local connections.

Enter the Python project:

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:AMQP_URL = 'amqp://notes_user:local_rabbit_change_me@127.0.0.1:5672/%2F'
uv run --locked python -m task_tools.mq_demo publish --event-id demo-001
uv run --locked python -m task_tools.mq_demo consume
```

The [complete code](examples/taskboard/python/src/task_tools/mq_demo.py) retrieves only one message per consume and exits normally if the queue is empty; it is not a continuously running background worker. Special characters in the URL password require correct percent encoding.

<a id="section-3"></a>

## Acknowledgments and local business effects :id=h-abf7c4753cd0

The producer enables confirms, marks messages persistent, and requires successful routing. The consumer first writes eventId together with the business effect into a local SQLite transaction, then acknowledges only after commit.

When the same eventId arrives again, a database unique key prevents duplicate insertion. The demonstrated “business effect” is a single database record. It sends no email and does not claim the database and an external email service can commit atomically together.

In a clean practice queue, publish / consume again with the same eventId; expect Committed new effect: False. Inspect handled-events.db, rather than only checking that the queue emptied.

<a id="section-4"></a>

## Dead letters and failure handling :id=h-105cdef1c260

Invalid JSON, overly long messages, or invalid fields are rejected without requeueing to the original queue, and routed to notes.failed according to the topology. Inspect the failure, repair it, and replay under control. Preserve the original eventId for duplicate business events to benefit from idempotency.

To avoid infinite loops, this example also routes SQLite errors to the dead-letter path. Real systems must distinguish transient and permanent failures, with bounded retries, delays, and manual recovery procedures.

Dead-letter forwarding itself depends on queue type and availability configuration. Configuring DLX does not guarantee no loss under every possible failure.

<a id="section-5"></a>

## Consistency between the database and messages :id=h-9d331c0734bf

Sending after a business database commit risks a crash before sending; sending before commit may notify about an operation that later rolls back. A common approach commits business data and an outbox record together, then uses a publisher to send and confirm.

If a consumer crashes after commit but before ack, the message is redelivered, so idempotency is a normal design requirement. “Normally sent only once” is not proof that duplicates cannot occur.

Long-running workers also need connection recovery, appropriate prefetch, graceful shutdown, and monitoring. With multiple consumers, completion order need not match enqueue order; ordered business processing requires explicit grouping and serial constraints.

<a id="section-6"></a>

## Verification and development quick reference :id=h-d3342c037370

| Symptom                                               | Check                                                                                                    |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Confirm succeeds but nobody processes the message     | Routing, queue bindings, consumer status, and logs                                                       |
| Messages keep reappearing                             | Check requeue on failure and missing ack                                                                 |
| The same notification produces two effects            | Check stable eventId and whether effect and deduplication share a transaction                            |
| Queue parameter conflict                              | Check whether an old queue was created with different parameters; do not casually delete business queues |
| Records remain after restart, but deduplication fails | Check changed SQLite file paths or lost persistent storage                                               |

Query status before retrying an unknown outcome. Do not generate a new eventId on every retry, or the unique key cannot identify the same business event.

<a id="section-7"></a>

## Official references :id=h-90fa4fc06a70

- [RabbitMQ acknowledgment mechanisms](https://www.rabbitmq.com/docs/confirms)
- [Reliability guide](https://www.rabbitmq.com/docs/reliability)
- [Dead-letter exchanges](https://www.rabbitmq.com/docs/dlx)

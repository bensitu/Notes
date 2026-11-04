"""Deliver explicitly and commit offsets after a durable, idempotent local effect."""

import argparse
import json
import os
import sqlite3
import time
import uuid
from contextlib import closing
from pathlib import Path

from confluent_kafka import Consumer, KafkaException, Producer


def parse_event(body: bytes | None) -> dict:
    if body is None or len(body) > 65536:
        raise ValueError("Event body is missing or too large")
    event = json.loads(body)
    if not isinstance(event, dict):
        raise TypeError("Event must be an object")
    if type(event.get("schemaVersion")) is not int or event["schemaVersion"] != 1:
        raise ValueError("Unsupported schema version")
    for key in ("eventId", "taskId", "title"):
        if (
            not isinstance(event.get(key), str)
            or not 1 <= len(event[key]) <= 100
            or not event[key].strip()
        ):
            raise ValueError("Invalid event field: " + key)
    return event


def record_effect(database: Path, event: dict) -> bool:
    with closing(sqlite3.connect(database)) as db, db:
        db.execute(
            "CREATE TABLE IF NOT EXISTS task_effect "
            "(event_id TEXT PRIMARY KEY, task_id TEXT NOT NULL, title TEXT NOT NULL)"
        )
        row = db.execute(
            "INSERT OR IGNORE INTO task_effect VALUES (?, ?, ?)",
            (event["eventId"], event["taskId"], event["title"]),
        )
        if row.rowcount == 0:
            previous = db.execute(
                "SELECT task_id, title FROM task_effect WHERE event_id = ?", (event["eventId"],)
            ).fetchone()
            if previous != (event["taskId"], event["title"]):
                raise ValueError("An eventId was reused with different data")
        return row.rowcount == 1


def handle_message(consumer, message, database: Path) -> bool:
    event = parse_event(message.value())
    if message.key() != event["taskId"].encode("utf-8"):
        raise ValueError("Record key does not match taskId")
    changed = record_effect(database, event)
    committed = consumer.commit(message=message, asynchronous=False)
    if not committed:
        raise RuntimeError("Offset commit returned no partition result")
    for partition in committed:
        if partition.error is not None:
            raise KafkaException(partition.error)
    return changed


def publish(bootstrap: str, topic: str, event: dict) -> None:
    producer = Producer(
        {
            "bootstrap.servers": bootstrap,
            "client.id": "notes-producer",
            "enable.idempotence": True,
            "acks": "all",
            "partitioner": "murmur2_random",
            "delivery.timeout.ms": 10000,
        }
    )
    errors = []

    def delivered(error, _):
        if error is not None:
            errors.append(str(error))

    body = json.dumps(event, ensure_ascii=False).encode("utf-8")
    parse_event(body)
    producer.produce(topic, key=event["taskId"].encode("utf-8"), value=body, on_delivery=delivered)
    remaining = producer.flush(12)
    if remaining or errors:
        raise RuntimeError("Delivery was not confirmed: " + "; ".join(errors))
    print("Delivered event:", event["eventId"])


def consume(
    bootstrap: str, topic: str, group: str, database: Path, limit: int, idle_seconds: float
) -> None:
    consumer = Consumer(
        {
            "bootstrap.servers": bootstrap,
            "group.id": group,
            "auto.offset.reset": "earliest",
            "enable.auto.commit": False,
            "enable.auto.offset.store": False,
        }
    )
    try:
        consumer.subscribe([topic])
        processed = 0
        last_message = time.monotonic()
        while processed < limit and time.monotonic() - last_message < idle_seconds:
            message = consumer.poll(1)
            if message is None:
                continue
            if message.error():
                raise KafkaException(message.error())
            changed = handle_message(consumer, message, database)
            print("Processed:", message.partition(), message.offset(), "new effect:", changed)
            processed += 1
            last_message = time.monotonic()
        print("Processed records:", processed)
    finally:
        consumer.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["publish", "consume"])
    parser.add_argument("--topic", default="notes.tasks.v1")
    parser.add_argument("--group", default="notes-demo")
    parser.add_argument("--event-id", default=None)
    parser.add_argument("--task-id", default="task-1")
    parser.add_argument("--title", default="Learn Kafka")
    parser.add_argument("--database", type=Path, default=Path("kafka-effects.db"))
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--idle-seconds", type=float, default=10)
    args = parser.parse_args()
    if args.limit < 1 or args.idle_seconds <= 0:
        parser.error("limit and idle-seconds must be positive")
    bootstrap = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "127.0.0.1:9092")
    if args.action == "publish":
        publish(
            bootstrap,
            args.topic,
            {
                "schemaVersion": 1,
                "eventId": args.event_id or str(uuid.uuid4()),
                "taskId": args.task_id,
                "title": args.title,
            },
        )
    else:
        consume(bootstrap, args.topic, args.group, args.database, args.limit, args.idle_seconds)


if __name__ == "__main__":
    main()

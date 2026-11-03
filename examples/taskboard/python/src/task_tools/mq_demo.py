"""Publish with confirms; commit a local effect before acknowledging."""

import argparse
import json
import os
import sqlite3
import uuid
from contextlib import closing
from pathlib import Path

import pika


def topology(channel):
    channel.exchange_declare("notes.events", "direct", durable=True)
    channel.exchange_declare("notes.dead", "direct", durable=True)
    channel.queue_declare(
        "notes.tasks",
        durable=True,
        arguments={
            "x-dead-letter-exchange": "notes.dead",
            "x-dead-letter-routing-key": "failed",
        },
    )
    channel.queue_bind("notes.tasks", "notes.events", "task.created")
    channel.queue_declare("notes.failed", durable=True)
    channel.queue_bind("notes.failed", "notes.dead", "failed")


def record_effect(database: Path, event: dict) -> bool:
    with closing(sqlite3.connect(database)) as db, db:
        db.execute(
            "CREATE TABLE IF NOT EXISTS handled_event "
            "(event_id TEXT PRIMARY KEY, title TEXT NOT NULL)"
        )
        cursor = db.execute(
            "INSERT OR IGNORE INTO handled_event VALUES (?, ?)", (event["eventId"], event["title"])
        )
        return cursor.rowcount == 1


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["publish", "consume"])
    parser.add_argument("--event-id")
    parser.add_argument("--database", type=Path, default=Path("handled-events.db"))
    args = parser.parse_args()
    parameters = pika.URLParameters(os.environ["AMQP_URL"])
    parameters.heartbeat = 30
    parameters.blocked_connection_timeout = 5
    parameters.socket_timeout = 5
    connection = pika.BlockingConnection(parameters)
    try:
        channel = connection.channel()
        topology(channel)
        if args.action == "publish":
            event_id = args.event_id or str(uuid.uuid4())
            body = json.dumps({"eventId": event_id, "title": "Learn reliable messaging"})
            channel.confirm_delivery()
            channel.basic_publish(
                "notes.events",
                "task.created",
                body.encode(),
                mandatory=True,
                properties=pika.BasicProperties(
                    delivery_mode=2, message_id=event_id, content_type="application/json"
                ),
            )
            print("Confirmed:", event_id)
        else:
            method, _, body = channel.basic_get("notes.tasks", auto_ack=False)
            if method is None:
                print("No message available")
                return
            try:
                if len(body) > 65536:
                    raise ValueError("Message is too large")
                event = json.loads(body)
                if (
                    not isinstance(event, dict)
                    or not isinstance(event.get("eventId"), str)
                    or not 1 <= len(event["eventId"]) <= 100
                    or not isinstance(event.get("title"), str)
                    or not 1 <= len(event["title"]) <= 100
                ):
                    raise ValueError("Invalid event fields")
                changed = record_effect(args.database, event)
            except (ValueError, UnicodeError, sqlite3.Error):
                channel.basic_nack(method.delivery_tag, requeue=False)
                print("Rejected to dead-letter route")
            else:
                channel.basic_ack(method.delivery_tag)
                print("Committed new effect:", changed)
    finally:
        connection.close()


if __name__ == "__main__":
    main()

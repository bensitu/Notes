import json
import sqlite3
from types import SimpleNamespace

import pytest
from confluent_kafka import KafkaError, KafkaException

from kafka_notes import demo


def event():
    return {"schemaVersion": 1, "eventId": "event-1", "taskId": "task-1", "title": "Learn Kafka"}


class Message:
    def __init__(self, value=None):
        self.body = json.dumps(event()).encode() if value is None else value

    def value(self):
        return self.body

    def key(self):
        return b"task-1"


class Consumer:
    def __init__(self, fail=False, partition_error=None):
        self.commits = 0
        self.fail = fail
        self.partition_error = partition_error

    def commit(self, **kwargs):
        if self.fail:
            raise RuntimeError("Offset commit failed")
        self.commits += 1
        return [SimpleNamespace(error=self.partition_error)]


def test_duplicate_event_has_one_local_effect(tmp_path):
    database = tmp_path / "events.db"
    consumer = Consumer()
    assert demo.handle_message(consumer, Message(), database) is True
    assert demo.handle_message(consumer, Message(), database) is False
    assert consumer.commits == 2


def test_database_failure_does_not_commit_offset(tmp_path, monkeypatch):
    consumer = Consumer()

    def fail(*_):
        raise sqlite3.OperationalError("Disk unavailable")

    monkeypatch.setattr(demo, "record_effect", fail)
    with pytest.raises(sqlite3.OperationalError):
        demo.handle_message(consumer, Message(), tmp_path / "events.db")
    assert consumer.commits == 0


def test_offset_failure_can_replay_without_duplicate_effect(tmp_path):
    database = tmp_path / "events.db"
    with pytest.raises(RuntimeError):
        demo.handle_message(Consumer(fail=True), Message(), database)
    assert demo.handle_message(Consumer(), Message(), database) is False


def test_invalid_event_does_not_commit_offset(tmp_path):
    consumer = Consumer()
    with pytest.raises(ValueError):
        demo.handle_message(consumer, Message(b'{"schemaVersion": 99}'), tmp_path / "events.db")
    assert consumer.commits == 0


def test_event_id_collision_is_not_silently_accepted(tmp_path):
    database = tmp_path / "events.db"
    demo.record_effect(database, event())
    different = event() | {"title": "Unexpected replacement"}
    with pytest.raises(ValueError, match="different data"):
        demo.record_effect(database, different)


def test_partition_commit_error_can_replay_without_duplicate_effect(tmp_path):
    database = tmp_path / "events.db"
    failed = Consumer(partition_error=KafkaError(KafkaError._FAIL, "Partition commit failed"))
    with pytest.raises(KafkaException):
        demo.handle_message(failed, Message(), database)
    assert demo.handle_message(Consumer(), Message(), database) is False

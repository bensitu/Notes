from task_tools.mq_demo import record_effect


def test_duplicate_event_does_not_repeat_the_effect(tmp_path):
    database = tmp_path / "events.db"
    event = {"eventId": "same-message", "title": "Only once locally"}
    assert record_effect(database, event) is True
    assert record_effect(database, event) is False

import pytest

from task_tools.cli import summarize


def test_counts_completed_and_pending(tmp_path):
    source = tmp_path / "tasks.csv"
    source.write_text("title,done\nFirst,true\nSecond,false\n", encoding="utf-8")
    assert summarize(source) == {"total": 2, "completed": 1, "pending": 1}


def test_rejects_invalid_input_without_rewriting_it(tmp_path):
    source = tmp_path / "tasks.csv"
    original = "title,done\nFirst,perhaps\n"
    source.write_text(original, encoding="utf-8")
    with pytest.raises(ValueError, match="line 2"):
        summarize(source)
    assert source.read_text(encoding="utf-8") == original

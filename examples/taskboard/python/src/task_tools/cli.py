"""Read task CSV files without modifying the source."""

import argparse
import csv
import json
from pathlib import Path


def summarize(source: Path) -> dict[str, int]:
    total = completed = 0
    with source.open(encoding="utf-8-sig", newline="") as stream:
        rows = csv.DictReader(stream)
        if rows.fieldnames is None or not {"title", "done"} <= set(rows.fieldnames):
            raise ValueError("CSV must contain title and done columns")
        for line, row in enumerate(rows, start=2):
            title = (row.get("title") or "").strip()
            done = (row.get("done") or "").strip().lower()
            if not title or len(title) > 100 or done not in {"true", "false"}:
                raise ValueError(f"Invalid task at CSV line {line}")
            total += 1
            completed += done == "true"
    return {"total": total, "completed": completed, "pending": total - completed}


def main() -> None:
    parser = argparse.ArgumentParser(description="Summarize a UTF-8 task CSV")
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    try:
        print(json.dumps(summarize(args.source), ensure_ascii=False))
    except (OSError, ValueError) as error:
        parser.exit(1, f"Error: {error}\n")


if __name__ == "__main__":
    main()

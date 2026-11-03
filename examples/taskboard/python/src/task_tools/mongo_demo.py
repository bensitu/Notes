"""Use a unique key and an atomic conditional update."""

import os
from datetime import UTC, datetime

from pymongo import MongoClient


def main() -> None:
    with MongoClient(os.environ["MONGO_URI"], serverSelectionTimeoutMS=3000) as client:
        collection = client.notes_demo.tasks
        collection.create_index("externalId", unique=True)
        collection.update_one(
            {"externalId": "notes-demo-1"},
            {
                "$setOnInsert": {
                    "title": "Learn MongoDB",
                    "done": False,
                    "version": 0,
                    "createdAt": datetime.now(UTC),
                }
            },
            upsert=True,
        )
        before = collection.find_one({"externalId": "notes-demo-1"})
        result = collection.update_one(
            {"_id": before["_id"], "version": before["version"]},
            {"$set": {"done": True}, "$inc": {"version": 1}},
        )
        print("Matched:", result.matched_count, "Modified:", result.modified_count)
        current = collection.find_one({"_id": before["_id"]}, {"_id": 0})
        print(current)


if __name__ == "__main__":
    main()

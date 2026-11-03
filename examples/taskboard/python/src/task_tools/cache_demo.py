"""Demonstrate an expiring cache with a bounded timeout."""

import json
import os

import redis


def main() -> None:
    password = os.environ["REDIS_PASSWORD"]
    with redis.Redis(
        host="127.0.0.1",
        port=6379,
        password=password,
        decode_responses=True,
        socket_timeout=2,
        socket_connect_timeout=2,
    ) as client:
        key = "notes:task:v1:demo"
        payload = {"id": 1, "title": "Learn caching", "done": False}
        client.set(key, json.dumps(payload), ex=60)
        raw = client.get(key)
        print(json.loads(raw) if raw is not None else "Cache miss")
        print("TTL:", client.ttl(key))
        client.delete(key)


if __name__ == "__main__":
    main()

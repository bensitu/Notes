# FastAPI API development: validation, databases, and tests :id=h-308b44711d34

Learning objectives: provide verifiable HTTP APIs with Python, and understand synchronous databases, request validation, and application lifecycle.

**Scope:** The running project uses Python 3.15, FastAPI, Pydantic, and SQLAlchemy 2; see uv.lock for versions. This is an independent learning implementation, defaulting to local port 8081 and a SQLite database, without sharing data with the Java backend.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [What FastAPI does in the project](#section-1)
- [Minimal run instructions](#section-2)
- [Data models and database sessions](#section-3)
- [Synchronous, asynchronous, and transaction](#section-4)
- [Testing and verification](#section-5)
- [Common errors and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## What FastAPI does in the project :id=h-581c3193450d

Routes receive requests, Pydantic describes and validates input and output, SQLAlchemy accesses the database, and Uvicorn runs the ASGI application. Type annotations do not automatically make arbitrary external data trustworthy; explicit validation boundaries are required.

See [app.py](examples/taskboard/python/src/task_tools/app.py) for the complete file. The example supports task creation, reading, and version-conditional updates, without login, deletion, or multi-user isolation. It cannot directly replace the protected Java service.

<a id="section-2"></a>

## Minimal run instructions :id=h-46780e92f314

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
uv run --locked uvicorn task_tools.app:create_app --factory --host 127.0.0.1 --port 8081
```

Open [http://127.0.0.1:8081/docs](http://127.0.0.1:8081/docs) and use the interactive documentation to send POST /api/tasks:

```json
{"title": "Learn FastAPI"}
```

Expect 201 with id, done=false, version=0, and Location. Then call PUT using the returned id:

```json
{"title": "Learn FastAPI", "done": true, "version": 0}
```

The first update changes version to 1; submitting the old version again returns 409. A blank title triggers the framework's default 422. Define validation statuses for each framework in the API contract; do not mechanically apply Java's 400.

<a id="section-3"></a>

## Data models and database sessions :id=h-d303df0fc2d7

Input models accept only fields permitted to change; output models read from ORM objects using from_attributes. Titles are trimmed and length-validated. Pydantic may coerce types by default; strict types require explicit configuration and tests.

Each request obtains its own Session through a dependency and closes it when the request ends. A Session is not a global object to share across arbitrary concurrent requests.

The startup lifecycle creates missing tables and releases the engine on shutdown. create_all does not automatically alter existing schemas. Use versioned migrations such as Alembic for production evolution, and plan compatibility with older versions.

<a id="section-4"></a>

## Synchronous, asynchronous, and transaction :id=h-7cbc25d3e4a2

This example uses synchronous SQLAlchemy, so routes use ordinary def to avoid blocking the event loop directly in async def. An asynchronous switch requires compatible asynchronous drivers, engines, and sessions together, not just adding async to functions.

Updates use id and version conditions, checking the old version and incrementing it in one statement. If no rows update, roll back and determine whether to return 404 or 409.

Database commits, external HTTP requests, and message delivery do not form an automatic global transaction. Reliable cross-system notifications require a design with explicit recovery logic.

<a id="section-5"></a>

## Testing and verification :id=h-2056f7dff953

```powershell
uv run --locked pytest tests/test_app.py
```

Tests create isolated temporary SQLite files and use the TestClient context manager to execute application lifespan. They cover invalid titles, creation, updates, conflicts, and missing records without depending on local tasks.db.

Success with SQLite does not establish identical SQL dialects, locks, or performance for MySQL and PostgreSQL. Before changing databases, add the corresponding driver and real-database tests.

<a id="section-6"></a>

## Common errors and development quick reference :id=h-32f416a9bb23

| Symptom                                       | Check                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| Cannot find task_tools                        | Check uv sync and whether a module path is used from the project directory   |
| Address conflict                              | Java uses 8080; this example uses 8081                                       |
| Existing tables lack new fields               | create_all does not perform schema migrations                                |
| API is “asynchronous” but concurrency is poor | Check for blocking I/O in the event loop                                     |
| Response object lacks fields                  | Check consistency among the output model, from_attributes, and actual object |

The local example binds to loopback. Before exposing it externally, add authentication, authorization, rate limiting, HTTPS, migrations, logs, and deployment process management. Do not treat development hot reload as a production release method.

<a id="section-7"></a>

## Official references :id=h-847dd1226518

- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/)
- [FastAPI asynchronous operation guide](https://fastapi.tiangolo.com/async/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/quickstart.html)
- [Pydantic](https://docs.pydantic.dev/latest/)
- [Alembic](https://alembic.sqlalchemy.org/en/latest/)

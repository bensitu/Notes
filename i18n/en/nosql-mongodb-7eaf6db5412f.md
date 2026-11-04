# NoSQL and MongoDB fundamentals :id=h-6a8a85a15c1a

Learning objectives: know when to choose a document database and learn modeling, querying, indexing, atomic updates, and transaction boundaries. First study database fundamentals and Python project engineering.

**Scope:** Teaching container: MongoDB 8.0; see uv.lock for the exact PyMongo driver version. The local container is standalone, for single-document exercises only. Multi-document transactions require a suitable replica set or sharded cluster.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [NoSQL is not one database product](#section-1)
- [Modeling documents](#section-2)
- [Minimal run instructions](#section-3)
- [Query and index exercises](#section-4)
- [Single-document atomic updates and transactions](#section-5)
- [Schema validation, security, and verification](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## NoSQL is not one database product :id=h-80883c4f16a3

| Model       | Common uses                                  | Learning focus                                          |
| ----------- | -------------------------------------------- | ------------------------------------------------------- |
| Key-value   | Caching and fast key lookups                 | Key design, TTL, capacity, and consistency              |
| Document    | Business objects with varying structure      | Document boundaries, indexes, embedding, and references |
| Wide-column | Specialized large-scale key and range access | Partition keys and query patterns                       |
| Graph       | Relationship traversal                       | Nodes, edges, and path queries                          |

Here MongoDB supplements the document model; the Redis article covers caching. NoSQL does not mean no structure, no transaction, or necessarily faster than relational databases.

<a id="section-2"></a>

## Modeling documents :id=h-45779ca2fc6a

Put data read together frequently and needing atomic changes together into one bounded document. Do not endlessly append growing comments, logs, or history into the same array.

Embedding reduces read-time joins but may duplicate data; references reduce duplication but require additional queries or relationship design. List query and update patterns before deciding boundaries.

MongoDB stores BSON, not raw JSON text. Types such as ObjectId, dates, and Decimal128 differ from JSON; define explicit conversions for API output.

<a id="section-3"></a>

## Minimal run instructions :id=h-ce4bff5e2113

Start MongoDB from the running project directory:

```powershell
docker compose --env-file .env --profile tools up -d mongo
```

Enter the Python project using the same demo account as .env:

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:MONGO_URI = 'mongodb://notes_admin:local_mongo_change_me@127.0.0.1:27017/?authSource=admin'
uv run --locked python -m task_tools.mongo_demo
```

The [complete code](examples/taskboard/python/src/task_tools/mongo_demo.py) creates a unique externalId index, initializes demo records with upsert, then updates one document conditionally on version. The demo connects as the initialization administrator; create an application account limited to required databases in production.

<a id="section-4"></a>

## Query and index exercises :id=h-610dbc8a1cf6

The following mongosh fragment requires connecting to the same instance and selecting the practice database first:

```javascript
const notesDb = db.getSiblingDB('notes_demo');
notesDb.tasks.createIndex({ externalId: 1 }, { unique: true });
notesDb.tasks.find({ done: true }, { title: 1, version: 1 }).sort({ _id: 1 }).limit(20);
notesDb.tasks.find({ externalId: 'notes-demo-1' }).explain('executionStats');
```

Compare query predicates and execution plans before choosing compound indexes. Indexes improve some reads but add write and space costs. TTL index deletion runs in the background and is not a second-precise business timer.

Existing duplicates may prevent unique-index creation. Investigate their cause and plan data repair first; do not simply drop and recreate the database.

<a id="section-5"></a>

## Single-document atomic updates and transactions :id=h-8565936668a2

Version-conditional updates are essential:

```python
result = collection.update_one(
    {"_id": document_id, "version": expected_version},
    {"$set": {"done": True}, "$inc": {"version": 1}},
)
```

This is a method fragment; collection, document_id, and expected_version come from the calling context. Zero matched_count means no document matched that version; distinguish absence from concurrent modification.

Single-document atomicity does not commit multiple documents, Redis, or external APIs together. Multi-document transactions also involve deployment model, read/write concern, retries, and cost, and cannot simply be used on this standalone demo instance.

<a id="section-6"></a>

## Schema validation, security, and verification :id=h-65c7f3f5127f

Document databases still require field contracts, version evolution, and necessary database JSON Schema validation. Do not directly use a full client-provided dictionary as a MongoDB query or update; allow only explicit fields and types.

Exercise checks: rerunning creates no second record with the same externalId; consecutive updates with the same old version succeed only once; inspect query plans; disconnected clients fail within bounded time.

| Common misconception                   | Correct boundary                                                          |
| -------------------------------------- | ------------------------------------------------------------------------- |
| Flexible schemas need no migrations    | Field renames, type changes, and historical data still need evolution     |
| No joins means no consistency problems | Synchronization and conflicts in duplicate data still require design      |
| Replication is backup                  | Accidental deletes and incorrect writes may also replicate                |
| Successful writes can never be lost    | Persistence and failure guarantees depend on deployment and write concern |
| MongoDB replaces every SQL table       | Choose based on business queries, constraints, and operational cost       |

Before real use, add least privilege, network isolation, backup-and-restore rehearsals, and load tests with representative data. Local practice has not completed this deployment work for you.

<a id="section-7"></a>

## Official references :id=h-2ef8691d4a19

- [MongoDB single-document atomicity](https://www.mongodb.com/docs/manual/tutorial/model-data-for-atomic-operations/)
- [MongoDB transaction](https://www.mongodb.com/docs/manual/core/transactions/)
- [PyMongo](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/)
- [MongoDB data modeling](https://www.mongodb.com/docs/manual/data-modeling/)

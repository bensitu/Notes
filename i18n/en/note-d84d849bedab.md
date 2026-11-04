# Database indexes, transactions, and migrations :id=h-9bdf5d93ba20

Learning objectives: move from “SQL runs” to explainable queries, manageable concurrency, evolvable schemas, and recoverable data. First learn SQL and JDBC.

**Scope:** MySQL 8.4 / InnoDB; the running project uses Flyway versioned migrations. Default H2 is only for quick runs and some tests.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [What to inspect first for query performance](#section-1)
- [Minimal exercise: create a separate table and inspect plans](#section-2)
- [Concurrency: two connections doing the same thing](#section-3)
- [Optimistic locking, retries, and transaction boundaries](#section-4)
- [Flyway migrations and backup recovery](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## What to inspect first for query performance :id=h-e47270ce5043

Record SQL, parameter shape, data volume, duration, and frequency before deciding on indexes. Indexes add storage and write costs; more is not always better.

Estimated rows in plans are not actual rows. Full-table scans can be reasonable on small tables; the appearance of ALL alone does not prove a query is poor.

<a id="section-2"></a>

## Minimal exercise: create a separate table and inspect plans :id=h-230e4358098a

Run in your own practice database; audit_task is separate from the main project's task table:

```sql
CREATE TABLE audit_task (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
 owner_id BIGINT NOT NULL,
 title VARCHAR(100) NOT NULL,
 done BOOLEAN NOT NULL DEFAULT FALSE,
 version BIGINT NOT NULL DEFAULT 0,
 INDEX ix_owner_done_id (owner_id, done, id)
) ENGINE=InnoDB;

INSERT INTO audit_task (owner_id, title)
VALUES (1, 'Learn indexes'), (1, 'Test transactions'), (2, 'Write docs');

EXPLAIN SELECT id, title FROM audit_task
WHERE owner_id = 1 AND done = FALSE ORDER BY id LIMIT 20;
```

Three rows cannot establish production performance. Compare using representative data distributions. EXPLAIN ANALYZE actually executes supported statements; confirm their behavior and cost first.

Composite indexes are commonly designed around equality filters, range filters, and sorting. Leftmost prefixes are an important starting point, but actual plans determine whether indexes are used. Functions, implicit type conversions, and low selectivity can change plans.

<a id="section-3"></a>

## Concurrency: two connections doing the same thing :id=h-7a5d055be550

Use two independent mysql sessions on the same practice record. First run in session A:

```sql
START TRANSACTION;
SELECT id, version FROM audit_task WHERE id = 1 FOR UPDATE;
```

Before A ends its transaction, run in session B:

```sql
UPDATE audit_task SET done = TRUE WHERE id = 1;
```

B usually waits for A's row lock and may time out according to lock-wait settings. Return to A, execute COMMIT or ROLLBACK, and observe B. Do not forget open transaction.

Ordinary consistent reads differ from FOR UPDATE locking reads. “Repeatable read” does not prevent other transaction from modifying data. Isolation levels, read modes, and indexes affect visibility and lock scope.

<a id="section-4"></a>

## Optimistic locking, retries, and transaction boundaries :id=h-24eda20fd75b

The project's version-conditional update checks affected rows; stale-version failures return 409. This prevents silent overwrites but does not automatically merge two business changes.

Deadlocks are a possible concurrency outcome. Shorten transaction, use consistent lock ordering, and if retries are needed, retry the whole transaction with a limit, only when the business operation is safe to retry.

Database transactions do not automatically cover Redis, message queues, or third-party HTTP requests. For reliable cross-system notifications, consider patterns such as a transaction outbox; @Transactional does not mean system-wide rollback.

<a id="section-5"></a>

## Flyway migrations and backup recovery :id=h-be55ddea06ec

The project's [V1__create_task.sql](examples/taskboard/backend/src/main/resources/db/migration/V1__create_task.sql) creates the initial table. Put new schema changes in new V2 files; do not casually edit applied migrations to bypass validation.

Release by compatible expansion first, data migration next, and old-structure removal last. Immediately deleting old fields in one deployment may prevent the old application from running after rollback.

Backups need restoration rehearsals: restore to an independent instance and check table counts, key records, and application reads/writes. Logical backup consistency depends on the engine, transaction, DDL activity, and backup options. A backup file's existence alone does not prove recoverability.

<a id="section-6"></a>

## Verification and development quick reference :id=h-d9559d4f4c68

| Situation                                               | Focus                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------ |
| Duplicate or missing rows in pagination                 | Deterministic ordering, cursor needs, and intervening inserts or updates |
| An index exists but seems unused                        | Parameter types, selectivity, functions, statistics, and actual plans    |
| External side effects remain after transaction rollback | Check whether side effects occur outside the database                    |
| Migration validation fails                              | Check edited applied files or connection to the wrong database           |
| Volume is still empty after “restoration”               | Check mounts to the correct instance and backup/recovery records         |

Before release, test schema creation and migration, repeated startup, conflicting updates, and failed-operation rollback on real MySQL. Success on H2 cannot replace MySQL concurrency verification.

<a id="section-7"></a>

## Official references :id=h-ea078aaeaf6e

- [MySQL EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/explain.html)
- [InnoDB locking](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking.html)
- [Flyway migrations](https://documentation.red-gate.com/flyway/flyway-concepts/migrations)

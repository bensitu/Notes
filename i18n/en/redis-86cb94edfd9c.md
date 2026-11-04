# Practical Redis caching :id=h-ecb6780791c0

Learning objectives: understand cache hits, expiration, eviction, failures, and data consistency, and run a caching example with timeouts and TTL.

**Scope:** The server teaching baseline is Redis 8.2; the Python client is pinned in the project lockfile. Complete Docker and Python project engineering first. The current Java API does not enable caching.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [A cache does not replace the primary database](#section-1)
- [Minimal run instructions](#section-2)
- [Cache-aside ordering and races](#section-3)
- [Expiration, capacity, and cache avalanches](#section-4)
- [Locks and failure boundaries](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## A cache does not replace the primary database :id=h-0e07c090c4cf

A cache stores data that can be obtained again to reduce repeated access costs. Measure the bottleneck before deciding what to cache. Caching adds complexity around invalidation, permission isolation, and failure handling.

| Concept     | Meaning                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------- |
| Hit / miss  | Cached data was found / a reliable data source must be read                                 |
| TTL         | Time to live; after expiration, the old value must no longer be treated as valid cache data |
| Eviction    | Removing data according to policy after memory reaches its limit                            |
| Persistence | Redis's mechanism for saving data; not equivalent to a business database backup             |
| Hotspot     | Many requests concentrate on a few keys                                                     |

<a id="section-2"></a>

## Minimal run instructions :id=h-d90e8a470430

First start Redis in the running project directory:

```powershell
docker compose --env-file .env --profile tools up -d redis
```

In another terminal, enter the Python project and use the same password as .env:

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:REDIS_PASSWORD = 'local_redis_change_me'
uv run --locked python -m task_tools.cache_demo
```

The [complete code](examples/taskboard/python/src/task_tools/cache_demo.py) sets a JSON cache valid for 60 seconds, reads the result, observes TTL, and finally deletes its own demo key. Redis must already accept connections; inspect service logs on the first startup.

The notes:task:v1:demo key is a practice namespace; this does not scan or flush all Redis data. The example is a standalone command and does not automatically cache the Java task API.

<a id="section-3"></a>

## Cache-aside ordering and races :id=h-cab0f1c7d66a

A common read flow is: read the cache; on a miss, read the database, then cache the result with TTL. For changes, commit the database first, then delete related cache entries.

This order can still race: another old query may write stale data back after deletion. TTL limits the stale value's lifetime but does not guarantee strong consistency. Critical data may require version validation, controlled refresh, or direct reads from authoritative storage.

Do not simply claim “delayed double deletion” solves every consistency problem. Define acceptable staleness, recovery on failure, and coordination among instances.

<a id="section-4"></a>

## Expiration, capacity, and cache avalanches :id=h-004eff3afa00

The ex parameter of SET sets the value and TTL together, avoiding forgotten expiration if the process exits between operations. Add small random jitter to TTL to avoid many keys expiring simultaneously.

When a hot key expires, request coalescing, controlled refresh, or bounded mutual exclusion can reduce database reads, but waiting limits and failure policies must be explicit. Use a reasonably short TTL for cached nonexistent data, ensuring later additions become visible promptly.

Configure maxmemory and eviction policies for the intended use. If Redis stores both indispensable tasks and disposable cache data, do not casually choose a policy that can evict all keys.

<a id="section-5"></a>

## Locks and failure boundaries :id=h-aeab07e1c5ce

SET key token NX PX duration can be a starting point for leased mutual exclusion. Release must compare the owner token and delete atomically. GET followed by DEL has a race and is not safe unlocking.

An old holder may continue running after its lease expires. Critical writes require downstream version or fencing protection. Redis locks cannot replace database unique constraints and transaction.

Set connection and read/write timeouts. Decide whether cache failures can fall back to the database based on database capacity, rate limits, and business correctness; do not allow unlimited fallback traffic.

<a id="section-6"></a>

## Verification and development quick reference :id=h-b377a7febe45

| Exercise                                   | Observe                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| Read back after writing                    | JSON fields and TTL are reasonable                                          |
| Read after waiting for TTL                 | A miss; do not treat an absent value as a successfully retrieved empty task |
| Stop Redis                                 | Timeouts are bounded and errors can be located                              |
| Many concurrent accesses to an expired key | Check for a sudden surge in database load                                   |
| Read again after changing a task           | Check recovery within the allowed staleness window                          |

Cache keys must include required tenant, user, and version dimensions to avoid returning user A's result to user B. Do not expose production Redis directly to the internet; configure authentication, networking, backups, and memory monitoring together.

<a id="section-7"></a>

## Official references :id=h-6d31227eb482

- [Redis developer documentation](https://redis.io/docs/latest/develop/)
- [SET command](https://redis.io/docs/latest/commands/set/)
- [Key eviction](https://redis.io/docs/latest/develop/reference/eviction/)
- [Distributed lock boundaries](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)

# Deployment, release, and rollback :id=h-d9bab1ddeb30

Learning objectives: deliver a tested version to users and restore service when problems occur. First complete the container, database migration, and CI documentation.

**Scope:** Begin with single-machine Compose practice and preserve the same verification principles on other platforms. This article contains no real domain, certificate, or production-server credentials.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [What is released](#section-1)
- [Minimal release rehearsal](#section-2)
- [Release steps and exit criteria](#section-3)
- [Understand rollback with two artifacts](#section-4)
- [Shutdown, connections, and secrets](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## What is released :id=h-a55a1d61ff69

A release consists of a verified artifact with a known origin and its configuration, not source code temporarily edited on the server. Code version, image digest, configuration version, and database migration version should be traceable to each other.

Rolling back an application does not roll back its database. Data written by the new application or migrated tables may already be incompatible with the old application.

<a id="section-2"></a>

## Minimal release rehearsal :id=h-0bf804b8b779

In the running project directory, first run local checks for the backend, frontend, and Python, then execute:

```powershell
docker compose --env-file .env config --quiet
docker compose --env-file .env up -d --build
docker compose ps
curl.exe --fail http://127.0.0.1:8080/actuator/health
curl.exe --fail http://127.0.0.1:8088/
```

This is a local rehearsal: build uses the current directory. Production releases should build and push immutable images in CI, then deploy the same digest. Do not recompile separately on each production machine.

<a id="section-3"></a>

## Release steps and exit criteria :id=h-8f9fec56193c

| Step                  | Required evidence                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| Before release        | Tests pass, dependencies and configuration are explicit, and backup and recovery conditions are available |
| Database expansion    | Compatible schema understood by both old and new applications                                             |
| Start the new version | Healthy process, health checks, and dependency connections                                                |
| Smoke tests           | Real login, creation, queries, and permission denials match expectations                                  |
| Observation           | Normal error rates, latency, resource usage, and business results                                         |
| Completion            | Record versions, deployment time, and verification results                                                |

A health endpoint proves only what its checks cover. A homepage 200 does not prove API is writable; readable API does not prove permissions and data migration are correct.

<a id="section-4"></a>

## Understand rollback with two artifacts :id=h-f818868810d5

Record the old image digest and configuration before deploying the new version. Once explicit rollback conditions occur, restore the old image and compatible configuration, restart, and run the same smoke tests.

Do not merely “pull the old tag”: tags may have been overwritten. Retrieve the original version by immutable digest or artifact checksum from the release record.

If database changes are incompatible with the old application, stop further writes and follow the established recovery plan. Do not delete new columns or restore the entire database for a quick rollback while ignoring data created in the meantime.

<a id="section-5"></a>

## Shutdown, connections, and secrets :id=h-cd660caf37b5

On receiving an exit signal, stop accepting new tasks and allow reasonable time for in-flight requests to finish. A load balancer or proxy must stop directing traffic to old instances before terminating them.

Set timeouts for database connections, HTTP requests, and message consumption. Shorter timeouts are not the only optimization; measure the actual call chain first. Bound retries and apply them only to operations that are safe to retry.

Inject secrets through the deployment environment; do not put them in frontend builds, image layers, or logs. Secret rotation must account for server accounts, running instances, and rollback versions together.

<a id="section-6"></a>

## Verification and development quick reference :id=h-5e732a76c024

| Failure                             | First action                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| Many 502 responses                  | Check instances, ports, readiness, and upstream logs                              |
| Login suddenly fails                | Check session storage, keys, cookies, and proxy HTTPS configuration               |
| More write conflicts                | Observe business concurrency and old clients; do not simply remove version checks |
| Migration waits a long time         | Inspect DDL and locks; do not start more migration processes                      |
| Records missing after data recovery | Check backup time, incremental logs, and recovery target point                    |

Retain release and recovery-rehearsal records. Backups never actually restored and old artifacts never verified cannot count as completed rollback capability.

<a id="section-7"></a>

## Official references :id=h-d16a562d63a7

- [Docker production deployment](https://docs.docker.com/compose/how-tos/production/)
- [DORA continuous delivery](https://dora.dev/capabilities/continuous-delivery/)

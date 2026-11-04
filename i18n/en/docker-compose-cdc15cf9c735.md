# Docker and Compose: run applications and dependencies together :id=h-e4f798fc855f

Learning objectives: distinguish images, containers, networks, and volumes, and start and troubleshoot a multi-service practice environment. First learn processes, ports, and environment variables.

**Scope:** Requires Docker Engine / Docker Desktop capable of Linux containers and Compose v2+. On Windows, the WSL2 backend of Docker Desktop is recommended. Image tags are teaching baselines; Compose and Dockerfile also pin the verified digests. Reverify and update when upgrading.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [Four basic concepts](#section-1)
- [Minimal run instructions](#section-2)
- [How builds and configuration work together](#section-3)
- [Optional middleware](#section-4)
- [Data, rebuilding, and cleanup](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Four basic concepts :id=h-313562e45a49

| Concept   | How to understand it                                                  |
| --------- | --------------------------------------------------------------------- |
| Image     | Build output containing application files and the runtime environment |
| Container | An isolated process started from an image                             |
| Network   | A channel for containers to discover and connect to each other        |
| Volume    | Data storage independent of the container lifecycle                   |

A container is neither a complete virtual machine nor a data backup. After deletion and recreation, data outside persistent storage may disappear.

<a id="section-2"></a>

## Minimal run instructions :id=h-b8e1c57caec2

Run from the repository root, assuming Docker is installed and can run Linux containers:

```powershell
Set-Location examples/taskboard
Copy-Item .env.example .env
docker compose --env-file .env --profile tools config --quiet
docker compose --env-file .env up -d --build
docker compose ps
docker compose logs --tail 100 backend
```

If .env already exists, inspect its configuration instead of overwriting it again. Example passwords are local practice values; every host port binds only to 127.0.0.1.

Open [http://127.0.0.1:8088](http://127.0.0.1:8088) in a browser, using admin and the APP_PASSWORD password from .env. Initial image pulls, dependency downloads, and database creation may take time. Confirm backend health before retrying login.

<a id="section-3"></a>

## How builds and configuration work together :id=h-ecd6504f5504

The [complete Compose configuration](examples/taskboard/compose.yml) starts MySQL, the Java backend, and the Nginx frontend by default; the tools profile additionally provides Redis, RabbitMQ, and MongoDB.

Frontend builds use Node; runtime retains only static files and Nginx. Backend builds use Maven, while runtime uses JRE and a non-root user. In production, run tests first and release verified images.

DB_URL inside a container uses mysql:3306; Windows host connections to the practice database use 127.0.0.1:3307. Port mappings do not change the internal listening port.

<a id="section-4"></a>

## Optional middleware :id=h-4db4c25c93bb

```powershell
docker compose --env-file .env --profile tools up -d redis rabbit mongo
docker compose --env-file .env --profile tools ps
```

These services support their separate Python exercises and are not yet integrated into the Java task API. Starting them does not mean task data is written to three databases simultaneously.

The healthcheck for MySQL actually connects to the practice database and executes SELECT 1. depends_on waits only for declared conditions; it does not replace application reconnection and timeout handling during operation.

<a id="section-5"></a>

## Data, rebuilding, and cleanup :id=h-593c1ee8f005

```powershell
docker compose stop
docker compose start
docker compose down
```

stop stops existing containers; start starts existing containers; down removes this project's containers and networks while retaining named volumes by default. down --volumes deletes practice data in associated volumes; run it only after confirming the data is no longer needed and backed up.

Database initialization environment variables usually apply only on the first startup with an empty data directory. Changing a password in .env and restarting an existing volume does not automatically update database users; follow the database's change procedure.

<a id="section-6"></a>

## Verification and development quick reference :id=h-da84bbdf79e7

| Issue                           | Check                                                              |
| ------------------------------- | ------------------------------------------------------------------ |
| Container exits                 | logs, exit code, variables, and file permissions                   |
| Service name cannot be resolved | Check the same Compose network and names matching the service      |
| Host port conflict              | Change the mapped host port and update client configuration        |
| Code changes have no effect     | Check build / recreate was performed, not only start               |
| Data appears “lost”             | Check for changed project name, volume name, or connection address |

Local configuration validation needs no container-engine connection. Actual image builds, startup, health, and persistence verification require the Docker engine. Passing config --quiet does not mean deployment succeeded.

Before upgrading images, record tags and digests, back up data, and rehearse restoration. Database image upgrades also require checking data formats and supported upgrade paths; do not arbitrarily revert to an old image to read a new data volume.

<a id="section-7"></a>

## Official references :id=h-1d0c8734d7cb

- [Getting started with Compose](https://docs.docker.com/compose/)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Persistent volumes](https://docs.docker.com/engine/storage/volumes/)

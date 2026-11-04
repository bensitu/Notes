# Linux and network troubleshooting: trace the request path :id=h-1655eed479aa

Learning objectives: diagnose server process, port, configuration, and log issues. First learn file paths and HTTP requests.

**Scope:** Server commands use common Linux examples labeled bash; Windows equivalents use PowerShell. Do not mix package-installation commands from different distributions.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [Where a request travels](#section-1)
- [Minimal exercise: check local services](#section-2)
- [Common diagnostic commands](#section-3)
- [Find causes by symptom](#section-4)
- [Permissions, environment variables, and shutdown](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Where a request travels :id=h-a7b9b122d5e2

Browser → DNS resolution → server port → Nginx → backend process → database. Identify the failing segment before changing its configuration.

File paths are case-sensitive; / is the root directory and \~ is usually the current user's home. Relative paths start at the current directory. Do not assume Windows path and case rules transfer directly.

<a id="section-2"></a>

## Minimal exercise: check local services :id=h-a274c7cc5759

Start the backend following the [project instructions](examples/taskboard/README.md), then run on Linux:

```bash
pwd
java -version
ps -ef
ss -lnt
curl -i --connect-timeout 3 --max-time 10 http://127.0.0.1:8080/actuator/health
curl -i --connect-timeout 3 --max-time 10 http://127.0.0.1:8080/api/tasks
```

Expect HTTP 200 for health and 401 for reading tasks without login. The server is reachable; the latter request fails because of authentication, not an inaccessible port.

Windows equivalents:

```powershell
Get-Location
Get-Process java -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
Test-NetConnection 127.0.0.1 -Port 8080
curl.exe -i http://127.0.0.1:8080/actuator/health
```

<a id="section-3"></a>

## Common diagnostic commands :id=h-fbd84794a418

The following systemctl and journalctl commands apply only to servers using systemd with an existing taskboard service; they are not installation steps for this example.

```bash
systemctl status taskboard --no-pager
journalctl -u taskboard -n 100 --no-pager
df -h
df -i
free -h
getent hosts example.com
```

For containers, use docker compose ps and docker compose logs instead. localhost inside a container refers to that container; use Compose service names to reach others.

<a id="section-4"></a>

## Find causes by symptom :id=h-3d5eaf3e0d49

| Symptom                 | Check first                                            | Do not immediately conclude          |
| ----------------------- | ------------------------------------------------------ | ------------------------------------ |
| Name cannot be resolved | DNS, domain spelling, and local hosts                  | Backend code is faulty               |
| Connection refused      | Process alive, listening address, and port             | It must be the firewall              |
| Connection timeout      | Routes, firewall, security groups, and service load    | It must be a client issue            |
| HTTP 502                | Nginx upstream connection and upstream logs            | Browser cache issue                  |
| HTTP 504                | Upstream response, request chain, and timeout settings | Increasing the timeout will solve it |
| HTTP 401 / 403          | Login state, permissions, and CSRF                     | Network is unreachable               |
| No space left           | Disk capacity and inodes                               | A restart alone will restore service |

Access 127.0.0.1 from the server before trying externally; access the backend directly before going through the proxy. Change only one condition at a time, retaining time, request path, status code, and related logs.

<a id="section-5"></a>

## Permissions, environment variables, and shutdown :id=h-e5efa421086e

Processes should have only required directory permissions. chmod 777 broadens permissions and is not the default answer to deployment problems. Ordinary applications generally do not need root.

Environment variables belong to process environments: changing the current terminal does not automatically change running services. For systemd, check the service's EnvironmentFile. For containers, recreate them according to the deployment method after changing configuration.

Request graceful exit first and wait for connections and tasks to finish; force termination is a last resort. Verify PID and the command before signaling; do not kill batches of processes selected by vague matches.

<a id="section-6"></a>

## Verification and development quick reference :id=h-139549e559f4

Retest with the original request after repair and inspect error rates, response times, and logs. Startup success alone does not mean database access, authentication, and writes all work.

Logs may contain personal information or credentials; retain only diagnostic portions before sharing. Record the system, runtime, and startup method to avoid assuming development-machine behavior is universal.

<a id="section-7"></a>

## Official references :id=h-f6c7c5602dc7

- [systemd service management](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)
- [curl manual](https://curl.se/docs/manpage.html)

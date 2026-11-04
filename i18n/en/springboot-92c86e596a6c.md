# Modern Spring Boot project practice :id=h-f08e280889d5

Learning objectives: progress from a startup class to an API with validation, transaction support, error responses, and security controls. First learn Java, Maven, HTTP, and JDBC.

**Scope:** The running project pins Spring Boot 4.1.2. Java source compiles for 17 and can run on JDK 25. The default H2 in-memory database is introductory; the mysql profile uses MySQL 8.4.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [How a request reaches the database](#section-1)
- [Minimal run instructions](#section-2)
- [API contract](#section-3)
- [Validation, transactions, and concurrent changes](#section-4)
- [Configuration and startup methods](#section-5)
- [Verification, common errors, and quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## How a request reaches the database :id=h-d21afb58f137

Browser → Spring Security filters → Controller parameter binding and validation → JDBC operations → database → JSON response.

To reduce navigation for beginners, the example places short business operations requiring a transaction in the Controller. Extract a Service as complexity grows, keeping transaction boundaries and dependency direction clear. This does not require all business logic to live in Controllers.

Complete files: [pom.xml](examples/taskboard/backend/pom.xml) and [TaskController.java](examples/taskboard/backend/src/main/java/example/tasks/TaskController.java).

<a id="section-2"></a>

## Minimal run instructions :id=h-78aa98e3547f

Enter the backend from the repository root; install JDK and Maven first:

```powershell
Set-Location examples/taskboard/backend
$env:APP_PASSWORD = 'local-demo-change-me'
mvn -B -ntp verify
mvn spring-boot:run
```

Access from another terminal:

```powershell
curl.exe -i http://127.0.0.1:8080/actuator/health
```

Expect HTTP 200 and UP. Task APIs require login; use the running project's frontend to log in and operate. Default H2 data disappears when the process ends; it is for practice, not production storage.

<a id="section-3"></a>

## API contract :id=h-3bd99be3972e

| Request                | Request body or result               | Expected result                             |
| ---------------------- | ------------------------------------ | ------------------------------------------- |
| GET /api/tasks         | Latest 100 items, descending by id   | 200                                         |
| POST /api/tasks        | title                                | 201, with Location pointing to the new task |
| GET /api/tasks/{id}    | One task                             | 200 or 404                                  |
| PUT /api/tasks/{id}    | title、done、version                   | 200 or 409                                  |
| DELETE /api/tasks/{id} | Only administrators may delete       | 204 or 404                                  |
| GET /api/csrf          | headerName、token                     | Retrieve separately before and after login  |
| POST /api/login        | URL-encoded form: username, password | 204 or 401                                  |

The title field must be nonblank and at most 100 characters; Update requires done and version. Creation and updates use separate DTO to avoid exposing all database fields indiscriminately to clients.

<a id="section-4"></a>

## Validation, transactions, and concurrent changes :id=h-bbf896ff9404

@NotBlank and @Size check bound fields; @Valid triggers request-body validation. Frontend validation provides feedback and cannot replace server validation or database constraints.

The core SQL for versioned updates comes from the actual source:

```sql
UPDATE task
SET title = :title, done = :done, version = version + 1
WHERE id = :id AND version = :version;
```

This is a named-parameter fragment for JdbcClient, not a statement to paste directly into the mysql client. Of two requests using the same old version, only the first successful one updates a row. The other gets 409 and reloads for the user to decide.

@Transactional takes effect through Spring proxy calls. Self-invocation within the same object, asynchronous threads, and HTTP requests to other services do not automatically share this local transaction.

<a id="section-5"></a>

## Configuration and startup methods :id=h-709ae59bc9c0

[application.yml](examples/taskboard/backend/src/main/resources/application.yml) provides local defaults; [application-mysql.yml](examples/taskboard/backend/src/main/resources/application-mysql.yml) reads connection information from environment variables.

When starting the MySQL configuration, provide SPRING_PROFILES_ACTIVE=mysql, DB_URL, DB_USER, and DB_PASSWORD together. Set port and password variables in the environment of the process that actually starts JVM.

Start production with a tested JAR or image, not development commands that download dependencies on demand. Expose only necessary management endpoints, without complete configuration or detailed health information.

<a id="section-6"></a>

## Verification, common errors, and quick reference :id=h-f7e0fb0be1eb

Run mvn verify to cover unauthenticated requests, missing CSRF, invalid inputs, update conflicts, delete permissions, and missing resources. After H2 tests pass, verify migrations, locks, and dialects on MySQL too; the databases are not fully equivalent.

| Issue                              | Check                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| Table not found on startup         | Flyway dependencies, migration locations, and target database                      |
| Creation fails                     | Validation response, data lengths, and database constraints                        |
| Stale-version writes return 409    | Normal conflict handling; do not change to unconditional overwrites                |
| A transaction did not roll back    | Exception propagation, proxy invocation, and same data source                      |
| Client shows only an unknown error | Check HTTP status is retained and ProblemDetail is not treated as business success |

This example has no multi-tenancy, self-service registration, full pagination, or uploads. Add boundaries and tests for each extension; do not imply these capabilities already exist.

<a id="section-7"></a>

## Official references :id=h-d3852c4b31f3

- [Spring Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html)
- [Spring JDBC](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html)
- [Parameter validation](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)

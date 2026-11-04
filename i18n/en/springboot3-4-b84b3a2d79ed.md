# Spring Boot 3 to 4 migration reference :id=h-03638183f3f3

Learning objectives: preserve the original project's observable behavior through an upgrade and identify changes in dependencies, JSON, tests, and runtime.

**Scope:** Migrate gradually from a current 3.5.x maintenance release to the target stable 4.x release. This article gives the sequence; the repository does not claim all old tutorials have been automatically migrated.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [Gather evidence before upgrading](#section-1)
- [Minimal migration comparison](#section-2)
- [Execution order](#section-3)
- [Key regression checklist](#section-4)
- [Common errors and quick reference](#section-5)
- [Official references](#section-6)

<a id="section-1"></a>

## Gather evidence before upgrading :id=h-d866e508232e

Record JDK, Maven, Boot, database, container, and extra starter versions. Retain existing API examples, error responses, authentication flows, and key test results.

First upgrade to the chosen 3.5.x maintenance release and address deprecations, then upgrade to 4.x on an isolated branch. Do not simultaneously rewrite data models, change authentication or JDK, and split services, making regression sources unidentifiable.

<a id="section-2"></a>

## Minimal migration comparison :id=h-f15aa023be57

The old [SpringBoot.md](SpringBoot.md) is a historical Boot 2.5 tutorial; do not apply it directly while skipping intervening changes. The new [backend POM](examples/taskboard/backend/pom.xml) is a separate complete Boot 4.1.2 example.

| Check item           | Required action                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Java                 | Boot 4 requires at least Java 17; check third-party libraries for the target JDK too       |
| Servlet container    | Match Servlet 6.1 and container versions to the target Boot requirements                   |
| Modules and starters | Boot 4 has more granular modules; check the starter for each capability                    |
| JSON                 | Check Jackson 3 dependency, import, and custom-configuration compatibility                 |
| Tests                | Check test modules, annotation packages, and test engines                                  |
| Additional ecosystem | Check compatibility matrices individually for MyBatis, JoinFaces, Spring Cloud, and others |

This project uses spring-boot-starter-webmvc and the corresponding webmvc-test. Do not mechanically copy the example's new test annotation packages into Boot 3 projects.

<a id="section-3"></a>

## Execution order :id=h-33f2911fff33

```powershell
mvn -B -ntp verify
mvn dependency:tree
```

Keep results before and after upgrading. Resolve dependency conflicts and compile errors first, then startup and behavior differences.

1. Choose the target version and update the parent or BOM.
2. Adjust starters, explicit dependencies, and plugins; avoid mixing major versions.
3. Fix removed deprecated APIs, package paths, and configuration-property changes.
4. Check data sources, migrations, authentication, JSON, and exception responses.
5. Run unit, integration, and browser tests.
6. Rehearse on the same container image and database as production.
7. Verify the old artifact can run after rollback against the migrated schema.

<a id="section-4"></a>

## Key regression checklist :id=h-5f7087d2607a

Verify dates/times, enums, null fields, unknown JSON fields, large integers, pagination format, error statuses, and Content-Type with real requests.

Also check filter order, CSRF, login redirects, cookie attributes, resource paths, and proxy forwarding. Error-free startup logs do not prove these match the original project.

Framework-managed dependencies are usually coordinated through BOM. Do not arbitrarily override an individual Jackson, Security, or Spring version just to eliminate one compile error.

<a id="section-5"></a>

## Common errors and quick reference :id=h-21918950df86

| Symptom                                           | Possible cause                                              |
| ------------------------------------------------- | ----------------------------------------------------------- |
| Compiles, but NoSuchMethodError occurs at runtime | Incompatible runtime dependency combination                 |
| Test annotation cannot be found                   | Changed test starter or package path                        |
| JSON output changes                               | Serialization version, module, or configuration differences |
| Container deployment fails                        | Servlet and container version mismatch                      |
| Works only locally                                | CI JDK, image, or configuration differs from local          |

Migration records should include verification methods and rollback conditions. Clearly label old-version documentation and use separate version paths for new documents; do not combine different versions' fragments into one project.

<a id="section-6"></a>

## Official references :id=h-e3636094f914

- [Official Boot 4 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)
- [Target-version system requirements](https://docs.spring.io/spring-boot/system-requirements.html)

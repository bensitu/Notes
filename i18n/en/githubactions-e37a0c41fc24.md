# GitHub Actions continuous integration :id=h-19d6ae561d89

Learning objectives: automatically run the same checks as locally for each change, blocking merges or releases on failure. First learn Git and each project's test commands.

**Scope:** GitHub Actions hosted Linux runners. Third-party Actions in the template are pinned to full commit SHA values; runtimes pin Java 25, Node 24, Python 3.15, and the uv version.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [CI, continuous delivery, and automatic deployment](#section-1)
- [A complete template ready to adopt](#section-2)
- [What the template executes](#section-3)
- [Lockfiles, caches, and artifacts](#section-4)
- [Permissions and untrusted input](#section-5)
- [Verification and troubleshooting](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## CI, continuous delivery, and automatic deployment :id=h-b5910bd7b0f6

CI means integrating changes frequently and checking them automatically. Continuous delivery keeps software releasable; automatic deployment deploys artifacts to a target environment once conditions are met. These concepts are related, but are not a single switch.

A workflow runs jobs in response to triggering events; jobs execute steps on runners. Filesystems are not shared between jobs by default, so upload and download artifacts explicitly.

<a id="section-2"></a>

## A complete template ready to adopt :id=h-d5636eb30d7e

See [learning-examples.yml](examples/taskboard/ci/learning-examples.yml) for the complete file. Create .github/workflows at your repository root and copy the file there. Paths assume the repository still contains examples/taskboard.

```powershell
New-Item -ItemType Directory -Force .github/workflows
Copy-Item examples/taskboard/ci/learning-examples.yml .github/workflows/learning-examples.yml
```

Compare an existing workflow with the same name before replacing it. A template under examples does not run automatically. Only after copying it to the standard workflow directory and committing it will push, pull_request, or manual events trigger it.

<a id="section-3"></a>

## What the template executes :id=h-2728fca57ce1

| job      | Core checks                               | Output                                |
| -------- | ----------------------------------------- | ------------------------------------- |
| java     | mvn verify                                | Tested JAR                            |
| frontend | npm ci, tests, type checks, and build     | dist                                  |
| python   | Locked installation, Ruff, and pytest     | Test results                          |
| browser  | Start the real backend and run Playwright | Real login and task-operation results |

To reduce duplicate work, the browser job skips tests when building the JAR used for startup; the separate java job must run all tests. Release gates must depend on all required jobs passing, not only browser.

<a id="section-4"></a>

## Lockfiles, caches, and artifacts :id=h-eba7fa3323f4

npm ci checks the lockfile; uv sync --locked fails if dependency declarations and the lock differ. Do not automatically update dependencies in CI and call an installation that happens to succeed a reproducible build.

Caches accelerate downloads; artifacts pass along this build's results. Caches may be invalidated or replaced and must not be the only release source. Record source commit, build number, checksum, and retention period for artifacts.

The template uploads JAR and dist for seven days. Production releases also need image builds, scanning, repository permissions, and environment protection; the template does not pretend to have configured your production server.

<a id="section-5"></a>

## Permissions and untrusted input :id=h-c936a92cc788

Grant only contents:read by default. Add necessary image-publication or deployment permissions only to the relevant job. A trusted cloud platform can issue short-lived credentials through OIDC, but allowed repositories, branches, and environments must still be restricted.

Do not execute external PR code in an environment holding production secrets. Do not directly interpolate untrusted PR titles or branch names into shell scripts. Pass them as arguments or environment variables with correct quoting.

Pinning an Action's SHA does not mean never updating it. Review its origin, maintenance, and changes, then update the pinned value.

<a id="section-6"></a>

## Verification and troubleshooting :id=h-6fde756191b8

Confirm the same command works locally before committing the workflow. In GitHub Actions, inspect the failing job, step, and first error, and download necessary reports.

| Symptom                                | Check                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| Passes locally but fails in CI         | Runtime versions, case sensitivity, paths, time zone, and environment variables  |
| CI is not triggered                    | File location, events, branch filters, and YAML                                  |
| Build succeeds but no artifact appears | Upload paths and if-no-files-found settings                                      |
| Release occurs despite test failures   | Release job needs, conditions, and exit codes                                    |
| Fork PR lacks secrets                  | This is a normal permission boundary; do not bypass it by broadening permissions |

Configure required checks in branch protection or repository rules so failures actually block merges. Remote workflow success must be confirmed by running it in the real repository; local YAML parsing is no substitute.

<a id="section-7"></a>

## Official references :id=h-27c3ccb79f68

- [GitHub Actions workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [OIDC](https://docs.github.com/en/actions/concepts/security/openid-connect)

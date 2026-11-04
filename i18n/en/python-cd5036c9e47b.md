# Practical Python automation scripts :id=h-6d4f431ef25d

Learning objectives: write small tools with clear inputs, diagnosable errors, and no accidental changes to source data. First learn Python files, exceptions, and functions.

**Scope:** The complete example is the project's task-tools CSV summary tool, using the Python 3.15 teaching environment. Run file-operation, HTTP, and subprocess examples in the context of each section.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [Define inputs, outputs, and failures first](#section-1)
- [Minimal run instructions](#section-2)
- [File-processing boundaries](#section-3)
- [HTTP request example](#section-4)
- [Calling external programs](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Define inputs, outputs, and failures first :id=h-15815b6ddc59

Scripts also need an interface contract: which files they accept, their encoding, allowed fields, output destination, and how failure is reported.

This example reads title and done columns. done accepts only true / false; after trimming leading and trailing whitespace, titles must be 1 to 100 characters long. It outputs a JSON summary without changing the input file.

<a id="section-2"></a>

## Minimal run instructions :id=h-b8fa24008116

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
uv run --locked task-tools sample.csv
```

Expected output:

```json
{"total": 2, "completed": 1, "pending": 1}
```

The [complete script](examples/taskboard/python/src/task_tools/cli.py) uses argparse, pathlib, csv, and json. Missing files, incomplete columns, or invalid rows produce an error and a nonzero exit code. Tests verify the error row number and that the original file has not been overwritten.

<a id="section-3"></a>

## File-processing boundaries :id=h-ecb06582da83

Do not replace CSV parsing with string split(","): fields may contain quotes, commas, or newlines. Iterate through large files by row instead of reading everything into memory.

If an output file might overwrite existing content, provide an explicit overwrite option. For complete replacement, first write a temporary file on the same filesystem, confirm completion, then replace according to platform rules. A partial write is not success.

For batch renaming or cleanup, first output absolute paths and the number of files, verify the scope, then execute. Symbolic links, relative paths, extension case, and permissions may all change the actual targets.

<a id="section-4"></a>

## HTTP request example :id=h-bd4336bf0cdf

The following standalone script only reads the project's health endpoint; it does not create tasks:

```python
import httpx

with httpx.Client(timeout=httpx.Timeout(5.0, connect=2.0)) as client:
    response = client.get("http://127.0.0.1:8080/actuator/health")
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict) or payload.get("status") != "UP":
        raise ValueError("Unexpected health response")
    print("Service is healthy")
```

Start the Java backend first. Timeouts limit different phases; they do not mean the entire batch job must finish within five seconds. On failure, record the target, status, and necessary error information, but not passwords.

Do not unconditionally retry POST requests that create records, make payments, or send notifications. A timeout may occur after the server has completed the operation. Query the result or use a reliable idempotency design.

<a id="section-5"></a>

## Calling external programs :id=h-d0b20ed0f245

```python
import subprocess

result = subprocess.run(
    ["git", "status", "--short"],
    check=True,
    capture_output=True,
    text=True,
    encoding="utf-8",
    timeout=10,
)
print(result.stdout)
```

git must be installed and the current directory must be a repository. Argument lists avoid building shell statements from input; check=True turns nonzero exit codes into exceptions. When capturing output, also consider large output volumes and the source encoding.

<a id="section-6"></a>

## Verification and development quick reference :id=h-2c6710658741

| Input or failure       | Expected result                                            |
| ---------------------- | ---------------------------------------------------------- |
| Valid CSV              | Accurate counts without modifying the source file          |
| File does not exist    | Clear path-related error and nonzero exit                  |
| Invalid done           | Identify the row number; do not silently treat it as false |
| Backend unreachable    | Fail within a bounded time                                 |
| External program fails | Retain exit status and necessary diagnostics               |

For scheduled execution, use absolute paths, an explicit working directory, and controlled environment variables; add reentry prevention and failure alerts. A script running manually once does not mean it can run unattended long term.

<a id="section-7"></a>

## Official references :id=h-e106a5976150

- [argparse](https://docs.python.org/3/library/argparse.html)
- [csv](https://docs.python.org/3/library/csv.html)
- [subprocess](https://docs.python.org/3/library/subprocess.html)
- [HTTPX timeouts](https://www.python-httpx.org/advanced/timeouts/)

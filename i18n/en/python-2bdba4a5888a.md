# Python fundamentals and the standard library :id=h-0c162fd1a402

Learning objectives: progress from syntax to small programs that handle files, exceptions, and structured data. Even with Java or JavaScript experience, check Python's own semantics.

**Scope:** The teaching interpreter is CPython 3.15; the project declares a minimum of 3.11 and avoids depending on newer syntax. Actual verification uses the version managed by the project's .python-version and uv. See the verification record for exact interpreter and dependency versions.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [Concepts to learn first](#section-1)
- [Minimal runnable example](#section-2)
- [Functions, default arguments, and copying](#section-3)
- [Files, encoding, and exceptions](#section-4)
- [Choosing standard-library tools](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Concepts to learn first :id=h-66fe66162340

Python uses indentation to organize code blocks. Variable names bind to objects; assignment does not automatically copy objects. Integers, floating-point numbers, strings, lists, dictionaries, and sets are distinct data types.

| Syntax            | Meaning                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------ |
| list / dict / set | Mutable lists, mappings, and sets                                                          |
| tuple             | Tuple: element references cannot be reassigned, but contained objects may still be mutable |
| None              | Represents an absent value, not an empty string                                            |
| == / is           | Compare values / check object identity                                                     |
| def / class       | Define a function / class                                                                  |
| with              | Manage resources and exit behavior according to the object's protocol                      |

<a id="section-2"></a>

## Minimal runnable example :id=h-57c33f27c028

Save as hello_tasks.py:

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Task:
    title: str
    done: bool = False


def pending_titles(tasks: list[Task]) -> list[str]:
    return [task.title for task in tasks if not task.done]


if __name__ == "__main__":
    tasks = [Task("Learn Python", True), Task("Write tests")]
    print(pending_titles(tasks))
```

```powershell
python hello_tasks.py
```

Expected output: \['Write tests']. Type annotations help tools check code; they do not automatically reject incorrect types at runtime. frozen restricts field assignment, but does not make all referenced content deeply immutable.

<a id="section-3"></a>

## Functions, default arguments, and copying :id=h-3497a3f72103

Default arguments are evaluated when a function is defined. Do not use a mutable list to hold fresh data for each call:

```python
def add_title(title: str, titles: list[str] | None = None) -> list[str]:
    result = [] if titles is None else list(titles)
    result.append(title)
    return result
```

This explicitly copies the passed list without changing the caller's list. A shallow copy still shares nested objects. Before deep copying, decide which objects should be shared, rather than mechanically calling deepcopy on all data.

A function returning multiple values usually actually returns a tuple. Do not confuse printed output with a return value: print outputs data, while return passes data to the caller.

<a id="section-4"></a>

## Files, encoding, and exceptions :id=h-95db64973ddd

Use pathlib for paths, specify text encoding, and set newline="" for CSV. UTF-8 files may contain a BOM; use utf-8-sig when needed to read such exports.

```python
from pathlib import Path

source = Path("tasks.txt")
try:
    with source.open(encoding="utf-8") as stream:
        for line in stream:
            print(line.rstrip("\n"))
except FileNotFoundError:
    print("Input file was not found")
```

Catch only exceptions you know how to handle. An unconditional pass after except Exception lets execution continue as though an error were a success. Preserve the original cause when propagating an error.

<a id="section-5"></a>

## Choosing standard-library tools :id=h-a37f7d80d54c

| Task                       | Start with                                             |
| -------------------------- | ------------------------------------------------------ |
| Paths and files            | pathlib、io                                             |
| JSON / CSV                 | json、csv                                               |
| Dates and times            | datetime、zoneinfo                                      |
| Command-line arguments     | argparse                                               |
| Logging                    | logging                                                |
| Monetary amounts           | decimal                                                |
| Calling external processes | subprocess; prefer argument lists and avoid shell=True |
| Iterative processing       | itertools and generators                               |

Use json.loads to parse JSON, not eval. Do not load untrusted pickle data; deserialization can execute code.

<a id="section-6"></a>

## Verification and development quick reference :id=h-988185588b4a

Confirm the actual interpreter with python --version, and locate the environment with python -m pip instead of an ambiguous pip path. This repository uses uv run to unify interpreter and environment; see the [project engineering documentation](Python项目工程化.md).

Test functions with empty, normal, and invalid inputs. Floating-point comparisons, mutable defaults, shallow copies, file encodings, and swallowed exceptions are boundaries beginners coming from other languages easily overlook.

<a id="section-7"></a>

## Official references :id=h-884b8b4138ad

- [Python tutorial](https://docs.python.org/3/tutorial/)
- [Standard library](https://docs.python.org/3/library/)
- [Python releases](https://www.python.org/downloads/)

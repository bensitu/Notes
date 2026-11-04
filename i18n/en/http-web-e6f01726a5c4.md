# HTTP and Web security fundamentals :id=h-6485986418d0

Learning objectives: read a request and response and distinguish network, authentication, permission, and input errors. Basic browser skills are required first.

**Scope:** Focuses on modern browsers, HTTP semantics, and same-origin Web applications. The running project uses HTTP locally; public deployment requires HTTPS.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [What requests and responses are](#section-1)
- [Minimal exercise: inspect real responses](#section-2)
- [Cookies, sessions, and tokens](#section-3)
- [Four easily confused problems](#section-4)
- [Caching, HTTPS, and boundaries](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## What requests and responses are :id=h-707b0705c879

A request contains a method, target, headers, and optional body; a response contains a status code, headers, and optional body. JSON is a content format, not a communication protocol, and does not automatically provide authentication or encryption.

| Method | Use in this project     | Considerations for repeated requests                                                          |
| ------ | ----------------------- | --------------------------------------------------------------------------------------------- |
| GET    | Read tasks              | Should not change business state                                                              |
| POST   | Create a task or log in | Resending after a network timeout may create duplicates                                       |
| PUT    | Submit new task content | The example has a version condition; resubmitting an old version may return 409               |
| DELETE | Delete a specified task | Repeated deletions may return different statuses, but the resulting deleted state is the same |

Idempotency describes the intended effect of repeated execution, not identical responses every time. Retriable POST for payments, orders, and similar operations require application-level idempotency keys and database constraints.

<a id="section-2"></a>

## Minimal exercise: inspect real responses :id=h-a665f96b1dd4

Start the running project's backend first:

```powershell
curl.exe -i http://127.0.0.1:8080/actuator/health
curl.exe -i http://127.0.0.1:8080/api/tasks
curl.exe -i http://127.0.0.1:8080/api/csrf
```

Observe 200, 401, and CSRF JSON separately. A CSRF response may also establish a session; command-line clients must retain cookies to continue login. The browser frontend already wraps this flow.

| Status          | Common meaning                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| 200 / 201 / 204 | Read or modification succeeded / created / succeeded with no response body                                |
| 400 / 422       | Input violates the API contract; this project's Java uses 400, while Python's default validation uses 422 |
| 401 / 403       | Unauthenticated / permission or request-protection checks failed                                          |
| 404 / 409       | Resource not found / conflict with current resource state                                                 |
| 500 / 502 / 504 | Internal application error / proxy upstream error / upstream timeout                                      |

<a id="section-3"></a>

## Cookies, sessions, and tokens :id=h-709e78586962

Cookies are data browsers attach according to domain, path, expiration, and similar rules. Sessions store session state on the server, usually passing the session identifier through a cookie. JWT is a token format, not equivalent to OAuth2, and does not remove the need to handle logout, leaks, and permission changes.

HttpOnly restricts script access to cookies; Secure requires secure transport; SameSite controls some cross-site sending. Each has its own role and cannot replace authorization checks or every CSRF defense.

<a id="section-4"></a>

## Four easily confused problems :id=h-d4fdc3511d04

| Problem             | Example                                                       | Response                                                                               |
| ------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| XSS                 | Executing user input as HTML or script                        | Output text by default, restrict rich text, and use reliable sanitizers when necessary |
| CSRF                | The browser performs an unintended action using login cookies | CSRF tokens, appropriate cookie settings, and origin checks                            |
| SQL injection       | Concatenating input into SQL structure                        | Parameter binding; program allowlists for dynamic table names and sort fields          |
| Unauthorized access | Changing a task ID in URL to read someone else's task         | Check task ownership against the current user on the server                            |

CORS is browser control over cross-origin reads. Opening CORS does not log users in or grant business permissions; non-browser clients are not subject to the same read restrictions.

<a id="section-5"></a>

## Caching, HTTPS, and boundaries :id=h-5d9a8c914b9d

Content-hashed static assets suit long-term caching; the HTML entry point should support revalidation. Personal data and tokens must not enter shared caches. ETag and If-None-Match support conditional requests; 304 is not a business failure.

HTTPS protects transport, but verify the domain and certificate are valid. Do not fix production connections by disabling certificate checks. Proxies should trust forwarded headers only from known proxies.

This project forwards /api requests through Vite or Nginx so browsers use same-origin addresses. A development proxy does not automatically become a production proxy.

<a id="section-6"></a>

## Verification and development quick reference :id=h-0d003d14ab05

Record URL, method, status, Content-Type, cookies, and request body in the browser Network panel. For 403, distinguish insufficient permissions from missing CSRF first; for 401, check session expiration first.

Avoid logging passwords, full cookies, Authorization, or CSRF tokens. Tests for creation, deletion, and permission changes must cover success and rejection paths.

<a id="section-7"></a>

## Official references :id=h-bf77cadff69a

- [HTTP semantics standard RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [OWASP prevention cheat sheet](https://cheatsheetseries.owasp.org/)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

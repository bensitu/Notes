# Login authentication and access control :id=h-e697a94d00dc

Learning objectives: let legitimate users access permitted resources and understand the distinct roles of login, sessions, CSRF, and authorization checks. Read the HTTP and Web security documentation first.

**Scope:** The complete example uses Spring Security managed by Spring Boot 4, server-side sessions, and an in-memory demo account. Public deployment requires HTTPS, real user storage, and account lifecycle management.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [Distinguish three questions first](#section-1)
- [The complete runnable flow](#section-2)
- [Cookie and CSRF details](#section-3)
- [Passwords, users, and the gap to production](#section-4)
- [The roles of OAuth2, OIDC, and JWT](#section-5)
- [Verification and development quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## Distinguish three questions first :id=h-f4f98e79a0f0

| Question           | Meaning                    | Example                                        |
| ------------------ | -------------------------- | ---------------------------------------------- |
| Authentication     | Who are you?               | Password login establishing a session          |
| Authorization      | What can you do?           | Administrators may delete                      |
| Resource ownership | Which data can you act on? | Ordinary users can modify only their own tasks |

Hiding frontend buttons affects only display and cannot prevent direct API calls. Role checks do not automatically check object ownership either.

<a id="section-2"></a>

## The complete runnable flow :id=h-4ba65a202e1e

1. Start the backend and frontend following the project instructions.
2. The frontend sends GET /api/csrf, retains cookies, and receives a header name and token.
3. Send POST /api/login with account and password as a URL-encoded form, including the CSRF header.
4. After successful login, retrieve the CSRF token again before creating or updating tasks.
5. Send POST /api/logout with the token as well; clear shared page state after logout.

Use the [complete security configuration](examples/taskboard/backend/src/main/java/example/tasks/SecurityConfig.java) with the [browser request wrapper](examples/taskboard/frontend/src/api.ts). The username is admin; the password comes from APP_PASSWORD. The local fallback value is only for practice, not public deployment.

<a id="section-3"></a>

## Cookie and CSRF details :id=h-a42bd3fccba8

The session identifier is stored in an HttpOnly cookie; the frontend need not read it. fetch uses same-origin credentials; Vite / Nginx proxies maintain the same origin in development / production respectively.

The example keeps Spring Security's default CSRF protection instead of disabling it because “the API returns JSON.” Cookie-authenticated writes still require request protection.

Tokens may change after login or logout. Do not retain the first token indefinitely or record it in URL or logs. For a 403, first distinguish authorization failure from token mismatch.

<a id="section-4"></a>

## Passwords, users, and the gap to production :id=h-f0ba523b9983

PasswordEncoder creates password hashes with an algorithm identifier; hashing is not reversible encryption. Use matches for verification instead of re-encoding and comparing strings yourself: random salts produce different encodings for the same password.

The example creates an in-memory account on every startup. Real systems must persist hashes and support disabling accounts, permission changes, password resets, login rate limits, and necessary auditing. Do not return user passwords alongside task fields.

After adding user ownership, database operations must also constrain the user ID, as in this syntax fragment:

```sql
SELECT id, title FROM task WHERE id = ? AND owner_id = ?;
```

The current example table lacks owner_id, so this cannot run directly. Multi-user isolation is supported only after migrating the field, backfilling existing data, implementing authorization, and adding unauthorized-access tests.

<a id="section-5"></a>

## The roles of OAuth2, OIDC, and JWT :id=h-ca53ec5d4f13

OAuth2 handles delegated authorization; OIDC adds an identity layer; JWT is a token format. For single sign-on, integrate a trusted identity provider. Beginners should not write a complete authorization server themselves.

Even when browsers use authorization code flow with PKCE, verify redirect addresses and binding information such as state. Validating JWT requires more than decoding: verify signature, issuer, audience, expiry, and permitted algorithms according to the contract.

Do not consider a token permanently valid because it is JWT. Logout, revocation, permission changes, and leaks all require design. Choose sessions or tokens according to clients and deployment scenarios.

<a id="section-6"></a>

## Verification and development quick reference :id=h-798d43a11818

| Test case                                | Expected result                                  |
| ---------------------------------------- | ------------------------------------------------ |
| Read tasks without login                 | 401                                              |
| Logged in, but write lacks CSRF          | 403                                              |
| Ordinary role deletes                    | 403                                              |
| Administrator deletes with a valid token | 204, or 404 if the resource is absent            |
| Read again after logout                  | 401                                              |
| User A acts on user B's resource         | Must be rejected after adding multi-user support |

Backend tests use mock identities to verify authorization rules; browser end-to-end tests verify real password login, cookies, and CSRF working together. Neither test category replaces the other.

<a id="section-7"></a>

## Official references :id=h-843a4448887f

- [Spring Security authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/index.html)
- [CSRF protection](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [Password storage](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)

# Nginx reverse proxy and HTTPS :id=h-30cc88c5c528

Learning objectives: let browsers access pages and API through one entry point, and understand paths, forwarded headers, timeouts, caching, and certificates.

**Scope:** The running project uses the official Nginx stable-alpine image; its local entry point is HTTP 8088. The HTTPS configuration is an extension requiring a domain and valid certificate before activation.

[Document index](README.md) · [Running project and instructions](examples/taskboard/README.md)

**Contents**

- [What a reverse proxy does](#section-1)
- [Minimal run instructions](#section-2)
- [Trailing slashes matter](#section-3)
- [Static caching and page routing](#section-4)
- [HTTPS configuration template](#section-5)
- [Verification and troubleshooting quick reference](#section-6)
- [Official references](#section-7)

<a id="section-1"></a>

## What a reverse proxy does :id=h-84f20df41628

Browsers access Nginx: it returns static pages and forwards /api requests to the Java backend. The browser sees one origin, without directly connecting to the container database or internal backend address.

Nginx does not replace business authorization checks. Accessible frontend pages do not mean the task API permits anonymous access.

<a id="section-2"></a>

## Minimal run instructions :id=h-dd40cac97511

```powershell
Set-Location examples/taskboard
docker compose --env-file .env up -d --build
docker compose exec web nginx -t
curl.exe -i http://127.0.0.1:8088/
curl.exe -i http://127.0.0.1:8088/api/tasks
```

Expect 200 for the homepage and 401 for unauthenticated API. The second response shows the path reached the backend. See [nginx.conf](examples/taskboard/frontend/nginx.conf) for complete configuration.

<a id="section-3"></a>

## Trailing slashes matter :id=h-e7275b29da89

The example uses:

```nginx
location /api/ {
    proxy_pass http://backend:8080;
}
```

Forwarding /api/tasks preserves /api/tasks. If instead written as proxy_pass [http://backend:8080/ with a URI, the matched ](http://backend:8080/，匹配的) /api/ prefix is replaced, so the backend may receive /tasks.

After changing path mappings, verify with real URL rather than only checking configuration syntax.

<a id="section-4"></a>

## Static caching and page routing :id=h-63ec1d39c865

Vite's hashed assets can be cached long term; the HTML entry point needs timely revalidation. Do not apply shared caching indiscriminately to login responses, user data, and all /api responses.

On a SPA page refresh, Nginx falls back to index.html for nonexistent frontend routes. API needs its own location; it must not also fall back to HTML and appear successful.

If the browser reports “JSON parsing failed,” check whether the actual response is index.html returned by mistake.

<a id="section-5"></a>

## HTTPS configuration template :id=h-55f1b3b49238

Place the following server fragment in Nginx's http configuration context. Configure domain DNS first and securely mount the real certificate and private key at these paths. This configuration is not already enabled in local Compose.

```nginx
server {
    listen 443 ssl;
    server_name tasks.example.com;
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

Also configure static pages, explicit redirection from 80 to 443, certificate renewal, and health verification. The backend must trust forwarded headers only from known proxies and set Secure session cookies on the HTTPS path. Adding headers alone does not mean the backend correctly recognizes the original protocol.

Do not put private keys in images or repositories. Enable HSTS only after confirming the whole domain and relevant subdomains can use HTTPS long term; do not casually apply includeSubDomains.

<a id="section-6"></a>

## Verification and troubleshooting quick reference :id=h-1a1c0bca24b9

| Symptom                              | Check                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| 502                                  | Upstream address, container DNS, listening port, and backend process               |
| 504                                  | Processing time, blocking points, timeouts, and call chain                         |
| Part of the request path is missing  | Check whether proxy_pass includes a URI and how location matches                   |
| Configuration changes have no effect | Check reload or image rebuild after nginx -t                                       |
| Certificate is untrusted             | Domain, validity, certificate chain, and client trust; do not disable verification |
| Upload fails                         | Check both Nginx and backend size limits                                           |

Nginx add_header has configuration-level and inheritance rules. When adding cache headers to child locations, check required security headers remain. Validate before reloading; temporary edits inside containers do not automatically enter the next image.

The upstream service name here is resolved when Nginx loads configuration. If replacing only backend changes its IP, recheck and reload or rebuild web. Do not assume an existing Nginx process immediately resolves Docker DNS again.

<a id="section-7"></a>

## Official references :id=h-f8d4934fee49

- [Nginx proxy module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [HTTPS configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [Response header module](https://nginx.org/en/docs/http/ngx_http_headers_module.html)

# Axios, Promise, and async/await :id=h-3c801620a67b

Understand request parameters, response errors, and asynchronous execution order; look up HTTP methods and Promise behavior during development.

**Prerequisites and versions:** First learn JavaScript functions and objects. This document uses Axios 1.x and ES2017+; use await inside asynchronous functions.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://axios-http.com/docs/intro)

**On this page**

- [How the three relate](#section-1)
- [HTTP method and parameter reference](#section-2)
- [GET, POST, PUT, and DELETE](#section-3)
- [JSON, forms, and files](#section-4)
- [Responses and errors](#section-5)
- [Default configuration and interceptors](#section-6)
- [Cancellation and preventing stale results from overwriting newer ones](#section-7)
- [Basic Promise behavior](#section-8)
- [Chaining](#section-9)
- [async/await, sequential execution, and concurrency](#section-10)
- [Quick development troubleshooting](#section-11)

<a id="section-1"></a>

## How the three relate :id=h-b5e7092a9071

A Promise represents obtaining a value successfully in the future, or failing with an error. async/await is syntax for working with Promises. Axios is a library for sending HTTP requests, and its request methods return Promises.

Network requests remain asynchronous. await pauses only the subsequent steps of the current function; it does not block the entire JavaScript thread.

This document uses Axios 1.x. In an npm project, install axios\@1 and commit package-lock.json to record the actual version. Put browser examples in modules managed by a build tool; Node.js examples use a project supporting ES modules.

```sh
npm install axios@1
```

```javascript
import axios from "axios";
```

<a id="section-2"></a>

## HTTP method and parameter reference :id=h-1f57bd29ac82

HTTP methods express request intent, rather than CRUD rules defined by Axios itself. GET reads, POST submits for processing, PUT replaces a target resource, PATCH partially updates it, and DELETE deletes it. Agree on the exact API behavior with the backend.

| Method                         | Second argument | Where to place the request body                                         |
| ------------------------------ | --------------- | ----------------------------------------------------------------------- |
| axios.get(url, config)         | Configuration   | Browser GET requests do not send a body; put query parameters in params |
| axios.delete(url, config)      | Configuration   | config.data                                                             |
| axios.head(url, config)        | Configuration   | No body                                                                 |
| axios.options(url, config)     | Configuration   | Use config.data when needed                                             |
| axios.post(url, data, config)  | Body            | data                                                                    |
| axios.put(url, data, config)   | Body            | data                                                                    |
| axios.patch(url, data, config) | Body            | data                                                                    |

<a id="section-3"></a>

## GET, POST, PUT, and DELETE :id=h-521d6508d935

```javascript
const response = await axios.get("/api/users", {
  params: { page: 1, size: 10 },
  timeout: 5000
});
console.log(response.data);
```

params handles query parameter encoding. Do not directly concatenate input containing spaces, Chinese characters, or & into a URL. Top-level await requires ES module support; alternatively, put the snippet inside an async function.

```javascript
async function createUser() {
  const response = await axios.post("/api/users", {
    name: "Tom",
    age: 18
  });
  return response.data;
}

async function updateUser(id) {
  const response = await axios.put("/api/users/" + encodeURIComponent(id), {
    name: "Mary",
    age: 20
  });
  return response.data;
}

async function deleteUser(id) {
  const response = await axios.delete("/api/users/" + encodeURIComponent(id));
  return response.data;
}
```

These functions send requests only when called, for example await createUser(). They depend on actual backend endpoints and are not offline demos that return data simply by running them.

When DELETE requires a body:

```javascript
await axios.delete("/api/users", {
  data: { ids: [1, 2, 3] }
});
```

Whether a body is allowed for bulk deletion depends on the backend API contract; do not assume it behaves exactly like GET.

<a id="section-4"></a>

## JSON, forms, and files :id=h-d9a9f5fa4108

Axios normally serializes plain objects as JSON, so there is no need to call JSON.stringify on every object.

```javascript
const form = new URLSearchParams();
form.set("username", "Tom");
form.set("password", "example-password");
await axios.post("/api/login", form);
```

URLSearchParams is used for application/x-www-form-urlencoded. The password example is for local practice only; use HTTPS for real login requests.

File upload in the browser:

```javascript
async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const response = await axios.post("/api/files", form);
  return response.data;
}
```

file is the File object selected by the user. When sending FormData in a browser, let the browser and Axios generate Content-Type with its boundary. Do not hard-code multipart/form-data and omit the boundary parameter.

<a id="section-5"></a>

## Responses and errors :id=h-bf4712c5de3d

| Field               | Meaning                                                         |
| ------------------- | --------------------------------------------------------------- |
| response.data       | Response body, such as JSON returned by the backend             |
| response.status     | HTTP status code                                                |
| response.statusText | Status text; may be empty with HTTP/2 and similar cases         |
| response.headers    | Response headers                                                |
| response.config     | Configuration used to send the request                          |
| response.request    | Underlying request object; differs between browsers and Node.js |

By default, 2xx status codes fulfill the request Promise; other status codes normally reject it. validateStatus can change this rule. HTTP 200 does not guarantee business success; agree with the backend on the business status in the response body.

```javascript
try {
  const response = await axios.get("/api/users/1");
  console.log(response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("HTTP error:", error.response.status);
    } else if (error.request) {
      console.error("No response was received");
    } else {
      console.error("Request setup failed:", error.message);
    }
  } else {
    throw error;
  }
}
```

Network errors, timeouts, and canceled requests may have no error.response. Do not access error.response.status without checking first.

```javascript
axios.get("/api/users/1")
  .then(response => console.log(response.data))
  .catch(error => console.error(error))
  .finally(() => console.log("Request finished"));
```

finally performs cleanup after completion. A then after catch is not an unconditional finally: if catch throws again, the following fulfillment callback will not run.

<a id="section-6"></a>

## Default configuration and interceptors :id=h-c3ccec309720

```javascript
const api = axios.create({
  baseURL: "/api",
  timeout: 5000
});

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", "Bearer " + token);
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);
```

This module snippet requires you to implement getAccessToken(), with tokens supplied by the login module. When changing one request header, preserve the others; do not overwrite all of config.headers.

Request interceptors run before Axios sends a request. Response interceptors run before the Axios response reaches the caller's then/catch. They apply only to the corresponding Axios instance and do not intercept all Fetch, image, or form requests on the page.

Configuration precedence is normally library defaults < instance defaults < per-request config. Create a shared API instance centrally to avoid scattering business configuration across globals.

Error interceptors normally return Promise.reject(error) so callers can decide how to display the error. Recover to success only when a fallback result is explicitly defined. Do not casually convert errors to {}, or later code may mistakenly assume the request succeeded.

Remove an interceptor:

```javascript
const interceptorId = api.interceptors.request.use(config => config);
api.interceptors.request.eject(interceptorId);
```

<a id="section-7"></a>

## Cancellation and preventing stale results from overwriting newer ones :id=h-154e3bf033e2

Axios supports AbortController starting with 0.22. CancelToken is the older API; use signal in new code.

```javascript
let currentController;

async function searchUsers(keyword) {
  if (currentController) {
    currentController.abort();
  }

  const controller = new AbortController();
  currentController = controller;

  try {
    const response = await axios.get("/api/users", {
      params: { keyword },
      signal: controller.signal
    });
    if (currentController !== controller) {
      return null;
    }
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      return null;
    }
    throw error;
  } finally {
    if (currentController === controller) {
      currentController = undefined;
    }
  }
}
```

This function cancels the previous search and ignores outdated responses. The caller treats null as canceled or stale and does not update the page. Create a new controller for each new request; an aborted signal cannot be reset.

Canceling the client's wait does not guarantee that the server stops executing. Operations such as creation and payments need backend idempotency handling; frontend cancellation alone cannot prevent duplicate writes.

<a id="section-8"></a>

## Basic Promise behavior :id=h-4013bcc53158

A Promise has three states: pending (waiting), fulfilled (success), and rejected (failure). Once fulfilled or rejected, it cannot change again. The executor runs immediately; then/catch callbacks run asynchronously as microtasks.

```javascript
const promise = new Promise(resolve => {
  console.log("executor");
  setTimeout(() => resolve("done"), 10);
});

promise.then(value => console.log(value));
console.log("after registration");
```

Expected order: executor, after registration, done. Do not call resolve before the timer, or the result inside the timer will no longer determine the Promise's outcome.

resolve does not necessarily fulfill immediately: when passed another Promise or thenable, it adopts that object's eventual outcome.

<a id="section-9"></a>

## Chaining :id=h-01592e0345bc

Each then returns a new Promise.

```javascript
Promise.resolve(1)
  .then(value => value + 1)
  .then(value => console.log(value));
```

The result is 2. A callback does not need to return a Promise to continue the chain: an ordinary value is passed to the next callback; a Promise is awaited; without return, the next callback receives undefined; a thrown error goes to a subsequent catch.

```javascript
function delay(value, milliseconds) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), milliseconds);
  });
}

delay("first", 10)
  .then(value => {
    console.log(value);
    return delay("second", 10);
  })
  .then(value => console.log(value));
```

The second delay needs return so the whole chain waits for it. A Promise executor should only start the task and deliver its result; making it an async function is not recommended.

<a id="section-10"></a>

## async/await, sequential execution, and concurrency :id=h-3adb7fc5ddf0

async/await was introduced in ES2017. An async function always returns a Promise. async can be used without await. await can wait for ordinary values or Promises. A rejected Promise throws at await and can be handled with try/catch.

```javascript
async function queryData() {
  const first = await axios.get("/api/first");
  const second = await axios.get("/api/second", {
    params: { id: first.data.id }
  });
  return second.data;
}

queryData()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

Write queryData(); do not write queryData.then(...) on the function itself.

When two requests do not depend on each other, start them concurrently:

```javascript
const [user, permissions] = await Promise.all([
  axios.get("/api/users/1"),
  axios.get("/api/users/1/permissions")
]);
console.log(user.data, permissions.data);
```

Promise.all rejects when one task fails, but does not automatically cancel the other requests. To retain the success or failure result of every task, use Promise.allSettled.

<a id="section-11"></a>

## Quick development troubleshooting :id=h-61bd3031ab86

1. Check that the URL, HTTP method, query parameters, and request body match the backend contract.
2. Check the status code and response body in the browser's Network panel, not just the console.
3. Distinguish HTTP errors, business errors, network errors, and CORS blocking.
4. Confirm that interceptors return the configuration or response and do not swallow errors.
5. Cross-origin Cookie requests normally require withCredentials together with server-side CORS. A proxy only forwards requests during development and does not replace deployment configuration.

References: [Axios API](https://axios-http.com/docs/api_intro), [request configuration](https://axios-http.com/docs/req_config), [request cancellation](https://axios-http.com/docs/cancellation), and the [ECMAScript Promise specification](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects).

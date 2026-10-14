# Axios、Promise 与 async/await

理解请求参数、响应错误与异步顺序；开发时查 HTTP 方法和 Promise 行为。

**学习前提与版本：** 先会 JavaScript 函数与对象。本篇采用 Axios 1.x 与 ES2017+；await 在异步函数中使用。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://axios-http.com/docs/intro)

**内容导航**

- [三者的关系](#section-1)
- [HTTP 方法与参数速查](#section-2)
- [GET、POST、PUT 与 DELETE](#section-3)
- [JSON、表单与文件](#section-4)
- [响应与错误](#section-5)
- [默认配置与拦截器](#section-6)
- [取消与避免旧结果覆盖](#section-7)
- [Promise 的基本行为](#section-8)
- [链式调用](#section-9)
- [async/await 与串行、并发](#section-10)
- [开发时快速排查](#section-11)


<a id="section-1"></a>

## 三者的关系

Promise 表达“将来成功得到一个值，或失败得到一个错误”。async/await 是使用 Promise 的语法。Axios 是发送 HTTP 请求的库，其请求方法返回 Promise。

网络请求仍然是异步的。await 只暂停当前函数的后续步骤，不会阻塞整个 JavaScript 线程。

本文以 Axios 1.x 为例。npm 项目安装 axios@1，并提交 package-lock.json 记录实际版本。浏览器示例放在构建工具管理的模块中；Node.js 示例使用支持 ES 模块的项目。

```sh
npm install axios@1
```

```javascript
import axios from "axios";
```

<a id="section-2"></a>

## HTTP 方法与参数速查

HTTP 方法表达请求意图，不是 Axios 自己规定的 CRUD。GET 用于读取；POST 提交处理；PUT 替换目标资源；PATCH 局部更新；DELETE 删除目标资源。接口还需要与后端约定具体行为。

| 方法 | 第二个参数 | 请求体写在哪里 |
| --- | --- | --- |
| axios.get(url, config) | 配置 | 浏览器 GET 不发送正文，查询参数放 params |
| axios.delete(url, config) | 配置 | config.data |
| axios.head(url, config) | 配置 | 不使用正文 |
| axios.options(url, config) | 配置 | 需要时用 config.data |
| axios.post(url, data, config) | 正文 | data |
| axios.put(url, data, config) | 正文 | data |
| axios.patch(url, data, config) | 正文 | data |

<a id="section-3"></a>

## GET、POST、PUT 与 DELETE

```javascript
const response = await axios.get("/api/users", {
  params: { page: 1, size: 10 },
  timeout: 5000
});
console.log(response.data);
```

params 会负责查询参数编码。不要把带空格、中文或 & 的输入直接拼进 URL。顶层 await 要求 ES 模块支持；也可以把片段放进 async 函数。

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

这些函数需要先调用才会发请求，例如 await createUser()。它们依赖实际存在的后端接口，不是直接运行即可获得数据的离线演示。

DELETE 需要正文时：

```javascript
await axios.delete("/api/users", {
  data: { ids: [1, 2, 3] }
});
```

是否允许批量删除正文由后端接口约定，不应假定它与 GET 完全一样。

<a id="section-4"></a>

## JSON、表单与文件

普通对象通常会被 Axios 按 JSON 序列化，无需再统一调用 JSON.stringify。

```javascript
const form = new URLSearchParams();
form.set("username", "Tom");
form.set("password", "example-password");
await axios.post("/api/login", form);
```

URLSearchParams 用于 application/x-www-form-urlencoded。密码示例仅用于本地练习，真实登录请求使用 HTTPS。

浏览器文件上传：

```javascript
async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const response = await axios.post("/api/files", form);
  return response.data;
}
```

file 是用户选择的 File 对象。浏览器发送 FormData 时，让浏览器与 Axios 生成带 boundary 的 Content-Type，不要自行写死 multipart/form-data 而遗漏边界参数。

<a id="section-5"></a>

## 响应与错误

| 字段 | 含义 |
| --- | --- |
| response.data | 响应体，例如后端返回的 JSON |
| response.status | HTTP 状态码 |
| response.statusText | 状态文本，HTTP/2 等情况下可能为空 |
| response.headers | 响应头 |
| response.config | 发请求时的配置 |
| response.request | 底层请求对象，浏览器和 Node.js 不同 |

默认 2xx 状态码使请求 Promise 成功；其他状态码通常使其失败。validateStatus 可以改变这个规则。HTTP 200 不代表业务一定成功，需要与后端约定响应体中的业务状态。

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

网络错误、超时和取消请求可能没有 error.response。不能不检查就访问 error.response.status。

```javascript
axios.get("/api/users/1")
  .then(response => console.log(response.data))
  .catch(error => console.error(error))
  .finally(() => console.log("Request finished"));
```

finally 用于完成后的清理。catch 后再写 then 不等于无条件 finally：catch 内如果再次抛出异常，后面的成功回调不会执行。

<a id="section-6"></a>

## 默认配置与拦截器

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

这个模块片段需要自行实现 getAccessToken()，由登录模块提供令牌。修改单个请求头时保留其他请求头，不要把 config.headers 全部覆盖掉。

请求拦截器在 Axios 发请求前执行，响应拦截器在 Axios 的响应进入调用者 then/catch 之前执行。它们只作用于相应 Axios 实例，不会拦截页面中的全部 Fetch、图片或表单请求。

配置优先级通常是库默认值 < 实例 defaults < 单次请求 config。建议集中创建一个 API 实例，避免把业务配置散落在全局。

错误拦截器通常继续返回 Promise.reject(error)，让调用方决定如何提示。只有明确约定了替代结果时才恢复为成功；不要把错误随意变成 {}，否则后续代码会误认为请求成功。

移除拦截器：

```javascript
const interceptorId = api.interceptors.request.use(config => config);
api.interceptors.request.eject(interceptorId);
```

<a id="section-7"></a>

## 取消与避免旧结果覆盖

Axios 0.22 起支持 AbortController。CancelToken 是旧 API，新增代码使用 signal。

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

这个函数取消前一次搜索，并忽略已经过时的响应。调用者约定 null 表示取消或结果过时，不更新页面。每次新请求要创建新控制器，已经 abort 的 signal 不能恢复。

取消客户端等待并不保证服务器停止执行。新增、支付等操作需要后端幂等处理，不能只靠前端取消避免重复写入。

<a id="section-8"></a>

## Promise 的基本行为

Promise 有 pending（等待）、fulfilled（成功）、rejected（失败）三种状态。一旦确定成功或失败，就不能再次改变。执行器立即运行，then/catch 回调通过微任务异步执行。

```javascript
const promise = new Promise(resolve => {
  console.log("executor");
  setTimeout(() => resolve("done"), 10);
});

promise.then(value => console.log(value));
console.log("after registration");
```

预期顺序：executor、after registration、done。不要在定时器之前先调用 resolve，否则定时器中的结果不再决定这个 Promise。

resolve 不一定立即变成 fulfilled：传入另一个 Promise 或 thenable 时，会采用它后续的结果。

<a id="section-9"></a>

## 链式调用

每次 then 都返回一个新的 Promise。

```javascript
Promise.resolve(1)
  .then(value => value + 1)
  .then(value => console.log(value));
```

结果为 2。上一段回调不必返回 Promise 才能继续链式调用：普通值传给下一段；Promise 会被等待；没有 return 则下一段收到 undefined；抛出错误则进入后续 catch。

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

第二次延迟需要 return，才能让整个链等待它。Promise 执行器只负责启动任务与交付结果，不推荐写成 async 函数。

<a id="section-10"></a>

## async/await 与串行、并发

async/await 在 ES2017 引入。async 函数总是返回 Promise；async 可以独立使用，不要求一定写 await。await 可以等待普通值，也可以等待 Promise；拒绝的 Promise 会在 await 处抛出错误，可用 try/catch 处理。

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

必须写 queryData()，不能对函数本身写 queryData.then(...)。

两次请求没有依赖关系时，可以并发发起：

```javascript
const [user, permissions] = await Promise.all([
  axios.get("/api/users/1"),
  axios.get("/api/users/1/permissions")
]);
console.log(user.data, permissions.data);
```

Promise.all 在其中一个任务失败时拒绝，但不会自动取消其他请求。需要保留每个任务的成功或失败结果时，使用 Promise.allSettled。

<a id="section-11"></a>

## 开发时快速排查

1. 检查 URL、HTTP 方法、查询参数与请求体是否符合后端约定。
2. 查看浏览器网络面板的状态码与响应体，不要只看 console。
3. 区分 HTTP 错误、业务错误、网络错误和 CORS 拦截。
4. 确认拦截器返回了配置或响应，且没有吞掉错误。
5. 跨源 Cookie 请求通常需要 withCredentials 与服务端 CORS 配合；代理只解决开发时的转发，不代替部署配置。

参考：[Axios API](https://axios-http.com/docs/api_intro)、[请求配置](https://axios-http.com/docs/req_config)、[取消请求](https://axios-http.com/docs/cancellation)、[ECMAScript Promise 规范](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise-objects)。

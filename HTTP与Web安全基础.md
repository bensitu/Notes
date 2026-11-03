# HTTP 与 Web 安全基础

学习目标：读懂一次请求与响应，并区分网络、认证、权限和输入错误。先会浏览器基本操作。

**适用范围：** 以现代浏览器、HTTP 语义与同源 Web 应用为主。贯穿项目在本机用 HTTP，公网部署需要 HTTPS。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [请求与响应是什么](#section-1)
- [最小练习：观察真实响应](#section-2)
- [Cookie、Session 与 Token](#section-3)
- [四类容易混淆的问题](#section-4)
- [缓存、HTTPS 与边界](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 请求与响应是什么

请求包含方法、目标、请求头和可选的请求体；响应包含状态码、响应头和可选的响应体。JSON 是内容格式，不是通信协议，也不自动提供认证或加密。

| 方法 | 本项目用途 | 重复请求时的注意事项 |
| --- | --- | --- |
| GET | 读取任务 | 不应改变业务状态 |
| POST | 创建任务或登录 | 网络超时后重发可能重复创建 |
| PUT | 提交任务的新内容 | 示例带版本条件；重复提交旧版本可能得到 409 |
| DELETE | 删除指定任务 | 连续删除可返回不同状态，但删除后的目标状态相同 |

幂等描述多次执行的预期效果，不要求每次响应完全一样。支付、下单等 POST 若允许重试，需要应用自己的幂等键及数据库约束。

<a id="section-2"></a>

## 最小练习：观察真实响应

先启动贯穿项目后端：

```powershell
curl.exe -i http://127.0.0.1:8080/actuator/health
curl.exe -i http://127.0.0.1:8080/api/tasks
curl.exe -i http://127.0.0.1:8080/api/csrf
```

分别观察 200、401 和 CSRF JSON。CSRF 响应同时可能建立会话，命令行要保存 Cookie 才能继续完成登录；浏览器前端已经封装了流程。

| 状态 | 常见含义 |
| --- | --- |
| 200 / 201 / 204 | 读取或修改成功 / 已创建 / 成功且无响应体 |
| 400 / 422 | 输入不符合接口约定；本项目 Java 用 400，Python 默认验证用 422 |
| 401 / 403 | 未认证 / 权限或请求保护检查未通过 |
| 404 / 409 | 资源不存在 / 与当前资源状态冲突 |
| 500 / 502 / 504 | 应用内部错误 / 代理上游异常 / 等待上游超时 |

<a id="section-3"></a>

## Cookie、Session 与 Token

Cookie 是浏览器按域、路径、有效期等规则附带的数据。Session 是服务器保存会话状态的一种方式，通常用 Cookie 传递会话标识。JWT 是一种令牌格式，不等于 OAuth2，也不意味着可以忽略退出、泄露与权限变更。

HttpOnly 限制脚本读取 Cookie；Secure 要求通过安全连接发送；SameSite 控制部分跨站发送行为。它们有各自作用，不能代替权限校验或所有 CSRF 防护。

<a id="section-4"></a>

## 四类容易混淆的问题

| 问题 | 例子 | 应对方式 |
| --- | --- | --- |
| XSS | 把用户输入当 HTML 或脚本执行 | 默认文本输出、限制富文本、必要时使用可靠净化工具 |
| CSRF | 浏览器带着登录 Cookie 发出非用户本意的操作 | CSRF Token、合适的 Cookie 配置与来源检查 |
| SQL 注入 | 把输入拼进 SQL 结构 | 参数绑定；动态表名与排序字段用程序白名单 |
| 越权 | 修改 URL 的任务 ID 后读取别人任务 | 服务端检查当前用户与该任务的归属关系 |

CORS 是浏览器对跨源读取的控制。开放 CORS 不会登录用户，也不会赋予业务权限；非浏览器客户端也不受同一套读取限制。

<a id="section-5"></a>

## 缓存、HTTPS 与边界

带内容哈希的静态资源适合长期缓存；HTML 入口应能重新验证；个人数据和令牌不能进入共享缓存。ETag 和 If-None-Match 可以用于条件请求，304 不是业务失败。

HTTPS 保护传输，仍需确认连接的域名与证书有效；不要用关闭证书校验修复生产连接。代理应只信任来自已知代理的转发头。

本项目通过 Vite 或 Nginx 将 /api 请求转发到后端，让浏览器使用同源地址。开发代理不会自动变成生产代理。

<a id="section-6"></a>

## 验证与开发速查

在浏览器 Network 面板记录 URL、方法、状态、Content-Type、Cookie 和请求体。遇到 403，先区分权限不足和缺少 CSRF；遇到 401，先确认会话是否过期。

日志避免记录密码、完整 Cookie、Authorization 或 CSRF Token。创建、删除、权限变更的测试既要覆盖成功，也要覆盖拒绝路径。

<a id="section-7"></a>

## 官方参考

- [HTTP 语义标准 RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- [OWASP 防护速查](https://cheatsheetseries.owasp.org/)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

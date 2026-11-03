# Nginx 反向代理与 HTTPS

学习目标：让浏览器通过同一个入口访问页面和 API，理解路径、转发头、超时、缓存与证书。

**适用范围：** 贯穿项目使用 Nginx 官方 stable-alpine 镜像；本机入口为 HTTP 8088。HTTPS 配置是需要域名和有效证书后才能启用的扩展。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [反向代理做什么](#section-1)
- [最小运行步骤](#section-2)
- [路径结尾的斜杠很重要](#section-3)
- [静态缓存与页面路由](#section-4)
- [HTTPS 配置模板](#section-5)
- [验证与排错速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 反向代理做什么

浏览器访问 Nginx；静态页面由 Nginx 返回，/api 请求由它转发给 Java 后端。浏览器看到同一个源，不需要直接连接容器数据库或内部后端地址。

Nginx 不负责替代业务权限检查。前端页面可访问，不代表任务 API 可以匿名访问。

<a id="section-2"></a>

## 最小运行步骤

```powershell
Set-Location examples/taskboard
docker compose --env-file .env up -d --build
docker compose exec web nginx -t
curl.exe -i http://127.0.0.1:8088/
curl.exe -i http://127.0.0.1:8088/api/tasks
```

首页预期 200，未登录 API 预期 401。第二个响应说明路径已经转发到后端。完整配置见 [nginx.conf](examples/taskboard/frontend/nginx.conf)。

<a id="section-3"></a>

## 路径结尾的斜杠很重要

示例使用：

```nginx
location /api/ {
    proxy_pass http://backend:8080;
}
```

请求 /api/tasks 转发时保留 /api/tasks。若写成带 URI 的 proxy_pass http://backend:8080/，匹配的 /api/ 前缀会被替换，后端收到的路径可能变成 /tasks。

修改路径映射后，用真实 URL 验证，而不是只检查配置语法。

<a id="section-4"></a>

## 静态缓存与页面路由

Vite 生成带哈希的 assets 文件，可以长期缓存；HTML 入口需要及时重新验证。不能给登录响应、用户数据与所有 /api 响应一律加共享缓存。

SPA 页面刷新时，Nginx 将不存在的前端路由回退到 index.html。API 路径需要独立 location，不能也回退成 HTML 后假装成功。

浏览器出现“JSON 解析失败”时，检查实际响应是否是错误返回的 index.html。

<a id="section-5"></a>

## HTTPS 配置模板

以下 server 片段需放入 Nginx 的 http 配置上下文；先配置域名 DNS，并将真实证书与私钥安全挂载到这些路径。它不是本机 Compose 中已经启用的配置。

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

还要配置静态页面、80 到 443 的明确重定向、证书续期和健康验证。后端应只信任已知代理的转发头，并在 HTTPS 路线设置 Secure 会话 Cookie。仅添加请求头不代表后端已经正确识别原始协议。

私钥不进入镜像或仓库。HSTS 应在确认整个域名与相关子域都能长期使用 HTTPS 后再启用，不能随意套用 includeSubDomains。

<a id="section-6"></a>

## 验证与排错速查

| 症状 | 检查 |
| --- | --- |
| 502 | 上游地址、容器 DNS、监听端口、后端进程 |
| 504 | 处理耗时、阻塞点、超时与调用链 |
| 请求路径少了一段 | proxy_pass 是否带 URI，location 如何匹配 |
| 改配置没生效 | nginx -t 后是否 reload 或重新构建了镜像 |
| 证书不被信任 | 域名、有效期、证书链与客户端信任，不关闭校验 |
| 上传失败 | Nginx 大小限制与后端限制是否都满足 |

Nginx add_header 有配置层级与继承规则，给子 location 加缓存头时要检查需要的安全头是否仍存在。重载前检查配置；容器里临时修改的文件不会自动进入下一版镜像。

本例的上游服务名在 Nginx 加载配置时解析。若只替换 backend 容器导致 IP 改变，应重新检查并重载或重建 web；不要假定已有 Nginx 进程会立即重新解析 Docker DNS。

<a id="section-7"></a>

## 官方参考

- [Nginx proxy 模块](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [HTTPS 配置](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [响应头模块](https://nginx.org/en/docs/http/ngx_http_headers_module.html)

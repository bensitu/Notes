# Docker 与 Compose：把应用和依赖一起运行

学习目标：分清镜像、容器、网络与数据卷，能启动和排查一个多服务练习环境。先了解进程、端口和环境变量。

**适用范围：** 需要可运行 Linux 容器的 Docker Engine / Docker Desktop 与 Compose v2+。Windows 建议使用 Docker Desktop 的 WSL2 后端。镜像标签为教学基线，Compose 与 Dockerfile 同时固定本次核对的 digest；升级时应重新验证并更新。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [四个基本概念](#section-1)
- [最小运行步骤](#section-2)
- [构建与配置怎样配合](#section-3)
- [可选中间件](#section-4)
- [数据、重建与清理](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 四个基本概念

| 概念 | 可以怎样理解 |
| --- | --- |
| 镜像 Image | 应用文件和运行环境的构建结果 |
| 容器 Container | 从镜像启动的隔离进程 |
| 网络 Network | 容器互相发现和连接的通道 |
| 数据卷 Volume | 独立于容器生命周期的数据保存位置 |

容器不是完整虚拟机，也不是数据备份。删除并重建容器后，没放到持久化位置的数据可能消失。

<a id="section-2"></a>

## 最小运行步骤

在仓库根目录执行；假设已安装 Docker 并能运行 Linux 容器：

```powershell
Set-Location examples/taskboard
Copy-Item .env.example .env
docker compose --env-file .env --profile tools config --quiet
docker compose --env-file .env up -d --build
docker compose ps
docker compose logs --tail 100 backend
```

已有 .env 时不要再次覆盖，应检查其中的配置。示例密码是本机练习值，所有宿主机端口仅绑定 127.0.0.1。

浏览器打开 http://127.0.0.1:8088，用户名 admin，密码来自 .env 的 APP_PASSWORD。首次拉镜像、下载依赖与创建数据库可能需要等待。重试登录前先确认后端健康。

<a id="section-3"></a>

## 构建与配置怎样配合

[Compose 完整配置](examples/taskboard/compose.yml)默认启动 MySQL、Java 后端和 Nginx 前端；tools profile 额外提供 Redis、RabbitMQ、MongoDB。

前端构建阶段使用 Node，运行阶段只保留静态文件与 Nginx。后端构建阶段使用 Maven，运行阶段使用 JRE 与非 root 用户。生产应先运行测试，再发布已验证的镜像。

容器里的 DB_URL 使用 mysql:3306；Windows 本机连接练习数据库使用 127.0.0.1:3307。端口映射不会改变容器内部监听端口。

<a id="section-4"></a>

## 可选中间件

```powershell
docker compose --env-file .env --profile tools up -d redis rabbit mongo
docker compose --env-file .env --profile tools ps
```

这些服务用于各自的独立 Python 练习，尚未被接入 Java 任务 API。它们启动了不代表任务数据已经同时写入三个数据库。

MySQL 的 healthcheck 会实际连接练习数据库执行 SELECT 1。depends_on 只按声明的条件等待，不替代应用运行中的断线恢复和超时处理。

<a id="section-5"></a>

## 数据、重建与清理

```powershell
docker compose stop
docker compose start
docker compose down
```

stop 停止现有容器；start 启动已有容器；down 删除本项目容器与网络，默认保留命名卷。down --volumes 会删除关联卷中的练习数据，确认不再需要并有备份后才执行。

数据库初始化环境变量通常只在空数据目录首次启动时生效。修改 .env 的密码并重启已有数据卷，不会自动修改库内用户；要按数据库流程变更。

<a id="section-6"></a>

## 验证与开发速查

| 问题 | 检查 |
| --- | --- |
| 容器退出 | logs、退出码、变量与文件权限 |
| 服务名无法解析 | 是否在同一 Compose 网络，名称是否与 service 一致 |
| 本机端口冲突 | 改映射的宿主机端口，并同步客户端配置 |
| 修改代码没生效 | 是否重新 build / recreate，而不是只 start |
| 数据“丢失” | 是否换了项目名、卷名或连接地址 |

本机配置校验不需要连接容器引擎；真正的镜像构建、启动、健康与持久化验证需要 Docker 引擎。不要把 config --quiet 成功当作部署成功。

升级镜像前记录标签与 digest，备份并演练恢复。数据库镜像升级还要检查数据格式与支持的升级路线，不能任意退回旧镜像读取新数据卷。

<a id="section-7"></a>

## 官方参考

- [Compose 入门](https://docs.docker.com/compose/)
- [多阶段构建](https://docs.docker.com/build/building/multi-stage/)
- [持久化卷](https://docs.docker.com/engine/storage/volumes/)

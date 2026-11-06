# 任务管理贯穿示例

从仓库根目录进入 examples/taskboard。这个项目让学习文档中的命令、路径和接口使用同一组真实文件；各模块的依赖与启动方式在这里统一说明。

## 环境与版本

| 模块 | 教学基线 | 固定方式 |
| --- | --- | --- |
| Java API | Boot 4.1.2，源码 release 17 | Maven parent/BOM；本机 JDK 17 验证，CI / 镜像选 JDK 25 |
| 前端 | Node 24、Vue 3、Router 5、Pinia 4、Vite 8 | package.json 精确版本与 package-lock.json |
| 类型检查 | TypeScript 5.9.3、vue-tsc 3.3.14 | 已验证的组合；TypeScript 7 与该工具的内部路径不兼容 |
| Python | CPython 3.15，uv 0.13.7 | .python-version、pyproject.toml 与 uv.lock |
| 服务镜像 | MySQL 8.4、Redis 8.2、RabbitMQ 4.2、MongoDB 8.0、Nginx stable | 教学版本标签与已核对的 manifest digest 一起固定 |

主机还需要 Maven 3.9；容器路线需要能运行 Linux 容器的 Docker 引擎和 Compose。脚本与说明不要求读者安装项目中所有语言的全局依赖。

## 文件地图

| 目录 | 用途 |
| --- | --- |
| backend | 受 Session、CSRF 与角色保护的 Java API，默认 H2，mysql profile 使用真实 MySQL |
| frontend | Vue 页面、状态、请求封装、组件和浏览器测试 |
| python | CSV 工具、独立 FastAPI、Redis / RabbitMQ / MongoDB 命令 |
| ci | 可复制的 GitHub Actions 工作流，尚未放到自动触发目录 |
| compose.yml | 本机 MySQL、后端和前端；tools profile 是独立中间件练习 |

Java API 和 Python API 是两条学习路线，数据库不共享。Redis、RabbitMQ 和 MongoDB 命令没有被隐式接入 Java 任务接口。

## 路线 A：不用容器，先跑通页面

终端一，在仓库根目录开始：

```powershell
Set-Location examples/taskboard/backend
$env:APP_PASSWORD = 'local-demo-change-me'
mvn -B -ntp verify
mvn spring-boot:run
```

终端二，同样从仓库根目录开始：

```powershell
Set-Location examples/taskboard/frontend
npm ci
npm run dev
```

打开 <http://127.0.0.1:5173>，admin / local-demo-change-me 登录。新增、完成、退出后重新登录观察结果。默认 H2 内存库会随 Java 进程退出清空。

使用同一终端照抄两段 Set-Location 会改变相对路径；需要回到仓库根目录，或另开终端再开始。

## 路线 B：容器与持久化数据库

```powershell
Set-Location examples/taskboard
Copy-Item .env.example .env
docker compose --env-file .env --profile tools config --quiet
docker compose --env-file .env up -d --build
docker compose ps
docker compose logs --tail 100 backend
```

已有 .env 时保留并检查，不直接覆盖。等待后端健康后打开 <http://127.0.0.1:8088>；使用 .env 的 APP_PASSWORD。示例文件中的值都是本机练习值，不能用作公网凭证。

数据存在 mysql-data 命名卷。stop / start 不清数据；down 默认保留卷；删除卷会删除练习数据。先核对项目名、卷名与备份。

所有端口映射只绑定回环地址；Nginx 示例是 HTTP，本地验证不能替代公网 TLS 和访问控制。

## Python 路线

在仓库根目录开始：

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
uv run --locked task-tools sample.csv
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked pytest
uv run --locked uvicorn task_tools.app:create_app --factory --host 127.0.0.1 --port 8081
```

打开 <http://127.0.0.1:8081/docs>。FastAPI 使用当前目录 tasks.db，不和 Java H2 / MySQL 共享；这个 API 没有登录，仅绑定本机供练习。结束服务用终端 Ctrl+C。

SQLite 同一时刻只能有一个写入者。并发写入或长时间占用的事务可能让其他请求等待，等待超时后会出现 database is locked；增加线程并不能解除这个限制。这个示例适合本机单用户练习。扩展为多用户服务时，应缩短写入事务、按业务需要处理重试，并评估是否改用支持更多并发写入的数据库。原理见 [SQLite 的隔离与并发说明](https://www.sqlite.org/isolation.html)。

## 中间件路线

在 taskboard 目录启动：

```powershell
docker compose --env-file .env --profile tools up -d redis rabbit mongo
```

等待服务就绪后，另开终端从仓库根目录进入 Python 目录。下面的变量对应 .env.example，若改过 .env，必须使用实际值；URI 里的特殊字符要百分号编码。

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:REDIS_PASSWORD = 'local_redis_change_me'
$env:AMQP_URL = 'amqp://notes_user:local_rabbit_change_me@127.0.0.1:5672/%2F'
$env:MONGO_URI = 'mongodb://notes_admin:local_mongo_change_me@127.0.0.1:27017/?authSource=admin'
uv run --locked python -m task_tools.cache_demo
uv run --locked python -m task_tools.mq_demo publish --event-id demo-001
uv run --locked python -m task_tools.mq_demo consume
uv run --locked python -m task_tools.mongo_demo
```

默认连接本机演示容器；不要改为不明服务地址后继续发送同一凭证。MongoDB 是单节点 standalone，不用于多文档事务练习。

## 提交前的检查

```powershell
Set-Location examples/taskboard/backend
mvn -B -ntp verify
```

另开终端：

```powershell
Set-Location examples/taskboard/frontend
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

端到端测试需要 Java 后端仍在 8080 运行，APP_PASSWORD 与后端相同。Playwright 自动启动前端开发服务器；运行后确认没有误连其他应用。

Python 检查见前面的命令。容器配置检查不需要引擎，但容器的启动、Nginx 配置与数据持久化验证需要引擎。

## 能力边界与验证

这是学习项目，不是已经加固的生产系统。Java 只有一个演示管理员，没有多用户数据隔离；列表只显示最新 100 条；Python API 没有认证；中间件为独立练习。

配置语法检查不能证明真实 MySQL 锁、中间件连通、容器镜像或远端 Actions 已运行成功。这些集成行为需要在实际环境中按上面的步骤验证。

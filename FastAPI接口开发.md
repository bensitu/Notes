# FastAPI 接口开发：校验、数据库与测试

学习目标：用 Python 提供可验证的 HTTP 接口，并理解同步数据库、请求校验和应用生命周期。

**适用范围：** 贯穿项目使用 Python 3.15、FastAPI、Pydantic 与 SQLAlchemy 2，版本见 uv.lock。服务是独立学习实现，默认本机 8081、SQLite 数据库，不与 Java 后端共享数据。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [FastAPI 在项目中负责什么](#section-1)
- [最小运行步骤](#section-2)
- [数据模型与数据库会话](#section-3)
- [同步、异步与事务](#section-4)
- [测试与验证](#section-5)
- [常见错误与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## FastAPI 在项目中负责什么

路由接收请求，Pydantic 描述并验证输入与输出，SQLAlchemy 访问数据库，Uvicorn 运行 ASGI 应用。类型标注不会让任意外部数据自动可信，必须经过明确的校验边界。

完整文件见 [app.py](examples/taskboard/python/src/task_tools/app.py)。本例提供任务的创建、读取和带版本条件的修改，没有登录、删除和多用户隔离；不能直接用它替换受保护的 Java 服务。

<a id="section-2"></a>

## 最小运行步骤

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
uv run --locked uvicorn task_tools.app:create_app --factory --host 127.0.0.1 --port 8081
```

打开 <http://127.0.0.1:8081/docs>，在交互文档中 POST /api/tasks：

```json
{"title": "Learn FastAPI"}
```

预期 201，响应包含 id、done=false、version=0，并带 Location。然后使用返回的 id 调用 PUT：

```json
{"title": "Learn FastAPI", "done": true, "version": 0}
```

第一次修改版本变为 1；再次提交旧 version 得到 409。空白标题触发框架默认 422。不同框架的验证状态要在接口约定中明确，不机械套用 Java 的 400。

<a id="section-3"></a>

## 数据模型与数据库会话

输入模型只接收允许修改的字段，输出模型使用 from_attributes 从 ORM 对象读取。标题会去掉两端空白并校验长度；Pydantic 默认可能做类型转换，要求严格类型时需显式配置和测试。

每个请求通过依赖获得自己的 Session，请求结束关闭。Session 不是可在任意并发请求之间共享的全局对象。

启动生命周期创建缺失表并在结束时释放引擎。create_all 不会自动修改已有表结构；正式演进应使用 Alembic 等版本化迁移，并设计与旧版本的兼容过程。

<a id="section-4"></a>

## 同步、异步与事务

本例使用同步 SQLAlchemy，因此路由使用普通 def，避免在 async def 中直接阻塞事件循环。切换异步要同时使用兼容的异步驱动、引擎和会话，不能只给函数加 async。

更新使用 id 与 version 条件，一次语句检查旧版本并递增版本。没有更新行时回滚，进一步判断 404 或 409。

数据库提交、外部 HTTP 请求和消息发送不是一个自动的全局事务。需要可靠跨系统通知时，使用有明确恢复逻辑的设计。

<a id="section-5"></a>

## 测试与验证

```powershell
uv run --locked pytest tests/test_app.py
```

测试创建独立临时 SQLite 文件，使用 TestClient 的上下文管理器执行应用 lifespan。覆盖非法标题、创建、更新、冲突和不存在，不依赖本机 tasks.db。

SQLite 成功不能证明 MySQL、PostgreSQL 的 SQL 方言、锁或性能相同。更换数据库前加入对应驱动与真实数据库测试。

<a id="section-6"></a>

## 常见错误与开发速查

| 现象 | 检查 |
| --- | --- |
| 找不到 task_tools | 是否 uv sync、是否从项目目录使用模块路径 |
| 地址冲突 | Java 用 8080，本示例用 8081 |
| 旧数据表没有新字段 | create_all 不负责结构迁移 |
| 接口“异步”但并发很差 | 是否在事件循环执行阻塞 I/O |
| 响应对象缺字段 | 输出模型、from_attributes 与实际对象是否一致 |

本机示例绑定回环地址。若要对外提供服务，先增加认证、授权、限流、HTTPS、迁移、日志与部署进程管理；不要把开发热重载当作正式发布方式。

<a id="section-7"></a>

## 官方参考

- [FastAPI 教程](https://fastapi.tiangolo.com/tutorial/)
- [FastAPI 异步说明](https://fastapi.tiangolo.com/async/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/orm/quickstart.html)
- [Pydantic](https://docs.pydantic.dev/latest/)
- [Alembic](https://alembic.sqlalchemy.org/en/latest/)

# Spring Boot 现代项目实践

学习目标：从启动类到有校验、事务、错误响应和安全控制的 API。先掌握 Java、Maven、HTTP 与 JDBC。

**适用范围：** 贯穿项目固定 Spring Boot 4.1.2；Java 源码以 17 编译，可在 JDK 25 运行。默认 H2 内存库用于入门，mysql profile 使用 MySQL 8.4。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [请求怎样到达数据库](#section-1)
- [最小运行步骤](#section-2)
- [接口约定](#section-3)
- [校验、事务与竞争修改](#section-4)
- [配置与启动方式](#section-5)
- [验证、常见错误与速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 请求怎样到达数据库

浏览器 → Spring Security 过滤器 → Controller 参数绑定与校验 → JDBC 操作 → 数据库 → JSON 响应。

本例为减少初学者跳转，把短小的事务业务写在 Controller 中。项目复杂后应抽取 Service，保持事务边界和依赖方向清晰；这不是要求所有业务都写在 Controller。

完整文件见 [pom.xml](examples/taskboard/backend/pom.xml)、[TaskController.java](examples/taskboard/backend/src/main/java/example/tasks/TaskController.java)。

<a id="section-2"></a>

## 最小运行步骤

从仓库根目录进入后端；先安装 JDK 与 Maven：

```powershell
Set-Location examples/taskboard/backend
$env:APP_PASSWORD = 'local-demo-change-me'
mvn -B -ntp verify
mvn spring-boot:run
```

另开终端访问：

```powershell
curl.exe -i http://127.0.0.1:8080/actuator/health
```

预期 HTTP 200 和 UP。任务接口要求登录，使用贯穿项目的前端完成登录与操作。默认 H2 数据随进程结束消失，适合练习，不是生产存储配置。

<a id="section-3"></a>

## 接口约定

| 请求 | 请求体或结果 | 预期 |
| --- | --- | --- |
| GET /api/tasks | 最新 100 条，按 id 降序 | 200 |
| POST /api/tasks | title | 201，Location 指向新任务 |
| GET /api/tasks/{id} | 单个任务 | 200 或 404 |
| PUT /api/tasks/{id} | title、done、version | 200 或 409 |
| DELETE /api/tasks/{id} | 仅管理员可删 | 204 或 404 |
| GET /api/csrf | headerName、token | 登录前后分别获取 |
| POST /api/login | URL 编码表单 username、password | 204 或 401 |

字段 title 非空白且最多 100 个字符；Update 的 done 和 version 必填。创建和修改使用不同 DTO，避免把数据库字段一股脑开放给客户端。

<a id="section-4"></a>

## 校验、事务与竞争修改

@NotBlank 与 @Size 检查绑定后的字段；@Valid 触发请求体校验。前端校验用于反馈，不能替代服务端校验和数据库约束。

版本更新的核心 SQL 来自实际源码：

```sql
UPDATE task
SET title = :title, done = :done, version = version + 1
WHERE id = :id AND version = :version;
```

这是 JdbcClient 的命名参数片段，不是直接粘进 mysql 客户端执行的语句。两个请求使用同一旧版本，只有先成功的请求更新一行；另一个得到 409，重新读取后再由用户决定。

@Transactional 要通过 Spring 代理调用才生效。同一对象内部自调用、异步线程和另一个服务的 HTTP 请求，不会自动共享这个本地事务。

<a id="section-5"></a>

## 配置与启动方式

[application.yml](examples/taskboard/backend/src/main/resources/application.yml) 是本机默认值；[application-mysql.yml](examples/taskboard/backend/src/main/resources/application-mysql.yml) 从环境变量取连接信息。

启动 MySQL 配置时同时提供 SPRING_PROFILES_ACTIVE=mysql、DB_URL、DB_USER、DB_PASSWORD。端口、密码等环境变量要设置到真正启动 JVM 的进程环境中。

生产通过经过测试的 JAR 或镜像启动，不用开发命令临时下载依赖。只公开必要的管理端点，不暴露完整配置与健康细节。

<a id="section-6"></a>

## 验证、常见错误与速查

运行 mvn verify 覆盖未登录、缺少 CSRF、非法输入、更新冲突、删除权限和资源不存在。H2 测试通过后，还要在 MySQL 上验证迁移、锁和方言，不能把两种数据库视为完全等价。

| 问题 | 检查 |
| --- | --- |
| 启动找不到表 | Flyway 依赖、迁移文件位置、连接到哪个库 |
| 创建失败 | 校验响应、数据长度、数据库约束 |
| 旧版本写入 409 | 正常冲突处理，不应改成无条件覆盖 |
| 事务没有回滚 | 异常是否向外传播、是否通过代理、是否同一数据源 |
| 客户端只显示未知错误 | 是否保留 HTTP 状态、是否把 ProblemDetail 当业务成功 |

本例没有多租户、用户自助注册、全量分页或上传功能。扩展时分别增加边界和测试，不在示例中暗示这些能力已经实现。

<a id="section-7"></a>

## 官方参考

- [Spring Boot 系统要求](https://docs.spring.io/spring-boot/system-requirements.html)
- [Spring JDBC](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html)
- [参数校验](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html)

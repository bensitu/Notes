# 开发学习与工程实践笔记

面向基础入门开发者的技术文档，也用于开发时查阅概念、配置、示例和常见问题。文档按技术领域整理；使用代码前先检查对应文档的学习前提、适用版本和运行环境。

[任务管理示例](examples/taskboard/README.md) · [React 示例](examples/react-taskboard/README.md) · [SSR 示例与验证](examples/ssr/README.md) · [任务管理验证记录](examples/taskboard/验证记录.md)

[站内 Playground 使用说明](site/playground.md)：可以在浏览器中修改并运行 HTML/CSS/JavaScript、React 和 Vue 示例，并逐步观察 CSR、SSR 与水合的区别。

## 目录

- [Java 与后端开发](#java-与后端开发)
- [数据库与数据访问](#数据库与数据访问)
- [前端开发](#前端开发)
- [Faces 页面开发](#faces-页面开发)
- [中间件与服务入口](#中间件与服务入口)
- [Python](#python)
- [协作、测试与交付](#协作测试与交付)
- [示例与版本说明](#示例与版本说明)

## Java 与后端开发

| 文档 | 内容 |
| --- | --- |
| [现代 Java 开发](现代Java开发.md) | 集合、record、异常、时间、Stream 与并发边界 |
| [随机数](Random随机数.md) | 方法、取值区间与 API 选择 |
| [JUnit、反射与注解](Junit单元测试&反射&注解.md) | 测试基础、反射调用与注解作用 |
| [Maven 基础](Maven基础.md) | 项目结构、依赖、构建与冲突排查 |
| [Java Web 基础](Java%20Web基础.md) | Servlet、请求、响应与作用域 |
| [MVC 与分层](MVC结构.md) | 职责、调用方向、实体与 DTO |
| [Spring MVC：请求与响应](SpringMVC_1.md) | 路由、参数绑定、JSON 与 REST |
| [Spring MVC：整合与异常](SpringMVC_2.md) | 结果封装、异常处理与拦截器 |
| [SSM 整合](SSM.md) | IoC、AOP、事务和完整整合示例 |
| [Spring Boot 基础](SpringBoot.md) | starter、自动配置、配置文件与整合 |
| [Spring Boot 项目实践](SpringBoot现代项目实践.md) | 校验、事务、API、安全与配置 |
| [常用注解速查](SpringBoot的所有注解.md) | Spring、JPA、Jackson 与 Lombok |
| [Boot 3 到 4 迁移](SpringBoot3到4迁移.md) | 依赖、配置、JSON、测试和行为回归 |
| [登录认证与权限](登录认证与权限控制.md) | Session、CSRF、角色、资源归属与身份协议 |

## 数据库与数据访问

| 文档 | 内容 |
| --- | --- |
| [MySQL 数据库与表](MySQL数据库与表的基本操作.md) | 类型、建表、增删改与数据约束 |
| [MySQL 运算符](MySQL运算符.md) | 算术、比较、NULL、逻辑与模式匹配 |
| [MySQL 查询与分页](MySQL的基本查询,%20多表查询与分页.md) | 去重、排序、连接、子查询与分页 |
| [带前缀的业务编号](MySQL的VARCHAR型自增.md) | 数值自增、编号格式化、序列表与并发 |
| [索引、事务与迁移](数据库索引事务与迁移.md) | 执行计划、锁、版本更新、迁移与恢复 |
| [JDBC 基础](JDBC基础.md) | 参数绑定、资源关闭、批量写入与事务 |
| [MyBatis](MyBatis的使用.md) | Mapper、参数、结果映射、动态 SQL 与缓存 |
| [MyBatis-Plus 排查](Mybatis-plus使用问题.md) | 空结果、字段映射和配置检查 |
| [NoSQL 与 MongoDB](NoSQL与MongoDB基础.md) | 文档建模、索引、原子更新与事务边界 |

## 前端开发

| 文档 | 内容 |
| --- | --- |
| [HTML 与 CSS](前端基础_HTML&CSS.md) | 网页结构、表单、请求格式与样式 |
| [现代 CSS 与可访问性](现代CSS与可访问性.md) | Flex、Grid、响应式、键盘操作与反馈 |
| [JavaScript](前端基础-js.md) | 变量、函数、对象、控制语句与浏览器 API |
| [TypeScript](TypeScript基础.md) | 类型、接口、联合类型与泛型 |
| [Axios、Promise 与 async/await](Axios与Promise,%20Async,%20Await.md) | 请求、错误、取消与异步顺序 |
| [Vue 2 详解](VUE基础.md) | 绑定、响应式、组件、路由与状态管理 |
| [Vue 2 项目实践](前端基础-vue2.md) | 组件、请求、动态路由、Vuex 与管理界面 |
| [Vue 3 基础与实践](前端基础-vue3.md) | 响应式、组件通信、请求与工程类型 |
| [Vue 3 工程化](Vue3工程化开发.md) | Vite、路由、Pinia、配置、构建与排错 |
| [React 基础与组件](React基础与组件.md) | JSX、props、state、表单、列表与组件通信 |
| [React Hooks 与状态](ReactHooks与状态管理.md) | Effect、清理、闭包、ref、reducer 与状态归属 |
| [React 工程化与测试](React工程化与测试.md) | Vite、路由、请求、组件与浏览器测试 |
| [SSR 与水合](SSR与水合原理.md) | CSR、SSR、预渲染、初始数据与客户端接管 |
| [Next.js 与 App Router](Next.js与AppRouter实践.md) | React 服务端组件、交互边界、路由与缓存 |
| [Nuxt 全栈与 SSR](Nuxt全栈与SSR实践.md) | Vue 页面、Nitro、useFetch、useState 与 payload |
| [SSR 部署与缓存安全](SSR部署与缓存安全.md) | 运行产物、请求隔离、凭证、代理与缓存 |
| [前端自动化测试](前端自动化测试.md) | 状态、组件和真实浏览器测试 |

## Faces 页面开发

| 文档 | 内容 |
| --- | --- |
| [JSF 基础](JSF%20基础.md) | 组件树、生命周期、Bean 与作用域 |
| [JSF 标签](JSF%20标签.md) | 输入输出、转换、校验、表格与事件 |
| [IDEA 创建与部署 JSF](IDEA创建JSF项目.md) | 依赖、容器、部署配置和操作对照 |
| [Boot、Faces 与 MyBatis](Springboot+JSF+Mybatis.md) | JoinFaces、页面 Bean、数据库与安全边界 |

## 中间件与服务入口

| 文档 | 内容 |
| --- | --- |
| [Redis 缓存](Redis缓存实践.md) | TTL、淘汰、回源、竞争、一致性与故障 |
| [Apache Kafka](ApacheKafka基础与实践.md) | 事件日志、分区、消费组、位移、重放与幂等 |
| [消息队列与 RabbitMQ](消息队列基础与RabbitMQ实践.md) | 确认、重投、幂等、死信与业务事务 |
| [Nginx 与 HTTPS](Nginx反向代理与HTTPS.md) | 反向代理、路径、缓存、转发头与证书 |

## Python

| 文档 | 内容 |
| --- | --- |
| [Python 基础与标准库](Python基础与标准库.md) | 数据类型、函数、对象、文件、异常与常用模块 |
| [Python 项目工程化](Python项目工程化.md) | 环境、依赖、锁文件、Ruff 与 pytest |
| [Python 自动化脚本](Python自动化脚本实践.md) | CSV、HTTP、命令行、外部程序与失败处理 |
| [FastAPI 接口开发](FastAPI接口开发.md) | 参数校验、SQLAlchemy、事务、测试与部署边界 |

## 协作、测试与交付

| 文档 | 内容 |
| --- | --- |
| [Git 与团队协作](Git与团队协作.md) | 工作区、暂存、提交、冲突、审阅与撤销 |
| [Linux 与网络排错](Linux与网络排错.md) | 进程、端口、权限、DNS、日志与请求链路 |
| [HTTP 与 Web 安全](HTTP与Web安全基础.md) | 状态码、Cookie、CORS、CSRF、XSS 与越权 |
| [命名原则与规约](常用命名原则和规约.md) | 类、方法、变量与团队约定 |
| [后端自动化测试](后端自动化测试.md) | 单元、Web、数据库与失败路径验证 |
| [Docker 与 Compose](Docker与Compose.md) | 镜像、容器、网络、数据卷与多服务运行 |
| [GitHub Actions](GitHubActions持续集成.md) | 工作流、依赖锁定、测试、制品与权限 |
| [部署、发布与回滚](部署发布与回滚.md) | 发布验证、数据库兼容、制品和恢复 |

## 示例与版本说明

文档中的完整项目、代码片段和语法模板有不同使用条件：

- **完整项目**按文件、依赖和运行步骤使用；数据库、端口与凭证需要对应实际环境。
- **代码片段**放入指定的类、组件或配置上下文；同节替代写法不要全部拼接。
- **语法模板**中的占位名称和省略内容需要补齐；错误演示不能作为成功运行示例。
- **验证记录**区分实际测试、配置检查和需要外部服务的验证，不能把一种结果当成另一种证明。
- 代码注释使用英文，中文解释位于代码块前后。

版本不同的示例独立使用，尤其注意：

| 范围 | 需要核对 |
| --- | --- |
| Java / Spring | JDK、Boot、Framework、starter、构建插件和容器的配套要求 |
| Servlet / Faces | javax 与 jakarta 的包名、规范版本及容器支持 |
| Vue | Vue、Router、状态库、UI 库、TypeScript 和构建工具的组合 |
| Python | 解释器、依赖锁、驱动和外部服务 |
| 数据库 / 中间件 | 服务端版本、客户端、部署形态、持久化和备份恢复 |

贯穿示例的精确依赖保存在 Maven POM、package-lock.json 和 uv.lock；容器镜像固定已核对的 digest。调整版本后重新验证，不仅修改一个版本号。

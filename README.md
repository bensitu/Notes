# Java Web 与前端学习笔记

这是一组面向初学者的学习笔记，也可在开发时按问题查阅。文档同时包含旧项目维护资料与较新的整合示例。**先确认版本，再复制代码**：同名 API 在不同版本中可能已经更名或删除。

## 学习顺序与索引

| 阶段 | 先学什么 | 文档 |
| --- | --- | --- |
| 1. Java 工具与基础 | Maven、测试、随机数、命名 | [Maven](Maven基础.md)、[测试、反射与注解](Junit单元测试&反射&注解.md)、[随机数](Random随机数.md)、[命名规约](常用命名原则和规约.md) |
| 2. 数据库 | 表、类型、运算、查询、分页 | [数据库与表](MySQL数据库与表的基本操作.md)、[运算符](MySQL运算符.md)、[查询与分页](MySQL的基本查询,%20多表查询与分页.md)、[带前缀编号](MySQL的VARCHAR型自增.md) |
| 3. Java 访问数据库 | 连接、资源关闭、事务、映射 | [JDBC](JDBC基础.md)、[MyBatis](MyBatis的使用.md)、[MyBatis-Plus 排查](Mybatis-plus使用问题.md) |
| 4. Java Web | HTTP、Servlet、分层与 MVC | [Java Web](Java%20Web基础.md)、[MVC 结构](MVC结构.md)、[Spring MVC 入门](SpringMVC_1.md)、[Spring MVC 进阶](SpringMVC_2.md) |
| 5. Spring 整合 | IoC、事务、Boot 配置、注解 | [SSM 完整示例](SSM.md)、[Spring Boot](SpringBoot.md)、[注解速查](SpringBoot的所有注解.md) |
| 6. 浏览器基础 | HTML、CSS、JavaScript、类型与请求 | [HTML/CSS](前端基础_HTML&CSS.md)、[JavaScript](前端基础-js.md)、[TypeScript](TypeScript基础.md)、[Axios 与异步代码](Axios与Promise,%20Async,%20Await.md) |
| 7. Vue | 组件、响应式、路由、状态管理 | [Vue 2 详解](VUE基础.md)、[Vue 2 项目笔记](前端基础-vue2.md)、[Vue 3 项目笔记](前端基础-vue3.md) |
| 8. Faces | 生命周期、组件、部署、整合 | [JSF 基础](JSF%20基础.md)、[JSF 标签](JSF%20标签.md)、[IDEA 历史部署流程](IDEA创建JSF项目.md)、[Boot + Faces + MyBatis 示例](Springboot+JSF+Mybatis.md) |

没有数据库经验时，先练习建表与查询，再阅读 JDBC 和 MyBatis。没有浏览器开发经验时，先学 HTML、JavaScript 和异步请求，再学 Vue。Faces 与 Vue 是不同的页面开发路线，不必同时学习。

## 版本怎样选择

| 文档路线 | 版本范围与用途 | 注意事项 |
| --- | --- | --- |
| Servlet、JSF 2、旧 Spring MVC / Boot 笔记 | 维护使用 javax.servlet、javax.faces 的历史项目 | 不能直接配 Tomcat 10.1 或 Faces 4 |
| SSM.md | Java 17、Spring 6.2、MyBatis-Spring 3.0、Tomcat 10.1 | Servlet API 使用 jakarta.servlet |
| Springboot+JSF+Mybatis.md | Java 17、Boot 3.5.6、JoinFaces 5.5.6、Faces 4 | 使用文中的 BOM 与 starter 组合 |
| VUE基础.md / 前端基础-vue2.md | Vue 2、Vue Router 3、Vuex 3 | 维护旧项目；Vue 2 已结束官方维护 |
| 前端基础-vue3.md | Vue 3；部分截图与 UI 库示例来自早期版本 | 核对安装版本的组件属性，不要混用 Vue 2 插件 |
| TypeScript基础.md | TypeScript 5.x 的基础概念，建议 strict 模式 | 标为错误演示的代码不能作为成功运行示例 |

这些是文档的教学版本，不代表最新发布版。做新项目或上线项目时，应结合所选版本的官方支持周期、修复公告和兼容矩阵确定依赖。[Vue 官方维护说明](https://v2.vuejs.org/eol/)、[MyBatis-Spring 兼容要求](https://mybatis.org/spring/)、[JoinFaces 5.5.6 文档](https://docs.joinfaces.org/5.5.6/reference/)。

## 示例怎么用

- **完整示例**：给出文件名、依赖、必要配置和启动步骤，按所在文档操作。数据库用户名、密码、端口等需替换为本机配置。
- **代码片段**：只展示某个方法、标签或配置项。需要放进已有类、组件或配置文件，不能把每个代码块当成独立项目运行。
- **语法模板**：包含省略号、占位名称或示意符号，用来说明结构，先补齐实际内容。
- **错误演示**：故意展示类型错误或错误写法，阅读紧随其后的解释；不要复制到正常业务代码。
- 同一节的多个写法通常是替代方案。重复的变量名、类名和配置不要全部放进同一个文件。
- SQL 的 DROP、TRUNCATE、DELETE、UPDATE 会改动数据。在自己的练习库操作，并先确认 WHERE 条件。文中的 employees 等表属于示例数据集，查询结果数量不应当作固定结论。
- 代码里的注释使用英文，中文解释放在代码块前后。编号说明与同一代码块中的 “See note” 注释对应。

阅读顺序是“前提 → 示例 → 结果 → 注意事项”。开发时按目录定位问题，再检查所在小节的版本和上下文。

## 常见词快速解释

| 词 | 初学者可以怎样理解 |
| --- | --- |
| HTTP 请求 / 响应 | 浏览器向服务器提出请求，服务器返回状态、响应头和内容 |
| Servlet | Java Web 中接收 HTTP 请求的服务器端组件 |
| MVC | 接收请求、组织数据、显示页面的职责分工；并不等于三层架构 |
| IoC / DI | 对象由容器创建或管理，并把需要的依赖传入 |
| Bean | 由相应容器管理的对象；Spring Bean 与 Faces Bean 的管理方式可能不同 |
| DAO / Mapper | 把应用的数据访问操作转换为数据库操作 |
| DTO | 用于接口或层之间传递数据的对象 |
| 事务 | 让一组数据库操作作为一个整体成功或回滚 |
| 作用域 Scope | 对象在什么范围内复用、何时结束，例如请求、会话、视图 |
| Promise / await | 表达异步操作的结果，以及在异步函数中等待结果的语法 |
| 响应式 | 数据变化时，框架能更新依赖这些数据的界面 |
| BOM | 一组经过配套管理的依赖版本清单，不会自动引入所有依赖 |

## 查错时的顺序

1. 先记录实际报错、请求状态或 SQL，而不是只看截图。
2. 检查版本、导入包、文件位置与配置是否匹配。
3. 用最小输入复现，区分语法错误、类型错误、配置错误和业务错误。
4. 查所在版本的官方文档。历史截图中的菜单、路径和结果仅供对照。

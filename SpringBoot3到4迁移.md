# Spring Boot 3 到 4 迁移参考

学习目标：让原项目的可观察行为在升级前后保持一致，并识别依赖、JSON、测试和运行环境变化。

**适用范围：** 从当前 3.5.x 维护版本逐步迁移到目标 4.x 稳定版本。本文提供迁移顺序；仓库没有声称已经把所有旧教程自动迁移。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [升级前先准备证据](#section-1)
- [最小的迁移对照](#section-2)
- [实际执行顺序](#section-3)
- [重点回归清单](#section-4)
- [常见错误与速查](#section-5)
- [官方参考](#section-6)

<a id="section-1"></a>

## 升级前先准备证据

记录 JDK、Maven、Boot、数据库、容器和所有额外 starter 的版本。保存现有接口样例、错误响应、认证流程和关键测试结果。

先升级到所选 3.5.x 维护版本并处理弃用，再在独立分支升级 4.x。不要同时重写数据库模型、换认证方式、换 JDK 和拆服务，导致无法判断回归来自哪里。

<a id="section-2"></a>

## 最小的迁移对照

仓库旧 [SpringBoot.md](SpringBoot.md) 是 Boot 2.5 历史教程，不能跳过中间变化直接套用。新 [后端 POM](examples/taskboard/backend/pom.xml) 是独立的 Boot 4.1.2 完整示例。

| 检查项 | 需要做什么 |
| --- | --- |
| Java | Boot 4 最低 Java 17；目标 JDK 还要核对第三方库 |
| Servlet 容器 | 按目标 Boot 要求匹配 Servlet 6.1 与容器版本 |
| 模块与 starter | Boot 4 更细分模块，核对功能对应 starter |
| JSON | 检查 Jackson 3 的依赖、导入和自定义配置兼容性 |
| 测试 | 核对测试模块、注解包名和测试引擎 |
| 额外生态 | MyBatis、JoinFaces、Spring Cloud 等逐项检查兼容矩阵 |

本项目使用 spring-boot-starter-webmvc 与对应 webmvc-test；不要把示例中的新测试注解包名机械替换进 Boot 3 项目。

<a id="section-3"></a>

## 实际执行顺序

```powershell
mvn -B -ntp verify
mvn dependency:tree
```

在升级前后分别保留结果；先解决依赖冲突和编译错误，再处理启动与行为差异。

1. 确定目标版本并更新 parent 或 BOM。
2. 调整 starter、显式依赖与插件，避免混装不同主版本。
3. 修复弃用移除、包路径和配置属性变化。
4. 检查数据源、迁移、认证、JSON 与异常响应。
5. 执行单元、集成和浏览器测试。
6. 在与上线相同的容器镜像与数据库上演练。
7. 验证旧制品能否在迁移后的结构上回滚运行。

<a id="section-4"></a>

## 重点回归清单

日期时间、枚举、空字段、未知 JSON 字段、大整数、分页格式、错误状态和 Content-Type 都应有真实请求验证。

同时检查过滤器顺序、CSRF、登录跳转、Cookie 属性、资源路径和代理转发。启动日志没有错误不代表这些行为与原项目相同。

框架管理的依赖通常由 BOM 配套；不能为了消除一次编译错误随意覆盖 Jackson、Security 或 Spring 的单个版本。

<a id="section-5"></a>

## 常见错误与速查

| 现象 | 可能原因 |
| --- | --- |
| 编译通过，运行 NoSuchMethodError | 运行时出现不兼容依赖组合 |
| 测试注解找不到 | 测试 starter 或包路径变化 |
| JSON 输出变化 | 序列化版本、模块或配置差异 |
| 容器部署失败 | Servlet 与容器版本不匹配 |
| 仅本机成功 | CI JDK、镜像或配置与本机不同 |

迁移记录应包含验证方式和回滚条件；旧版本文档保留清晰标记，新文档使用独立版本路线，不能把不同版本的片段拼成同一项目。

<a id="section-6"></a>

## 官方参考

- [Boot 4 官方迁移指南](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide)
- [目标版本系统要求](https://docs.spring.io/spring-boot/system-requirements.html)

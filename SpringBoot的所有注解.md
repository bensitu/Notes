# Spring Boot 与 Java Web 常用注解速查

按用途查常用注解，理解使用条件、作用与常见误区。

**学习前提与版本：** 这是一份常用注解速查，并非全部注解清单。以 Spring Boot 3 / Spring 6 / Jakarta 为主要范围；JPA、Jackson 和 Lombok 分属不同库，需要各自依赖。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[文档目录](README.md) · [官方参考](https://docs.spring.io/spring-framework/reference/)

**内容导航**

- [如何阅读这份速查表](#section-1)
- [Spring 容器与依赖注入](#section-2)
- [Spring MVC 请求与响应](#section-3)
- [校验、事务与异常](#section-4)
- [JPA：实体与关联](#section-5)
- [Jackson：JSON 映射](#section-6)
- [Lombok：生成常见代码](#section-7)
- [JPA 生命周期回调](#section-8)


<a id="section-1"></a>

## 如何阅读这份速查表

注解是在代码上添加的信息。只有编译器、框架或工具识别它时，才会产生相应作用。这份文档列出常用注解，不是“Spring Boot 的全部注解”。

Spring Boot 2 / Spring 5 的 Java EE API 通常使用 javax 包；Spring Boot 3、4 的对应 API 使用 jakarta 包。不是所有 javax 包都改名，例如 JDBC 的 javax.sql.DataSource 仍然使用 javax。先确认项目依赖版本，再查看 import。

<a id="section-2"></a>

## Spring 容器与依赖注入

| 注解 | 放在哪里 | 作用与注意事项 |
| --- | --- | --- |
| @SpringBootApplication | 启动类 | 组合启动配置、自动配置和组件扫描；默认扫描所在包及子包 |
| @Configuration | 配置类 | 声明配置，可以在方法上使用 @Bean |
| @Bean | 配置方法 | 把返回的对象交给 Spring 管理；默认名字为方法名 |
| @Component | 类 | 注册普通组件 |
| @Service | 类 | 标识业务服务，属于组件注解 |
| @Repository | 类 | 标识持久层组件，可配合异常翻译机制使用；不是加上就自动实现 SQL |
| @ComponentScan | 配置类 | 指定组件扫描范围 |
| @Import | 配置类 | 导入配置类或其他可注册组件 |
| @ImportResource | 配置类 | 加载 XML 配置 |
| @EnableAutoConfiguration | 配置类 | 根据依赖和已有 Bean 尝试配置功能，通常通过启动注解间接使用 |
| @Autowired | 构造器、字段或方法 | 按类型匹配依赖；可配合 @Qualifier、@Primary 处理多个候选 |
| @Qualifier | 注入位置等 | 筛选同类型候选；名称只是其中一种筛选方式 |
| @Primary | Bean 定义 | 多个候选中优先选择该 Bean |
| @Value | 字段或参数等 | 读取单个配置值，例如 `${server.port}` |
| @ConfigurationProperties | 配置类或 Bean 方法 | 按前缀绑定一组配置，比很多零散 @Value 更易维护 |
| @Scope | Bean 定义 | 设置 singleton、prototype、request、session 等作用域 |

只有一个构造器时，Spring 可以自动使用它，不必添加 @Autowired。构造器注入让必需依赖更清楚，也更便于测试。

```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

这是结构片段，还需要定义 UserRepository 并把它注册成 Bean。

@Resource 属于 Java EE / Jakarta 注解，常按名称查找，再按规则回退到类型匹配。@Inject 也用于依赖注入，但没有 @Autowired 的 required 属性，不能认为两者在所有细节上完全相同。

<a id="section-3"></a>

## Spring MVC 请求与响应

| 注解 | 作用 | 例子或限制 |
| --- | --- | --- |
| @Controller | 声明控制器 | 可以返回视图名，也可以配合 @ResponseBody 返回数据 |
| @RestController | @Controller + @ResponseBody | 返回 HTTP 响应体；不保证接口设计本身就符合 REST |
| @RequestMapping | 匹配请求 | path/value、method、params、headers、consumes、produces 等条件 |
| @GetMapping / @PostMapping / @PutMapping / @DeleteMapping / @PatchMapping | 限定 HTTP 方法 | 用在控制器方法上 |
| @PathVariable | 读取路径变量 | /users/{id} 中的 id |
| @RequestParam | 读取查询参数或表单字段 | ?page=1；默认 required=true |
| @RequestHeader | 读取请求头 | Accept、Authorization 等 |
| @CookieValue | 读取 Cookie | 注意缺失时的处理 |
| @RequestBody | 按消息转换器读取请求体 | 常用于 JSON，也可读取文本等格式；不是 JSON 专用 |
| @ResponseBody | 把返回值写入响应体 | 不含 pattern 属性，具体格式由消息转换器决定 |
| @DateTimeFormat | 转换查询参数、表单等日期字段 | pattern="yyyy-MM-dd"；不直接控制 JSON 日期格式 |
| @JsonFormat | Jackson 日期等序列化格式 | 与 @DateTimeFormat 的用途不同 |

```java
@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping("/{id}")
    public Map<String, Long> find(@PathVariable("id") Long id) {
        return Collections.singletonMap("id", id);
    }
}
```

导入 Spring MVC 注解、java.util.Map 和 java.util.Collections。项目需要 MVC 和 JSON 消息转换依赖；Spring Boot 的 Web starter 通常已提供。

<a id="section-4"></a>

## 校验、事务与异常

| 注解 | 作用 | 注意事项 |
| --- | --- | --- |
| @Valid | 触发 Bean Validation | 需要校验实现；常配合 @RequestBody |
| @Validated | Spring 校验入口、校验分组等 | 与 @Valid 有交集，但不完全相同 |
| @NotNull / @NotBlank / @Size | 声明校验约束 | 分别用于非 null、非空白字符串、长度或集合大小等 |
| @Transactional | 声明事务 | 默认代理模式下，类内部直接调用自己的事务方法不会经过代理 |
| @ControllerAdvice | 集中处理控制器相关逻辑 | 可用于异常、数据绑定等 |
| @RestControllerAdvice | @ControllerAdvice + @ResponseBody | 常用于 API 异常响应 |
| @ExceptionHandler | 声明异常处理方法 | 通常配合 Advice 或放在控制器内部 |

@Transactional 默认对 RuntimeException 和 Error 回滚，受检异常默认不回滚。需要受检异常也回滚时，设置 rollbackFor=Exception.class。readOnly 是只读提示，其执行方式取决于事务管理器与数据库，不能当作通用权限控制。timeout 的单位是秒，不是毫秒。

异常响应需要同时考虑响应体和 HTTP 状态码，不能只返回错误 JSON 却默认始终使用 200。

<a id="section-5"></a>

## JPA：实体与关联

以下是 Jakarta Persistence / JPA 的注解，不是 MyBatis 注解。不要在纯 MyBatis 项目中期待 @Entity 自动创建数据库映射。

| 注解 | 含义 |
| --- | --- |
| @Entity | 声明持久化实体，通常需要主键和可访问的无参构造器 |
| @Table | 指定表名、索引等；命名策略也可能改变实际表名 |
| @Id | 标识主键 |
| @GeneratedValue | 指定主键生成策略 |
| @SequenceGenerator | 定义序列生成器；数据库必须支持所选方式 |
| @MappedSuperclass | 父类的映射属性由子实体继承；父类不是单独的实体表 |
| @Column | 指定列名、nullable、length、precision、scale、insertable、updatable 等 |
| @Transient | 不持久化该属性，不等于不参与 JSON 序列化 |
| @Basic | 基本属性映射；LAZY 是提示，可能需要提供者增强支持 |
| @OneToOne / @OneToMany / @ManyToOne / @ManyToMany | 定义实体关联 |
| @JoinColumn | 定义关联使用的连接列，位置取决于关联类型与所有权 |
| @NoRepositoryBean | Spring Data 排除基础仓库接口实例化，不是 JPA 注解 |

传统 JPA 主键策略为 AUTO、IDENTITY、SEQUENCE、TABLE；JPA 3.1 增加 UUID。native 不是 GenerationType 枚举成员。MySQL 常用 IDENTITY；不要直接复制其他数据库的 SEQUENCE 配置。

@Column(nullable=false) 主要描述映射与建表约束，不代替请求参数校验。precision/scale 用于精确小数列，金额通常使用 BigDecimal；不要把它们当成 double 的浮点精度控制。

<a id="section-6"></a>

## Jackson：JSON 映射

- @JsonIgnore：通常忽略属性的序列化与反序列化，具体取决于属性上的组合配置。
- @JsonManagedReference / @JsonBackReference：处理双向父子引用。BackReference 一侧不会正常输出成递归子对象。
- 避免直接返回带复杂关联的 JPA 实体，使用明确的响应 DTO 更易控制字段和查询次数。

<a id="section-7"></a>

## Lombok：生成常见代码

| 注解或类型 | 作用与边界 |
| --- | --- |
| @Getter / @Setter | 生成访问方法，适用于字段或类；final 字段不会生成普通 setter |
| @Data | 组合访问方法、equals/hashCode、toString 和必需参数构造器等；不是无条件给所有字段生成 setter |
| @NoArgsConstructor | 生成无参构造器 |
| @RequiredArgsConstructor | 为未初始化 final 字段及符合条件的 @NonNull 字段生成构造器 |
| @AllArgsConstructor | 为实例字段生成全参构造器 |
| @EqualsAndHashCode | 生成相等性方法，默认不包含 static 和 transient 字段 |
| @ToString | 生成 toString；注意排除密码和可能递归的关联 |
| @Log4j2 | 生成 Log4j 2 日志对象，需要匹配的日志依赖 |
| @NonNull | 在 Lombok 支持的生成代码中增加参数检查，不是全局非空保证 |
| val | 局部变量的类型推断，生成 final 局部变量；不能作为字段注解使用 |

Lombok 需要编译期注解处理支持。构造器注解可组合使用，但生成相同签名会冲突；手写构造器也要检查签名是否重复。

<a id="section-8"></a>

## JPA 生命周期回调

| 回调 | 时机 |
| --- | --- |
| @PostLoad | 实体被加载或刷新后 |
| @PrePersist / @PostPersist | 持久化前 / 插入操作后 |
| @PreUpdate / @PostUpdate | 数据库更新操作前后 |
| @PreRemove / @PostRemove | 删除前后 |

SQL 可能在 flush 时执行，不一定等到 commit。PostPersist、PostUpdate、PostRemove 也不表示事务已经成功提交。getReference 返回代理时，不一定立即加载实体或触发 PostLoad。

参考：[Spring 注解](https://docs.spring.io/spring-framework/reference/)、[Jakarta Persistence](https://jakarta.ee/specifications/persistence/)、[Lombok 功能](https://projectlombok.org/features/)。

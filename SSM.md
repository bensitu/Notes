# SSM：Spring、Spring MVC 与 MyBatis 整合

用一个完整项目连接 Spring、Spring MVC 与 MyBatis，再查 IoC、AOP 和事务。

**学习前提与版本：** 需要 Java、Maven、SQL 和 HTTP 基础。完整示例固定 Java 17、Spring 6.2、MyBatis-Spring 3.0、Tomcat 10.1，使用 jakarta.servlet。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://mybatis.org/spring/)

**内容导航**

- [先理解三个框架各自做什么](#section-1)
- [学习顺序与版本对应](#section-2)
- [IoC 与依赖注入](#section-3)
- [Bean 的作用域与生命周期](#section-4)
- [一个可复现的整合项目](#section-5)
- [AOP：集中实现重复的横切行为](#section-6)
- [事务属性与边界](#section-7)
- [JdbcTemplate、XML 与扩展专题](#section-8)


<a id="section-1"></a>

## 先理解三个框架各自做什么

SSM 是三个框架的组合，不是独立的新框架。

| 框架 | 主要职责 |
| --- | --- |
| Spring | 创建和组织对象，提供依赖注入、AOP、事务管理等 |
| Spring MVC | 接收 HTTP 请求，绑定参数，调用控制器并输出响应 |
| MyBatis | 执行 SQL，把数据库结果映射成 Java 对象 |

请求通常经过 Controller -> Service -> Mapper -> Database，再沿相反方向返回。Model 是业务数据与模型，不是 Mapper；Java 属性通常对应列，对象通常对应一行。

<a id="section-2"></a>

## 学习顺序与版本对应

先学习 [MVC 分层](MVC结构.md)、[JDBC](JDBC基础.md) 和 [MyBatis](MyBatis的使用.md)，再阅读整合示例。

| 场景 | Java | Spring | MyBatis-Spring | Servlet 容器 |
| --- | --- | --- | --- | --- |
| 本文复现示例 | 17+ | 6.2.x | 3.0.x | Tomcat 10.1，jakarta.servlet |
| 旧项目维护 | 8+ | 5.x | 2.1.x | Tomcat 9，javax.servlet |
| Spring 7 项目 | 17+ | 7.x | 4.x | 按 Servlet / Jakarta 版本重新匹配 |

本仓库 SpringMVC_1、SpringMVC_2 中有 Spring 5 的历史示例，不能直接把 javax imports、旧版文件上传解析器等复制到本节。以下固定依赖版本用于复现实验，不表示这些是当前最新版本。正式项目先确认维护状态和补丁版本，再统一管理依赖。

<a id="section-3"></a>

## IoC 与依赖注入

IoC（控制反转）表示对象的创建与协作交给容器组织。DI（依赖注入）是常见实现方式：容器把一个对象需要的另一个对象交给它。

```java
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

这是构造器注入的结构片段，UserRepository 需要另行定义。它比在方法中随意 new Repository 更容易替换实现和测试。

Spring 可以通过 XML、@Component 或 @Bean 注册对象，不必把三种方式叠加到同一个对象上。

| 注解 | 用途 |
| --- | --- |
| @Component | 普通组件 |
| @Service | 业务组件 |
| @Repository | 持久化组件，可能参与异常翻译 |
| @Controller | MVC 控制器 |
| @Configuration / @Bean | 配置类及工厂方法 |
| @Autowired | 按规则注入依赖，required=false 表示可选 |
| @Qualifier / @Primary | 多个同类型候选时决定选择 |

这些注解不能认为只是给开发者看的名字：Controller 参与 MVC 识别，Repository 可以参与异常翻译。BeanFactory 可以供应用使用；ApplicationContext 在其基础上提供事件、资源、国际化等功能，通常更方便。

<a id="section-4"></a>

## Bean 的作用域与生命周期

| 作用域 | 含义 |
| --- | --- |
| singleton | 同一个容器中，一个 Bean 定义通常对应一个实例，默认作用域 |
| prototype | 每次获取创建实例；容器通常不管理其销毁过程 |
| request | 每次 HTTP 请求一个实例，需要 Web 环境 |
| session | 每个 HTTP 会话一个实例 |
| application | ServletContext 范围，与普通容器 singleton 不完全相同 |

singleton 不表示线程安全。默认通常在容器初始化时创建，但 lazy Bean 等存在例外。Bean 的创建也不一定经过无参构造器，可以使用构造器注入或工厂方法。

常见生命周期：创建对象 -> 注入属性 -> 初始化回调 -> 使用 -> 容器关闭时销毁单例。BeanPostProcessor 可在初始化前后扩展行为；并非所有对象都经历完全相同的处理步骤。

FactoryBean 是创建另一种对象的工厂：getBean("name") 通常得到 getObject 的结果，getBean("&name") 得到工厂本身。SqlSessionFactoryBean 就是这种机制的应用。

<a id="section-5"></a>

## 一个可复现的整合项目

本节使用 Maven WAR、外部 Tomcat 和 JSON 响应，不使用 Spring Boot。数据库为 MySQL 8.x，表使用 InnoDB。

```text
ssm-notes/
  pom.xml
  src/main/java/example/
    config/SpringConfig.java
    config/WebConfig.java
    config/WebInitializer.java
    domain/Book.java
    mapper/BookMapper.java
    service/BookService.java
    controller/BookController.java
  src/main/resources/jdbc.properties
```

### 1. Maven 依赖

文件：pom.xml。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>example</groupId>
    <artifactId>ssm-notes</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>
    <properties>
        <maven.compiler.release>17</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <spring.version>6.2.11</spring.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.19</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>3.0.4</version>
        </dependency>
        <dependency>
            <groupId>com.zaxxer</groupId>
            <artifactId>HikariCP</artifactId>
            <version>5.1.0</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.4.0</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.18.4</version>
        </dependency>
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>6.0.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
    <build>
        <finalName>ssm-notes</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.4.0</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

provided 表示 Servlet API 由 Tomcat 提供，不把另一份 API 打进 WAR。JSON 转换使用 Jackson。示例只配置最小依赖，日志可另外添加与 SLF4J 版本匹配的实现。

### 2. 数据库与连接配置

```sql
CREATE TABLE book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

文件：jdbc.properties。study 数据库与具有访问权限的账户需要先准备。以下占位值必须替换成本地练习配置。

```properties
jdbc.url=jdbc:mysql://localhost:3306/study?characterEncoding=UTF-8
jdbc.username=study_user
jdbc.password=replace-with-your-local-password
```

### 3. 根容器：业务、数据源、MyBatis、事务

文件：SpringConfig.java。

```java
package example.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@ComponentScan("example.service")
@MapperScan("example.mapper")
@PropertySource("classpath:jdbc.properties")
@EnableTransactionManagement
public class SpringConfig {
    @Bean
    public static PropertySourcesPlaceholderConfigurer placeholders() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean(destroyMethod = "close")
    public HikariDataSource dataSource(
            @Value("${jdbc.url}") String url,
            @Value("${jdbc.username}") String username,
            @Value("${jdbc.password}") String password) {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setMaximumPoolSize(5);
        return dataSource;
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factory = new SqlSessionFactoryBean();
        factory.setDataSource(dataSource);
        return factory.getObject();
    }

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
```

MyBatis 与事务管理器必须使用同一个 DataSource。示例用注解 SQL，不需要 Mapper XML；改用 XML 时，要配置 mapperLocations 并保持 namespace 与接口全限定名一致。

### 4. MVC 子容器与 Servlet 初始化

文件：WebConfig.java。

```java
package example.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
@ComponentScan("example.controller")
public class WebConfig implements WebMvcConfigurer {
}
```

文件：WebInitializer.java。

```java
package example.config;

import jakarta.servlet.Filter;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class WebInitializer
        extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { SpringConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { WebConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }

    @Override
    protected Filter[] getServletFilters() {
        return new Filter[] { new CharacterEncodingFilter("UTF-8", true) };
    }
}
```

Servlet 3+ 容器可以发现这个初始化类，不需要再重复注册相同 DispatcherServlet 的 web.xml。MVC 子容器可访问根容器的 Service；根容器不应依赖子容器的 Controller。

### 5. 实体与 Mapper

文件：Book.java。

```java
package example.domain;

public class Book {
    private Long id;
    private String title;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
```

文件：BookMapper.java。

```java
package example.mapper;

import example.domain.Book;
import org.apache.ibatis.annotations.*;

public interface BookMapper {
    @Select("SELECT id, title FROM book WHERE id = #{id}")
    Book findById(@Param("id") long id);

    @Insert("INSERT INTO book (title) VALUES (#{title})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Book book);
}
```

`#{}` 绑定数据值，避免把标题当 SQL 拼接。主键由数据库生成并写回 Book.id，insert 的返回值仍是受影响行数。

### 6. 业务与控制器

文件：BookService.java。

```java
package example.service;

import example.domain.Book;
import example.mapper.BookMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {
    private final BookMapper mapper;

    public BookService(BookMapper mapper) {
        this.mapper = mapper;
    }

    public Book findById(long id) {
        return mapper.findById(id);
    }

    @Transactional
    public Book create(String title) {
        if (title == null || title.isBlank() || title.length() > 100) {
            throw new IllegalArgumentException("Title must contain 1 to 100 characters");
        }
        Book book = new Book();
        book.setTitle(title);
        if (mapper.insert(book) != 1) {
            throw new IllegalStateException("Book was not inserted");
        }
        return book;
    }
}
```

文件：BookController.java。

```java
package example.controller;

import java.net.URI;
import java.util.Map;
import example.domain.Book;
import example.service.BookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    public record CreateBookRequest(String title) {}

    @GetMapping("/{id}")
    public ResponseEntity<Book> find(@PathVariable("id") long id) {
        Book book = service.findById(id);
        return book == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(book);
    }

    @PostMapping
    public ResponseEntity<Book> create(@RequestBody CreateBookRequest request) {
        Book book = service.create(request.title());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(book.getId()).toUri();
        return ResponseEntity.created(location).body(book);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> invalidInput(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}
```

查询不存在返回 404；创建成功返回 201 和 Location；标题校验失败返回 400。示例展示两种操作，完整 CRUD 可按同样分层继续扩展。数据库异常不要直接把详细 SQL 或密码返回给客户端。

### 7. 构建与验证

1. 从项目根目录运行 mvn clean package。
2. 把 target/ssm-notes.war 部署到 Tomcat 10.1。
3. 启动时检查数据源、Servlet 和 Mapper 是否成功初始化。
4. 使用 HTTP 客户端发送 POST /ssm-notes/books，Content-Type 为 application/json，正文为 {"title":"Java 入门"}。
5. 预期收到 201、带编号的 JSON 和 Location；按该路径 GET，预期收到 200。
6. 发送空白标题预期 400，查询不存在编号预期 404。

地址前缀取决于 WAR 的上下文路径；这里不是直接访问 /books。启动失败时先看最早出现的异常原因，不要只修改最后一条错误。

<a id="section-6"></a>

## AOP：集中实现重复的横切行为

日志、计时等可能横跨多个业务方法。Spring AOP 通过代理在方法调用周围增加行为。它主要支持方法执行连接点，不是“方法中任意一行代码都可以拦截”。

- JDK 代理通常针对接口。
- 类代理通过继承目标类实现，final 类或方法存在限制。
- AspectJ 织入修改字节码，是另一种实现，不应简单当作同一种 Spring 代理。

| 通知 | 注解 | 时机 |
| --- | --- | --- |
| 前置 | @Before | 目标方法执行前 |
| 返回 | @AfterReturning | 正常返回后 |
| 异常 | @AfterThrowing | 抛出匹配异常后 |
| 最终 | @After | 方法结束后，类似 finally |
| 环绕 | @Around | 可以包围调用，必须明确是否调用 proceed |

下面是配置外的扩展示例，需要添加 aspectjweaver 依赖，并在根配置上开启 @EnableAspectJAutoProxy。

```java
@Aspect
@Component
public class TimingAspect {
    @Around("execution(* example.service..*(..))")
    public Object measure(ProceedingJoinPoint point) throws Throwable {
        long started = System.nanoTime();
        try {
            return point.proceed();
        } finally {
            System.out.println(point.getSignature() + ": " +
                (System.nanoTime() - started) + " ns");
        }
    }
}
```

导入 org.aspectj.lang.ProceedingJoinPoint、org.aspectj.lang.annotation.Aspect、Around 和 Spring Component。该类放在被根容器扫描的包中，例如 example.service。

表达式中第一个 * 是任意返回类型，example.service.. 表示该包及子包，(..) 是任意参数。权限修饰符可省略；指定 int 返回类型不要求同时写 public。

多个切面的 @Order 数值越小优先级越高，进入时先执行、退出时后执行。同一切面不同通知的顺序还受框架版本和声明方式影响，不要让业务依赖未明确保证的顺序。

<a id="section-7"></a>

## 事务属性与边界

| 属性 | 含义 |
| --- | --- |
| propagation=REQUIRED | 默认；有事务就加入，没有则创建 |
| propagation=REQUIRES_NEW | 暂停外层事务，创建独立事务，通常需要额外连接 |
| isolation | 隔离级别；是否生效取决于是否创建新事务及数据库支持 |
| readOnly | 只读提示，不是通用写入权限检查 |
| timeout | 超时秒数；依赖事务管理器和资源检查，不是任意 Java 代码的强制中断 |
| rollbackFor | 指定需要回滚的异常类 |
| noRollbackFor | 指定不回滚的异常类 |
| rollbackForClassName / noRollbackForClassName | 根据异常名称匹配规则，通常优先使用类形式 |

```java
@Transactional(timeout = 5, rollbackFor = Exception.class)
public void buyBook(Long bookId, Long userId) throws Exception {
    bookDao.updateStock(bookId);
    bookDao.updateBalance(userId, bookId);
}
```

这是事务属性片段，bookDao 与业务规则需要另行实现。超时示例使用 timeout=5，不能用 readOnly=true 替代。

默认对 RuntimeException 和 Error 回滚，受检异常默认不回滚。“受检异常”不等于编译错误；代码编译失败根本不会进入事务。

默认代理模式下，Service 直接调用自己的另一个方法会绕过代理；仅添加 @Transactional 不保证这种内部调用创建新事务。不要捕获错误后静默返回成功，也不要在事务中手动提交由 Spring 管理的连接。

| SQL 标准隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| READ UNCOMMITTED | 允许 | 允许 | 允许 |
| READ COMMITTED | 防止 | 允许 | 允许 |
| REPEATABLE READ | 防止 | 防止 | 标准允许 |
| SERIALIZABLE | 防止 | 防止 | 防止 |

表格是标准允许的现象，不等于每种数据库的实现都一样。InnoDB 的普通可重复读查询使用快照，其他事务仍可更新数据；锁定读取和普通快照读取的行为也不同。

<a id="section-8"></a>

## JdbcTemplate、XML 与扩展专题

JdbcTemplate 封装 JDBC 资源管理和异常转换。它需要配置同一个 DataSource；业务事务仍放在 Service。

```java
JdbcTemplate template = new JdbcTemplate(dataSource);
Integer count = template.queryForObject("SELECT COUNT(*) FROM book", Integer.class);
```

导入 org.springframework.jdbc.core.JdbcTemplate，dataSource 是已配置对象。queryForObject 对零行或多行结果有异常语义，不要与 MyBatis 的单对象查询混淆。

旧项目使用 XML 时，constructor-arg 用于构造器参数，property/ref 用于对象依赖；value 是字面量，不是对象引用。集合使用 list、set、map；typeAliases、resultMap 等是 MyBatis 配置，不应放进 Spring beans 配置。

| 需要查阅的内容 | 专题 |
| --- | --- |
| 参数绑定、动态 SQL、关联映射、缓存、逆向工程、分页插件 | [MyBatis 的使用](MyBatis的使用.md) |
| 请求参数、JSON、REST、静态资源 | [SpringMVC_1](SpringMVC_1.md)（Spring 5 历史示例） |
| 结果封装、异常处理、拦截器与页面联调 | [SpringMVC_2](SpringMVC_2.md)（Spring 5 历史示例） |
| 自动配置、多环境和测试 | [SpringBoot](SpringBoot.md) |
| 注解名称和作用 | [常用注解速查](SpringBoot的所有注解.md) |

Spring 6 项目文件上传使用 Servlet multipart 支持与 StandardServletMultipartResolver，并配置 multipart；旧 CommonsMultipartResolver 已移除。上传目录、文件大小和文件名都需要明确约定，不能把旧项目配置原样搬过来。

参考：[Spring 文档](https://docs.spring.io/spring-framework/reference/)、[MyBatis-Spring 版本要求](https://mybatis.org/spring/)、[MyBatis-Spring 事务](https://mybatis.org/spring/transactions.html)、[Tomcat 10.1](https://tomcat.apache.org/tomcat-10.1-doc/)。

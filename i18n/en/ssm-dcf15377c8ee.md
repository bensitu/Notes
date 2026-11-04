# SSM: integrating Spring, Spring MVC, and MyBatis :id=h-a17aca482531

Connect Spring, Spring MVC, and MyBatis in a complete project, then look up IoC, AOP, and transaction concepts.

**Prerequisites and versions:** Basic knowledge of Java, Maven, SQL, and HTTP is required. The complete example fixes Java 17, Spring 6.2, MyBatis-Spring 3.0, and Tomcat 10.1, using jakarta.servlet.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://mybatis.org/spring/)

**Contents**

- [First understand each framework's role](#section-1)
- [Learning order and version compatibility](#section-2)
- [IoC and dependency injection](#section-3)
- [Bean scopes and lifecycle](#section-4)
- [A reproducible integration project](#section-5)
- [AOP: centralizing repeated cross-cutting behavior](#section-6)
- [transaction attributes and boundaries](#section-7)
- [JdbcTemplate, XML, and further topics](#section-8)

<a id="section-1"></a>

## First understand each framework's role :id=h-88956c3b0b70

SSM combines three frameworks; it is not a new standalone framework.

| Framework  | Main responsibilities                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Spring     | Creates and organizes objects; provides dependency injection, AOP, transaction management, and more |
| Spring MVC | Receives HTTP requests, binds parameters, invokes controllers, and produces responses               |
| MyBatis    | Executes SQL and maps database results to Java objects                                              |

Requests usually pass through Controller -> Service -> Mapper -> Database, then return in reverse order. Model means business data and models, not Mapper. A Java property usually corresponds to a column, and an object to a row.

<a id="section-2"></a>

## Learning order and version compatibility :id=h-cc1a3799048d

Study [MVC layering](MVC结构.md), [JDBC](JDBC基础.md), and [MyBatis](MyBatis的使用.md) before reading the integration example.

| Scenario                              | Java | Spring | MyBatis-Spring | Servlet container                                      |
| ------------------------------------- | ---- | ------ | -------------- | ------------------------------------------------------ |
| Reproducible example in this document | 17+  | 6.2.x  | 3.0.x          | Tomcat 10.1，jakarta.servlet                            |
| Maintaining older projects            | 8+   | 5.x    | 2.1.x          | Tomcat 9，javax.servlet                                 |
| Spring 7 project                      | 17+  | 7.x    | 4.x            | Match again according to the Servlet / Jakarta version |

This repository's SpringMVC_1 and SpringMVC_2 contain historical Spring 5 examples. Do not directly copy javax imports or older file-upload resolvers into this section. The fixed versions below make the exercise reproducible and do not claim to be current releases. For production projects, check maintenance status and patch versions, then manage dependencies consistently.

<a id="section-3"></a>

## IoC and dependency injection :id=h-9bb1f6ef39c3

IoC (inversion of control) means letting the container organize object creation and collaboration. DI (dependency injection) is a common implementation: the container gives an object another object it needs.

```java
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

This constructor-injection snippet requires a separate definition of UserRepository. It makes replacing implementations and testing easier than casually constructing a Repository with new inside methods.

Spring can register objects through XML, @Component, or @Bean. Do not apply all three to the same object.

| Annotation             | Usage                                                                       |
| ---------------------- | --------------------------------------------------------------------------- |
| @Component             | General component                                                           |
| @Service               | Business component                                                          |
| @Repository            | Persistence component; may participate in exception translation             |
| @Controller            | MVC controller                                                              |
| @Configuration / @Bean | Configuration classes and factory methods                                   |
| @Autowired             | Injects dependencies according to rules; required=false makes them optional |
| @Qualifier / @Primary  | Determines the choice among multiple candidates of the same type            |

These annotations are not merely names for developers: Controller participates in MVC detection, while Repository can participate in exception translation. Applications can use BeanFactory; ApplicationContext adds events, resources, internationalization, and other features, and is usually more convenient.

<a id="section-4"></a>

## Bean scopes and lifecycle :id=h-165d2b53a6f2

| Scope       | Meaning                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------ |
| singleton   | Normally one instance per Bean definition in the same container; the default scope         |
| prototype   | Creates an instance on every retrieval; the container normally does not manage destruction |
| request     | One instance per HTTP request; requires a web environment                                  |
| session     | One instance per HTTP session                                                              |
| application | ServletContext scope; not identical to an ordinary container singleton                     |

singleton does not mean thread-safe. By default, instances are normally created during container initialization, with exceptions such as lazy beans. Bean creation need not use a no-argument constructor; constructor injection and factory methods are also possible.

Typical lifecycle: create object -> inject properties -> initialization callbacks -> use -> destroy singletons when the container closes. BeanPostProcessor can extend behavior before and after initialization; not every object follows exactly the same processing steps.

FactoryBean is a factory for another kind of object: getBean("name") normally returns the result of getObject, while getBean("\&name") returns the factory itself. SqlSessionFactoryBean uses this mechanism.

<a id="section-5"></a>

## A reproducible integration project :id=h-96d1863cf522

This section uses a Maven WAR, external Tomcat, and JSON responses, without Spring Boot. The database is MySQL 8.x and tables use InnoDB.

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

### 1. Maven dependencies :id=h-703906f5015e

File: pom.xml.

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

provided means Tomcat supplies the Servlet API, so another copy of the API is not packaged in the WAR. Jackson handles JSON conversion. This example configures only minimal dependencies; add a logging implementation matching the SLF4J version separately if needed.

### 2. Database and connection configuration :id=h-9dd4cc6d38ae

```sql
CREATE TABLE book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

File: jdbc.properties. Prepare the study database and an account with access first. Replace the following placeholders with your local practice configuration.

```properties
jdbc.url=jdbc:mysql://localhost:3306/study?characterEncoding=UTF-8
jdbc.username=study_user
jdbc.password=replace-with-your-local-password
```

### 3. Root container: business logic, data source, MyBatis, and transactions :id=h-87f56b848609

File: SpringConfig.java.

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

MyBatis and the transaction manager must use the same DataSource. This example uses annotated SQL, so Mapper XML is not needed. When switching to XML, configure mapperLocations and keep namespace identical to the interface's fully qualified name.

### 4. MVC child container and Servlet initialization :id=h-a065fb6ff262

File: WebConfig.java.

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

File: WebInitializer.java.

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

Servlet 3+ containers can discover this initializer. Do not register the same DispatcherServlet again in web.xml. The MVC child container can access root-container services; the root container should not depend on child-container controllers.

### 5. Entity and mapper :id=h-39de76c86126

File: Book.java.

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

File: BookMapper.java.

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

`#{}` binds data values, avoiding concatenating a title into SQL. The database generates the primary key and writes it back to Book.id; insert still returns the affected-row count.

### 6. Business logic and controller :id=h-608f77db4e63

File: BookService.java.

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

File: BookController.java.

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

A missing record returns 404; successful creation returns 201 and Location; failed title validation returns 400. This example demonstrates two operations; extend the same layers for full CRUD. Do not return detailed SQL or passwords to clients when a database exception occurs.

### 7. Build and verify :id=h-ff3977d7cd48

1. Run mvn clean package from the project root.
2. Deploy target/ssm-notes.war to Tomcat 10.1.
3. At startup, check that the data source, Servlet, and Mapper initialize successfully.
4. Use an HTTP client to send POST /ssm-notes/books, with Content-Type application/json and body {"title":"Java Basics"}.
5. Expect 201, JSON containing an ID, and Location. Send GET to that path and expect 200.
6. A blank title should return 400; querying a nonexistent ID should return 404.

The address prefix depends on the WAR context path; here, do not access /books directly. If startup fails, first inspect the earliest exception cause rather than only changing the last error.

<a id="section-6"></a>

## AOP: centralizing repeated cross-cutting behavior :id=h-3f44ee844fe6

Logging and timing may span many business methods. Spring AOP uses proxies to add behavior around method calls. It mainly supports method-execution join points, not interception of any arbitrary line inside a method.

- JDK proxies normally target interfaces.
- Class-based proxies extend the target class, so final classes and methods have limitations.
- AspectJ weaving modifies bytecode. It is a different implementation and should not be treated as the same kind of Spring proxy.

| Advice          | Annotation      | Timing                                                           |
| --------------- | --------------- | ---------------------------------------------------------------- |
| Before          | @Before         | Before the target method executes                                |
| After returning | @AfterReturning | After normal return                                              |
| Exception       | @AfterThrowing  | After a matching exception is thrown                             |
| After (finally) | @After          | After the method finishes, similar to finally                    |
| Around          | @Around         | Can surround the call; explicitly decide whether to call proceed |

The following extension is not part of the configuration above. Add the aspectjweaver dependency and enable @EnableAspectJAutoProxy on the root configuration.

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

Import org.aspectj.lang.ProceedingJoinPoint, org.aspectj.lang.annotation.Aspect, Around, and Spring Component. Place the class in a package scanned by the root container, such as example.service.

In the expression, the first \* means any return type, example.service.. means that package and its subpackages, and (..) means any parameters. The access modifier may be omitted; specifying an int return type does not require public as well.

For multiple aspects, a lower @Order value has higher priority: it runs earlier on entry and later on exit. Ordering of different advice in the same aspect also depends on framework version and declaration style. Do not make business logic depend on ordering without an explicit guarantee.

<a id="section-7"></a>

## transaction attributes and boundaries :id=h-6fecf52f4280

| Attribute                                     | Meaning                                                                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| propagation=REQUIRED                          | Default: joins an existing transaction, or creates one if none exists                                                                 |
| propagation=REQUIRES_NEW                      | Suspends the outer transaction and creates an independent transaction; normally requires an extra connection                          |
| isolation                                     | Isolation level; effectiveness depends on creating a new transaction and database support                                             |
| readOnly                                      | Read-only hint, not a general write-permission check                                                                                  |
| timeout                                       | Timeout in seconds; depends on checks by the transaction manager and resources, rather than forcibly interrupting arbitrary Java code |
| rollbackFor                                   | Specifies exception classes that trigger rollback                                                                                     |
| noRollbackFor                                 | Specifies exception classes that do not trigger rollback                                                                              |
| rollbackForClassName / noRollbackForClassName | Matches by exception-name rules; prefer class-based declarations in general                                                           |

```java
@Transactional(timeout = 5, rollbackFor = Exception.class)
public void buyBook(Long bookId, Long userId) throws Exception {
    bookDao.updateStock(bookId);
    bookDao.updateBalance(userId, bookId);
}
```

This transaction attribute snippet requires separate implementations of bookDao and business rules. The timeout example uses timeout=5; readOnly=true cannot replace it.

By default, RuntimeException and Error trigger rollback; checked exceptions do not. A checked exception is not a compilation error: code that fails compilation never enters a transaction.

In the default proxy mode, a Service calling another of its own methods bypasses the proxy. Adding @Transactional alone does not guarantee a new transaction for this internal call. Do not catch an error and silently return success, or manually commit a Spring-managed connection inside a transaction.

| Standard SQL isolation levels | Dirty reads | Non-repeatable reads | Phantom reads           |
| ----------------------------- | ----------- | -------------------- | ----------------------- |
| READ UNCOMMITTED              | Allowed     | Allowed              | Allowed                 |
| READ COMMITTED                | Prevented   | Allowed              | Allowed                 |
| REPEATABLE READ               | Prevented   | Prevented            | Allowed by the standard |
| SERIALIZABLE                  | Prevented   | Prevented            | Prevented               |

The table lists phenomena allowed by the standard, not identical behavior in every database implementation. Ordinary repeatable-read queries in InnoDB use snapshots, while other transactions can still update data. Locking reads also behave differently from ordinary snapshot reads.

<a id="section-8"></a>

## JdbcTemplate, XML, and further topics :id=h-4d996beb14ab

JdbcTemplate wraps JDBC resource management and exception conversion. Configure it with the same DataSource; business transactions still belong in the Service.

```java
JdbcTemplate template = new JdbcTemplate(dataSource);
Integer count = template.queryForObject("SELECT COUNT(*) FROM book", Integer.class);
```

Import org.springframework.jdbc.core.JdbcTemplate; dataSource is an already configured object. queryForObject throws exceptions for zero-row or multiple-row results; do not confuse it with a single-object query in MyBatis.

In older XML projects, constructor-arg sets constructor parameters and property/ref specifies object dependencies. value is a literal, not an object reference. Collections use list, set, and map. typeAliases, resultMap, and similar elements are MyBatis configuration and do not belong in Spring beans configuration.

| What to look up                                                                                            | Topic                                                        |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Parameter binding, dynamic SQL, association mappings, caching, reverse engineering, and pagination plugins | [Using MyBatis](MyBatis的使用.md)                               |
| Request parameters, JSON, REST, and static resources                                                       | [SpringMVC_1](SpringMVC_1.md) (historical Spring 5 examples) |
| Response wrapping, exception handling, interceptors, and integration testing with pages                    | [SpringMVC_2](SpringMVC_2.md) (historical Spring 5 examples) |
| Auto-configuration, multiple environments, and testing                                                     | [SpringBoot](SpringBoot.md)                                  |
| Annotation names and purposes                                                                              | [Common annotation reference](SpringBoot的所有注解.md)            |

For file uploads in Spring 6 projects, use Servlet multipart support with StandardServletMultipartResolver and configure multipart. The old CommonsMultipartResolver has been removed. Explicitly define the upload directory, file size, and filename rules; do not copy older project configuration unchanged.

References: [Spring documentation](https://docs.spring.io/spring-framework/reference/), [MyBatis-Spring version requirements](https://mybatis.org/spring/), [MyBatis-Spring transactions](https://mybatis.org/spring/transactions.html), and [Tomcat 10.1](https://tomcat.apache.org/tomcat-10.1-doc/).

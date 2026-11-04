# Common annotation reference for Spring Boot and Java web development :id=h-7c1f675e7dd0

Look up common annotations by purpose and understand their prerequisites, effects, and common pitfalls.

**Prerequisites and versions:** This is a reference for common annotations, not an exhaustive list. Its main scope is Spring Boot 3 / Spring 6 / Jakarta. JPA, Jackson, and Lombok are separate libraries with their own dependencies.

**Using the examples:** Unless a project explicitly lists every file and all steps to run it, code blocks are separate examples for their respective sections. Fill in omitted code and placeholder names. Lines marked as incorrect illustrate a problem. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://docs.spring.io/spring-framework/reference/)

**On this page**

- [How to read this reference](#section-1)
- [The Spring container and dependency injection](#section-2)
- [Requests and responses in Spring MVC](#section-3)
- [Validation, transactions, and exceptions](#section-4)
- [JPA: entities and relationships](#section-5)
- [Jackson: JSON mapping](#section-6)
- [Lombok: generating common code](#section-7)
- [JPA lifecycle callbacks](#section-8)

<a id="section-1"></a>

## How to read this reference :id=h-b7bc02c4a8fe

An annotation adds information to code. It only has an effect when a compiler, framework, or tool recognizes it. This reference lists commonly used annotations, not every annotation in Spring Boot.

The Java EE API in Spring Boot 2 / Spring 5 generally use javax packages. The corresponding API in Spring Boot 3 and 4 use jakarta. Not every javax package was renamed: javax.sql.DataSource in JDBC, for example, still uses javax. Check dependency versions before choosing imports.

<a id="section-2"></a>

## The Spring container and dependency injection :id=h-4c1682a681bb

| Annotation               | Where to use it                         | Purpose and notes                                                                                                                |
| ------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| @SpringBootApplication   | Application entry class                 | Combines application configuration, auto-configuration, and component scanning; scans its own package and subpackages by default |
| @Configuration           | Configuration class                     | Declares configuration; methods can use @Bean                                                                                    |
| @Bean                    | Configuration method                    | Gives the returned object to Spring to manage; the default bean name is the method name                                          |
| @Component               | Class                                   | Registers an ordinary component                                                                                                  |
| @Service                 | Class                                   | Identifies a business service; a component annotation                                                                            |
| @Repository              | Class                                   | Identifies a persistence component and can participate in exception translation; it does not automatically implement SQL         |
| @ComponentScan           | Configuration class                     | Specifies the component-scanning scope                                                                                           |
| @Import                  | Configuration class                     | Imports configuration classes or other registrable components                                                                    |
| @ImportResource          | Configuration class                     | Loads XML configuration                                                                                                          |
| @EnableAutoConfiguration | Configuration class                     | Attempts configuration based on dependencies and existing beans; normally used indirectly through the application annotation     |
| @Autowired               | Constructor, field, or method           | Matches dependencies by type; use @Qualifier or @Primary when several candidates exist                                           |
| @Qualifier               | Injection point and similar locations   | Filters candidates of the same type; a name is only one possible selection criterion                                             |
| @Primary                 | Bean definition                         | Prefers this bean among multiple candidates                                                                                      |
| @Value                   | Field, parameter, and similar locations | Reads one configuration value, for example `${server.port}`                                                                      |
| @ConfigurationProperties | Configuration class or Bean method      | Binds a group of properties by prefix; easier to maintain than many separate @Value annotations                                  |
| @Scope                   | Bean definition                         | Sets scopes such as singleton, prototype, request, and session                                                                   |

If a class has only one constructor, Spring can use it automatically without @Autowired. Constructor injection makes required dependencies clearer and simplifies testing.

```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

This is a structural fragment; define UserRepository and register it as a bean as well.

@Resource belongs to Java EE / Jakarta. It commonly looks up by name, then falls back to type matching according to its rules. @Inject also supports dependency injection, but lacks the required attribute of @Autowired; the two are not identical in every detail.

<a id="section-3"></a>

## Requests and responses in Spring MVC :id=h-d181fcaf810b

| Annotation                                                                | Purpose                                                   | Example or limitation                                                                 |
| ------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| @Controller                                                               | Declares a controller                                     | Can return a view name or use @ResponseBody to return data                            |
| @RestController                                                           | @Controller + @ResponseBody                               | Returns an HTTP response body; does not by itself make the interface conform to REST  |
| @RequestMapping                                                           | Matches requests                                          | Conditions such as path/value, method, params, headers, consumes, and produces        |
| @GetMapping / @PostMapping / @PutMapping / @DeleteMapping / @PatchMapping | Restricts the HTTP method                                 | Used on controller methods                                                            |
| @PathVariable                                                             | Reads a path variable                                     | The id in /users/{id}                                                                 |
| @RequestParam                                                             | Reads query parameters or form fields                     | ?page=1; required=true by default                                                     |
| @RequestHeader                                                            | Reads a request header                                    | Accept, Authorization, and similar headers                                            |
| @CookieValue                                                              | Reads a Cookie                                            | Define behavior when the value is absent                                              |
| @RequestBody                                                              | Reads the request body through a message converter        | Commonly used for JSON, but also supports formats such as text; not exclusive to JSON |
| @ResponseBody                                                             | Writes the return value to the response body              | Has no pattern attribute; the message converter determines the format                 |
| @DateTimeFormat                                                           | Converts date fields in query parameters and forms        | pattern="yyyy-MM-dd"; does not directly control JSON date formatting                  |
| @JsonFormat                                                               | Jackson serialization format for dates and similar values | Serves a different purpose from @DateTimeFormat                                       |

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

Import the Spring MVC annotations, java.util.Map, and java.util.Collections. The project needs MVC and JSON message-conversion dependencies; the Spring Boot Web starter normally supplies them.

<a id="section-4"></a>

## Validation, transactions, and exceptions :id=h-dc4934461810

| Annotation                   | Purpose                                                                 | Points to note                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| @Valid                       | Triggers Bean Validation                                                | Needs a validation implementation; commonly used with @RequestBody                                      |
| @Validated                   | Spring validation entry point, validation groups, and similar functions | Overlaps with @Valid but is not identical                                                               |
| @NotNull / @NotBlank / @Size | Declares validation constraints                                         | For non-null values, nonblank strings, lengths, collection sizes, and similar constraints, respectively |
| @Transactional               | Declares a transaction                                                  | In default proxy mode, a direct call within a class to its own transaction method bypasses the proxy    |
| @ControllerAdvice            | Centralizes controller-related behavior                                 | Can handle exceptions, data binding, and similar concerns                                               |
| @RestControllerAdvice        | @ControllerAdvice + @ResponseBody                                       | Commonly used for API error responses                                                                   |
| @ExceptionHandler            | Declares an exception-handler method                                    | Normally used with Advice or within a controller                                                        |

@Transactional rolls back for RuntimeException and Error by default, but not for checked exceptions. To roll back for checked exceptions, set rollbackFor=Exception.class. readOnly is a read-only hint whose enforcement depends on the transaction manager and database; it is not general access control. timeout is measured in seconds, not milliseconds.

An error response needs both a response body and an appropriate HTTP status. Do not return error JSON while leaving every status at 200.

<a id="section-5"></a>

## JPA: entities and relationships :id=h-644c23bdf67d

These are Jakarta Persistence / JPA annotations, not MyBatis annotations. Do not expect @Entity to create database mappings in a project that only uses MyBatis.

| Annotation                                        | Meaning                                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| @Entity                                           | Declares a persistent entity; normally needs a primary key and an accessible no-argument constructor          |
| @Table                                            | Specifies table names, indexes, and similar settings; a naming strategy may also affect the actual table name |
| @Id                                               | Identifies the primary key                                                                                    |
| @GeneratedValue                                   | Selects a primary-key generation strategy                                                                     |
| @SequenceGenerator                                | Defines a sequence generator; the database must support the selected strategy                                 |
| @MappedSuperclass                                 | Subentities inherit the parent mapping; the parent is not a separate entity table                             |
| @Column                                           | Specifies column name, nullable, length, precision, scale, insertable, updatable, and similar settings        |
| @Transient                                        | Excludes the property from persistence, not necessarily from JSON serialization                               |
| @Basic                                            | Basic property mapping; LAZY is a hint and may require provider enhancement support                           |
| @OneToOne / @OneToMany / @ManyToOne / @ManyToMany | Defines entity relationships                                                                                  |
| @JoinColumn                                       | Defines a join column; placement depends on the relationship type and ownership                               |
| @NoRepositoryBean                                 | Spring Data excludes a base repository interface from instantiation; not a JPA annotation                     |

Traditional JPA key strategies are AUTO, IDENTITY, SEQUENCE, and TABLE. JPA 3.1 adds UUID. native is not a GenerationType enum member. MySQL commonly uses IDENTITY; do not copy SEQUENCE configuration from another database unchanged.

@Column(nullable=false) mainly describes mapping and schema constraints; it does not replace request validation. precision/scale applies to exact decimal columns, typically with BigDecimal for money. It does not control double floating-point precision.

<a id="section-6"></a>

## Jackson: JSON mapping :id=h-5e0a04898143

- @JsonIgnore normally ignores a property during serialization and deserialization; exact behavior depends on the combined property configuration.
- @JsonManagedReference / @JsonBackReference handle bidirectional parent-child references. The BackReference side is not normally serialized as a recursive child object.
- Avoid returning JPA entities with complex relationships directly. An explicit response DTO makes fields and query counts easier to control.

<a id="section-7"></a>

## Lombok: generating common code :id=h-4be716196713

| Annotation or type       | Purpose and limits                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| @Getter / @Setter        | Generates accessors on fields or classes; ordinary setters are not generated for final fields                                                                |
| @Data                    | Combines accessors, equals/hashCode, toString, a required-arguments constructor, and related code; does not unconditionally generate setters for every field |
| @NoArgsConstructor       | Generates a no-argument constructor                                                                                                                          |
| @RequiredArgsConstructor | Generates a constructor for uninitialized final fields and qualifying @NonNull fields                                                                        |
| @AllArgsConstructor      | Generates an all-arguments constructor for instance fields                                                                                                   |
| @EqualsAndHashCode       | Generates equality methods; excludes static and transient fields by default                                                                                  |
| @ToString                | Generates toString; exclude passwords and relationships that could recurse                                                                                   |
| @Log4j2                  | Generates a Log4j 2 logger; matching logging dependencies are required                                                                                       |
| @NonNull                 | Adds argument checks to supported Lombok-generated code; not a global non-null guarantee                                                                     |
| val                      | Infers a local variable type and produces a final local variable; cannot be used as a field annotation                                                       |

Lombok requires annotation processing during compilation. Constructor annotations can be combined, but duplicate generated signatures conflict. Check handwritten constructors for duplicate signatures too.

<a id="section-8"></a>

## JPA lifecycle callbacks :id=h-c9be6deae864

| Callback                   | When it runs                                    |
| -------------------------- | ----------------------------------------------- |
| @PostLoad                  | After an entity is loaded or refreshed          |
| @PrePersist / @PostPersist | Before persistence / after the insert operation |
| @PreUpdate / @PostUpdate   | Before / after a database update                |
| @PreRemove / @PostRemove   | Before / after removal                          |

SQL can run during flush, rather than waiting for commit. PostPersist, PostUpdate, and PostRemove do not mean that the transaction has committed successfully. When getReference returns a proxy, it need not immediately load the entity or trigger PostLoad.

References: [Spring annotations](https://docs.spring.io/spring-framework/reference/), [Jakarta Persistence](https://jakarta.ee/specifications/persistence/), and [Lombok features](https://projectlombok.org/features/).

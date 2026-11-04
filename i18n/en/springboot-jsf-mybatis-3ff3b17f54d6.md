# Integrating Spring Boot, Jakarta Faces, and MyBatis :id=h-a511ccb57865

Build a Boot, Faces, and MyBatis project file by file, and understand page beans and database access.

**Prerequisites and versions:** Basic knowledge of Maven, JSF, and SQL is required. The complete example uses fixed versions: Java 17, Boot 3.5.6, JoinFaces 5.5.6, and Faces 4. Do not replace individual parts of this version combination.

**Using the examples:** Unless a project explicitly lists all files and run instructions, code blocks are independent snippets for each section. Fill in ellipses and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://docs.joinfaces.org/5.5.6/reference/)

**Contents**

- [Check versions first](#section-1)
- [1. Maven configuration](#section-2)
- [2. Project files](#section-3)
- [3. Database and YAML](#section-4)
- [4. Application class and mapper](#section-5)
- [5. Page bean and scope](#section-6)
- [6. Facelets page](#section-7)
- [7. Considerations when adding Spring Security](#section-8)

<a id="section-1"></a>

## Check versions first :id=h-654efe1eed6a

Faces (formerly called JSF) handles server-side page components, MyBatis handles database queries, and Spring Boot handles application startup and configuration. Their API versions must be compatible. Do not mix the javax API of JSF 2 with the jakarta API of Faces 3/4.

This section uses a specific reproducible combination: Java 17, Spring Boot 3.5.6, JoinFaces 5.5.6, Faces 4, and MyBatis starter 3.0.4. These versions are for reproducing the tutorial and do not indicate the latest patches. JoinFaces provides initialization and scope support compatible with Boot, avoiding duplicate manual registration of FacesServlet and listeners, or a custom ViewScope without destruction callbacks.

| Maintenance scenario      | Compatible combination                                                          |
| ------------------------- | ------------------------------------------------------------------------------- |
| Existing Boot 2.7 project | JoinFaces 4.7，JSF 2，javax.faces                                                 |
| Boot 3.5 in this section  | JoinFaces 5.5，Jakarta Faces，jakarta.faces                                       |
| Boot 4 project            | JoinFaces 6.x; select the MyBatis starter using its version compatibility table |

For basic tags and the lifecycle, first consult [JSF Basics](JSF%20基础.md) and [JSF Tags](JSF%20标签.md). Those documents retain historical JSF 2 examples; this section uses Faces 4 namespaces and Spring-managed beans.

<a id="section-2"></a>

## 1. Maven configuration :id=h-c799cce6de35

File: pom.xml. Add only the dependencies required by this example. Other business libraries, such as email or project management file parsers, are unrelated to Faces integration.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.6</version>
        <relativePath/>
    </parent>
    <groupId>example</groupId>
    <artifactId>faces-notes</artifactId>
    <version>1.0.0</version>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.joinfaces</groupId>
                <artifactId>joinfaces-platform</artifactId>
                <version>5.5.6</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.joinfaces</groupId>
            <artifactId>faces-spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>3.0.4</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

Do not additionally add jsf-api 2.2, jsf-impl 2.2, or another Faces implementation. The API contains only interfaces; an implementation provides runtime behavior. Duplicate dependencies and dependencies spanning incompatible versions can cause class-loading problems.

<a id="section-3"></a>

## 2. Project files :id=h-cc557945c8ff

```text
src/main/java/example/faces/
  FacesApplication.java
  BookMapper.java
  BookView.java
src/main/resources/
  application.yml
  META-INF/resources/index.xhtml
```

For an executable Spring Boot JAR, place pages under META-INF/resources on the classpath. Do not assume src/main/webapp will be included in the executable JAR. Organize webapp according to WAR deployment conventions only when actually using that deployment format.

JoinFaces handles Faces initialization automatically. This example requires neither web.xml nor manual registration of a second FacesServlet. If custom Faces configuration is needed, the standard name is faces-config.xml, not face-config.xml. Its location and version depend on the deployment method; do not rename it arbitrarily.

<a id="section-4"></a>

## 3. Database and YAML :id=h-36aee1f1b4ad

Create a practice table in the study database in MySQL:

```sql
CREATE TABLE book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO book (title) VALUES ('Java 入门'), ('SQL 入门');
```

File: application.yml. The runtime environment supplies the DB_USER and DB_PASSWORD environment variables. Do not save real credentials in the repository.

```yaml
server:
  port: 9000
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/study?characterEncoding=UTF-8
    username: ${DB_USER}
    password: ${DB_PASSWORD}
joinfaces:
  faces:
    project-stage: development
```

mybatis.mapper-locations, mybatis.type-aliases-package, and similar settings are YAML configuration, not XML. This example uses only annotated SQL, so no Mapper XML path is required. Change the Faces project-stage to production when deploying to production.

<a id="section-5"></a>

## 4. Application class and mapper :id=h-cf68411db398

File: FacesApplication.java.

```java
package example.faces;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FacesApplication {
    public static void main(String[] args) {
        SpringApplication.run(FacesApplication.class, args);
    }
}
```

File: BookMapper.java.

```java
package example.faces;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BookMapper {
    @Select("SELECT title FROM book ORDER BY id LIMIT 100")
    List<String> listTitles();
}
```

LIMIT 100 is an explicit limit for this demonstration; implement pagination for real lists. @Mapper makes the MyBatis starter register a mapper proxy. You do not need to write a separate implementation class.

<a id="section-6"></a>

## 5. Page bean and scope :id=h-68e3e95db0ee

File: BookView\.java.

```java
package example.faces;

import java.util.List;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component("bookView")
@Scope("view")
public class BookView {
    private final BookMapper mapper;
    private List<String> titles;

    public BookView(BookMapper mapper) {
        this.mapper = mapper;
    }

    public List<String> getTitles() {
        if (titles == null) {
            titles = mapper.listTitles();
        }
        return titles;
    }

    public void reload() {
        titles = mapper.listTitles();
    }
}
```

JoinFaces registers the view scope, which is suitable for retaining data while interacting with the same page. getTitles may be called multiple times during one render, so cache the list instead of querying the database on every getter call.

request creates one instance per request; session shares an instance within the same session; singleton shares an instance across all users. Do not casually place user input or page state in a singleton. Cluster session replication, view serialization, and destruction callbacks must use mechanisms supported by the relevant version. An empty registerDestructionCallback method is not a substitute for a complete scope implementation.

<a id="section-7"></a>

## 6. Facelets page :id=h-f14aebeba153

File: src/main/resources/META-INF/resources/index.xhtml.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="jakarta.faces.html"
      xmlns:ui="jakarta.faces.facelets">
<h:head>
    <title>图书列表</title>
</h:head>
<h:body>
    <h:form id="books">
        <h:commandButton value="刷新" action="#{bookView.reload}"/>
        <ul>
            <ui:repeat value="#{bookView.titles}" var="title">
                <li><h:outputText value="#{title}"/></li>
            </ui:repeat>
        </ul>
    </h:form>
</h:body>
</html>
```

Output components escape text by default. Do not casually set escape=false to display user input.

Run mvn spring-boot:run from the project root, then visit [http://localhost:9000/index.xhtml](http://localhost:9000/index.xhtml). Two books should appear; click refresh to reload the list. Alternatively, run mvn package and start the application with java -jar target/faces-notes-1.0.0.jar.

<a id="section-8"></a>

## 7. Considerations when adding Spring Security :id=h-b5ac9a89355b

When authentication is required, add the security starter that matches the Boot version. Spring Security 6 no longer provides WebSecurityConfigurerAdapter; configure a SecurityFilterChain bean instead.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(authorize -> authorize
            .requestMatchers("/jakarta.faces.resource/**").permitAll()
            .anyRequest().authenticated())
        .formLogin(Customizer.withDefaults());
    return http.build();
}
```

This optional configuration snippet belongs in an @Configuration class with the corresponding Spring Security types imported. User authentication still needs to be configured. Without custom users, Boot's default development user mechanism cannot serve directly as a production account system.

Authenticated Faces forms need to include Spring's CSRF token. Add a native hidden field inside h:form:

```html
<input type="hidden"
       name="#{requestScope['_csrf'].parameterName}"
       value="#{requestScope['_csrf'].token}"/>
```

Use this snippet only on pages where Security is enabled. Faces ViewState and Spring CSRF tokens are two different mechanisms. If a 403 occurs, first check whether the token was submitted. Do not disable all CSRF protection just because a POST request fails. Verify token transmission and expired-session behavior separately for Ajax, uploads, and custom login flows.

References: [JoinFaces 5.5.6](https://docs.joinfaces.org/5.5.6/reference/), [version compatibility](https://github.com/joinfaces/joinfaces#version-compatibility), [MyBatis starter](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/), and [Spring Security CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html).

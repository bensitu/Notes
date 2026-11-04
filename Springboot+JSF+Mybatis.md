# Spring Boot、Jakarta Faces 与 MyBatis 整合

按文件搭建 Boot、Faces 和 MyBatis 项目，理解页面 Bean 与数据库访问。

**学习前提与版本：** 需要 Maven、JSF 与 SQL 基础。完整示例固定 Java 17、Boot 3.5.6、JoinFaces 5.5.6 与 Faces 4，版本组合不要拆开替换。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[文档目录](README.md) · [官方参考](https://docs.joinfaces.org/5.5.6/reference/)

**内容导航**

- [先确认版本](#section-1)
- [1. Maven 配置](#section-2)
- [2. 项目文件](#section-3)
- [3. 数据库与 YAML](#section-4)
- [4. 启动类与 Mapper](#section-5)
- [5. 页面 Bean 与作用域](#section-6)
- [6. Facelets 页面](#section-7)
- [7. 加入 Spring Security 时的边界](#section-8)


<a id="section-1"></a>

## 先确认版本

Faces（早期名称 JSF）负责服务器端页面组件，MyBatis 负责数据库查询，Spring Boot 负责应用启动与配置。它们的 API 版本必须匹配，不能把 JSF 2 的 javax API 与 Faces 3/4 的 jakarta API 混用。

本节采用一个明确的复现组合：Java 17、Spring Boot 3.5.6、JoinFaces 5.5.6、Faces 4、MyBatis starter 3.0.4。版本用于教学复现，不表示最新补丁。JoinFaces 提供与 Boot 匹配的初始化与作用域支持，避免手工重复注册 FacesServlet、监听器和缺少销毁回调的自定义 ViewScope。

| 维护场景 | 对应关系 |
| --- | --- |
| Boot 2.7 旧项目 | JoinFaces 4.7，JSF 2，javax.faces |
| 本节 Boot 3.5 | JoinFaces 5.5，Jakarta Faces，jakarta.faces |
| Boot 4 项目 | JoinFaces 6.x，按其版本表选择 MyBatis starter |

基础标签与生命周期可先查阅 [JSF 基础](JSF%20基础.md) 和 [JSF 标签](JSF%20标签.md)。这两份文档保留 JSF 2 历史示例；本节使用 Faces 4 的命名空间与 Spring 管理的 Bean。

<a id="section-2"></a>

## 1. Maven 配置

文件：pom.xml。仅加入当前示例需要的依赖；邮件、项目管理文件解析等其他业务库与 Faces 整合无关。

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

不要再额外添加 jsf-api 2.2、jsf-impl 2.2 或另一种 Faces 实现。API 只是接口，实现才提供运行行为；重复和跨版本依赖容易造成类加载问题。

<a id="section-3"></a>

## 2. 项目文件

```text
src/main/java/example/faces/
  FacesApplication.java
  BookMapper.java
  BookView.java
src/main/resources/
  application.yml
  META-INF/resources/index.xhtml
```

Spring Boot 可执行 JAR 的页面放在 classpath 下的 META-INF/resources。不要假定 src/main/webapp 一定会进入可执行 JAR。只有确实采用 WAR 部署时，才按对应方式组织 webapp。

JoinFaces 自动处理 Faces 初始化。本例不需要 web.xml，也不需要手工注册第二个 FacesServlet。需要自定义 Faces 配置时，标准名称是 faces-config.xml，不是 face-config.xml；位置和版本由所选部署方式决定，不能随意换名。

<a id="section-4"></a>

## 3. 数据库与 YAML

在 MySQL 的 study 数据库中创建练习表：

```sql
CREATE TABLE book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT INTO book (title) VALUES ('Java 入门'), ('SQL 入门');
```

文件：application.yml。环境变量 DB_USER、DB_PASSWORD 由运行环境提供，不把真实凭据保存进仓库。

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

mybatis.mapper-locations、mybatis.type-aliases-package 等是 YAML 配置，不是 XML。这里只用注解 SQL，无需配置 Mapper XML 路径。上线时把 Faces project-stage 改为 production。

<a id="section-5"></a>

## 4. 启动类与 Mapper

文件：FacesApplication.java。

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

文件：BookMapper.java。

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

LIMIT 100 是明确的演示上限，实际列表应实现分页。@Mapper 使 MyBatis starter 注册 Mapper 代理；不需要另写实现类。

<a id="section-6"></a>

## 5. 页面 Bean 与作用域

文件：BookView.java。

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

view 作用域由 JoinFaces 注册，适合保留同一页面交互期间的数据。getTitles 可能在一次渲染中被调用多次，因此缓存列表，不要每次 getter 调用都查询数据库。

request 每次请求一个实例；session 同一会话共享实例；singleton 被所有用户共享。用户输入与页面状态不应随意放进 singleton。集群会话复制、视图序列化与销毁回调需要使用对应版本支持的方式，不能用空 registerDestructionCallback 方法代替完整作用域实现。

<a id="section-7"></a>

## 6. Facelets 页面

文件：src/main/resources/META-INF/resources/index.xhtml。

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

输出组件默认转义文本。不要为了显示用户输入而随意设置 escape=false。

从项目根目录运行 mvn spring-boot:run，然后访问 <http://localhost:9000/index.xhtml>。预期显示两本图书，点击刷新重新读取列表。也可执行 mvn package，再用 java -jar target/faces-notes-1.0.0.jar 启动。

<a id="section-8"></a>

## 7. 加入 Spring Security 时的边界

需要认证时，再添加与 Boot 版本匹配的 security starter。Spring Security 6 不再提供 WebSecurityConfigurerAdapter，使用 SecurityFilterChain Bean 配置。

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

这是可选配置片段，放在 @Configuration 类中并导入 Spring Security 对应类型。它仍需要用户认证配置；未配置自定义用户时，Boot 的默认开发用户机制不能直接作为正式账号系统。

认证后的 Faces 表单需要携带 Spring 的 CSRF token。可在 h:form 内添加原生隐藏字段：

```html
<input type="hidden"
       name="#{requestScope['_csrf'].parameterName}"
       value="#{requestScope['_csrf'].token}"/>
```

只在已启用 Security 的页面使用这个片段。Faces 的 ViewState 与 Spring 的 CSRF token 是两个不同机制。遇到 403 时先检查令牌是否提交，不要因为“POST 报错”就关闭整个 CSRF 保护。Ajax、上传和自定义登录需要分别验证令牌传递与过期会话行为。

参考：[JoinFaces 5.5.6](https://docs.joinfaces.org/5.5.6/reference/)、[版本对应](https://github.com/joinfaces/joinfaces#version-compatibility)、[MyBatis starter](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)、[Spring Security CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)。

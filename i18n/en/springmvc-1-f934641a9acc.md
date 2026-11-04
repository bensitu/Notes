# Spring MVC: request and response basics :id=h-4558c1789e08

Understand request mappings, parameter handling, responses, and REST APIs, and look up the corresponding annotations during development.

**Prerequisites and versions:** This article retains the historical Spring 5.2 / javax / Tomcat 9 teaching environment. Use snippets in the project specified by each section. For complete Spring 6 configuration, see SSM.md.

**About screenshots:** Images retain the procedures from the original teaching environment. If an older approach in a screenshot differs from the text, follow the revised text and the official documentation for your chosen version.

**Using the examples:** Unless a project explicitly lists all files and execution steps, code blocks are independent snippets for each section. Fill in omissions and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations in the same section.

[Documentation index](README.md) · [Official references](https://docs.spring.io/spring-framework/docs/5.2.10.RELEASE/spring-framework-reference/web.html)

**Contents**

- [1. Overview of SpringMVC](#section-1)
- [2. SpringMVC starter example](#section-2)
- [3. Using PostMan](#section-3)
- [4. Requests and responses](#section-4)
- [5. REST style](#section-5)

**Today's topics**

> - Understand SpringMVC concepts
> - Complete a SpringMVC starter example
> - Learn to send requests and data using PostMan
> - Master how SpringMVC receives requests and data and returns results
> - Master the RESTful style and its use
> - Complete an example based on RESTful

SpringMVC is part of the Spring framework, primarily for web development, and wraps Servlet functionality.

We will study these SpringMVC topics:

- Introduction to SpringMVC
- \==Requests and responses==
- \==REST style==
- \==SSM integration (annotations)==
- Interceptors

SpringMVC operates in the web layer. It receives frontend requests and data, processes them, and returns results to the frontend. Request and response handling is therefore central to SpringMVC.

REST is a software architecture style that can reduce development complexity and improve scalability, and is widely used in later applications.

SSM integration combines SpringMVC + Spring + Mybatis for business development, applying all three frameworks together.

The final SpringMVC learning objectives are:

1. \==Master obtaining request parameters and returning json with SpringMVC==
2. \==Use REST-style request paths and parameter passing proficiently==
3. Define and implement a frontend/backend communication protocol for actual business requirements
4. \==Develop any business module using SSM integration==

<a id="section-1"></a>

## 1. Overview of SpringMVC :id=h-9fcfc7cad577

Before learning SpringMVC, review how web applications are built today, typically using a three-layer architecture.

Three-layer architecture

![1630427303762](Resources/1630427303762.png)

- The browser sends a request to the backend server, which currently receives requests and data through Servlet.

- If Servlet handles everything, all functionality becomes tightly coupled, making maintenance and extension difficult.

- Split backend Servlet processing into three layers: `web`, `service`, and `dao`.
  - The web layer mainly uses servlets to handle page requests, collect data, and return results to the frontend.
  - The service layer mainly handles business logic.
  - The dao layer mainly handles data CRUD.

- Servlet can handle multiple requests. Spring MVC dispatches requests centrally through DispatcherServlet, reducing manual path checks and parameter parsing.

- Optimize the web layer using the MVC design pattern, dividing it into `controller`, `view`, and `Model`.
  - controller receives requests and data, then delegates to service for business processing.
  - service calls dao as needed for data CRUD.
  - dao returns its result to service, which passes it to controller.
  - controller assembles a Model and View as needed; together they generate a page forwarded to the frontend browser.
  - This lets controller handle and dispatch multiple requests to different business operations.

With separate frontend and backend applications, the browser often fetches data through fetch or Axios and updates the page on the frontend. Browser-side asynchronous requests and server-side asynchronous processing are distinct; returning JSON alone does not guarantee better performance.

![1630427769938](Resources/1630427769938.png)

- In this separated example, the backend returns data and the frontend renders the page. Spring MVC also continues to support server-side template views.
- This example uses JSON for data; asynchronous requests can also receive HTML, text, or files.
- SpringMVC is ==mainly== responsible for:
  - How controller receives requests and data
  - How to delegate requests and data to the business layer
  - How to convert response data to json and send it to the frontend

With that background, define SpringMVC:

- SpringMVC is a lightweight web framework implementing the MVC model based on Java.

- Advantages

  - Easy to use and convenient for development (compared with Servlet)
  - Highly flexible

  You will gradually experience these advantages as you use it.

<a id="section-2"></a>

## 2. SpringMVC starter example :id=h-16ff7e7343ea

Spring MVC still uses Servlet internally. First review how Servlet receives requests, then learn how DispatcherServlet dispatches them centrally.

1\. Create a web project (Maven structure).

2\. Configure Tomcat and load the web project (Tomcat plugin).

3\. Import dependencies (Servlet).

4\. Define a request-handling class (UserServlet).

5\. Set request mappings (configure mapping relationships).

Building SpringMVC follows almost the same steps. What is the specific process?

1\. Create a web project (Maven structure).

2\. Configure Tomcat and load the web project (Tomcat plugin).

3\. Import dependencies (==SpringMVC== + Servlet).

4\. Define a request-handling class (==UserController==).

5\. ==Set request mappings (configure mapping relationships).==

6\. ==Configure SpringMVC to load into the Tomcat container.==

### 2.1 Requirements analysis :id=h-99425b85252c

### 2.2 Building the example :id=h-1071db4da616

#### Step 1: Create a Maven project :id=h-5d1366ae484c

Open IDEA and create a new web project.

![1630428920116](Resources/1630428920116.png)

#### Step 2: Complete the directory structure :id=h-56e20dec7f75

The archetype-generated project structure is incomplete, so add the missing directories manually.

![1630429288339](Resources/1630429288339.png)

#### Step 3: Import jar files :id=h-1a583c000196

Remove unnecessary content from pom.xml and add the dependencies required by SpringMVC.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.itheima</groupId>
  <artifactId>springmvc_01_quickstart</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>

  <dependencies>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>3.1.0</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.10.RELEASE</version>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.1</version>
        <configuration>
          <port>80</port>
          <path>/</path>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>

```

\*\*Explanation:\*\* Why does the servlet dependency need `<scope>provided</scope>`?

- scope describes the scope of a jar dependency in maven.

- If omitted, the default is `compile`, applying during compilation, execution, and testing.

- Including it at runtime conflicts with Tomcat's servlet-api package, causing a startup error.

- provided includes the package only for compilation and testing. At runtime, Tomcat's version is used, avoiding the conflict.

#### Step 4: Create the configuration class :id=h-c8b3dca082ab

```java
@Configuration
@ComponentScan("com.itheima.controller")
public class SpringMvcConfig {
}
```

#### Step 5: Create the Controller class :id=h-2ac3a58d1c6e

```java
@Controller
public class UserController {

    @RequestMapping("/save")
    public void save(){
        System.out.println("user save ...");
    }
}

```

#### Step 6: Replace web.xml with a configuration class :id=h-4be8b001f433

Delete web.xml and replace it with ServletContainersInitConfig.

```java
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    // See note 1 below.
    protected WebApplicationContext createServletApplicationContext() {
        // See note 2 below.
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        // See note 3 below.
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }

    // See note 4 below.
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    // See note 5 below.
    protected WebApplicationContext createRootApplicationContext() {
        return null;
    }
}
```

Example notes:

1. Load the springmvc configuration class
2. Initialize the WebApplicationContext object
3. Load the specified configuration class
4. Set request paths handled by the springmvc controller
5. Load the spring configuration class

#### Step 7: Configure Tomcat :id=h-5d9a95479e0d

![1630430302683](Resources/1630430302683.png)

#### Step 8: Start the project :id=h-46ad13ea29db

![1630430345246](Resources/1630430345246.png)

#### Step 9: Access it in the browser :id=h-f670f600298d

Enter `http://localhost/save` in the browser; the following error appears:

![1630430401561](Resources/1630430401561.png)

The page reports an error because the backend did not specify a response page. For now, check only whether `user save ...` ran in the console.

#### Step 10: Change the Controller return value to address the problem :id=h-c9301ccb59bd

Our current focus is frontend asynchronous requests and backend json responses, so modify the Controller save method next.

```java
@Controller
public class UserController {

    @RequestMapping("/save")
    public String save(){
        System.out.println("user save ...");
        return "{'info':'springmvc'}";
    }
}

```

Restart Tomcat and test again in the browser. There is still an error, this time 404.

![1630430658028](Resources/1630430658028.png)

When a method returns a string directly, springmvc treats it as a page name and looks for that page. No matching page exists, so it returns 404, resource not found.

We actually want to return json directly. How should we change the code?

#### Step 11: Return json data :id=h-0160168ec0bf

```java
@Controller
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'info':'springmvc'}";
    }
}

```

Restart Tomcat and access it again in the browser to see the returned data.

![1630430835628](Resources/1630430835628.png)

The SpringMVC starter example is now complete.

**Notes**

- SpringMVC is based on Spring. Only `spring-webmvc` is imported in pom.xml because it brings in the required Spring dependencies automatically.
- AbstractDispatcherServletInitializer is an abstract class provided by SpringMVC for quickly initializing a Web 3.0 container.
- AbstractDispatcherServletInitializer provides three interface methods to implement.
  - createServletApplicationContext loads beans for SpringMVC when the Servlet container is created, placing them in WebApplicationContext. WebApplicationContext has ServletContext scope, covering the entire web container.
  - getServletMappings sets request mappings for SpringMVC, determining which requests SpringMVC intercepts.
  - Use createRootApplicationContext when creating the Servlet container to load beans unrelated to SpringMVC; its usage matches createServletApplicationContext.
  - createServletApplicationContext loads the SpringMVC environment.
  - createRootApplicationContext loads the Spring environment.

### Key concept 1: @Controller :id=h-a7f3f773fba9

| Name     | @Controller                                    |
| -------- | ---------------------------------------------- |
| Type     | Class annotation                               |
| Location | Above a SpringMVC controller class declaration |
| Purpose  | Defines the core controller bean for SpringMVC |

### Key concept 2: @RequestMapping :id=h-1c13bf62f1e3

| Name               | @RequestMapping                                          |
| ------------------ | -------------------------------------------------------- |
| Type               | Class or method annotation                               |
| Location           | Above a SpringMVC controller class or method declaration |
| Purpose            | Sets the request path for the controller method          |
| Related attributes | value (default): request path                            |

### Key concept 3: @ResponseBody :id=h-4c82bc8b906f

| Name     | @ResponseBody                                                                            |
| -------- | ---------------------------------------------------------------------------------------- |
| Type     | Class or method annotation                                                               |
| Location | Above a SpringMVC controller class or method declaration                                 |
| Purpose  | Uses the method's return value directly as the response content, without view resolution |

### 2.3 Starter example summary :id=h-c2281e285b0c

- One-time setup
  - Create the project, configure the server, and load the project
  - Import dependencies
  - Create the web container initializer, load SpringMVC configuration, and set SpringMVC request mappings
  - SpringMVC core configuration class (mark the configuration class, scan controller, and load Controller beans)
- Repeated work
  - Define request-handling controller classes
  - Define request-handling methods, with request mappings (@RequestMapping) and json responses (@ResponseBody)

### 2.4 Workflow explained :id=h-0e82a1dad0e4

To understand SpringMVC better, analyze SpringMVC usage in two phases: `启动服务器初始化过程` and `单次请求过程`.

![1630432494752](Resources/1630432494752.png)

#### 2.4.1 Server startup initialization :id=h-45c3d6c48376

1. The server starts, executes ServletContainersInitConfig, and initializes the web container.

   - This serves a role similar to the earlier web.xml.

2. Execute createServletApplicationContext to create WebApplicationContext.

   - This method loads SpringMVC's configuration class SpringMvcConfig to initialize the SpringMVC container.

3. Load the SpringMvcConfig configuration class

   ![1630433335744](Resources/1630433335744.png)

4. Execute @ComponentScan to load the corresponding beans.

   - Scan annotations on every class in the specified package and subpackages, such as @Controller on controller classes.

5. Load UserController; each @RequestMapping name corresponds to a specific method.

   ![1630433398932](Resources/1630433398932.png)

   - This establishes the mapping between `/save` and save.

6. Execute getServletMappings to set the request interception path rules for SpringMVC.

   ![1630433510528](Resources/1630433510528.png)

   - `/` specifies the intercepted paths; only intercepted requests can be passed to SpringMVC for handling.

#### 2.4.2 Processing a single request :id=h-52b0c01c4687

1. Send the request `http://localhost/save`
2. The web container finds that the request matches SpringMVC's rules and passes it to SpringMVC.
3. Parse the request path /save
4. Match /save to the corresponding method save()
   - Step 5 above established the path-to-method mapping, so /save locates save.
5. Execute save()
6. Detect @ResponseBody and return save()'s value directly as the response body.

### 2.5 Controlling bean loading :id=h-b131b113a379

#### 2.5.1 Problem analysis :id=h-037a2884647a

The starter example created a `SpringMvcConfig` configuration class. Earlier Spring lessons also created `SpringConfig`. Both load resources; which resources should each load?

First, examine the current project structure:

![1630459727575](Resources/1630459727575.png)

- config stores configuration classes, including:

  - ServletContainersInitConfig
  - SpringConfig
  - SpringMvcConfig
  - JdbcConfig
  - MybatisConfig
- controller stores SpringMVC controller classes.
- service stores service interfaces and implementations.
- dao stores dao/Mapper interfaces.

controller, service, and dao must all be container-managed beans. Should SpringMVC or Spring load them?

- SpringMVC loads its related presentation-layer beans: classes in controller.
- Beans managed by Spring
  - Business beans (Service)
  - Functional beans (DataSource, SqlSessionFactoryBean, MapperScannerConfigurer, etc.)

Once responsibilities are clear, the next problem is making Spring and SpringMVC load their contents separately.

In SpringMVC's configuration class `SpringMvcConfig`, restrict `@ComponentScan` to scan controller, for example:

![1630460319004](Resources/1630460319004.png)

In Spring's `SpringConfig`, the earlier `@ComponentScan` scanning scope already included controller:

![1630460408159](Resources/1630460408159.png)

The package structure shows that Spring also scans SpringMVC controllers. Next, we will learn how to resolve this.

Our problem is: ==How can we prevent Spring from incorrectly loading SpringMVC beans when their responsibilities differ?==

#### 2.5.2 Analyzing the approach :id=h-d1aee2914f7e

The solution is straightforward:

- Exclude SpringMVC-managed beans when loading Spring-managed beans.

How can we exclude them?

- Approach 1: Give Spring precise scanning scopes, such as service and dao.
- Approach 2: Scan com.itheima in Spring but exclude controller beans.
- Approach 3: Load Spring and SpringMVC into one environment without separating them (awareness only).

#### 2.5.4 Preparing the environment :id=h-9427e1115184

- Create a Maven web project

- Add Spring dependencies to pom.xml.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_02_bean_load</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
        <version>1.1.16</version>
      </dependency>

      <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.6</version>
      </dependency>

      <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
      </dependency>

      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>

      <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>1.3.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- Create the corresponding configuration classes

  ```java
  public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
      protected WebApplicationContext createServletApplicationContext() {
          AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
          ctx.register(SpringMvcConfig.class);
          return ctx;
      }
      protected String[] getServletMappings() {
          return new String[]{"/"};
      }
      protected WebApplicationContext createRootApplicationContext() {
        return null;
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  public class SpringMvcConfig {
  }

  @Configuration
  @ComponentScan("com.itheima")
  public class SpringConfig {
  }

  ```

- Write Controller, Service, Dao, and Domain classes.

  ```java
  @Controller
  public class UserController {

      @RequestMapping("/save")
      @ResponseBody
      public String save(){
          System.out.println("user save ...");
          return "{'info':'springmvc'}";
      }
  }

  public interface UserService {
      public void save(User user);
  }

  @Service
  public class UserServiceImpl implements UserService {
      public void save(User user) {
          System.out.println("user service ...");
      }
  }

  public interface UserDao {
      @Insert("insert into tbl_user(name,age)values(#{name},#{age})")
      public void save(User user);
  }
  public class User {
      private Integer id;
      private String name;
      private Integer age;
      // See note 1 below.
  }
  ```

Example notes:

1. setter..getter..toString omitted

The completed project structure is as follows:

![1630461261820](Resources/1630461261820.png)

#### 2.5.5 Configuring bean loading control :id=h-ea6431c68e07

Approach 1: Modify Spring configuration to scan precise packages.

```java
@Configuration
@ComponentScan({"com.itheima.service","comitheima.dao"})
public class SpringConfig {
}
```

**Explanation:**

This demonstrates precise package scanning. In actual development, Dao scanning is handled by `MapperScannerConfigurer`, so Spring only needs to scan service.

Approach 2: Scan com.itheima in Spring but exclude controller beans.

```java
@Configuration
@ComponentScan(value="com.itheima",
    excludeFilters=@ComponentScan.Filter(
        type = FilterType.ANNOTATION,
        classes = Controller.class
    )
)
public class SpringConfig {
}
```

- excludeFilters: filter rules excluding beans during scanning

- type: the exclusion rule type; here, exclude by the annotation used to define the bean

  - ANNOTATION: exclude by annotation
  - ASSIGNABLE_TYPE: filter by a specified type
  - ASPECTJ: exclude by Aspectj expression; rarely used here
  - REGEX: exclude by regular expression
  - CUSTOM: exclude by custom rules

  You only need to know the first option, ANNOTATION.

- classes: the specific annotation classes to exclude; here, beans defined with @Controller

How can we test that controller classes were excluded?

```java
public class App{
    public static void main (String[] args){
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        System.out.println(ctx.getBean(UserController.class));
    }
}
```

If excluded, executing this method reports that the bean is not defined.

![1630462200947](Resources/1630462200947.png)

\==Note: Comment out @ComponentScan on SpringMvcConfig during this test; otherwise, no error occurs.==

This happens because:

- Spring scans `com.itheima`.
- SpringMVC's configuration class `SpringMvcConfig` has @Configuration, so Spring scans it too.
- SpringMvcConfig has @ComponentScan, which scans controller again.
- Without commenting out @ComponentScan, Spring excludes Controller, then discovers SpringMVC configuration and loads it back, preventing the intended demonstration.
- The fix is simple: move SpringMVC's configuration class outside Spring's scanning scope.

Finally, to load Spring configuration when Tomcat starts, modify ServletContainersInitConfig.

```java
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    protected WebApplicationContext createServletApplicationContext() {
      // See note 1 below.
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
    protected WebApplicationContext createRootApplicationContext() {
      // See note 2 below.
      AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringConfig.class);
        return ctx;
    }
}
```

Example notes:

1. Load the SpringMVC container
2. Load the Spring container

Spring offers a simpler configuration: no need to create `AnnotationConfigWebApplicationContext` manually or `register` the corresponding configuration classes. How?

```java
public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
```

### Key concept 1: @ComponentScan :id=h-7325af04e305

| Name               | @ComponentScan                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Type               | Class annotation                                                                                                                                       |
| Location           | Above the class declaration                                                                                                                            |
| Purpose            | Sets the Spring component-scanning path to load annotation-defined beans                                                                               |
| Related attributes | excludeFilters: excludes beans in scanned packages; specify type and classes. <br/>includeFilters: includes specified beans; specify type and classes. |

<a id="section-3"></a>

## 3. Using PostMan :id=h-726d4546f15f

### 3.1 Introduction to PostMan :id=h-e2b5bccda3c2

To test the code, opening a browser and entering a URL sends a request. This works directly for `GET`, but what about `POST`?

Testing a post request would require a page and form, which is cumbersome. Instead, use a third-party tool such as PostMan.

- PostMan is a powerful Chrome plugin for web debugging and sending web HTTP requests. ![1630463382386](Resources/1630463382386.png)

- Purpose: commonly used for API testing

- Features
  - Simple
  - Practical
  - Attractive
  - Clean layout

### 3.2 Installing PostMan :id=h-ba63eb899b8c

Double-click `资料\Postman-win64-8.3.1-Setup.exe` to install automatically.

After installation, register if prompted. If a skip link appears at the bottom, you can use it to skip registration.

![1630463816424](Resources/1630463816424.png)

The following screen indicates successful installation.

![1630463887711](Resources/1630463887711.png)

### 3.3 Using PostMan :id=h-832c60624060

#### 3.3.1 Creating a WorkSpace workspace :id=h-68a712efc359

![](Resources/image-20210805150044862.png)

#### 3.3.2 Sending requests :id=h-335c379d9c3c

![1630464489898](Resources/1630464489898.png)

#### 3.3.3 Saving the current request :id=h-97be9616d3d8

![1630464783034](Resources/1630464783034.png)

\*\*Note:\*\* Create a new directory for the first request. Later requests can be saved directly to that directory.

<a id="section-4"></a>

## 4. Requests and responses :id=h-f4d3cb4f9745

After the introductory example, we will study SpringMVC systematically. As a web-layer framework, SpringMVC receives requests and data and returns results. This chapter is therefore a ==key topic== in SpringMVC, covering four areas:

- Request mapping paths
- Request parameters
- Passing date parameters
- Returning json data

### 4.1 Setting request mappings :id=h-81ff594c466c

#### 4.1.1 Preparing the environment :id=h-50063a75ff2c

- Create a Maven web project

- Add Spring dependencies to pom.xml.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_03_request_mapping</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- Create the corresponding configuration classes

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }
      protected String[] getServletMappings() {
          return new String[]{"/"};
      }
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  public class SpringMvcConfig {
  }

  ```

- Write BookController and UserController

  ```java
  @Controller
  public class UserController {

      @RequestMapping("/save")
      @ResponseBody
      public String save(){
          System.out.println("user save ...");
          return "{'module':'user save'}";
      }

      @RequestMapping("/delete")
      @ResponseBody
      public String save(){
          System.out.println("user delete ...");
          return "{'module':'user delete'}";
      }
  }

  @Controller
  public class BookController {

      @RequestMapping("/save")
      @ResponseBody
      public String save(){
          System.out.println("book save ...");
          return "{'module':'book save'}";
      }
  }
  ```

The completed project structure is as follows:

![1630466431549](Resources/1630466431549.png)

With the environment ready, start Tomcat; the backend reports an error:

![1630466555934](Resources/1630466555934.png)

The error indicates:

- UserController has a save method mapped to `http://localhost/save`.
- BookController also has a save method mapped to `http://localhost/save`.
- When accessing `http://localhost/saved`, should UserController or BookController run?

#### 4.1.2 Problem analysis :id=h-7aa2ef523be5

How do we resolve path conflicts when multiple team members develop different requests?

Approach: prefix request paths with module names.

Set Book's save path to `http://localhost/book/save`.

Set User's save path to `http://localhost/user/save`.

Name conflicts within one module are then less likely.

#### 4.1.3 Setting mapping paths :id=h-cc9c682429ae

##### Step 1: Modify the Controller :id=h-52ddcff5fdf6

```java
@Controller
public class UserController {

    @RequestMapping("/user/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'module':'user save'}";
    }

    @RequestMapping("/user/delete")
    @ResponseBody
    public String save(){
        System.out.println("user delete ...");
        return "{'module':'user delete'}";
    }
}

@Controller
public class BookController {

    @RequestMapping("/book/save")
    @ResponseBody
    public String save(){
        System.out.println("book save ...");
        return "{'module':'book save'}";
    }
}
```

This fixes the problem but requires editing every method and repeats code. If /user changes later, every method must change, creating excessive coupling.

##### Step 2: Improve path configuration :id=h-5323cc959d8a

Improved approach:

```java
@Controller
@RequestMapping("/user")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'module':'user save'}";
    }

    @RequestMapping("/delete")
    @ResponseBody
    public String save(){
        System.out.println("user delete ...");
        return "{'module':'user delete'}";
    }
}

@Controller
@RequestMapping("/book")
public class BookController {

    @RequestMapping("/save")
    @ResponseBody
    public String save(){
        System.out.println("book save ...");
        return "{'module':'book save'}";
    }
}
```

**Note:**

- With `@RequestMapping` on both the class and method, the request must match their combined value paths.
- The leading `/` in @RequestMapping's value is optional.

Extra tip:

If text in PostMan looks too small, use `ctrl+=` to enlarge it and `ctrl+-` to shrink it.

### 4.2 Request parameters :id=h-cad01d63d8a5

Once request paths match the Controller configuration, the backend receives frontend requests. How does it receive parameters sent by the page?

Passing and receiving parameters depends on the request method. The two common methods are:

- GET
- POST

For each method, how does the frontend send data and the backend receive it?

#### 4.2.1 Preparing the environment :id=h-ad524d99cb1d

- Create a Maven web project

- Add Spring dependencies to pom.xml.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_03_request_mapping</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- Create the corresponding configuration classes

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }
      protected String[] getServletMappings() {
          return new String[]{"/"};
      }
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  public class SpringMvcConfig {
  }

  ```

- Write UserController

  ```java
  @Controller
  public class UserController {

      @RequestMapping("/commonParam")
      @ResponseBody
      public String commonParam(){
          return "{'module':'commonParam'}";
      }
  }
  ```

* Write the User and Address model classes

  ```java
  public class Address {
      private String province;
      private String city;
      // See note 1 below.
  }
  public class User {
      private String name;
      private int age;
      // See note 2 below.
  }
  ```

Example notes:

1. setter...getter... omitted
2. setter...getter... omitted

The completed project structure is as follows:

![1630467830654](Resources/1630467830654.png)

#### 4.2.2 Parameter passing :id=h-097f3bb2b302

##### GET Sending one parameter :id=h-e82ea5564664

Send the request and parameters:

```
http://localhost/commonParam?name=itcast
```

![1630467921300](Resources/1630467921300.png)

Receive parameters:

```java
@Controller
public class UserController {

    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name){
        System.out.println("普通参数传递 name ==> "+name);
        return "{'module':'commonParam'}";
    }
}
```

##### GET Sending multiple parameters :id=h-fe636cf1dd54

Send the request and parameters:

```
http://localhost/commonParam?name=itcast&age=15
```

![1630468045733](Resources/1630468045733.png)

Receive parameters:

```java
@Controller
public class UserController {

    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name,int age){
        System.out.println("普通参数传递 name ==> "+name);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'commonParam'}";
    }
}
```

##### GET Chinese character encoding issues :id=h-f2679c408e5c

If parameters contain Chinese characters, the received values may be garbled.

Send request: `http://localhost/commonParam?name=张三&age=18`

Console:

![1630480536510](Resources/1630480536510.png)

Tomcat versions after 8.5 already handle this encoding issue, but IDEA's Tomcat plugin currently goes only up to Tomcat 7. Modify pom.xml to fix Chinese encoding in GET requests.

```xml
<build>
    <plugins>
      <plugin>
        <groupId>org.apache.tomcat.maven</groupId>
        <artifactId>tomcat7-maven-plugin</artifactId>
        <version>2.1</version>
        <configuration>
          <port>80</port><!-- See note 1 below. -->
          <path>/</path> <!-- See note 2 below. -->
          <uriEncoding>UTF-8</uriEncoding><!-- See note 3 below. -->
        </configuration>
      </plugin>
    </plugins>
  </build>
```

Example notes:

1. Tomcat port
2. Context path
3. Character set for request-path encoding and decoding

##### POST Sending parameters :id=h-3788397f4e90

Send the request and parameters:

![1630480812809](Resources/1630480812809.png) Receive parameters:

Same as GET; no changes needed.

```java
@Controller
public class UserController {

    @RequestMapping("/commonParam")
    @ResponseBody
    public String commonParam(String name,int age){
        System.out.println("普通参数传递 name ==> "+name);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'commonParam'}";
    }
}
```

##### POST Chinese character encoding issues :id=h-40c4b568c9b0

Send the request and parameters:

![1630480964421](Resources/1630480964421.png)

Receive parameters:

The console output shows garbled Chinese characters.

![1630481008109](Resources/1630481008109.png)

Solution: configure a filter

```java
public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
    protected Class<?>[] getRootConfigClasses() {
        return new Class[0];
    }

    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    // See note 1 below.
    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("UTF-8");
        return new Filter[]{filter};
    }
}
```

Example notes:

1. Character encoding handling

CharacterEncodingFilter belongs to spring-web; import the corresponding jar before using it.

### 4.3 Passing five parameter types :id=h-98a3e2c7cb86

We can send simple requests and data through GET or POST. Next, examine more complex parameter passing. Common types are:

- Ordinary parameters
- POJO parameters
- Nested POJO parameters
- Array parameters
- Collection parameters

How do we send and receive these parameters? Let's study them one by one.

#### 4.3.1 Ordinary parameters :id=h-7e37041e19cc

- Ordinary URL parameters: when query parameter names match method parameter names, declare method parameters to receive them.

![1630481585729](Resources/1630481585729.png)

What if the method and URL parameter names differ?

Send the request and parameters:

```
http:// See note 1 below.
```

Example notes:

1. localhost/commonParamDifferentName?name=Zhang%20San\&age=18

Receive parameters on the backend:

```java
@RequestMapping("/commonParamDifferentName")
@ResponseBody
public String commonParamDifferentName(String userName , int age){
    System.out.println("普通参数传递 userName ==> "+userName);
    System.out.println("普通参数传递 age ==> "+age);
    return "{'module':'common param different name'}";
}
```

The frontend sends `name`, but the backend uses `userName`. Mismatched names cause binding to fail:

![1630481772035](Resources/1630481772035.png)

Solution: use @RequestParam

```java
@RequestMapping("/commonParamDifferentName")
    @ResponseBody
    public String commonParamDifferentName(@RequestPaam("name") String userName , int age){
        System.out.println("普通参数传递 userName ==> "+userName);
        System.out.println("普通参数传递 age ==> "+age);
        return "{'module':'common param different name'}";
    }
```

**@RequestParam specifies the binding name, whether the parameter is required, and its default value. The framework still reads and converts parameters; this does not guarantee a performance improvement.**

#### 4.3.2 POJO data type :id=h-4e24eefaeb4a

Simple types work well for requests with few parameters. With many parameters, backend handling becomes cumbersome; consider POJO.

- POJO parameters: if request parameter names match object properties, declare a POJO method parameter to receive them.

Use the POJO class prepared earlier. First, examine User.

```java
public class User {
    private String name;
    private int age;
    // See note 1 below.
}
```

Example notes:

1. setter...getter... omitted

Send the request and parameters:

![1630482186745](Resources/1630482186745.png)

Receive parameters on the backend:

```java
// See note 1 below.
@RequestMapping("/pojoParam")
@ResponseBody
public String pojoParam(User user){
    System.out.println("pojo参数传递 user ==> "+user);
    return "{'module':'pojo param'}";
}
```

Example notes:

1. POJO parameters: pass data by matching request parameters to object properties.

**Note:**

- When receiving POJO, frontend GET and POST requests remain unchanged.
- \==Request parameter keys must match POJO property names; otherwise, binding fails.==

#### 4.3.3 Nested POJO parameters :id=h-51511b35b684

If a POJO contains other POJO classes, for example:

```java
public class Address {
    private String province;
    private String city;
    // See note 1 below.
}
public class User {
    private String name;
    private int age;
    private Address address;
    // See note 2 below.
}
```

Example notes:

1. setter...getter... omitted
2. setter...getter... omitted

- Nested POJO parameters: match request names to object properties using the object hierarchy to receive nested POJO properties.

Send the request and parameters:

![1630482363291](Resources/1630482363291.png)

Receive parameters on the backend:

```java
// See note 1 below.
@RequestMapping("/pojoParam")
@ResponseBody
public String pojoParam(User user){
    System.out.println("pojo参数传递 user ==> "+user);
    return "{'module':'pojo param'}";
}
```

Example notes:

1. POJO parameters: pass data by matching request parameters to object properties.

**Note:**

\==Request parameter keys must match POJO property names; otherwise, binding fails.==

#### 4.3.4 Array parameters :id=h-766c34e2907e

For example, user interests usually contain multiple values. How should the frontend send them and the backend receive them?

- Array parameters: multiple request values with the same name can be received by declaring an array with that name.

Send the request and parameters:

![1630482999626](Resources/1630482999626.png)

Receive parameters on the backend:

```java
  // See note 1 below.
    @RequestMapping("/arrayParam")
    @ResponseBody
    public String arrayParam(String[] likes){
        System.out.println("数组参数传递 likes ==> "+ Arrays.toString(likes));
        return "{'module':'array param'}";
    }
```

Example notes:

1. Repeated request parameters map directly to a method parameter array with the matching name.

#### 4.3.5 Collection parameters :id=h-2a6c1db1b020

Arrays can receive multiple values; can collections do the same?

Send the request and parameters:

![1630484283773](Resources/1630484283773.png)

Receive parameters on the backend:

```java
// See note 1 below.
@RequestMapping("/listParam")
@ResponseBody
public String listParam(List<String> likes){
    System.out.println("集合参数传递 likes ==> "+ likes);
    return "{'module':'list param'}";
}
```

Example notes:

1. Collection parameters: @RequestParam maps repeated request parameters to a collection with the matching name.

Running this causes an error.

![1630484339065](Resources/1630484339065.png)

SpringMVC treats List as a POJO object, attempts to instantiate it, and plans to bind frontend data into it. However, List is an interface and cannot be instantiated, causing the error.

Solution: use `@RequestParam`.

```java
// See note 1 below.
@RequestMapping("/listParam")
@ResponseBody
public String listParam(@RequestParam List<String> likes){
    System.out.println("集合参数传递 likes ==> "+ likes);
    return "{'module':'list param'}";
}
```

Example notes:

1. Collection parameters: @RequestParam maps repeated request parameters to a collection with the matching name.

- For ordinary values in a collection, use repeated request parameters matching the collection parameter name and bind them with @RequestParam.
- For simple types, arrays are easier to use than collections.

### Key concept 1: @RequestParam :id=h-9057a07e1475

| Name               | @RequestParam                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Type               | Parameter annotation                                                                     |
| Location           | Before a SpringMVC controller method parameter declaration                               |
| Purpose            | Binds request parameters to handler method parameters                                    |
| Related parameters | required: whether the parameter is mandatory. <br/>defaultValue: default parameter value |

### 4.4 JSON data transfer parameters :id=h-cfb507da46bd

As discussed, asynchronous calls are common. Frontend/backend asynchronous exchanges use ==JSON== data. If the frontend sends JSON, how should the backend receive it?

There are three common JSON data forms:

- json array of ordinary values (\["value1","value2","value3",...])
- json object ({key1:value1,key2:value2,...})
- json object array (\[{key1:value1,...},{key2:value2,...}])

How does the frontend send these, and how does the backend receive them?

#### JSON array of ordinary values :id=h-7da21e18d33d

###### Step 1: Add the dependency to pom.xml :id=h-cd162a18fc1b

SpringMVC uses jackson for json conversion by default, so add jackson to pom.xml.

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.0</version>
</dependency>
```

###### Step 2: Send JSON using PostMan :id=h-361743632899

![1630485135061](Resources/1630485135061.png)

###### Step 3: Enable SpringMVC annotation support :id=h-6f522a5aff98

Enable SpringMVC annotation support in SpringMVC's configuration. This includes conversion of JSON to objects.

```java
@Configuration
@ComponentScan("com.itheima.controller")
// See note 1 below.
@EnableWebMvc
public class SpringMvcConfig {
}
```

Example notes:

1. Enable automatic json conversion

###### Step 4: Add @RequestBody before the parameter :id=h-30af182c03ec

```java
// See note 1 below.
@RequestMapping("/listParamForJson")
@ResponseBody
public String listParamForJson(@RequestBody List<String> likes){
    System.out.println("list common(json)参数传递 list ==> "+likes);
    return "{'module':'list common for json param'}";
}
```

Example notes:

1. Use @RequestBody to map incoming json array data to a collection method parameter.

###### Step 5: Start the program :id=h-f997b6932cb1

![1630492624684](Resources/1630492624684.png)

Passing a JSON array is complete. How do we pass a JSON object or JSON object array?

#### JSON object data :id=h-f1287df76e78

We only need to focus on sending requests and data and receiving the data on the backend.

Send the request and data:

```json
{
    "name":"itcast",
    "age":15
}
```

![1630493105450](Resources/1630493105450.png)

Receive data on the backend:

```java
@RequestMapping("/pojoParamForJson")
@ResponseBody
public String pojoParamForJson(@RequestBody User user){
    System.out.println("pojo(json)参数传递 user ==> "+user);
    return "{'module':'pojo for json param'}";
}
```

Start the program and test access

![1630493233550](Resources/1630493233550.png)

**Explanation:**

address is null because the frontend did not send its data.

To populate address, change the data sent by the frontend:

```json
{
    "name":"itcast",
    "age":15,
    "address":{
        "province":"beijing",
        "city":"beijing"
    }
}
```

Send the request again to see the address data.

![1630493450694](Resources/1630493450694.png)

#### JSON object arrays :id=h-2b7275aaa10e

How can a collection hold multiple POJO objects?

Send the request and data:

```json
[
    {"name":"itcast","age":15},
    {"name":"itheima","age":12}
]
```

![1630493501205](Resources/1630493501205.png)

Receive data on the backend:

```java
@RequestMapping("/listPojoParamForJson")
@ResponseBody
public String listPojoParamForJson(@RequestBody List<User> list){
    System.out.println("list pojo(json)参数传递 list ==> "+list);
    return "{'module':'list pojo for json param'}";
}
```

Start the program and test access

![1630493561137](Resources/1630493561137.png)

**Summary**

Steps for receiving JSON with SpringMVC:

(1) Import jackson.

(2) Send JSON with PostMan.

(3) Enable SpringMVC annotation support by adding @EnableWebMvc to the configuration class.

(4) Add @RequestBody before the Controller method parameter.

#### Key concept 1: @EnableWebMvc :id=h-b2c2a67e356c

| Name     | @EnableWebMvc                                     |
| -------- | ------------------------------------------------- |
| Type     | ==Configuration class annotation==                |
| Location | Above a SpringMVC configuration class declaration |
| Purpose  | Enables multiple SpringMVC support features       |

#### Key concept 2: @RequestBody :id=h-4abe6bf097b3

| Name     | @RequestBody                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------- |
| Type     | ==Parameter annotation==                                                                          |
| Location | Before a SpringMVC controller method parameter declaration                                        |
| Purpose  | Passes request-body data to a method parameter; use this annotation only once per handler method. |

#### @RequestBody versus @RequestParam :id=h-b2358104d4dc

- Differences
  - @RequestParam receives URL and form parameters \[ application/x-www-form-urlencoded ]
  - @RequestBody receives json data \[ application/json ]

- Usage
  - Later development mainly sends json, so @RequestBody is widely used.
  - For non-json data, use @RequestParam to receive request parameters.

### 4.5 Passing date parameters :id=h-39e3cd664ea3

We have handled simple types, POJO, arrays, collections, and JSON. Next is another common type: `日期类型`.

Dates are special because they have many possible input formats, for example:

- 2088-08-18
- 2088/08/18
- 08/18/2088
- ......

How can SpringMVC receive so many date formats? Can it handle dates correctly?

#### Step 1: Write a method accepting date data :id=h-d249b4247e05

Add a method to UserController with a date-type parameter.

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date) {
    System.out.println("参数传递 date ==> "+date);
    return "{'module':'data param'}";
}
```

#### Step 2: Start Tomcat :id=h-6297717ef14a

Check the console and resolve any errors first.

#### Step 3: Send a request using PostMan :id=h-c1141b2893a3

Send a GET request with PostMan, specifying date.

`http://localhost/dataParam?date=2088/08/08`

![1630494320917](Resources/1630494320917.png)

#### Step 4: Check the console :id=h-92ab338725b6

![1630494443738](Resources/1630494443738.png)

The output shows that SpringMVC can receive dates and print them in the console.

What if we change the date format? Can SpringMVC still handle it?

#### Step 5: Change the date format :id=h-453380f82468

Add another date parameter to make the result easier to observe.

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,Date date1) {
    System.out.println("参数传递 date ==> "+date);
    return "{'module':'data param'}";
}
```

Send a request using PostMan with two different date formats.

`http://localhost/dataParam?date=2088/08/08&date1=2088-08-08`

![1630494565970](Resources/1630494565970.png)

After sending the request and data, the page reports 400 and the console shows an error.

Resolved \[org.springframework.web.method.annotation.==MethodArgumentTypeMismatchException==: Failed to convert value of type 'java.lang.String' to required type 'java.util.Date'; nested exception is org.springframework.core.convert.==ConversionFailedException==: Failed to convert from type \[java.lang.String] to type \[java.util.Date] for value '2088-08-08'; nested exception is java.lang.IllegalArgumentException]

The error shows that converting `2088-08-08` to a date failed: SpringMVC's default string-to-date format is `yyyy/MM/dd`, and the supplied value does not match it. SpringMVC therefore cannot convert it.

The solution is to use `@DateTimeFormat`.

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,
                        @DateTimeFormat(pattern="yyyy-MM-dd") Date date1) {
    System.out.println("参数传递 date ==> "+date);
    System.out.println("参数传递 date1(yyyy-MM-dd) ==> "+date1);
    return "{'module':'data param'}";
}
```

Restart the server and resend the request; SpringMVC now converts the date correctly.

![1630495221038](Resources/1630495221038.png)

#### Step 6: A date containing a time :id=h-5fe451d6051c

Next, send a date containing a time and see how SpringMVC handles it.

Modify UserController to add a third parameter.

```java
@RequestMapping("/dataParam")
@ResponseBody
public String dataParam(Date date,
                        @DateTimeFormat(pattern="yyyy-MM-dd") Date date1,
                        @DateTimeFormat(pattern="yyyy/MM/dd HH:mm:ss") Date date2) {
    System.out.println("参数传递 date ==> "+date);
    System.out.println("参数传递 date1(yyyy-MM-dd) ==> "+date1);
    System.out.println("参数传递 date2(yyyy/MM/dd HH:mm:ss) ==> "+date2);
    return "{'module':'data param'}";
}
```

Send a request using PostMan with two different date formats.

`http://localhost/dataParam?date=2088/08/08&date1=2088-08-08&date2=2088/08/08 8:08:08`

![1630495347289](Resources/1630495347289.png)

Restart the server and resend the request; SpringMVC converts the date/time data.

![1630495507353](Resources/1630495507353.png)

#### Key concept 1: @DateTimeFormat :id=h-56af45ab43d8

| Name               | @DateTimeFormat                                |
| ------------------ | ---------------------------------------------- |
| Type               | ==Parameter annotation==                       |
| Location           | Before a SpringMVC controller method parameter |
| Purpose            | Defines the format of date/time data           |
| Related attributes | pattern: date/time format string               |

#### How it works internally :id=h-e048128ffd80

Before discussing the implementation, consider:

- The frontend sends a string; the backend receives a Date.
- The frontend sends JSON; the backend receives an object.
- The frontend sends a string; the backend receives an Integer.
- The backend needs many different data types.
- Many type conversions take place during data transfer.

Question: Who performs these conversions?

Answer: SpringMVC

Question: How does SpringMVC convert types?

Answer: SpringMVC provides many conversion interfaces and implementations.

Framework conversion interfaces include:

- (1) Converter interface

```java
/**
*	S: the source type
*	T: the target type
*/
public interface Converter<S, T> {
    @Nullable
    // See note 1 below.
    T convert(S source);
}
```

Example notes:

1. This method converts received page data (S) into the required type (T) and returns it.

**Note: Converter belongs to `org.springframework.core.convert.converter`.**

Converter implementations

![1630496385398](Resources/1630496385398.png)

The framework provides many Converter implementations for different type conversions, for example:

Age request parameter (String → Integer)

Date conversion (String → Date)

- (2) HttpMessageConverter interface

This interface converts between objects and JSON.

**Use @EnableWebMvc for the manual Spring MVC configuration in this section. Spring Boot normally auto-configures MVC support; adding this annotation directly takes over MVC configuration, so do not copy it indiscriminately.**

### 4.6 Responses :id=h-1e9e0d6dbfac

After receiving requests and data, SpringMVC processes them, possibly by delegating to Service, which calls Dao. Whatever the processing path, the result must be returned to the user.

For example: query a user by ID, list users, or add a user.

Responses mainly include two categories:

- Return a page
- Return data
  - Text data
  - json data

Since asynchronous calls are common, focus on returning JSON; awareness of the other response types is sufficient here.

#### 4.6.1 Preparing the environment :id=h-9a1e642f3e7a

- Create a Maven web project

- Add Spring dependencies to pom.xml.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_05_response</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- Create the corresponding configuration classes

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }

      protected String[] getServletMappings() {
          return new String[]{"/"};
      }

      // See note 1 below.
      @Override
      protected Filter[] getServletFilters() {
          CharacterEncodingFilter filter = new CharacterEncodingFilter();
          filter.setEncoding("UTF-8");
          return new Filter[]{filter};
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  // See note 2 below.
  @EnableWebMvc
  public class SpringMvcConfig {
  }


  ```

Example notes:

1. Character encoding handling
2. Enable automatic json conversion

- Write the User model class

  ```java
  public class User {
      private String name;
      private int age;
      // See note 1 below.
  }
  ```

Example notes:

1. getter...setter...toString omitted

- Create page.jsp under webapp

  ```jsp
  <html>
  <body>
  <h2>Hello Spring MVC!</h2>
  </body>
  </html>
  ```

- Write UserController

  ```java
  @Controller
  public class UserController {


  }
  ```

The completed project structure is as follows:

![1630497314131](Resources/1630497314131.png)

#### 4.6.2 Returning a page (overview) :id=h-744e48f7a30d

##### Step 1: Set the returned page :id=h-d5e3d3eca44e

```java
@Controller
public class UserController {

    @RequestMapping("/toJumpPage")
    // See note 1 below.
    // See note 2 below.
    // See note 3 below.
    public String toJumpPage(){
        System.out.println("跳转页面");
        return "page.jsp";
    }

}
```

Example notes:

1. Note
2. 1\. Do not add @ResponseBody here; otherwise, page.jsp is returned directly as text.
3. 2\. The method must return String.

##### Step 2: Start the application and test :id=h-b99acba3b355

Because this involves page navigation, PostMan is unsuitable for this test. Open a browser and enter:

`http://localhost/toJumpPage`

![1630497496785](Resources/1630497496785.png)

#### 4.6.3 Returning text (overview) :id=h-aada80c5e31c

##### Step 1: Set the response text :id=h-f45cecc85013

```java
@Controller
public class UserController {

       @RequestMapping("/toText")
    // See note 1 below.
    @ResponseBody
    public String toText(){
        System.out.println("返回纯文本数据");
        return "response text";
    }

}
```

Example notes:

1. Do not omit the annotation here. Without it, response text is treated as a page name; if no such page exists, a 404 occurs.

##### Step 2: Start the application and test :id=h-6d20d6663e07

This involves no page navigation. Since the request is GET, test using a browser or PostMan at `http://localhost/toText`.

![1630497741388](Resources/1630497741388.png)

#### 4.6.4 Returning JSON data :id=h-2a84ac809dc8

##### Return a POJO object :id=h-b3a896ecbf1f

```java
@Controller
public class UserController {

    @RequestMapping("/toJsonPOJO")
    @ResponseBody
    public User toJsonPOJO(){
        System.out.println("返回json对象数据");
        User user = new User();
        user.setName("itcast");
        user.setAge(15);
        return user;
    }

}
```

Return an entity object with the corresponding entity return type to produce its json data. This requires ==@ResponseBody== and ==@EnableWebMvc==.

Restart the server and access `http://localhost/toJsonPOJO`.

![1630497954896](Resources/1630497954896.png)

##### Return a POJO collection :id=h-c36f48bd4d2f

```java
@Controller
public class UserController {

    @RequestMapping("/toJsonList")
    @ResponseBody
    public List<User> toJsonList(){
        System.out.println("返回json集合数据");
        User user1 = new User();
        user1.setName("传智播客");
        user1.setAge(15);

        User user2 = new User();
        user2.setName("黑马程序员");
        user2.setAge(12);

        List<User> userList = new ArrayList<User>();
        userList.add(user1);
        userList.add(user2);

        return userList;
    }

}

```

Restart the server and access `http://localhost/toJsonList`.

![1630498084047](Resources/1630498084047.png)

#### Key concept 1: @ResponseBody :id=h-45ccf0a62d0d

| Name               | @ResponseBody                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Type               | ==Method/class annotation==                                                                                            |
| Location           | Above a SpringMVC controller method or controller class declaration                                                    |
| Purpose            | Uses the controller return value as the response body. When <br/> is on the class, all its methods gain this behavior. |
| Related attributes | None; the response format depends on HttpMessageConverter and the response Content-Type.                               |

**Explanation:**

- This annotation can be applied to a class or method.
- On a class, every method gains @ReponseBody behavior.
- When a method has @ReponseBody:
  - A string return value is sent directly as response text.
  - An object return value is converted to JSON and returned.

This uses conversion again, through HttpMessageConverter implementations such as Jackson's JSON converter. In addition to the earlier functions, converters can perform:

- Object to Json (POJO → json)
- Collection to Json (Collection → json)

<a id="section-5"></a>

## 5. REST style :id=h-70980392f15c

The REST topics to learn are:

- Introduction to REST
- REST starter example
- Rapid development with REST
- Example: page data interaction based on RESTful

### 5.1 Introduction to REST :id=h-1a51ac79ec3d

- \==REST== (Representational State Transfer) is a software architecture ==style==.

  There are two ways to represent a network resource:

  - Traditional resource URLs
    - `http://localhost/user/getById?id=1` Query the user with id 1
    - `http://localhost/user/saveUser` Save user information
  - REST-style resource URLs
    - `http://localhost/user/1`
    - `http://localhost/user`

Traditionally, one request URL corresponds to one operation. This is cumbersome and insecure: someone who knows programming can read the URL and roughly infer the operation it performs.

With REST-style URLs, request addresses become simpler, and looking at the request URL alone does not readily reveal the specific function of that URL.

The advantages of REST are:

- Hides the access action: the address alone does not reveal the operation on the resource
- Simpler URLs

But if one URL can mean insertion, update, or query, how do we distinguish the requested operation?

- Accessing resources in REST style uses ==actions== to distinguish operations.
  - `http://localhost/users` Query all users GET (query)
  - `http://localhost/users/1` Query a specified user GET (query)
  - `http://localhost/users` Add user information POST (insert/save)
  - `http://localhost/users` Update user information PUT (modify/update)
  - `http://localhost/users/1` Delete user information DELETE (delete)

There are many request methods, but four are common: `GET`, `POST`, `PUT`, and `DELETE`.

Different methods represent different operation types.

- GET requests query data.
- POST requests add data.
- PUT requests update data.
- DELETE requests delete data.

However, ==note:==

- These actions are conventions rather than an enforceable specification and can be broken; hence REST style, rather than REST specification.
  - REST provides an architectural approach that can reduce development complexity and improve scalability.
  - REST associates GET/POST/PUT/DELETE with query/insert/update/delete. It is technically possible to implement deletion using GET, however.
  - If most people follow this style, departing from it makes your code confusing to others.
- Module names usually use plurals ending in s to represent a resource type rather than one item, such as users, books, or accounts.

After understanding REST, another common term is `RESTful`. What is RESTful?

- Accessing resources according to REST is called ==RESTful==.

Later development will usually access backend services in REST style, so we will mainly develop based on RESTful.

### 5.2 RESTful starter example :id=h-6e4d6143117d

#### 5.2.1 Preparing the environment :id=h-f05bd22c977f

- Create a Maven web project

- Add Spring dependencies to pom.xml.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_06_rest</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- Create the corresponding configuration classes

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }

      protected String[] getServletMappings() {
          return new String[]{"/"};
      }

      // See note 1 below.
      @Override
      protected Filter[] getServletFilters() {
          CharacterEncodingFilter filter = new CharacterEncodingFilter();
          filter.setEncoding("UTF-8");
          return new Filter[]{filter};
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  // See note 2 below.
  @EnableWebMvc
  public class SpringMvcConfig {
  }


  ```

Example notes:

1. Character encoding handling
2. Enable automatic json conversion

- Write the User and Book model classes

  ```java
  public class User {
      private String name;
      private int age;
      // See note 1 below.
  }

  public class Book {
      private String name;
      private double price;
       // See note 2 below.
  }
  ```

Example notes:

1. getter...setter...toString omitted
2. getter...setter...toString omitted

- Write UserController and BookController

  ```java
  @Controller
  public class UserController {
      @RequestMapping("/save")
      @ResponseBody
      public String save(@RequestBody User user) {
          System.out.println("user save..."+user);
          return "{'module':'user save'}";
      }

      @RequestMapping("/delete")
      @ResponseBody
      public String delete(Integer id) {
          System.out.println("user delete..." + id);
          return "{'module':'user delete'}";
      }

      @RequestMapping("/update")
      @ResponseBody
      public String update(@RequestBody User user) {
          System.out.println("user update..." + user);
          return "{'module':'user update'}";
      }

      @RequestMapping("/getById")
      @ResponseBody
      public String getById(Integer id) {
          System.out.println("user getById..." + id);
          return "{'module':'user getById'}";
      }

      @RequestMapping("/findAll")
      @ResponseBody
      public String getAll() {
          System.out.println("user getAll...");
          return "{'module':'user getAll'}";
      }
  }


  @Controller
  public class BookController {

      @RequestMapping(value = "/books",method = RequestMethod.POST)
      @ResponseBody
      public String save(@RequestBody Book book){
          System.out.println("book save..." + book);
          return "{'module':'book save'}";
      }

      @RequestMapping(value = "/books/{id}",method = RequestMethod.DELETE)
      @ResponseBody
      public String delete(@PathVariable Integer id){
          System.out.println("book delete..." + id);
          return "{'module':'book delete'}";
      }

      @RequestMapping(value = "/books",method = RequestMethod.PUT)
      @ResponseBody
      public String update(@RequestBody Book book){
          System.out.println("book update..." + book);
          return "{'module':'book update'}";
      }

      @RequestMapping(value = "/books/{id}",method = RequestMethod.GET)
      @ResponseBody
      public String getById(@PathVariable Integer id){
          System.out.println("book getById..." + id);
          return "{'module':'book getById'}";
      }

      @RequestMapping(value = "/books",method = RequestMethod.GET)
      @ResponseBody
      public String getAll(){
          System.out.println("book getAll...");
          return "{'module':'book getAll'}";
      }

  }
  ```

The completed project structure is as follows:

![1630503741455](Resources/1630503741455.png)

#### 5.2.2 Analyzing the approach :id=h-08de1e174641

> Requirement: Replace the previous CRUD approach with RESTful.
>
> 1\. Previously, requests had different paths. Replace them with a common request path.
>
> Before: insert /save, update /update, delete /delete, ...
>
> After: CRUD /users
>
> 2\. Restrict methods by request type: GET for query, POST for insert, PUT for update, DELETE for delete.
>
> 3\. How should request parameters be supplied?

#### 5.2.3 Changing to RESTful style :id=h-ac1af51bddb9

##### Add :id=h-139ed1c14784

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users",method = RequestMethod.POST)
    @ResponseBody
    public String save() {
        System.out.println("user save...");
        return "{'module':'user save'}";
    }
}
```

Example notes:

1. Set the request method to POST, representing insertion in REST style

- Change the request path to `/users`.

  - Access this method using POST: `http://localhost/users`

- Use method to restrict access to `POST`.

  - A different method, such as GET instead of POST, produces an error.

    ![1630505392070](Resources/1630505392070.png)

##### Delete :id=h-46b3e2d7c083

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(Integer id) {
        System.out.println("user delete..." + id);
        return "{'module':'user delete'}";
    }
}
```

Example notes:

1. Set the request method to DELETE, representing deletion in REST style

- Change the request path to `/users`.
  - Access this method using DELETE: `http://localhost/users`

Access succeeds, but the delete method has no id. How do we pass data in RESTful development?

###### Passing path parameters :id=h-add8b6964574

The frontend sends `http://localhost/users/1`; `1` in the path is the parameter to pass.

To receive it on the backend, make these changes:

- Change @RequestMapping's value to `/users/{id}` to match the path.
- Add @PathVariable before the method parameter.

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users/{id}",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable Integer id) {
        System.out.println("user delete..." + id);
        return "{'module':'user delete'}";
    }
}
```

Example notes:

1. Set the request method to DELETE, representing deletion in REST style

**Consider these two questions:**

(1) What if the method parameter name differs from the value in the path's `{}`?

![1630506231379](Resources/1630506231379.png)

(2) How do we pass multiple parameters?

The frontend sends `http://localhost/users/1/tom`, with `1` and `tom` as the two path parameters.

To receive them on the backend, make these changes:

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users/{id}/{name}",method = RequestMethod.DELETE)
    @ResponseBody
    public String delete(@PathVariable Integer id,@PathVariable String name) {
        System.out.println("user delete..." + id+","+name);
        return "{'module':'user delete'}";
    }
}
```

Example notes:

1. Set the request method to DELETE, representing deletion in REST style

##### Update :id=h-eda12bccaf46

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users",method = RequestMethod.PUT)
    @ResponseBody
    public String update(@RequestBody User user) {
        System.out.println("user update..." + user);
        return "{'module':'user update'}";
    }
}
```

Example notes:

1. Set the request method to PUT, representing update in REST style

- Change the request path to `/users`.

  - Access this method using PUT: `http://localhost/users`

- Access with parameters:

  ![1630506507096](Resources/1630506507096.png)

##### Query by ID :id=h-df00cbe14ced

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users/{id}" ,method = RequestMethod.GET)
    @ResponseBody
    public String getById(@PathVariable Integer id){
        System.out.println("user getById..."+id);
        return "{'module':'user getById'}";
    }
}
```

Example notes:

1. Set the request method to GET, representing query in REST style

Change the request path to `/users`.

- Access this method using GET: `http://localhost/users/666`

##### Query all records :id=h-9944f3d2644b

```java
@Controller
public class UserController {
    // See note 1 below.
    @RequestMapping(value = "/users" ,method = RequestMethod.GET)
    @ResponseBody
    public String getAll() {
        System.out.println("user getAll...");
        return "{'module':'user getAll'}";
    }
}
```

Example notes:

1. Set the request method to GET, representing query in REST style

Change the request path to `/users`.

- Access this method using GET: `http://localhost/users`

**Summary**

The RESTful starter example covers:

(1) Setting HTTP request actions (verbs)

@RequestMapping(value="",==method== = RequestMethod.==POST|GET|PUT|DELETE==)

(2) Setting request parameters (path variables)

@RequestMapping(value="/users/=={id}==",method = RequestMethod.DELETE)

@ReponseBody

public String delete(==@PathVariable== Integer ==id==){

}

#### Key concept 1: @PathVariable :id=h-14ecd1ce5e54

| Name     | @PathVariable                                                                               |
| -------- | ------------------------------------------------------------------------------------------- |
| Type     | ==Parameter annotation==                                                                    |
| Location | Before a SpringMVC controller method parameter declaration                                  |
| Purpose  | Binds path parameters to handler method parameters; their names must correspond one to one. |

We have learned three parameter annotations: `@RequestBody`, `@RequestParam`, and `@PathVariable`. How do they differ, and when is each used?

- Differences
  - @RequestParam receives URL or form parameters.
  - @RequestBody receives json data.
  - @PathVariable receives path parameters, written as {parameterName}.
- Usage
  - When sending more than one parameter later, json will be the main format and @RequestBody will be widely used.
  - For non-json data, use @RequestParam to receive request parameters.
  - For RESTful development with few parameters, such as one id, use @PathVariable to receive a path variable.

### 5.3 Rapid development with RESTful :id=h-2fa6e92cfc59

After implementing RESTful, you may find it ==cumbersome==. Why?

![1630507339724](Resources/1630507339724.png)

Problem 1: Every method's @RequestMapping repeats the /books path.

Problem 2: Every method's @RequestMapping repeats method to specify the request type.

Problem 3: Every json-returning method repeats @ResponseBody.

How can we solve these three problems?

```java
@RestController //@Controller + ReponseBody
@RequestMapping("/books")
public class BookController {

    //@RequestMapping(method = RequestMethod.POST)
    @PostMapping
    public String save(@RequestBody Book book){
        System.out.println("book save..." + book);
        return "{'module':'book save'}";
    }

    //@RequestMapping(value = "/{id}",method = RequestMethod.DELETE)
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id){
        System.out.println("book delete..." + id);
        return "{'module':'book delete'}";
    }

    //@RequestMapping(method = RequestMethod.PUT)
    @PutMapping
    public String update(@RequestBody Book book){
        System.out.println("book update..." + book);
        return "{'module':'book update'}";
    }

    //@RequestMapping(value = "/{id}",method = RequestMethod.GET)
    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("book getById..." + id);
        return "{'module':'book getById'}";
    }

    //@RequestMapping(method = RequestMethod.GET)
    @GetMapping
    public String getAll(){
        System.out.println("book getAll...");
        return "{'module':'book getAll'}";
    }

}
```

Each problem has a corresponding solution:

Problem 1: Every method's @RequestMapping repeats the /books path.

```
将@RequestMapping提到类上面，用来定义所有方法共同的访问路径。
```

Problem 2: Every method's @RequestMapping repeats method to specify the request type.

```
使用@GetMapping  @PostMapping  @PutMapping  @DeleteMapping代替
```

Problem 3: Every json-returning method repeats @ResponseBody.

```
1.将ResponseBody提到类上面，让所有的方法都有@ResponseBody的功能
2.使用@RestController注解替换@Controller与@ResponseBody注解，简化书写
```

#### Key concept 1: @RestController :id=h-d35411730c1e

| Name     | @RestController                                                                      |
| -------- | ------------------------------------------------------------------------------------ |
| Type     | ==Class annotation==                                                                 |
| Location | Above a RESTful controller class declaration based on SpringMVC                      |
| Purpose  | Marks the controller as RESTful-style; <br/> combines @Controller and @ResponseBody. |

#### Key concept 2: @GetMapping @PostMapping @PutMapping @DeleteMapping :id=h-8c9bd2cd6ac7

| Name               | @GetMapping @PostMapping @PutMapping @DeleteMapping                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Type               | ==Method annotation==                                                                                                    |
| Location           | Above a RESTful controller method declaration based on SpringMVC                                                         |
| Purpose            | Sets the request path and action. Each annotation corresponds to one action; <br/> for example, @GetMapping maps to GET. |
| Related attributes | value (default): request path                                                                                            |

### 5.4 RESTful example :id=h-924aaff5c460

#### 5.4.1 Requirements analysis :id=h-10936a10e6dd

Requirement 1: Query the image list, retrieve backend data, and display it on the page.

![1630508310063](Resources/1630508310063.png)

Requirement 2: Add an image, sending the new book's data to the backend and printing it in the console.

![1630508367105](Resources/1630508367105.png)

\*\*Explanation:\*\* This example focuses on frontend/backend interaction using RESTful in SpringMVC. It does not access a database; all data is `假` data.

Steps:

> 1\. Set up the project and import jar files.
>
> 2\. Write a Controller with two methods: list and add.
>
> 3\. Use RESTful on the methods to set paths.
>
> 4\. Receive requests and parameters and return results.
>
> 5\. Test using PostMan.
>
> 6\. Copy the frontend pages into the project.
>
> 7\. Send ajax requests from the page.
>
> 8\. Display the data on the page.

#### 5.4.2 Preparing the environment :id=h-540a20142739

- Create a Maven web project

- Add Spring dependencies to pom.xml.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>

  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.itheima</groupId>
    <artifactId>springmvc_07_rest_case</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <dependencies>
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
      </dependency>
      <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.0</version>
      </dependency>
    </dependencies>

    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.tomcat.maven</groupId>
          <artifactId>tomcat7-maven-plugin</artifactId>
          <version>2.1</version>
          <configuration>
            <port>80</port>
            <path>/</path>
          </configuration>
        </plugin>
      </plugins>
    </build>
  </project>

  ```

- Create the corresponding configuration classes

  ```java
  public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
      protected Class<?>[] getRootConfigClasses() {
          return new Class[0];
      }

      protected Class<?>[] getServletConfigClasses() {
          return new Class[]{SpringMvcConfig.class};
      }

      protected String[] getServletMappings() {
          return new String[]{"/"};
      }

      // See note 1 below.
      @Override
      protected Filter[] getServletFilters() {
          CharacterEncodingFilter filter = new CharacterEncodingFilter();
          filter.setEncoding("UTF-8");
          return new Filter[]{filter};
      }
  }

  @Configuration
  @ComponentScan("com.itheima.controller")
  // See note 2 below.
  @EnableWebMvc
  public class SpringMvcConfig {
  }


  ```

Example notes:

1. Character encoding handling
2. Enable automatic json conversion

- Write the Book model class

  ```java
  public class Book {
      private Integer id;
      private String type;
      private String name;
      private String description;
      // See note 1 below.
  }
  ```

Example notes:

1. setter...getter...toString omitted

- Write BookController

  ```java
  @Controller
  public class BookController {


  }
  ```

The completed project structure is as follows:

![1630508864017](Resources/1630508864017.png)

#### 5.4.2 Developing backend APIs :id=h-8fe046a2e216

##### Step 1: Write the Controller and configure it with RESTful :id=h-07c937cb2193

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @PostMapping
    public String save(@RequestBody Book book){
        System.out.println("book save ==> "+ book);
        return "{'module':'book save success'}";
    }

     @GetMapping
    public List<Book> getAll(){
        System.out.println("book getAll is running ...");
        List<Book> bookList = new ArrayList<Book>();

        Book book1 = new Book();
        book1.setType("计算机");
        book1.setName("SpringMVC入门教程");
        book1.setDescription("小试牛刀");
        bookList.add(book1);

        Book book2 = new Book();
        book2.setType("计算机");
        book2.setName("SpringMVC实战教程");
        book2.setDescription("一代宗师");
        bookList.add(book2);

        Book book3 = new Book();
        book3.setType("计算机丛书");
        book3.setName("SpringMVC实战教程进阶");
        book3.setDescription("一代宗师呕心创作");
        bookList.add(book3);

        return bookList;
    }

}
```

##### Step 2: Test using PostMan :id=h-4123792c74bb

Test adding records

```json
{
    "type":"计算机丛书",
    "name":"SpringMVC终极开发",
    "description":"这是一本好书"
}
```

![1630509266954](Resources/1630509266954.png)

Test querying records

![](Resources/image-20210805140307371.png)

#### 5.4.3 Handling page access :id=h-335ea2cb7737

##### Step 1: Copy static pages :id=h-fa25b5c33388

Copy everything under `资料\功能页面` to the project's `webapp` directory.

![1630510166433](Resources/1630510166433.png)

##### Step 2: Access books.html under pages :id=h-01bfb8913514

Open a browser and enter `http://localhost/pages/books.html`.

![1630510225182](Resources/1630510225182.png)

(1) Why does the error occur?

![1630510264650](Resources/1630510264650.png)

SpringMVC intercepts the static resource and looks for a controller method matching /pages/books.html. None exists, causing 404.

(2) Why does SpringMVC intercept static resources?

![1630510397429](Resources/1630510397429.png)

(3) What is the solution?

- SpringMVC must allow static resources through.

```java
@Configuration
public class SpringMvcSupport extends WebMvcConfigurationSupport {
    // See note 1 below.
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        // See note 2 below.
        registry.addResourceHandler("/pages/**").addResourceLocations("/pages/");
        registry.addResourceHandler("/js/**").addResourceLocations("/js/");
        registry.addResourceHandler("/css/**").addResourceLocations("/css/");
        registry.addResourceHandler("/plugins/**").addResourceLocations("/plugins/");
    }
}

```

Example notes:

1. Configure static-resource access handling; this class must be a configuration class and be scanned.
2. For /pages/????, look for content under /pages.

- This configuration class is under config, but SpringMVC scans controller, so it is not active yet. Modify SpringMvcConfig to activate it.

```java
@Configuration
@ComponentScan({"com.itheima.controller","com.itheima.config"})
@EnableWebMvc
public class SpringMvcConfig {
}

```

Alternatively, choose one of these approaches; do not define duplicate classes with the same name:

```java

@Configuration
@ComponentScan("com.itheima")
@EnableWebMvc
public class SpringMvcConfig {
}
```

##### Step 3: Modify the books.html page :id=h-9046d9a91f56

```html
<!DOCTYPE html>

<html>
    <head>
        <!-- See note 1 below. -->
        <meta charset="utf-8">
        <title>SpringMVC案例</title>
        <!-- See note 2 below. -->
        <link rel="stylesheet" href="../plugins/elementui/index.css">
        <link rel="stylesheet" href="../plugins/font-awesome/css/font-awesome.min.css">
        <link rel="stylesheet" href="../css/style.css">
    </head>

    <body class="hold-transition">

        <div id="app">

            <div class="content-header">
                <h1>图书管理</h1>
            </div>

            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="图书名称" style="width: 200px;" class="filter-item"></el-input>
                        <el-button class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="openSave()">新建</el-button>
                    </div>

                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="type" label="图书类别" align="center"></el-table-column>
                        <el-table-column prop="name" label="图书名称" align="center"></el-table-column>
                        <el-table-column prop="description" label="描述" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button size="mini" type="danger">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagination-container">
                        <el-pagination
                            class="pagiantion"
                            @current-change="handleCurrentChange"
                            :current-page="pagination.currentPage"
                            :page-size="pagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="pagination.total">
                        </el-pagination>
                    </div>

                    <!-- See note 3 below. -->
                    <div class="add-form">
                        <el-dialog title="新增图书" :visible.sync="dialogFormVisible">
                            <el-form ref="dataAddForm" :model="formData" :rules="rules" label-position="right" label-width="100px">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="图书类别" prop="type">
                                            <el-input v-model="formData.type"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="图书名称" prop="name">
                                            <el-input v-model="formData.name"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="描述">
                                            <el-input v-model="formData.description" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取消</el-button>
                                <el-button type="primary" @click="saveBook()">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>

                </div>
            </div>
        </div>
    </body>

    <!-- See note 4 below. -->
    <script src="../js/vue.js"></script>
    <script src="../plugins/elementui/index.js"></script>
    <script type="text/javascript" src="../js/jquery.min.js"></script>
    <script src="../js/axios-0.18.0.js"></script>

    <script>
        var vue = new Vue({

            el: '#app',

            data:{
                dataList: [],// See note 5 below.
                formData: {},// See note 6 below.
                dialogFormVisible: false,// See note 7 below.
                dialogFormVisible4Edit:false,// See note 8 below.
                pagination: {},// See note 9 below.
            },

            // See note 10 below.
            created() {
                this.getAll();
            },

            methods: {
                // See note 11 below.
                resetForm() {
                    // See note 12 below.
                    this.formData = {};
                },

                // See note 13 below.
                openSave() {
                    this.dialogFormVisible = true;
                    this.resetForm();
                },

                // See note 14 below.
                saveBook () {
                    axios.post("/books",this.formData).then((res)=>{

                    });
                },

                // See note 15 below.
                getAll() {
                    axios.get("/books").then((res)=>{
                        this.dataList = res.data;
                    });
                },

            }
        })
    </script>
</html>
```

Example notes:

1. Page metadata
2. Import styles
3. Add-label popup
4. Import the component library
5. Paginated list data displayed on the current page
6. Form data
7. Whether the add form is visible
8. Controls whether the edit form is visible
9. Pagination model data, currently unused
10. Lifecycle hook, executed automatically after the VUE object is initialized
11. Reset the form
12. Clear the input fields
13. Open the add window
14. Add
15. Query the home-page list

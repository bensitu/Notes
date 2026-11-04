# Spring Boot basics :id=h-feec1895621a

Understand starters, auto-configuration, configuration files, testing, and MyBatis integration.

**Prerequisites and versions:** This article retains the Spring Boot 2.5 / javax teaching environment for learning concepts and comparing legacy projects. For the Jakarta approach in newer examples, see SSM.md and Springboot+JSF+Mybatis.md; changing only the parent POM does not complete a migration.

**About screenshots:** Images retain the procedures from the original teaching environment. If an older approach in a screenshot differs from the text, follow the revised text and the official documentation for your chosen version.

**Using the examples:** Unless a project explicitly lists all files and execution steps, code blocks are independent snippets for each section. Fill in omissions and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations in the same section.

[Documentation index](README.md) · [Official references](https://docs.spring.io/spring-boot/docs/2.5.0/reference/html/)

**Contents**

- [1. Introduction to SpringBoot](#section-1)
- [2. Configuration files](#section-2)
- [3. Integrating SpringBoot with junit](#section-3)
- [4. Integrating SpringBoot with mybatis](#section-4)
- [5. Example project](#section-5)

**Objectives:**

> - Master the steps for developing programs with the SpringBoot framework
> - Become proficient in modifying server settings through SpringBoot configuration
> - Develop an integrated SSM project based on SpringBoot

<a id="section-1"></a>

## 1. Introduction to SpringBoot :id=h-b51c4ea13b79

`SpringBoot` is a new framework provided by the `Pivotal` team, designed to **simplify** the **initial setup** and **development process** of `Spring` applications.

The `Spring` framework already simplifies development. `SpringBoot` further simplifies `Spring` development, which helps explain why `SpringBoot` is easy to use and widely adopted. Since `SpringBoot` simplifies `Spring` development, first review the process using `SpringMVC` as an example:

1. **Create a project and configure dependency coordinates in `pom.xml`**

<img src="Resources/image-20210911132335452.png" alt="image-20210911132335452" style="zoom:50%;" />

2. **Write the `web3.0` configuration class**

   A `web` application requires a `web3.0` configuration class. This class is fairly cumbersome, as the following code shows:

<img src="Resources/image-20210911133112602.png" alt="image-20210911133112602" style="zoom:50%;" />

3. **Write the `SpringMVC` configuration class**

<img src="Resources/image-20210911133219847.png" alt="image-20210911133219847" style="zoom:50%;" />

This only establishes the project skeleton. To make it externally accessible, you also need at least a `Controller` class with a method.

4. **Write the `Controller` class**

<img src="Resources/image-20210911133532151.png" alt="image-20210911133532151" style="zoom:50%;" />

In this `SpringMVC` development process, the first three steps all set up the environment and are largely fixed. `SpringBoot` simplifies those three steps. Next, a starter example shows how `SpingBoot` simplifies `Spring` development.

### 1.1 Getting started with SpringBoot :id=h-6b17c8f54900

#### 1.1.1 Development steps :id=h-12c83f25df67

Development with `SpringBoot` is very simple and consists of the following steps:

- Create a new module, select Spring initialization, and configure its basic information
- Select the technologies needed by the current module
- Develop a controller class
- Run the automatically generated Application class

Now that you know the `SpringBoot` development steps, let's carry them out.

##### 1.1.1.1 Creating a new module :id=h-b8aedbf89818

- Click `+` and select `New Module` to create a new module.

<img src="Resources/image-20210911155135008.png" alt="image-20210911155135008" style="zoom:60%;" />

- Select `Spring Initializr` to create a `SpringBoot` project.

  Previously, we selected `Maven`; today, select `Spring Initializr` to quickly build a `SpringBoot` project. For `Module SDK`, select the corresponding `JDK` version installed locally.

<img src="Resources/image-20210911155249493.png" alt="image-20210911155249493" style="zoom:60%;" />

- Configure the `SpringBoot` project.

  A `SpringBoot` project built this way is still a `Maven` project; this is simply a faster way to create it.

  <img src="Resources/image-20210911155916899.png" alt="image-20210911155916899" style="zoom:67%;" />

  > Note: Set the packaging type to `Jar` here.

- Select `Web`, then check `Spring Web`.

  We are developing a `web` application using `SpringMVC`, so select the options inside the red box below.

<img src="Resources/image-20210911160040328.png" alt="image-20210911160040328" style="zoom:60%;" />

- Leave the following screen unchanged and click `Finish` to finish creating the `SpringBoot` project.

<img src="Resources/image-20210911160353534.png" alt="image-20210911160353534" style="zoom:70%;" />

These steps create a module with the following structure. An `Application` class is generated automatically; we will use it shortly to start the server.

<img src="Resources/image-20210911160541833.png" alt="image-20210911160541833" style="zoom:80%;" />

> Note:
>
> 1. You do not need to create configuration classes in the generated project.
>
> 2. Keep .gitignore and the Maven Wrapper (.mvn, mvnw, mvnw\.cmd); they support version control and a consistent Maven version. Keep HELP.md as needed. Do not delete files needed for building and collaboration just to simplify the directory.

##### 1.1.1.2 Creating a Controller :id=h-ce01cfb3e7ff

Create `BookController` in the `com.itheima.controller` package with the following code:

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("id ==> "+id);
        return "hello , spring boot!";
    }
}
```

##### 1.1.1.3 Starting the server :id=h-5876de23fd0b

Running a `SpringBoot` project requires neither a local `Tomcat` installation nor a plugin. Run only the `Application` class in the project's `com.itheima` package; the console displays the following information:

![image-20210911165642280](Resources/image-20210911165642280.png)

##### 1.1.1.4 Testing :id=h-803ad536f338

Use `Postman` to test our program.

![image-20210911160850121](Resources/image-20210911160850121.png)

This introductory example shows how `SpringBoot` makes development much simpler. How does it do that?

To find out, examine the `Application` class and `pom.xml`. Start with the `Applicaion` class, whose contents are as follows:

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

This class is simple: it has a `@SpringBootApplication` annotation and a single line in its main method. Starting the server means executing this class's main method.

Next, examine the contents of `pom.xml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- See note 1 below. -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.5.0</version>
    </parent>
    <groupId>com.itheima</groupId>
    <artifactId>springboot_01_quickstart</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <!-- See note 2 below. -->
    <properties>
        <java.version>8</java.version>
    </properties>

    <dependencies>
        <!-- See note 3 below. -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- See note 4 below. -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- See note 5 below. -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

Example notes:

1. Specifies a parent project whose contents this project can inherit and use
2. The JDK version
3. This dependency was generated by selecting Spring Web when creating the SpringBoot project
4. This is the unit-testing dependency; since we are not testing yet, it is currently optional
5. This plugin is needed for packaging, which we have not used yet

Our code is simpler because of the specified parent project and the `Spring Web` dependency. We will discuss the details later.

#### 1.1.2 Comparison :id=h-d3b36e8c43e2

After completing the `SpringBoot` starter example, compare a `Spring` application with a `SpringBoot` application, as shown below.

<img src="Resources/image-20210911172200292.png" alt="image-20210911172200292" style="zoom:60%;" />

- **Dependency coordinates**

  A `Spring` application requires many dependency coordinates to be written manually.

  A `SpringBoot` application's dependency coordinates are generated automatically from the options selected during project creation.

- **web3.0 configuration class**

  In a `Spring` application, you must write this configuration class yourself. Having written it before, you likely found it complex.

  In a `SpringBoot` application, you do not need to write it yourself.

- **Configuration classes**

  A `Spring/SpringMVC` application requires manually written configuration classes; a `SpringBoot` application does not.

> \==Note: Quickly creating a `SpringBoot` project with `Spring Initializr` in Idea requires an internet connection.==

#### 1.1.3 Creating a project on the official website :id=h-d51ca68b4df9

The introductory example creates a `SpringBoot` project quickly because `Idea` uses the project-generation component provided by the official website for `SpringBoot`. To create a project directly on the official website, follow these steps:

##### 1.1.3.1 Opening the SpringBoot official website :id=h-24094b83fc1c

The official website address is:

```
https://spring.io/projects/spring-boot
```

Open the `SpringBoot` official website and scroll to the bottom to see the following:

<img src="Resources/image-20210911173712014.png" alt="image-20210911173712014" style="zoom:60%;" />

Click the `Spring Initializr` link to open the following page:

![image-20210911174110687](Resources/image-20210911174110687.png)

This page should look familiar: it is almost identical to the `Idea` interface for quickly creating a `SpringBoot` project. Enter the corresponding information on this page.

##### 1.1.3.2 Selecting dependencies :id=h-af25bf223eba

To select `Spring Web`, click `ADD DEPENDENCIES... CTRL + B` in the upper-right corner of the image above. The following screen appears:

![image-20210911174650679](Resources/image-20210911174650679.png)

##### 1.1.3.3 Generating the project :id=h-7de0282cd24d

After completing those steps, generate the `SpringBoot` project. Click `GENERATE CTRL + 回车` at the bottom of the page to generate and download it locally, as shown below.

![image-20210911175222857](Resources/image-20210911175222857.png)

Open the downloaded archive. Its project structure is identical to one generated by `Idea`, as shown below.

<img src="Resources/image-20210911175502834.png" alt="image-20210911175502834" style="zoom:80%;" />

The `pom.xml` file also contains the parent project and the `Spring Web` dependency.

These website operations show that `Idea` uses the official project-generation component to create `SpringBoot` projects quickly. You can therefore create a `SpringBoot` project through the website even without `Idea`.

#### 1.1.4 Quickly launching a SpringBoot project :id=h-ad9b295eae7c

##### 1.1.4.1 Introducing the problem :id=h-3b9cba8277c3

<img src="Resources/image-20210911180828611.png" alt="image-20210911180828611" style="zoom:50%;" />

When collaborating with frontend developers, they need the backend server running to test their frontend application, so they depend on backend developers. Trying to avoid this by installing `Tomcat` and `Idea` on their own computers and starting the backend themselves is clearly impractical.

The backend team can package the `SpringBoot` project as a `jar` archive. This `jar` runs without tools such as `Tomcat` or `Idea`; it only needs to connect to the same `Mysql` database as our application while the `jar` is running. This solves the problem, as shown below.

<img src="Resources/image-20210911181714437.png" alt="image-20210911181714437" style="zoom:50%;" />

How do we package it?

##### 1.1.4.2 Packaging :id=h-39937b861f71

When creating the `SpringBoot` project, we already configured the following plugin in `pom.xml`:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

Run the `package` command in `Maven` to generate the corresponding `Jar` archive in `target`.

> \==Note: This plugin must be configured; otherwise, the packaged `jar` will have problems.==

##### 1.1.4.3 Starting :id=h-afd314070a02

Go to the directory containing the `jar` and enter the following command in `命令提示符`:

```shell
jar -jar springboot_01_quickstart-0.0.1-SNAPSHOT.jar
```

After executing that command, you can see the `SpringBoot` runtime logs.

<img src="Resources/image-20210911182956629.png" alt="image-20210911182956629" style="zoom:60%;" />

### 1.2 Overview of SpringBoot :id=h-8edcc7e479d4

`SpringBoot` is a new framework provided by the Pivotal team, designed to ==simplify== the ==initial setup== and ==development process== of Spring applications.

Now that you have experienced a `SpringBoot` application, revisit the main purpose of `SpringBoot`: simplifying `Spring` setup and development.

Traditional `Spring` environment setup and development have the following problems:

- Cumbersome configuration
- Cumbersome dependency setup

The benefits of `SpringBoot` directly address the drawbacks of `Spring`.

- Auto-configuration addresses cumbersome `Spring` configuration.
- Starter dependencies address cumbersome `Spring` dependency setup.
- Supporting features (embedded servers, etc.). When starting a `SpringBoot` application, we use neither a local `tomcat` nor the `tomcat` plugin; we use the server embedded in `SpringBoot`.

Next, let's discuss starter dependencies in `SpringBoot`.

#### 1.2.1 Starter dependencies :id=h-a688c3464c20

The `pom.xml` configuration file of the `Maven` project created with `Spring Initializr` automatically contains many dependencies whose names include `starter`, as shown below.

<img src="Resources/image-20210918220338109.png" alt="image-20210918220338109" style="zoom:70%;" />

These are ==starter dependencies==. Let's examine how they work.

##### 1.2.1.1 Exploring the parent project :id=h-49dd903678b0

The file above specifies a parent project. Open that parent and you will find that it specifies another parent project, as shown below.

<img src="Resources/image-20210918220855024.png" alt="image-20210918220855024" style="zoom:80%;" />

Open that parent project to see the following configuration structure:

<img src="Resources/image-20210918221042947.png" alt="image-20210918221042947" style="zoom:80%;" />

The `properties` element above defines dependency versions for different technologies, managing a consistent set of versions. When adding or overriding dependencies, still check compatibility. The `servlet` and `mysql` versions in `properties` are shown below.

<img src="Resources/image-20210918221511249.png" alt="image-20210918221511249" style="zoom:80%;" />

The `dependencyManagement` element pins dependency versions but does not import those dependencies. If our project needs one, specify only its `groupid` and `artifactId`; no `version` is required.

The `build` element also pins plugin versions, as shown below.

<img src="Resources/image-20210918221942453.png" alt="image-20210918221942453" style="zoom:80%;" />

After examining the parent's `pom.xml` configuration, it is clear why our project's dependencies do not specify `version`.

##### 1.2.1.2 Exploring dependencies :id=h-b499cda9c1ae

Our project's `pom.xml` contains the following dependency:

<img src="Resources/image-20210918222321402.png" alt="image-20210918222321402" style="zoom:80%;" />

Open that dependency and examine `pom.xml`; it brings in the following dependencies:

<img src="Resources/image-20210918222607469.png" alt="image-20210918222607469" style="zoom:80%;" />

It includes `spring-web` and `spring-webmvc`, which explains why our project can use `springMVC` annotations without explicitly declaring those two packages.

From its name, `spring-boot-starter-tomcat` clearly depends on `tomcat`, enabling our project to start normally.

\==Conclusion: To use a technology, add its corresponding starter dependency.==

##### 1.2.1.3 Summary :id=h-308a43d593f4

**starter**

- A common project name in `SpringBoot`; it defines the dependency coordinates used by the project to reduce dependency configuration.

**parent**

- A common parent POM for Maven projects. Alternatively, import the spring-boot-dependencies BOM without inheriting this parent. It defines coordinate version numbers (dependency management, rather than actual dependencies) to reduce dependency conflicts.

- There are 57 differences in dependency coordinate versions between `spring-boot-starter-parent` (2.5.0) and `spring-boot-starter-parent` (2.4.6).

**In practice**

- For dependencies managed by Spring Boot, you usually specify only G and A; libraries outside its dependency management still require an explicit version.

  > G：groupid
  >
  > A：artifactId
  >
  > V：version

- If a dependency cannot be resolved, first check its coordinates, repositories, and whether its version is managed. Add version only after confirming that it is unmanaged or must be overridden, and verify compatibility requirements.

#### 1.2.2 Starting the application :id=h-913251fe4c49

Every newly created `SpringBoot` application contains a class like the following, called the bootstrap class.

```java
@SpringBootApplication
public class Springboot01QuickstartApplication {

    public static void main(String[] args) {
        SpringApplication.run(Springboot01QuickstartApplication.class, args);
    }
}
```

\==Note:==

- Use jar packaging when creating a `SpringBoot` project.

- The `SpringBoot` bootstrap class is the project's entry point; running its `main` method starts the project.

  Our `pom.xml` includes `spring-boot-starter-web`, which, as we learned, depends on `tomcat`. Running `main` can therefore start our project using `tomcat`.

#### 1.2.3 Switching web servers :id=h-8a5295e4e223

Our project currently starts with `tomcat`. Can we use `jetty` instead of `tomcat`? `jetty` is the server used for the private `maven` repository discussed in advanced `maven`. Switching the `web` server first requires excluding the default `tomcat`. Use an `exclusion` element to exclude it.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <artifactId>spring-boot-starter-tomcat</artifactId>
            <groupId>org.springframework.boot</groupId>
        </exclusion>
    </exclusions>
</dependency>
```

Can we now run the bootstrap class? Try it; the logs are as follows:

![image-20210918232512707](Resources/image-20210918232512707.png)

The application stops immediately. Why? Excluding `tomcat` leaves it with no server. You must both exclude `tomcat` and add `jetty`, using the `jetty` starter dependency in `pom.xml`.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

Run the bootstrap class again; the logs now show that the server is `jetty`.

![image-20210918232904623](Resources/image-20210918232904623.png)

**Summary:**

Switching servers shows that changing technologies with `SpringBoot` only requires importing the corresponding starter dependency.

<a id="section-2"></a>

## 2. Configuration files :id=h-881c35b672fe

### 2.1 Configuration file formats :id=h-e43c161234a2

The server's default port is `8080`, so its access URL can be written as:

```
http://localhost:8080/books/1
```

In production, we would like to change the port to `80` so that the URL can omit it, as follows:

```
http://localhost/books/1
```

How can a `SpringBoot` application change it? `SpringBoot` provides several ways to configure properties.

- `application.properties`

  ```
  server.port=80
  ```

- `application.yml`

  ```yaml
  server:
    port: 81
  ```

- `application.yaml`

  ```yaml
  server:
    port: 82
  ```

> \==Note: The default configuration filenames are application.properties, application.yml, and application.yaml. Startup parameters such as spring.config.name can change the name; they must be supplied before configuration files are read.==

#### 2.1.1 Preparing the environment :id=h-83427decb98c

Create a project named `springboot_02_base_config` to demonstrate different configuration files. Its environment is identical to the starter example, with the following structure:

<img src="Resources/image-20210917151314753.png" alt="image-20210917151314753" style="zoom:80%;" />

Create a controller named `BookController` in the `com.itheima.controller` package with the following contents:

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("id ==> "+id);
        return "hello , spring boot!";
    }
}
```

#### 2.1.2 Demonstrating different configuration files :id=h-8975eb64849b

- **application.properties configuration file**

Now configure the application. This example places configuration files in `src/main/resources` (Spring Boot also supports external files). That directory contains `application.properties`, where you can change the port. Type `port` in it and `Idea` offers suggestions, as shown below.

<img src="Resources/image-20210917161422535.png" alt="image-20210917161422535" style="zoom:80%;" />

The `application.properties` configuration file contains:

```properties
server.port=80
```

Start the service. The console logs show that the bound port has changed.

<img src="Resources/image-20210917161720855.png" alt="image-20210917161720855" style="zoom:80%;" />

- **application.yml configuration file**

Delete the contents of `application.properties`. Create `application.yml` under `resources`, and write the port configuration in the following format:

```yaml
server:
  port: 81
```

> \==Note: There must be a space after `:` and before the value.==

The `yml` configuration file also supports suggestions. Type `port`, and `idea` helps complete it in the format above.

<img src="Resources/image-20210917162512646.png" alt="image-20210917162512646" style="zoom:80%;" />

Start the service; the console shows the bound port as `81`.

![image-20210917162700711](Resources/image-20210917162700711.png)

- **application.yaml configuration file**

Delete the contents of `application.yml` and `application.properties`, then create `application.yaml` under `resources`. Its contents are identical to those of the `yml` configuration file; only the extension differs.

The `application.yaml` configuration file contains:

```yaml
server:
  port: 83
```

Start the service and check the bound port in the console.

![image-20210917163335913](Resources/image-20210917163335913.png)

\==Note: If configuration suggestions are missing, resolve it as follows.==

- Click `File` and select `Project Structure`.

<img src="Resources/image-20210917163557071.png" alt="image-20210917163557071" style="zoom:80%;" />

- In the following window, select the options indicated by the red boxes.

<img src="Resources/image-20210917163736458.png" alt="image-20210917163736458" style="zoom:70%;" />

- Those operations open the following window:

<img src="Resources/image-20210917163818051.png" alt="image-20210917163818051" style="zoom:80%;" />

- Click `+` in the image above to select this module's configuration files.

<img src="Resources/image-20210917163828518.png" alt="image-20210917163828518" style="zoom:80%;" />

- After those steps, the interface looks as follows: one `properties` configuration file and two `yaml` configuration files.

<img src="Resources/image-20210917163846243.png" alt="image-20210917163846243" style="zoom:80%;" />

#### 2.1.3 Configuration formats and precedence :id=h-ac322b7ea706

When properties and YAML files coexist in the same location, Spring Boot 2.5 gives properties precedence. Do not maintain identical settings in both application.yml and application.yaml and rely on loading order. Choose one format per project to make overrides easier to diagnose.

Precedence also depends on configuration location, active profiles, environment variables, and command-line arguments. For example, `java -jar app.jar --server.port=8085` can override the configured port. Check these sources first when a value is unexpected.

YAML uses spaces for indentation, never tabs; keep indentation consistent at each level. Next, we will cover YAML syntax.

Reference: [Spring Boot 2.5 external configuration](https://docs.spring.io/spring-boot/docs/2.5.0/reference/html/features.html#features.external-config).

### 2.2 yaml format :id=h-d6dd33e0a728

We have covered three configuration file types. You have already learned the `properties` format; next, we will focus on `yaml` files.

\*\*YAML (YAML Ain't Markup Language) is a data serialization format.\*\* This format has become dominant for configuration files in recent years and has advantages over earlier formats. First, review the configuration files used previously.

Initially, we used `xml` in the following format:

```xml
<enterprise>
    <name>itcast</name>
    <age>16</age>
    <tel>4006184000</tel>
</enterprise>
```

A `properties` configuration file looks as follows:

```properties
enterprise.name=itcast
enterprise.age=16
enterprise.tel=4006184000
```

The `yaml` configuration file contains:

```yaml
enterprise:
  name: itcast
  age: 16
  tel: 4006184000
```

**Advantages:**

- Easy to read

  A `yaml` configuration file is easier to read and has a clearer structure than an `xml` file.

- Easy interaction with scripting languages

- Data-centered, emphasizing data over formatting

  `yaml` emphasizes data, whereas `xml` emphasizes formatting.

**YAML file extensions:**

- `.yml` (most common)
- `.yaml`

Both extensions above work, but `yml` is used more frequently.

#### 2.2.1 Syntax rules :id=h-23327760a7e6

- Case-sensitive

- Describe property hierarchies across multiple lines, ending each hierarchy declaration with a colon

- Use indentation for hierarchy and align items at the same level; only spaces are allowed (no tabs)

  The number of spaces is unimportant as long as items at the same level align on the left.

- Put a space before each property value (separate the name and value with a colon followed by a space)

- \# introduces a comment

\==Core rule: Separate a value from its colon with a space.==

For arrays, put entries below the data's position, one per line, beginning with a hyphen followed by a space. For example:

```yaml
enterprise:
  name: itcast
  age: 16
  tel: 4006184000
  subject:
    - Java
    - 前端
    - 大数据
```

### 2.3 Reading data from yaml configuration files :id=h-b91b73a75317

#### 2.3.1 Preparing the environment :id=h-101409f5229c

Create a `SpringBoot` project named `springboot_03_read_data` with the following directory structure:

<img src="Resources/image-20210917172736484.png" alt="image-20210917172736484" style="zoom:80%;" />

Create a controller named `BookController` in the `com.itheima.controller` package with the following contents:

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println("id ==> "+id);
        return "hello , spring boot!";
    }
}
```

Create an entity class named `Enterprise` in `com.itheima.domain` to hold data later. Its contents are as follows:

```java
public class Enterprise {
    private String name;
    private int age;
    private String tel;
    private String[] subject;

    //setter and getter

    //toString
}
```

Create a configuration file named `application.yml` under `resources`, containing different kinds of data as follows:

```yaml
lesson: SpringBoot

server:
  port: 80

enterprise:
  name: itcast
  age: 16
  tel: 4006184000
  subject:
    - Java
    - 前端
    - 大数据
```

#### 2.3.2 Reading configuration data :id=h-d038179db3e3

##### 2.3.2.1 Using the @Value annotation :id=h-c0c621d2ffbe

Use `@Value("表达式")` to read data from a configuration file. Reference property names inside the annotation as `${一级属性名.二级属性名……}`.

In `BookController`, use `@Value` to read configuration data as follows:

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @Value("${lesson}")
    private String lesson;
    @Value("${server.port}")
    private Integer port;
    @Value("${enterprise.subject[0]}")
    private String subject_00;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(lesson);
        System.out.println(port);
        System.out.println(subject_00);
        return "hello , spring boot!";
    }
}
```

##### 2.3.2.2 The Environment object :id=h-8e36b8634b98

The approach above reads individual values separately. `SpringBoot` also allows you to read data by injecting an `Environment` object with `@Autowired`. With this approach, `SpringBoot` exposes all configuration data through `Environment`; retrieve a value by calling `getProperty(String name)` on `Environment`. The code is as follows:

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private Environment env;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(env.getProperty("lesson"));
        System.out.println(env.getProperty("enterprise.name"));
        System.out.println(env.getProperty("enterprise.subject[0]"));
        return "hello , spring boot!";
    }
}
```

> \==Note: This approach exposes a large amount of framework data and is rarely used in our development.==

##### 2.3.2.3 Custom objects :id=h-6cc0f2a628cb

`SpringBoot` can also bind configuration data to our own entity objects. Follow these steps:

- Let `Spring` manage creation of the entity `bean`.

  Add `@Component` to the class.

- Use `@ConfigurationProperties` to indicate configuration loading.

  Use the annotation's `prefix` attribute to load only data with the specified prefix.

- Inject it into `BookController`.

**The code is as follows:**

The `Enterprise` entity class contains:

```java
@Component
@ConfigurationProperties(prefix = "enterprise")
public class Enterprise {
    private String name;
    private int age;
    private String tel;
    private String[] subject;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String[] getSubject() {
        return subject;
    }

    public void setSubject(String[] subject) {
        this.subject = subject;
    }

    @Override
    public String toString() {
        return "Enterprise{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", tel='" + tel + '\'' +
                ", subject=" + Arrays.toString(subject) +
                '}';
    }
}
```

The contents of `BookController` are:

```java
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private Enterprise enterprise;

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id){
        System.out.println(enterprise.getName());
        System.out.println(enterprise.getAge());
        System.out.println(enterprise.getSubject());
        System.out.println(enterprise.getTel());
        System.out.println(enterprise.getSubject()[0]);
        return "hello , spring boot!";
    }
}
```

\==Note:==

The third approach produces the following warning on the entity class:

<img src="Resources/image-20210917180919390.png" alt="image-20210917180919390" style="zoom:70%;" />

Resolve this warning by adding the following dependency to `pom.xml`.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

### 2.4 Configuration for multiple environments :id=h-f6c8c8c8e728

Development, test, and production environments have different configurations. For example, during development you install `mysql` locally and connect to that local `mysql`. Before deploying the finished project, change the configuration to match production.

<img src="Resources/image-20210917185253557.png" alt="image-20210917185253557" style="zoom:60%;" />

Repeatedly editing settings is cumbersome. `SpringBoot` offers convenient multi-environment configuration so that switching environments requires changing only one setting. The setup differs by configuration file type; each is explained next.

#### 2.4.1 Multi-environment YAML configuration :id=h-f1347d1b7d6c

Since Spring Boot 2.4, use spring.config.activate.on-profile to activate a specific document. --- separates multiple YAML documents. The default document selects dev; subsequent documents apply only when their corresponding profile is active.

```yaml
spring:
  profiles:
    active: dev
---
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080
---
spring:
  config:
    activate:
      on-profile: test
server:
  port: 8081
---
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 8082
```

Run java -jar app.jar --spring.profiles.active=prod to switch to production configuration. Do not place spring.profiles.active inside a document containing on-profile. Supply sensitive settings such as passwords through environment variables or external configuration, and do not commit them to the repository.

You can also use separate application-dev.yml, application-test.yml, and application-prod.yml files. Choose a clear organizational approach for your project.

#### 2.4.2 properties files :id=h-ad6c5f894415

Multiple environments with `properties` files require separate configuration files.

- `application-dev.properties` is the development configuration file. Set its port to `80`.

  ```properties
  server.port=80
  ```

- `application-test.properties` is the test configuration file. Set its port to `81`.

  ```properties
  server.port=81
  ```

- `application-pro.properties` is the production configuration file. Set its port to `82`.

  ```properties
  server.port=82
  ```

By default, application.properties and YAML configuration are loaded. This section uses properties files, so select the configuration to activate in `application.properties`, as follows:

```properties
spring.profiles.active=pro
```

#### 2.4.3 Setting command-line startup arguments :id=h-685c9424c6e8

Applications developed with `SpringBoot` will be packaged as `jar` archives and started with `java -jar xxx.jar`. Since the configuration files are inside the jar, how can we switch environments?

A `jar` is an archive, so you could extract it, edit the configuration, and package it again. That is cumbersome. `SpringBoot` instead lets you select an environment when running the `jar`, as follows:

```shell
java –jar xxx.jar –-spring.profiles.active=test
```

Can this also temporarily change the port? Yes, as follows:

```shell
java –jar xxx.jar –-server.port=88
```

You can set multiple options at once, such as selecting an environment and temporarily overriding its port:

```shell
java –jar springboot.jar –-server.port=88 –-spring.profiles.active=test
```

Testing shows that a command-line port setting has higher precedence: the application uses the command-line value. The `SpringBoot` official website explains configuration precedence; see:

```
https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config
```

Opening that website displays the following page:

![image-20210917193910191](Resources/image-20210917193910191.png)

When several sources configure the same option, the one with higher precedence takes effect.

### 2.5 Configuration file categories :id=h-c1eff1aab1a8

<img src="Resources/image-20210917194941597.png" alt="image-20210917194941597" style="zoom:70%;" />

Consider testing after development. Because many settings differ between development and test environments, testers would need to override many options when running our project, as follows:

```shell
java –jar springboot.jar –-spring.profiles.active=test --server.port=85 --server.servlet.context-path=/heima --server.tomcat.connection-timeout=-1 …… …… …… …… ……
```

To address this, `SpringBoot` defines different configuration file locations with different precedence.

The four configuration file location levels in `SpringBoot` are:

- Level 1: classpath: application.yml
- Level 2: classpath: config/application.yml
- Level 3: file: application.yml
- Level 4: file: config/application.yml

> \==Explanation:== A higher level means higher precedence.

#### 2.5.1 Code demonstration :id=h-be4f087546b5

Here we demonstrate only the precedence of different configuration file locations.

##### 2.5.1.1 Preparing the environment :id=h-7fbcb69178dd

Create a `SpringBoot` project named `springboot_06_config_file` with the following directory structure:

<img src="Resources/image-20210917200241282.png" alt="image-20210917200241282" style="zoom:80%;" />

Create a `config` directory under `resources`, then create `application.yml` inside it and set the port to `81`:

```yaml
server:
  port: 81
```

In `application.yml` directly under `resources`, set the port to `80`:

```yaml
server:
  port: 80
```

##### 2.5.1.2 Comparing the precedence of levels 1 and 2 :id=h-04082a7bd58f

Run the bootstrap class; the console displays the following logs:

![image-20210917200805389](Resources/image-20210917200805389.png)

This result shows that ==configuration files in `config` on the classpath take precedence over those directly on the classpath.==

##### 2.5.1.3 Comparing the precedence of levels 2 and 4 :id=h-e17be182e019

To verify level 4, follow these steps:

- Package the project as a `jar`.

  Click the project's `package` action to create a `jar`.

  <img src="Resources/image-20210917201243721.png" alt="image-20210917201243721" style="zoom:80%;" />

- Locate the `jar` on disk.

  <img src="Resources/image-20210917201523669.png" alt="image-20210917201523669" style="zoom:70%;" />

- Create a `config` folder beside the `jar`. Inside it, create `application.yml` and set the port to `82`.

- Run the program from the command line using:

  ```shell
  java -jar springboot_06_config_file-0.0.1-SNAPSHOT.jar
  ```

  The runtime logs are as follows:

  ![image-20210917201922831](Resources/image-20210917201922831.png)

  This result shows that ==configuration files in file: `config` take precedence over those on the classpath.==

> \==Note:==
>
> SpringBoot 2.5.0 has a bug: when using this version, create a folder with any name in the `config` directory beside the `jar`.

<a id="section-3"></a>

## 3. Integrating SpringBoot with junit :id=h-776a50e5eda8

Review: integrating `Spring` with `junit`

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class UserServiceTest {

    @Autowired
    private BookService bookService;

    @Test
    public void testSave(){
        bookService.save();
    }
}
```

Use `@RunWith` to specify the runner and `@ContextConfiguration` to specify a configuration class or file. Integrating `SpringBoot` with `junit` is much simpler and takes three steps:

- Add `SpringBootTest` to the test class.
- Inject the resource to test using `@Autowired`.
- Define and run test methods.

### 3.1 Preparing the environment :id=h-93847a49d1b8

Create a `SpringBoot` project named `springboot_07_test` with the following project structure:

<img src="Resources/image-20210917213556673.png" alt="image-20210917213556673" style="zoom:80%;" />

Create the `BookService` interface under `com.itheima.service` with the following contents:

```java
public interface BookService {
    public void save();
}
```

Create `BookServiceImpl` in the `com.itheima.service.impl` package, implementing `BookService`, as follows:

```java
@Service
public class BookServiceImpl implements BookService {
    @Override
    public void save() {
        System.out.println("book service is running ...");
    }
}
```

### 3.2 Writing a test class :id=h-36db976199ea

Create the `com.itheima` package under `test/java`, create a test class inside it, and inject `BookService` into the test class.

```java
@SpringBootTest
class Springboot07TestApplicationTests {

    @Autowired
    private BookService bookService;

    @Test
    public void save() {
        bookService.save();
    }
}
```

> Note: By default, the search for @SpringBootApplication or @SpringBootConfiguration starts at the test class's package and moves toward parent packages. Test classes therefore usually reside in the bootstrap class's package or its subpackages.
>
> For example:
>
> - The bootstrap class is in `com.itheima`.
> - The test class is in `com.itheima`.
>
> If this requirement is not met, specify the bootstrap class's Class object using the `classes` attribute of `@SpringBootTest`, for example `@SpringBootTest(classes = Springboot07TestApplication.class)`.

<a id="section-4"></a>

## 4. Integrating SpringBoot with mybatis :id=h-67f166783265

### 4.1 Review: integrating Spring with Mybatis :id=h-18f479887e28

Integrating `Spring` with `Mybatis` requires many configuration classes.

- `SpringConfig` configuration class

  - Import the `JdbcConfig` configuration class

  - Import the `MybatisConfig` configuration class

    ```java
    @Configuration
    @ComponentScan("com.itheima")
    @PropertySource("classpath:jdbc.properties")
    @Import({JdbcConfig.class,MyBatisConfig.class})
    public class SpringConfig {
    }

    ```

- `JdbcConfig` configuration class

- Define a data source (load properties settings: driver, url, username, password)

  ```java
  public class JdbcConfig {
      @Value("${jdbc.driver}")
      private String driver;
      @Value("${jdbc.url}")
      private String url;
      @Value("${jdbc.username}")
      private String userName;
      @Value("${jdbc.password}")
      private String password;

      @Bean
      public DataSource getDataSource(){
          DruidDataSource ds = new DruidDataSource();
          ds.setDriverClassName(driver);
          ds.setUrl(url);
          ds.setUsername(userName);
          ds.setPassword(password);
          return ds;
      }
  }
  ```

- `MybatisConfig` configuration class

  - Define `SqlSessionFactoryBean`

  - Define mapping configuration

    ```java
    @Bean
    public MapperScannerConfigurer getMapperScannerConfigurer(){
        MapperScannerConfigurer msc = new MapperScannerConfigurer();
        msc.setBasePackage("com.itheima.dao");
        return msc;
    }

    @Bean
    public SqlSessionFactoryBean getSqlSessionFactoryBean(DataSource dataSource){
        SqlSessionFactoryBean ssfb = new SqlSessionFactoryBean();
        ssfb.setTypeAliasesPackage("com.itheima.domain");
        ssfb.setDataSource(dataSource);
        return ssfb;
    }

    ```

### 4.2 Integrating SpringBoot with mybatis :id=h-c0739335b4ae

#### 4.2.1 Creating a module :id=h-cde42d1ac587

- Create a new module, select `Spring Initializr`, and configure its basic information.

<img src="Resources/image-20210917215913779.png" alt="image-20210917215913779" style="zoom:80%;" />

- Select the technologies needed by this module (MyBatis, MySQL).

  <img src="Resources/image-20210917215958091.png" alt="image-20210917215958091" style="zoom:80%;" />

#### 4.2.2 Defining an entity class :id=h-f8d7696c1e40

Define the `Book` entity class in the `com.itheima.domain` package as follows:

```java
public class Book {
    private Integer id;
    private String name;
    private String type;
    private String description;

    //setter and  getter

    //toString
}
```

#### 4.2.3 Defining a dao interface :id=h-47db51a7e11d

Define the `BookDao` interface in the `com.itheima.dao` package as follows:

```java
public interface BookDao {
    @Select("select * from tbl_book where id = #{id}")
    public Book getById(Integer id);
}
```

#### 4.2.4 Defining a test class :id=h-b6a8a4d38117

Define the `com.itheima` package under `test/java`, then create a test class inside it with the following contents:

```java
@SpringBootTest
class Springboot08MybatisApplicationTests {

    @Autowired
    private BookDao bookDao;

    @Test
    void testGetById() {
        Book book = bookDao.getById(1);
        System.out.println(book);
    }
}
```

#### 4.2.5 Writing configuration :id=h-77e36940ada6

Our code does not specify the database, username, or password. Configure these in the `SpringBoot` configuration file.

Add the following configuration to `application.yml`:

```yml
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm_db
    username: root
    password: root
```

#### 4.2.6 Testing :id=h-a070efb8ff0b

Run the test method to see the following error:

<img src="Resources/image-20210917221427930.png" alt="image-20210917221427930" style="zoom:70%;" />

The error says that the `Spring` container has no `bean` of type `BookDao`. Why does this happen?

`Mybatis` scans interfaces, creates their proxy objects, and lets `Spring` manage them. However, we have not told `Mybatis` which interface is a `dao` interface. Add `@Mapper` to `BookDao` to resolve this; the revised `BookDao` is:

```java
@Mapper
public interface BookDao {
    @Select("select * from tbl_book where id = #{id}")
    public Book getById(Integer id);
}
```

> Note:
>
> When `SpringBoot` is earlier than 2.4.3 (exclusive) and the Mysql driver version is greater than 8.0, configure the time zone in the connection URL, `jdbc:mysql://localhost:3306/ssm_db?serverTimezone=UTC`, or configure it on the MySQL database server to resolve this issue.

#### 4.2.7 Using a Druid data source :id=h-4e3c61594e6f

We have not specified a data source, so `SpringBoot` uses its default. To use `Druid` instead, follow these steps:

- Import the `Druid` dependency.

  ```xml
  <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.1.16</version>
  </dependency>
  ```

- Configure it in `application.yml`.

  Use `spring.datasource.type` to select the data source. Update the configuration file as follows:

  ```yaml
  spring:
    datasource:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/ssm_db?serverTimezone=UTC
      username: root
      password: root
      type: com.alibaba.druid.pool.DruidDataSource
  ```

<a id="section-5"></a>

## 5. Example project :id=h-d3a9e2d95bb6

We have now finished learning `SpringBoot`. Next, reimplement the three-framework integration example from `SSM` using `SpringBoot`. This mainly involves copying the previous example and adapting it to `SpringBoot`, in the following areas:

1. pom.xml

   Configure starter dependencies and required dependency coordinates (druid)

2. application.yml

   Configure the data source, port, and other settings

3. Configuration classes

   Delete all

4. dao

   Add @Mapper

5. Test classes

6. Pages

   Place them in static under resources

### 5.1 Creating the project :id=h-65d480d305d6

Create a `SpringBoot` project and select `web`, `mysql`, and `mybatis` during creation. The directory structure is as follows:

<img src="Resources/image-20210917225019868.png" alt="image-20210917225019868" style="zoom:80%;" />

Our project uses `Druid`, so import the `Druid` dependency coordinates.

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.16</version>
</dependency>
```

### 5.2 Copying code :id=h-8378e6cbf11e

Copy the `java` source and test code, including their packages, from `springmvc_11_page` into `springboot_09_ssm`, as shown below.

<img src="Resources/image-20210917225715519.png" alt="image-20210917225715519" style="zoom:70%;" />

Make the following changes:

- Review the existing configuration item by item during migration. Spring Boot can supply some MVC configuration automatically, but custom interceptors, CORS, transaction, data sources, and other settings may still be needed. Do not delete the entire config package directly.

- After copying interfaces in `dao` to `springboot_09-ssm`, add `@Mapper` to each interface.

- Adapt `BookServiceTest` to `SpringBoot` integration with `junit`.

  ```java
  @SpringBootTest
  public class BookServiceTest {

      @Autowired
      private BookService bookService;

      @Test
      public void testGetById(){
          Book book = bookService.getById(2);
          System.out.println(book);
      }

      @Test
      public void testGetAll(){
          List<Book> all = bookService.getAll();
          System.out.println(all);
      }
  }
  ```

### 5.3 Configuration file :id=h-b75ef79976fa

Configure the following in `application.yml`:

- Service port number
- Database connection information
- Data source

```yaml
server:
  port: 80

spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm_db #?servierTimezone=UTC
    username: root
    password: root
```

### 5.4 Static resources :id=h-f30a86c686e1

A `SpringBoot` application has no `webapp` directory. Where should static resources go in a `SpringBoot` application?

Place static resources in `static` under `resources`, as shown below.

<img src="Resources/image-20210917230702072.png" alt="image-20210917230702072" style="zoom:80%;" />

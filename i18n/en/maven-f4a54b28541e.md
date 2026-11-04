# Maven :id=h-9e473096b790

Understand project directories, dependencies, build phases, and common commands, and learn to investigate dependency conflicts during development.

**Prerequisites and versions:** Install a JDK and Maven 3.x. The complete POM uses Java 17. The JDK settings in older screenshots only illustrate the menus; they do not determine the version used in this example.

**Using the examples:** Unless a project explicitly lists every file and all steps to run it, code blocks are separate examples for their respective sections. Fill in omitted code and placeholder names. Lines marked as incorrect illustrate a problem. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://maven.apache.org/guides/)

**On this page**

- [Maven basics](#section-1)
- [Installing and configuring Maven](#section-2)
- [Standard directory layout](#section-3)
- [Understanding pom.xml](#section-4)
- [Maven commands](#section-5)
- [Dependency scopes](#section-6)
- [Dependency conflicts](#section-7)
- [**Looking up Maven coordinates**](#section-8)

<a id="section-1"></a>

## Maven basics :id=h-adf7c25b2ff0

### What is Maven? :id=h-e374cfe94594

Maven is a project-management tool. It represents project development and management through a project object model (POM). Dependency management is one of its core functions, and its build lifecycle defines the process for building and publishing a project.

### What Maven does :id=h-adc90e50135a

- Project builds: provide a standard, cross-platform way to automate project builds.

- Dependency management: manage the libraries a project needs, such as JAR files, and address conflicts between their versions.

- A common project layout: Maven's widespread use has helped establish a standard directory structure.

### Core Maven concepts :id=h-01eec93afc2a

#### Repositories :id=h-f463c4dc92ac

A repository stores artifacts, including JAR files.

Repository types:

- Local repository: stores artifacts on your own computer and obtains them from remote repositories.
- Remote repository: a repository on another machine from which the local repository obtains artifacts.

Types of remote repository

- Central repository: a public Maven repository; it does not contain every Java library in the world.
- Private repository: stores artifacts for a department or company and can obtain artifacts from the central repository.

Why use a private repository?

- Store protected artifacts, including purchased libraries and JAR files developed in-house.
- Open-source libraries also have copyright. Whether an artifact may be published depends on its license and publishing rules. Internal or commercially licensed libraries that cannot be made public are usually stored in an access-controlled private repository.
- Share artifacts within a defined internal group without making them available externally.

#### Coordinates :id=h-4ee501b97a10

Coordinates identify the location of an artifact in a repository.

The parts of Maven coordinates:

- groupId identifies the organization that owns the Maven project. It usually uses a reversed domain name, for example org.mybatis.
- artifactId identifies the Maven project, usually by its module name.
- version identifies the current version number.

Coordinates uniquely identify an artifact so that tools can locate and download it automatically.

<a id="section-2"></a>

## Installing and configuring Maven :id=h-bfdb44e2f7ca

\*\*Maven website:\*\*[https://maven.apache.org/](https://maven.apache.org/)

\*\*Download:\*\*[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

### **Configuring the local repository** :id=h-42d0d729066e

Configure Maven's local repository in **conf/settings.xml**. Find the following block and set **localRepository**.

```xml
<localRepository>/Users/XXXXXXXX/dev/myRepository</localRepository>
```

### **Setting the default JDK version for Maven projects** :id=h-42c9b040cf7d

With the default settings, the compilation target depends on configuration such as the Compiler plugin version. It is not fixed at Java 1.5 for every Maven project. Commonly used JDK versions are 1.8 or higher, so you can change the defaults. Add the following **profile** block inside **profiles**.

```xml
<profile>
  <id>jdk-1.8</id>
  <activation>
    <activeByDefault>true</activeByDefault>
    <jdk>1.8</jdk>
  </activation>
  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
  </properties>
</profile>
```

### **Setting Maven environment variables** :id=h-e9fd48e1194a

On macOS, use the following configuration:

Edit Users/XXXXX/.zshrc and add the following lines.

```
export MAVEN_HOME=/Users/chaishuai/dev/apache-maven-3.8.6
export PATH=$PATH:$MAVEN_HOME/bin
```

On Windows, use the following configuration:

Open Advanced system settings and click Environment Variables. Configure the following system variables:

1. Create the system variable **MAVEN_HOME** with the value **E:\Maven\apache-maven-3.8.6**.
2. Edit the **Path** system variable and append **;%MAVEN_HOME%\bin**.

Run the following command in a terminal. If Maven version information appears, Maven has been installed successfully.

```
$ mvn -v

Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: /opt/apache-maven-3.8.6
Java version: 17.0.4, vendor: Azul Systems, Inc., runtime: /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
Default locale: zh_CN_#Hans, platform encoding: UTF-8
OS name: "mac os x", version: "12.5.1", arch: "aarch64", family: "mac"
```

<a id="section-3"></a>

## Standard directory layout :id=h-d9a3365ab8dc

Creating the standard directory layout

```
MYJAVAPROJECT                           工程名
  |---src                              源码
  |---|---main                             主程序目录
  |---|---|---java                             主程序的 Java 文件
  |---|---|---resources                        主程序的资源文件
    |---|---|---webapp                        	 主程序的网站相关配置文件
  |---|---test                             测试程序目录
  |---|---|---java                              测试程序的 Java 文件
  |---|---|---resources                         测试程序的资源文件
  |---target                           编译结果
  |---pom.xml                          Maven 工程的核心配置
```

<a id="section-4"></a>

## Understanding pom.xml :id=h-95daa6c36f5a

POM stands for Project Object Model.

pom.xml is the central configuration file of a Maven project. It contains the settings related to the build process. Its role is comparable to that of web.xml in a dynamic web project. Put the complete pom.xml file in the project's **root directory**.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>example</groupId>
    <artifactId>maven-notes</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    <properties>
        <maven.compiler.release>17</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
            </plugin>
        </plugins>
    </build>
    <profiles>
        <profile>
            <id>dev</id>
            <properties>
                <app.environment>development</app.environment>
            </properties>
        </profile>
    </profiles>
</project>
```

This complete example is a single-module JAR project using JDK 17 and JUnit 4. A profile must be inside profiles; activate it with mvn test -Pdev.

parent refers to another parent POM; a project cannot be its own parent. modules is for an aggregator project whose packaging is pom. Add module entries only for modules that actually exist.

dependencyManagement centralizes dependency versions; it does not add libraries automatically. optional=true mainly controls whether a dependency is passed on to downstream projects. It does not mean the current project can omit the library. Plugin dependencies belong to the plugin's runtime environment and are separate from the project's dependencies.

For example, a Spring Boot project can inherit its parent POM or import its BOM to manage dependency versions. Other projects still need to specify their versions explicitly.

<a id="section-5"></a>

## Maven commands :id=h-d079803ef152

- mvn clean: delete the target directory.
- mvn compile: compile the main source code and write the result to target/classes.
- mvn test-compile: compile the test source code and write the result to target/test-classes.
- mvn test: run the tests and save their reports in target/surefire-reports.
- mvn package: package the application and save the artifact in target.
- mvn install: install the JAR in the local repository, at the path determined by the project coordinates.
- mvn deploy: publish the JAR to a remote repository.
- mvn dependency:list: list the JAR files on which the current project depends.
- mvn dependency:tree: show the project's dependencies as a tree.
- mvn help:active-profiles: list all active profiles and where they are defined.
- mvn compile -Pdev: activate the profile named dev during compilation. A name is required after -P.

<a id="section-6"></a>

## Dependency scopes :id=h-bc7cfb78dfeb

|          | main directory (location)              | test directory (location)                  | During development (phase) | Deployed to the server (phase) |
| -------- | -------------------------------------- | ------------------------------------------ | -------------------------- | ------------------------------ |
| compile  | Available                              | Available                                  | Available                  | Available                      |
| test     | -                                      | Available                                  | Available                  | -                              |
| provided | Available                              | Available                                  | Available                  | -                              |
| runtime  | Not available when compiling main code | Available when compiling and running tests | Available at runtime       | Available                      |

> **Review:**
>
> - compile: the default scope, used for most ordinary library dependencies.
> - test: for libraries used by tests, such as junit.
> - provided: for libraries needed during development that the server supplies, such as servlet-api and jsp-api. They are excluded from deployment to avoid conflicting with the corresponding libraries already on the server.
> - runtime: for libraries that are not needed during compilation but are needed at runtime.

<a id="section-7"></a>

## Dependency conflicts :id=h-f9b40e98f50c

### How Maven selects dependency versions :id=h-f75cdd53814e

When different dependency paths lead to the same artifact, shallower dependencies take priority over deeper ones.

1. The nearest dependency wins
2. When the paths have the same length, the first declaration wins.

### Resolving conflicts :id=h-32cbdfaf1621

Choose the required version, exclude an unwanted transitive dependency with exclusions, or declare the desired dependency explicitly.

### Plugins for investigating dependency conflicts :id=h-de24543de06d

- Maven Helper for IDEA
- Maven Enforcer plugin

**Run the Enforcer plugin with: mvn clean package enforcer:enforce**

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-enforcer-plugin</artifactId>
            <version>3.5.0</version>
            <executions>
                <execution>
                    <id>check-dependencies</id>
                    <phase>validate</phase>
                    <goals><goal>enforce</goal></goals>
                    <configuration>
                        <rules>
                            <dependencyConvergence/>
                            <requireJavaVersion><version>[17,)</version></requireJavaVersion>
                        </rules>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

This is a build fragment from a POM. Merge it into the existing build section instead of creating a second one. mvn validate checks dependency convergence and the Java version. If a rule finds a conflict, inspect dependency:tree before choosing a version; do not exclude libraries arbitrarily.

pluginManagement only supplies default plugin configuration. To run a plugin automatically in the lifecycle, you usually also need to declare it in plugins. The rules above check version conflicts; they do not check every JAR for duplicate classes.

<a id="section-8"></a>

## **Looking up Maven coordinates** :id=h-88ec0a5c3046

[https://mvnrepository.com/](https://mvnrepository.com/)

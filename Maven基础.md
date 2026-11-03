# Maven

理解项目目录、依赖、构建阶段与常用命令，开发时排查依赖冲突。

**学习前提与版本：** 需要安装 JDK 和 Maven 3.x。完整 POM 采用 Java 17；旧截图中的 JDK 配置只用于解释菜单，不决定本例版本。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[文档目录](README.md) · [官方参考](https://maven.apache.org/guides/)

**内容导航**

- [Maven 基础](#section-1)
- [Maven 安装配置](#section-2)
- [约定的目录结构](#section-3)
- [pom.xml 详解](#section-4)
- [Maven 命令](#section-5)
- [依赖范围](#section-6)
- [依赖冲突](#section-7)
- [**Maven 坐标查询网址**](#section-8)


<a id="section-1"></a>

## Maven 基础

### Maven 是什么

Maven的本质是一个项目管理工具，将项目开发和管理过程抽象成一个项目对象模型（POM：project object model）,Maven最核心的功能是依赖管理，通过构建生命周期定义了一个项目构建跟发布的过程


### Maven 的作用

- 项目构建：提供标准的，跨平台的自动化项目构建方式

- 依赖管理：方便快捷的管理项目依赖的资源(jar包)，避免资源之间的版本冲突

- 统一开发结构：Maven的流行，形成了标准的，统一化的项目结构


### Maven 基础概念

#### 仓库

仓库的作用：用来存储资源，包含各种Jar包

仓库的分类：

- 本地仓库：自己电脑上存储资源的仓库，通过连接远程仓库获取资源
- 远程仓库：非本机电脑上的仓库，为本地仓库获取资源

远程仓库的分类

- 中央仓库：公共 Maven 仓库，不包含世界上所有 Java 库
- 私服：部门，公司范围内存储资源的仓库，从中央仓库获取资源

私服的作用：

- 保存具有版权的资源，包含购买或自主研发的jar包
- 开源库也有版权。是否能公开发布取决于许可证与发布规则；不能公开的内部库或商业授权库通常放在受权限控制的私服
- 一定范围内共享资源，仅对内部开放，对外不共享


#### 坐标

什么是坐标：坐标用于描述仓库中资源的位置

Maven 坐标的组成部分：

- groupId：定义当前 Maven 项目隶属组织名称，通常是域名反写，例如：org.mybatis
- artifactId：定义当前 Maven 项目名称，通常是模块名称
- version：定义当前版本号

坐标的作用：使用唯一标识，唯一性定位资源位置，可以通过该标识将资源的识别和下载由机器完成


<a id="section-2"></a>

## Maven 安装配置

**Maven 官网地址：**https://maven.apache.org/

**下载地址：**https://maven.apache.org/download.cgi


### **配置本地仓库**

在 **conf/settings.xml** 文件中配置 maven 本地仓库，找到如下代码块，配置 **localRepository**

```xml
<localRepository>/Users/XXXXXXXX/dev/myRepository</localRepository>
```


### **配置 Maven 工程的基础 JDK 版本**

如果按照默认配置运行，默认编译目标由 Compiler 插件版本等配置决定，并非所有 Maven 项目都固定为 Java 1.5，而我们常用的 JDK 版本为1.8或者更高，所以可以修改默认配置。在 **profiles** 标签下添加如下 **profile** 代码块。

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


### **配置 Maven 环境变量**

macOS系统配置如下：

编辑 Users/XXXXX/.zshrc 文件，添加如下语句

```
export MAVEN_HOME=/Users/chaishuai/dev/apache-maven-3.8.6
export PATH=$PATH:$MAVEN_HOME/bin
```


Windows系统配置如下：

在"高级系统设置"，点击"环境变量"，来设置环境变量，有以下系统变量需要配置：

1. 新建系统变量 **MAVEN_HOME**，变量值：**E:\Maven\apache-maven-3.8.6**
2. 编辑系统变量 **Path**，添加变量值：**;%MAVEN_HOME%\bin**


在控制台输入如下命令，如果能看到 Maven 相关版本信息，则说明 Maven 已经安装成功：

```
$ mvn -v

Apache Maven 3.8.6 (84538c9988a25aec085021c365c560670ad80f63)
Maven home: /opt/apache-maven-3.8.6
Java version: 17.0.4, vendor: Azul Systems, Inc., runtime: /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
Default locale: zh_CN_#Hans, platform encoding: UTF-8
OS name: "mac os x", version: "12.5.1", arch: "aarch64", family: "mac"
```


<a id="section-3"></a>

## 约定的目录结构

创建约定的目录结构

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

## pom.xml 详解

POM：Project Object Model 项目对象模型

pom.xml 对于 Maven工程是核心配置文件，与构建过程相关的一切设置都在这个文件中进行配置。重要程度相当于web.xml 对于动态web工程。一个完整的pom.xml文件放在项目的**根目录**下。

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

这个完整例子是单模块 JAR 项目，使用 JDK 17 和 JUnit 4。profile 必须放在 profiles 内，可通过 mvn test -Pdev 激活。

parent 指向另一个父 POM，不能把当前项目自己设为父项目。modules 用于聚合项目，其 packaging 应为 pom；只有模块实际存在时才添加 module 条目。

dependencyManagement 统一管理依赖版本，不会自动引入库。optional=true 主要控制依赖向下游项目的传递，不代表当前项目可以缺少该库。插件依赖属于插件自身运行环境，不等于项目 dependencies。

例如，Spring Boot 项目可继承其父 POM，或导入其 BOM 来管理依赖版本；普通项目仍需明确版本。


<a id="section-5"></a>

## Maven 命令

- mvn clean：删除 target 目录
- mvn compile：主程序编译，编译结果存放的目录：target/classes
- mvn test-compile：测试程序编译，编译结果存放的目录：target/test-classes
- mvn test：执行测试程序，测试的报告存放的目录：target/surefire-reports
- mvn package：打包程序，存放的目录：target
- mvn install：安装 jar 包到本地仓库，在仓库中的路径对应项目坐标
- mvn deploy：部署 jar 包到远程仓库
- mvn dependency:list：查看当前工程所依赖的 jar 包的列表
- mvn dependency:tree：以树形结构查看当前工程的依赖信息
- mvn help:active-profiles：列出所有激活的 profile，以及它们在哪里定义
- mvn compile -Pdev：在编译时激活名为 dev 的 profile；-P 后必须指定名称


<a id="section-6"></a>

## 依赖范围

|          | main目录（空间） | test目录（空间） | 开发过程（时间） | 部署到服务器（时间） |
| -------- | ---------------- | ---------------- | ---------------- | -------------------- |
| compile  | 有效             | 有效             | 有效             | 有效                 |
| test     | -                | 有效             | 有效             | -                    |
| provided | 有效             | 有效             | 有效             | -                    |
| runtime | 主代码编译时无 | 测试编译及运行时有效 | 运行时有效 | 有效 |

> **总结：**
>
> - compile：通常使用的 jar 包都是以 compile 范围进行依赖的，是默认值。
> - test：测试使用的 jar 包，以 test 范围依赖进来。比如 junit。
> - provided：在开发过程中需要用到的“服务器上的 jar 包”需要以 provided 范围依赖进来。比如 servlet-api、jsp-api。而这些范围的 jar 包之所以不参与部署是为了避免和服务器上已有的同类 jar 包产生冲突。
> - runtime：用于编译时不需要，运行时需要的 jar 包。


<a id="section-7"></a>

## 依赖冲突

### Maven 版本仲裁机制

当依赖中出现相同的资源时，层级越深，优先级越低，层级越浅，优先级越高；

1. 最短路径优先原则
2. 路径相同的情况下先声明的优先


### 解决办法

在冲突的 jar 包中选定一个，通过 exclusions 排除依赖，或者是明确声明使用某个依赖。


### 排查依赖冲突的插件

- IDEA 的 Maven Helper
- Maven 的 enforcer 插件

**执行 enforcer 插件的命令：mvn clean package enforcer:enforce**

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

这是 POM 的 build 片段；与已有 build 合并，不要重复创建两个 build。mvn validate 会检查依赖版本是否收敛以及 Java 版本。规则发现冲突后，需要检查 dependency:tree 再决定版本，不能随意排除库。

pluginManagement 只提供插件默认配置；要在生命周期自动执行，通常还需在 plugins 中声明插件。上述规则检查版本冲突，不是检查所有 JAR 是否含有重复 class。


<a id="section-8"></a>

## **Maven 坐标查询网址**

https://mvnrepository.com/

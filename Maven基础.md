# Maven



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

- 中央仓库：Maven 团队维护储存所有资源的仓库
- 私服：部门，公司范围内存储资源的仓库，从中央仓库获取资源

私服的作用：

- 保存具有版权的资源，包含购买或自主研发的jar包
- 中央仓库jar包都是开源的，不能储存具有自主版权的jar包
- 一定范围内共享资源，仅对内部开放，对外不共享



#### 坐标

什么是坐标：坐标用于描述仓库中资源的位置

Maven 坐标的组成部分：

- groupId：定义当前 Maven 项目隶属组织名称，通常是域名反写，例如：org.mabitis
- actifactId：定义当前 Maven 项目名称，通常是模块名称
- version：定义当前版本号

坐标的作用：使用唯一标识，唯一性定位资源位置，可以通过该标识将资源的识别和下载由机器完成




## Maven 安装配置

**Maven 官网地址：**https://maven.apache.org/

**下载地址：**https://maven.apache.org/download.cgi



### **配置本地仓库**

在 **conf/settings.xml** 文件中配置 maven 本地仓库，找到如下代码块，配置 **localRepository**

```xml
<localRepository>/Users/XXXXXXXX/dev/myRepository</localRepository>
```



### **配置 Maven 工程的基础 JDK 版本**

如果按照默认配置运行，Java 工程使用的默认 JDK 版本为1.5，而我们常用的 JDK 版本为1.8或者更高，所以可以修改默认配置。在 **profiles** 标签下添加如下 **profile** 代码块。

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



## pom.xml 详解

POM：Project Object Model 项目对象模型

pom.xml 对于 Maven工程是核心配置文件，与构建过程相关的一切设置都在这个文件中进行配置。重要程度相当于web.xml 对于动态web工程。一个完整的pom.xml文件放在项目的**根目录**下。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                      http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
 
	<!-- 基本部分 -->
	<!-- 当前 Maven 工程的坐标 -->
  <groupId>com.companyname.projectname</groupId>
  <artifactId>xxxxxxxx-demo</artifactId>
  <version>1.0-SNAPSHOT</version>
 
  <!-- 当前Maven工程的打包方式，可选值有下面三种： -->
  <!-- jar：表示这个工程是一个Java工程  -->
  <!-- war：表示这个工程是一个Web工程 -->
  <!-- pom：表示这个工程是“管理其他工程”的工程 -->
  <packaging>jar</packaging>

  <!-- parent 标签指定当前工程的父工程 -->
  <parent>
		<!-- 父工程的坐标 -->
    <groupId>com.companyname.projectname</groupId>
    <artifactId>xxxxxxxx-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
	</parent>

  <!--modules 和 module 标签配置当前父工程包含的子模块-->
  <modules>  
    <module>my-maven-demo1</module>
    <module>my-maven-demo2</module>
    <module>my-maven-demo3</module>
  </modules>

   <!-- 更多项目信息 -->
   <!-- 当前工程名称 -->
   <name>my-maven-demo</name>
   <url>http://maven.apache.org</url>

   <!--配置属性集-->
   <properties>
     <!-- 工程构建过程中读取源码时使用的字符集 -->
     <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
     <!-- 通过自定义属性，统一指定 Spring 的版本 -->
     <spring.version>5.3.18</spring.version>
   </properties>

   <!-- 当前工程所依赖的jar包 -->
   <dependencies>
     <!-- 使用 dependency 配置一个具体的依赖 -->
		<dependency>
        <!-- 在 dependency 标签内使用具体的坐标依赖jar包 -->
       <groupId>junit</groupId>
       <artifactId>junit</artifactId>
       <version>4.12</version>
       <!-- scope标签配置依赖的范围 -->
       <scope>test</scope>
    </dependency>
		<dependency>
			<groupId>org.springframework</groupId>
    	<artifactId>spring-context</artifactId>
    	<version>5.3.18</version>
    	<!-- 使用 excludes 标签排除依赖	-->
    	<exclusions>
      <!-- 在 exclude 标签中配置具体要排除的依赖 -->
      	<exclusion>
          <!-- 指定要排除的依赖的坐标（不需要写version） -->
          <groupId>commons-logging</groupId>
          <artifactId>commons-logging</artifactId>
      	</exclusion>
    	</exclusions>
  	</dependency>
	</dependencies>


  <!-- 在父工程中使用 dependencyManagement 标签配置对依赖的管理 -->
  <!-- 被管理的依赖并没有真正被引入到工程，只是指明版本号-->
  <!-- 子工程中依然需要引入以来，只是不需要声明版本号，起到统一依赖版本号的作用 -->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <!-- 使用${}引用自定义属性声明版本号，方便统一管理 -->
        <version>${spring.version}</version>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-beans</artifactId>
        <version>${spring.version}</version>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-expression</artifactId>
        <version>${spring.version}</version>
      </dependency>
      <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-aop</artifactId>
        <version>${spring.version}</version>
      </dependency>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-devtools</artifactId>
          <scope>runtime</scope>
          <!-- 表示该依赖是可选的，即可有可无 -->
          <optional>true</optional>
      </dependency>
    </dependencies>
  </dependencyManagement>

<!-- Maven在构建过程中相关配置 -->
<build>
    <!-- 构建过程中用到的插件 -->
    <plugins>
        <!-- 具体插件，逆向工程的操作是以构建过程中插件形式出现的 -->
        <plugin>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-maven-plugin</artifactId>
            <version>1.3.0</version>
            <!-- 插件用到的依赖 -->
            <dependencies>
                <!-- 逆向工程的核心依赖 -->
                <dependency>
                    <groupId>org.mybatis.generator</groupId>
                    <artifactId>mybatis-generator-core</artifactId>
                    <version>1.3.2</version>
                </dependency>
                <!-- 数据库连接池 -->
                <dependency>
                    <groupId>com.mchange</groupId>
                    <artifactId>c3p0</artifactId>
                    <version>0.9.2</version>
                </dependency>
                <!-- MySQL驱动 -->
                <dependency>
                    <groupId>mysql</groupId>
                    <artifactId>mysql-connector-java</artifactId>
                    <version>5.1.8</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>

<!-- 配置多套环境信息，在特定环境激活特定profile -->
<profile>
	<id>dev</id>
    <activation>
        <!-- 配置是否默认激活 -->
    	<activeByDefault>false</activeByDefault>
    	<!-- 指定激活条件为：JDK 1.6 -->
        <jdk>1.6</jdk>
        <os>
        	<name>Windows XP</name>
            <family>Windows</family>
            <arch>x86</arch>
            <version>5.1.2600</version>
        </os>
        <property>
        	<name>mavenVersion</name>
            <value>2.0.5</value>
        </property>
        <file>
        	<exists>file2.properties</exists>
            <missing>file1.properties</missing>
        </file>
    </activation>
    <!-- Maven 为了能够通过 profile 实现各不同运行环境切换，提供了一种资源属性过滤的机制。-->
    <!-- 通过属性替换实现不同环境使用不同的参数 -->
	<properties>
         <dev.jdbc.user>root</dev.jdbc.user>
         <dev.jdbc.password>root</dev.jdbc.password>
         <dev.jdbc.url>http://localhost:3306/db</dev.jdbc.url>
         <dev.jdbc.driver>com.mysql.jdbc.Driver</dev.jdbc.driver>
     </properties>
     <build>
         <resources>
             <resource>
                 <!-- 表示为这里指定的目录开启资源过滤功能 -->
                 <directory>src/main/resources</directory>
                 <!-- 将资源过滤功能打开 -->
                 <filtering>true</filtering>
             </resource>
         </resources>
     </build>
</profile>
```





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
- mvn compile -P：在编译时指定要激活的 profile



## 依赖范围

|          | main目录（空间） | test目录（空间） | 开发过程（时间） | 部署到服务器（时间） |
| -------- | ---------------- | ---------------- | ---------------- | -------------------- |
| compile  | 有效             | 有效             | 有效             | 有效                 |
| test     | -                | 有效             | 有效             | -                    |
| provided | 有效             | 有效             | 有效             | -                    |
| runtime  | -                | -                | -                | 有效                 |

> **总结：**
>
> - compile：通常使用的 jar 包都是以 compile 范围进行依赖的，是默认值。
> - test：测试使用的 jar 包，以 test 范围依赖进来。比如 junit。
> - provided：在开发过程中需要用到的“服务器上的 jar 包”需要以 provided 范围依赖进来。比如 servlet-api、jsp-api。而这些范围的 jar 包之所以不参与部署是为了避免和服务器上已有的同类 jar 包产生冲突。
> - runtime：用于编译时不需要，运行时需要的 jar 包。



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
<!-- 配置enforcer插件 -->
<build>
   <pluginManagement>
       <plugins>
           <plugin>
               <groupId>org.apache.maven.plugins</groupId>
               <artifactId>maven-enforcer-plugin</artifactId>
               <version>1.4.1</version>
               <executions>
                   <execution>
                       <id>enforce-dependencies</id>
                       <phase>validate</phase>
                       <goals>
                           <goal>display-info</goal>
                           <goal>enforce</goal>
                       </goals>
                   </execution>
               </executions>
               <dependencies>
                   <dependency>
                       <groupId>org.codehaus.mojo</groupId>
                       <artifactId>extra-enforcer-rules</artifactId>
                       <version>1.0-beta-4</version>
                   </dependency>
               </dependencies>
               <configuration>
                   <rules>
                       <banDuplicateClasses>
                           <findAllDuplicates>true</findAllDuplicates>
                       </banDuplicateClasses>
                   </rules>
               </configuration>
           </plugin>
       </plugins>
   </pluginManagement>
</build>

```



## **Maven 坐标查询网址**

https://mvnrepository.com/
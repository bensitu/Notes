# Introduction to Mybatis :id=h-06be47b199d6

Learn parameter binding, result mapping, dynamic SQL, and caching through Mapper interfaces.

**Prerequisites and versions:** Learn SQL and JDBC first. This article uses MyBatis 3 concepts and retains historical POM files and screenshots; old dependencies are only for maintenance reference. The parameter-binding examples are not a complete login system. Real login must not compare plaintext passwords using SQL.

**About screenshots:** Images retain the procedures from the original teaching environment. If an older approach in a screenshot differs from the text, follow the revised text and the official documentation for your chosen version.

**Using the examples:** Unless a project explicitly lists all files and execution steps, code blocks are independent snippets for each section. Fill in omissions and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations in the same section.

[Documentation index](README.md) · [Official references](https://mybatis.org/mybatis-3/zh/index.html)

**Contents**

- [History of MyBatis](#section-1)
- [MyBatis features](#section-2)
- [Downloading MyBatis](#section-3)
- [Comparison with other persistence technologies](#section-4)
- [Setting up MyBatis](#section-5)
- [Development environment](#section-6)
- [Creating a maven project](#section-7)
- [Creating the MyBatis core configuration file](#section-8)
- [Creating a mapper interface](#section-9)
- [Creating a MyBatis mapping file](#section-10)
- [Testing features with junit](#section-11)
- [Adding log4j logging](#section-12)
- [Core configuration file in detail](#section-13)
- [Default type aliases](#section-14)
- [CRUD with MyBatis](#section-15)
- [1. Implementing CRUD with configuration files](#section-16)
- [2. Implementing CRUD with annotations](#section-17)
- [Two ways MyBatis obtains parameter values (key topic)](#section-18)
- [A single literal-type parameter](#section-19)
- [Multiple literal-type parameters](#section-20)
- [Map-type parameters](#section-21)
- [Entity-type parameters](#section-22)
- [Identifying parameters with @Param](#section-23)
- [Review](#section-24)
- [Query features in MyBatis](#section-25)
- [Querying an entity object](#section-26)
- [Querying a List collection](#section-27)
- [Querying a single value](#section-28)
- [Querying one record as a map](#section-29)
- [Querying multiple records as maps](#section-30)
- [Executing special SQL](#section-31)
- [Pattern matching queries](#section-32)
- [Batch deletion](#section-33)
- [Setting table names dynamically](#section-34)
- [Retrieving auto-increment primary keys after insertion](#section-35)
- [Custom mappings with resultMap](#section-36)
- [Mapping columns to properties with resultMap](#section-37)
- [Many-to-one mappings](#section-38)
- [One-to-many mappings](#section-39)
- [Lazy loading](#section-40)
- [Dynamic SQL](#section-41)
- [if](#section-42)
- [where](#section-43)
- [trim](#section-44)
- [choose、when、otherwise](#section-45)
- [foreach](#section-46)
- [SQL fragments](#section-47)
- [Caching in MyBatis](#section-48)
- [First-level cache: reusing results in the same SqlSession](#section-49)
- [Second-level cache: managed by Mapper namespace](#section-50)
- [Query lookup order](#section-51)
- [Integrating the third-party cache EHCache (overview)](#section-52)
- [Reverse engineering with MyBatis](#section-53)
- [Steps for setting up reverse engineering](#section-54)
- [QBC](#section-55)
- [Pagination plugin](#section-56)
- [Steps for using the pagination plugin](#section-57)
- [Using the pagination plugin](#section-58)

<a id="section-1"></a>

## History of MyBatis :id=h-d61adf6e4ae3

- MyBatis began as Apache's open-source project iBatis. In June 2010 it moved from the Apache Software Foundation to Google Code. As the development team moved to Google Code, iBatis3.x was officially renamed MyBatis. The code moved to Github in November 2013.
- The name iBatis combines “internet” and “abatis.” It is a Java-based persistence framework. The persistence framework provided by iBatis includes SQL Maps and Data Access Objects (DAO).
  <a id="section-2"></a>

## MyBatis features :id=h-2683846c18cd

1. MyBatis is an excellent persistence framework supporting custom SQL, stored procedures, and advanced mappings.
2. MyBatis eliminates almost all JDBC code, manual parameter setting, and manual result-set retrieval.
3. MyBatis uses simple XML or annotations for configuration and primitive mappings, mapping interfaces and Java POJOs (Plain Old Java Objects, ordinary Java objects) to database records.
4. MyBatis is a semi-automatic ORM (Object Relation Mapping) framework.
   <a id="section-3"></a>

## Downloading MyBatis :id=h-236c83b28a0a

- [MyBatis download link](https://github.com/mybatis/mybatis-3)
- ![](Resources/MyBatis下载.png)
  <a id="section-4"></a>

## Comparison with other persistence technologies :id=h-9941aa49403c

- JDBC
  - Mixing SQL into Java code creates tight coupling and hard-coding problems.
  - Maintenance is difficult, and real development requirements often involve frequent changes to SQL.
  - Verbose code and low development productivity
- Hibernate and JPA
  - Easy to use and productive for development
  - Long and complex SQL statements require bypassing the framework.
  - Internally generated SQL is difficult to optimize for special requirements.
  - With a fully automatic framework based on complete mappings, partially mapping a POJO with many fields is difficult.
  - Too much reflection reduces database performance.
- MyBatis
  - Lightweight with excellent performance
  - SQL and Java code are separate, with clear boundaries: Java code focuses on business logic, while SQL statements focus on data.
  - Development productivity is slightly lower than HIbernate, but entirely acceptable.
    <a id="section-5"></a>

# Setting up MyBatis :id=h-98f56da232e1

<a id="section-6"></a>

## Development environment :id=h-473cdb4c81e5

- IDE：idea 2019.2
- Build tool: maven 3.5.4
- MySQL version: MySQL 5.7
- MyBatis version: MyBatis 3.5.7
  <a id="section-7"></a>

## Creating a maven project :id=h-906b3b90afa5

- Packaging: jar
- Add dependencies

  ```xml
  <dependencies>
      <!-- See note 1 below. -->
      <dependency>
          <groupId>org.mybatis</groupId>
          <artifactId>mybatis</artifactId>
          <version>3.5.7</version>
      </dependency>
      <!-- See note 2 below. -->
      <dependency>
          <groupId>junit</groupId>
          <artifactId>junit</artifactId>
          <version>4.12</version>
          <scope>test</scope>
      </dependency>
      <!-- See note 3 below. -->
      <dependency>
          <groupId>mysql</groupId>
          <artifactId>mysql-connector-java</artifactId>
          <version>5.1.3</version>
          </dependency>
  </dependencies>
  ```

Example notes:

1. Mybatis core
2. junit tests
3. MySQL driver

<a id="section-8"></a>

## Creating the MyBatis core configuration file :id=h-ef9e8b98f66b

> Conventionally named `mybatis-config.xml`, though this is only a suggestion, not a requirement. After Spring integration, this file can be omitted, so you can copy and paste it for this exercise.
> The core configuration file mainly configures the database connection environment and global MyBatis settings.
> Store it under src/main/resources.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- See note 1 below. -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/MyBatis"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
    <!-- See note 2 below. -->
    <mappers>
        <mapper resource="mappers/UserMapper.xml"/>
    </mappers>
</configuration>
```

Example notes:

1. Configure the database connection environment
2. Import the mapping file

<a id="section-9"></a>

## Creating a mapper interface :id=h-17819eeee969

> A mapper interface in MyBatis corresponds to the earlier dao. Unlike before, however, mapper is only an interface; we do not supply an implementation class.

```java
package com.atguigu.mybatis.mapper;

public interface UserMapper {
    /* See note 1 below. */
    int insertUser();
}
```

Example notes:

1. Add user information

<a id="section-10"></a>

## Creating a MyBatis mapping file :id=h-0fe2930a5b14

- Related concept: ORM (Object Relationship Mapping).
  - Object: an entity object in Java
  - Relation: a relational database
  - Mapping: the correspondence between the two

| Java concept | Database concept |
| ------------ | ---------------- |
| Class        | Table            |
| Property     | Field/column     |
| Object       | Record/row       |

- Mapping file naming rules
  - The name of the entity class corresponding to the table + Mapper.xml
  - For example, table t_user maps to entity class User and mapping file UserMapper.xml.
  - Thus, one mapping file corresponds to one entity class and operations on one table.
  - Entity names should follow Java camel-case naming conventions, such as userName, employeeId, and so on.
  - MyBatis mapping files contain SQL for accessing and manipulating table data.
  - Store MyBatis mapping files under src/main/resources/mappers.
- Interface-based data operations in MyBatis require two matching identifiers:
  - The mapper interface's fully qualified name must match the mapping file's namespace.
  - Each mapper method name must match the id of the corresponding SQL element in the mapping file.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.atguigu.mybatis.mapper.UserMapper">
    <!--int insertUser();-->
    <insert id="insertUser">
        insert into t_user values(null,'张三','123',23,'女')
    </insert>
</mapper>
```

<a id="section-11"></a>

## Testing features with junit :id=h-9004e3348326

- SqlSession represents the session between a Java program and the database. (HttpSession represents the session between a Java program and the browser.)
- SqlSessionFactory is the factory that produces SqlSession objects.
- Factory pattern: If an object's creation process is largely fixed, encapsulate that code in a factory class and use it to produce the required objects.

```java
public class UserMapperTest {
    @Test
    public void testInsertUser() throws IOException {
        // See note 1 below.
        InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
        // See note 2 below.
        SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
        // See note 3 below.
        SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
        // See note 4 below.
        //SqlSession sqlSession = sqlSessionFactory.openSession();
        // See note 5 below.
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        // See note 6 below.
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        // See note 7 below.
        int result = userMapper.insertUser();
        // See note 8 below.
        //sqlSession.commit();
        System.out.println("result:" + result);
    }
}
```

Example notes:

1. Read the MyBatis core configuration file
2. Obtain the SqlSessionFactoryBuilder object
3. Create the factory SqlSessionFactory from the byte input stream for the core configuration file, producing SqlSession objects
4. Obtain sqlSession; SQL executed through SqlSession now requires manual transaction commit or rollback
5. Create SqlSession; SQL executed through SqlSession is now committed automatically
6. Create a proxy implementation object for the UserMapper interface using the proxy pattern
7. Calling a UserMapper method matches the mapping file by the fully qualified name of UserMapper, matches its SQL element by method name, and executes the element's SQL statement
8. Commit the transaction

- Here, commit the transaction manually. To commit the transaction automatically, call `SqlSession sqlSession = sqlSessionFactory.openSession(true);` when obtaining sqlSession and pass the Boolean value true.
  <a id="section-12"></a>

## Adding log4j logging :id=h-97c7fe2b6219

1. Add the dependency
   ```xml
   <!-- See note 1 below. -->
   <dependency>
   <groupId>log4j</groupId>
   <artifactId>log4j</artifactId>
   <version>1.2.17</version>
   </dependency>
   ```

Example notes:

1. log4j logging

2. Add the log4j configuration file
   - Name the log4j configuration file log4j.xml and place it under src/main/resources.
   - Log levels: FATAL (fatal) > ERROR (error) > WARN (warning) > INFO (information) > DEBUG (debug). Output becomes more detailed from left to right.
   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
   <log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">
       <appender name="STDOUT" class="org.apache.log4j.ConsoleAppender">
           <param name="Encoding" value="UTF-8" />
           <layout class="org.apache.log4j.PatternLayout">
               <param name="ConversionPattern" value="%-5p %d{MM-dd HH:mm:ss,SSS} %m (%F:%L) \n" />
           </layout>
       </appender>
       <logger name="java.sql">
           <level value="debug" />
       </logger>
       <logger name="org.apache.ibatis">
           <level value="info" />
       </logger>
       <root>
           <level value="debug" />
           <appender-ref ref="STDOUT" />
       </root>
   </log4j:configuration>
   ```

<a id="section-13"></a>

# Core configuration file in detail :id=h-689a1539915c

> Elements in the core configuration file must follow a fixed order (some may be omitted, but the order must not change):
> properties, settings, typeAliases, typeHandlers, objectFactory, objectWrapperFactory, reflectorFactory, plugins, environments, databaseIdProvider, mappers

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//MyBatis.org//DTD Config 3.0//EN"
        "http://MyBatis.org/dtd/MyBatis-3-config.dtd">
<configuration>
    <!-- See note 1 below. -->
    <properties resource="jdbc.properties"></properties>
    <settings>
        <!-- See note 2 below. -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- See note 3 below. -->
        <setting name="lazyLoadingEnabled" value="true"/>
    </settings>
    <typeAliases>
        <!-- See note 4 below. -->
        <!--<typeAlias type="com.atguigu.mybatis.bean.User"></typeAlias>-->
        <!--<typeAlias type="com.atguigu.mybatis.bean.User" alias="user">
        </typeAlias>-->
        <!-- See note 5 below. -->
        <package name="com.atguigu.mybatis.bean"/>
    </typeAliases>
    <!-- See note 6 below. -->
    <environments default="mysql_test">
        <!-- See note 7 below. -->
        <environment id="mysql_test">
            <!-- See note 8 below. -->
            <transactionManager type="JDBC"/>
            <!-- See note 9 below. -->
            <dataSource type="POOLED">
                <!-- See note 10 below. -->
                <property name="driver" value="${jdbc.driver}"/>
                <!-- See note 11 below. -->
                <property name="url" value="${jdbc.url}"/>
                <!-- See note 12 below. -->
                <property name="username" value="${jdbc.username}"/>
                <!-- See note 13 below. -->
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
    <!-- See note 14 below. -->
    <mappers>
        <!-- <mapper resource="UserMapper.xml"/> -->
        <!-- See note 15 below. -->
        <package name="com.atguigu.mybatis.mapper"/>
    </mappers>
</configuration>
```

Example notes:

1. Import a properties file, then access values using ${propertyName}
2. Automatically convert underscore-separated table column names to camel case
3. Enable lazy loading
4. typeAlias: Sets an alias for a specific type. Attributes: type is the fully qualified type name; alias specifies a case-insensitive alias. If omitted, the default alias is the class name.
5. Set default aliases for every type in a package: each alias is its class name and is case-insensitive.
6. environments: Defines multiple database connection environments. Attribute: default specifies the id of the default environment.
7. environment: Defines a specific database connection environment. Attribute: id uniquely identifies it. Set that id in the environments default attribute to use it by default.
8. transactionManager: Configures transaction management. Attribute: type specifies the transaction management approach, type="JDBC|MANAGED". type="JDBC" requires manual management of the environment's transaction. type="MANAGED" delegates management of transaction, for example to Spring's AOP.
9. dataSource: Configures the data source. Attribute: type specifies the type, type="POOLED|UNPOOLED|JNDI". type="POOLED" uses a connection pool, caching connections for reuse without recreating them. type="UNPOOLED" does not use a pool and creates a connection each time. type="JNDI" obtains a data source from the context.
10. Set the driver's fully qualified class name
11. Set the database connection URL
12. Set the database connection username
13. Set the database connection password
14. Import the mapping file
15. Import all mapping files in a package into the core configuration. Note: 1. Mapper interfaces and mapping files must be in the same package. 2. Each mapper interface name must match its mapping filename.

- ![](Resources/mapper接口和mapper映射文件在同一包下.png)

<a id="section-14"></a>

# Default type aliases :id=h-53a3bd5aca0c

The `resultType` attribute in a mapping configuration specifies the result type (the fully qualified class name). Repeating this is cumbersome; Mybatis provides `类型别名` (typeAliases) to simplify it.

First configure type aliases in the core configuration file. Every class in the pojo package receives a case-insensitive alias equal to its class name:

```xml
<typeAliases>
    <!-- See note 1 below. -->
    <package name="com.itheima.pojo"/>
</typeAliases>

```

Example notes:

1. The name attribute specifies the package containing the entity classes

This configuration simplifies the `resultType` attribute values in mapping files.

```xml
<mapper namespace="com.itheima.mapper.UserMapper">
    <select id="selectAll" resultType="user">
        select * from tb_user;
    </select>
</mapper>
```

![](Resources/默认的类型别名1.png)
![](Resources/默认的类型别名2.png)

<a id="section-15"></a>

# CRUD with MyBatis :id=h-5d6ba39e92cb

1. Add
   ```xml
   <!--int insertUser();-->
   <insert id="insertUser">
       insert into t_user values(null,'admin','123456',23,'男','12345@qq.com')
   </insert>
   ```
2. Delete
   ```xml
   <!--int deleteUser();-->
   <delete id="deleteUser">
       delete from t_user where id = 6
   </delete>
   ```
3. Update
   ```xml
   <!--int updateUser();-->
   <update id="updateUser">
       update t_user set username = '张三' where id = 5
   </update>
   ```
4. Querying an entity object
   ```xml
   <!--User getUserById();-->
   <select id="getUserById" resultType="com.atguigu.mybatis.bean.User">
       select * from t_user where id = 2
   </select>
   ```
5. Querying a collection
   ```xml
   <!--List<User> getUserList();-->
   <select id="getUserList" resultType="com.atguigu.mybatis.bean.User">
       select * from t_user
   </select>
   ```

- Note:

  1. A select element must specify resultType or resultMap to define the mapping between entity classes and database tables.
     - resultType: automatic mapping when property names match table column names
     - resultMap: custom mapping for one-to-many, many-to-one, or mismatched column and property names
  2. When a query returns multiple records, return a collection rather than an entity, or TooManyResultsException is thrown. If it returns only one record, either an entity or a collection is valid.

<a id="section-16"></a>

## 1. Implementing CRUD with configuration files :id=h-29cc920636af

![image-20210729111159534](Resources/image-20210729111159534.png)

The product prototype above includes brand-data features such as `查询`, `按条件查询`, `添加`, `删除`, `批量删除`, and `修改`, all of which are CRUD operations on database records. Next, implement brand CRUD with Mybatis. The required features are:

> - Query
>   - Query all data
>   - Query details
>   - Conditional queries
> - Add
> - Update
>   - Update all fields
>   - Update fields dynamically
> - Delete
>   - Delete one record
>   - Batch deletion

First, prepare the required environment.

### 1.1 Preparing the environment :id=h-c9f69e29eca9

- Prepare the database table (tb_brand) and data

  ```sql
  -- See note 1 below.
  drop table if exists tb_brand;
  -- See note 2 below.
  create table tb_brand
  (
      -- See note 3 below.
      id           int primary key auto_increment,
      -- See note 4 below.
      brand_name   varchar(20),
      -- See note 5 below.
      company_name varchar(20),
      -- See note 6 below.
      ordered      int,
      -- See note 7 below.
      description  varchar(100),
      -- See note 8 below.
      status       int
  );
  -- See note 9 below.
  insert into tb_brand (brand_name, company_name, ordered, description, status)
  values ('三只松鼠', '三只松鼠股份有限公司', 5, '好吃不上火', 0),
         ('华为', '华为技术有限公司', 100, '华为致力于把数字世界带入每个人、每个家庭、每个组织，构建万物互联的智能世界', 1),
         ('小米', '小米科技有限公司', 50, 'are you ok', 1);
  ```

Example notes:

1. Drop the tb_brand table
2. Create the tb_brand table
3. id primary key
4. Brand name
5. Company name
6. Sort field
7. Description
8. Status: 0 = disabled, 1 = enabled
9. Add data

- Brand entity class

  Create the Brand entity class in the `com.itheima.pojo` package.

  ```java
  public class Brand {
      // See note 1 below.
      private Integer id;
      // See note 2 below.
      private String brandName;
      // See note 3 below.
      private String companyName;
      // See note 4 below.
      private Integer ordered;
      // See note 5 below.
      private String description;
      // See note 6 below.
      private Integer status;

      // See note 7 below.
  }
  ```

Example notes:

1. id primary key
2. Brand name
3. Company name
4. Sort field
5. Description
6. Status: 0 = disabled, 1 = enabled
7. Setter and getter methods are omitted. Add them when writing the code yourself.

- Write test cases

  Create packages and test cases under `test/java`. The project structure is as follows:

  <img src="Resources/image-20210729112907106.png" alt="image-20210729112907106" style="zoom:80%;" />

- Install the MyBatisX plugin

  - MybatisX is a rapid-development plugin based on IDEA, designed for productivity.

  - Main features

    - Navigate between XML mapping files and interface methods
    - Generate a statement from an interface method

  - Installation

    Click `file`, select `settings`, and the following screen appears:

    <img src="Resources/image-20210729113304743.png" alt="image-20210729113304743" style="zoom:80%;" />

    > Note: Restart IDEA after installation.

  - Plugin behavior

    <img src="Resources/image-20210729164450524.png" alt="image-20210729164450524" style="zoom:70%;" />

    The red-ribbon icon represents a mapping file; the blue-ribbon icon represents a mapper interface. Click the red-ribbon bird icon in a mapper interface to jump to its mapping file, or the blue-ribbon bird icon in a mapping file to jump to its mapper interface. Defining an interface method can also generate the corresponding `statement` in the mapping file, as shown below.

    ![image-20210729165337223](Resources/image-20210729165337223.png)

### 1.2 Querying all data :id=h-879eee9890f2

<img src="Resources/image-20210729165724838.png" alt="image-20210729165724838" style="zoom:80%;" />

The data displayed on the page above must be queried from the database. Implement the query-all feature through the following steps:

- Write the interface method: Mapper interface

  - Parameters: none

    Querying all data requires no conditions, so the method needs no parameters.

    <img src="Resources/image-20210729171208737.png" alt="image-20210729171208737" style="zoom:80%;" />

  - Result: List<Brand>

    Each queried record becomes a `Brand` object. Multiple records become multiple `Brand` objects, which are returned together in a List.

    <img src="Resources/image-20210729171146911.png" alt="image-20210729171146911" style="zoom:80%;" />

  - Execute the method and test

#### 1.2.1 Writing the interface method :id=h-c371505186d4

Create the `BrandMapper` interface in the `com.itheima.mapper` package and define `List<Brand> selectAll()` in it.

```java
public interface BrandMapper {

    /* See note 1 below. */
    List<Brand> selectAll();
}
```

Example notes:

1. Query all records

#### 1.2.2 Writing the SQL statement :id=h-36af81fae153

Create the `com/itheima/mapper` directory structure under `reources`, then create the mapping file `BrandMapper.xml` inside it.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.itheima.mapper.BrandMapper">
    <select id="selectAll" resultType="brand">
        select *
        from tb_brand;
    </select>
</mapper>
```

#### 1.2.3 Writing the test method :id=h-a2d4e460ff88

In `MybatisTest`, write a method to test querying all records.

```java
@Test
public void testSelectAll() throws IOException {
    // See note 1 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

    // See note 2 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();

    // See note 3 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);

    // See note 4 below.
    List<Brand> brands = brandMapper.selectAll();
    System.out.println(brands);

    // See note 5 below.
    sqlSession.close();

}
```

Example notes:

1. 1. Obtain SqlSessionFactory
2. 2. Obtain the SqlSession object
3. 3. Obtain the Mapper interface's proxy object
4. 4. Execute the method
5. 5. Release resources

> The test code currently feels cumbersome. Bear with it for now; later, we will write only step 3 above, with the other steps handled for us.

The test result is:

![image-20210729172544230](Resources/image-20210729172544230.png)

The result reveals a problem: some data was mapped successfully, but some was not. Why?

There are two ways to solve this:

- Give columns aliases
- Define column-to-property mappings with resultMap

#### 1.2.4 Solving the problem with aliases :id=h-a39ecf704a06

The data for `brandName` and `companyName` was not mapped. In the entity, the properties are `brandName` and `companyName`, while the table columns are `brand_name` and `company_name`, as shown below. Making these names match resolves the problem.

<img src="Resources/image-20210729173210433.png" alt="image-20210729173210433" style="zoom:80%;" />

In the SQL, give those two columns aliases matching their property names.

```xml
<select id="selectAll" resultType="brand">
    select
    id, brand_name as brandName, company_name as companyName, ordered, description, status
    from tb_brand;
</select>
```

Writing the column list in the SQL above is cumbersome. More columns and other features querying them would make the code repetitive. Mybatis provides `sql` fragments to improve SQL reuse.

**SQL fragments:**

- Extract reusable SQL fragments into `sql` elements.

  ```xml
  <sql id="brand_column">
      id, brand_name as brandName, company_name as companyName, ordered, description, status
  </sql>
  ```

  The id attribute is its unique identifier and is used to reference it.

- Reference it in the original SQL statement.

  Use `include` to reference the SQL fragment, with `refid` specifying the SQL fragment's id.

  ```xml
  <select id="selectAll" resultType="brand">
      select
      <include refid="brand_column" />
      from tb_brand;
  </select>
  ```

#### 1.2.5 Solving the problem with resultMap :id=h-589d45f8ce86

Aliases plus SQL fragments solve the problem but have limitations. A feature querying only some fields needs another SQL fragment, reducing flexibility.

Alternatively, use resultMap to define column-to-property mappings.

- Define column-to-property mappings with resultMap in the mapping configuration file

  ```xml
  <resultMap id="brandResultMap" type="brand">
      <!-- See note 1 below. -->
      <result column="brand_name" property="brandName"/>
      <result column="company_name" property="companyName"/>
  </resultMap>
  ```

Example notes:

1. id: maps the primary-key column; column: table column name; property: entity property name. result: maps an ordinary column; column: table column name; property: entity property name.

> Note: Define only mappings whose column and property names differ; matching names need no explicit definition.

- Write the SQL statement normally.

  ```xml
  <select id="selectAll" resultMap="brandResultMap">
      select *
      from tb_brand;
  </select>
  ```

#### 1.2.6 Summary :id=h-d8a9f9970f47

Different entity property and database column names prevent automatic mapping.

- \==Aliases:== In SQL, alias mismatched column names to match the entity's properties.
  - Define <sql> fragments to improve reuse.
- \==resultMap:== Define <resultMap> to map differing property and column names.

We ultimately choose resultMap. The query-all statement in the mapping file is:

```xml
 <resultMap id="brandResultMap" type="brand">
     <!-- See note 1 below. -->
     <result column="brand_name" property="brandName"/>
     <result column="company_name" property="companyName"/>
</resultMap>



<select id="selectAll" resultMap="brandResultMap">
    select *
    from tb_brand;
</select>
```

Example notes:

1. id: maps the primary-key column; column: table column name; property: entity property name. result: maps an ordinary column; column: table column name; property: entity property name.

### 1.3 Querying details :id=h-19e09cd0e83a

<img src="Resources/image-20210729180118287.png" alt="image-20210729180118287" style="zoom:80%;" />

Some records have too many properties to display in a page's table, so only some are shown. Retrieve the other properties through `查看详情`, as shown above.

Steps for implementing detail queries:

- Write the interface method: Mapper interface

  <img src="Resources/image-20210729180604529.png" alt="image-20210729180604529" style="zoom:80%;" />

  - Parameter: id

    Viewing details queries one row by id. Later, the page will supply the id.

  - Result: Brand

    A query by id returns one record, which can be wrapped in one Brand object.

- Write the SQL statement: SQL mapping file

  <img src="Resources/image-20210729180709318.png" alt="image-20210729180709318" style="zoom:80%;" />

- Execute the method and test

#### 1.3.1 Writing the interface method :id=h-2e55a7139a87

Define a query-by-id method in `BrandMapper`.

```java
/* See note 1 below. */
Brand selectById(int id);
```

Example notes:

1. View details: query by Id

#### 1.3.2 Writing the SQL statement :id=h-30559ef666b1

In `BrandMapper.xml`, write `statement` using `resultMap` instead of `resultType`.

```xml
<select id="selectById"  resultMap="brandResultMap">
    select *
    from tb_brand where id = #{id};
</select>
```

> Note: Leave #{id} in the SQL above as written for now; it will be explained shortly.

#### 1.3.3 Writing the test method :id=h-651cf6f7004c

Define a test method in `MybatisTest类中`, in the `com.itheima.mapper` package under `test/java`.

```java
 @Test
public void testSelectById() throws IOException {
    // See note 1 below.
    int id = 1;

    // See note 2 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

    // See note 3 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();

    // See note 4 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);

    // See note 5 below.
    Brand brand = brandMapper.selectById(id);
    System.out.println(brand);

    // See note 6 below.
    sqlSession.close();
}
```

Example notes:

1. Receive the parameter; this id will be passed in later
2. 1. Obtain SqlSessionFactory
3. 2. Obtain the SqlSession object
4. 3. Obtain the Mapper interface's proxy object
5. 4. Execute the method
6. 5. Release resources

The test result is:

<img src="Resources/image-20210729182223137.png" alt="image-20210729182223137" style="zoom:70%;" />

#### 1.3.4 Parameter placeholders :id=h-a7586c9f2b5e

The result is the row with id 1. Examine the console's SQL: it uses ? as a placeholder. Thus, `#{id}` in the mapping file ultimately becomes ?. Next, let's discuss these parameter placeholders.

mybatis provides two parameter placeholders:

- \#{}: When executing SQL, replaces #{} with ? and automatically sets parameter values. As the example shows, #{} uses `PreparedStatement` underneath.

- ${}: Inserts text directly into SQL, potentially causing SQL injection. The JDBC statement type is controlled by statementType, which defaults to PreparedStatement; ${} does not automatically switch to Statement. Replace #{} with ${} in the mapping file as shown below to observe the effect.

  ```xml
  <select id="selectById"  resultMap="brandResultMap">
      select *
      from tb_brand where id = ${id};
  </select>
  ```

  Run it again to see the following result:

  <img src="Resources/image-20210729184156019.png" alt="image-20210729184156019" style="zoom:70%;" />

> \==Note:== These two examples show why we use #{} parameter placeholders in development.

#### 1.3.5 Using parameterType :id=h-a1b22b887c47

For a mapper method with parameters, `ParameterType` specifies their type in the mapping file. However, this attribute can be omitted, as shown below.

```xml
<select id="selectById" parameterType="int" resultMap="brandResultMap">
    select *
    from tb_brand where id = ${id};
</select>
```

#### 1.3.6 Handling special characters in SQL statements :id=h-3ea4f26bd133

You will need special characters in SQL, such as testing whether a field is greater than a value, as shown below.

<img src="Resources/image-20210729184756094.png" alt="image-20210729184756094" style="zoom:80%;" />

An error appears because the mapping file is XML, where > and < have special meanings. Escape these symbols using either of the following approaches:

- Escape sequences

  `&lt;` below is the escape sequence for `<`.

  <img src="Resources/image-20210729185128686.png" alt="image-20210729185128686" style="zoom:60%;" />

- <![CDATA[内容]]>

  <img src="Resources/image-20210729185030318.png" alt="image-20210729185030318" style="zoom:60%;" />

### 1.4 Multiple-condition queries :id=h-307c99fc650c

![image-20210729203804276](Resources/image-20210729203804276.png)

Multiple-condition queries like the one above are common, with results displayed in a list below. To implement this, determine the final SQL statement by considering two questions:

- Condition expressions
- How to combine them

The `企业名称` and `品牌名称` fields require pattern matching, so their conditions are:

<img src="Resources/image-20210729204458815.png" alt="image-20210729204458815" style="zoom:70%;" />

After that analysis, the implementation steps are:

- Write the interface method
  - Parameters: all query conditions
  - Result: List<Brand>

- Write the SQL statement in the mapping file

- Write and execute the test method

#### 1.4.1 Writing the interface method :id=h-26dbe9979403

Define a multiple-condition query method in `BrandMapper`.

This feature has three parameters, so consider how to declare them in the interface. Mybatis supports several approaches for multiple parameters.

- Mark every parameter with `@Param("参数名称")` and use `#{参数名称}` placeholders in the mapping file.

  ```java
  List<Brand> selectByCondition(@Param("status") int status, @Param("companyName") String companyName,@Param("brandName") String brandName);
  ```

- Wrap multiple parameters in one entity object and use it as the method parameter. When using `#{内容}` in SQL, the name inside must match an entity property.

  ```java
  List<Brand> selectByCondition(Brand brand);
  ```

- Wrap multiple parameters in a map and use it as the method parameter. When using `#{内容}` in SQL, the name inside must match a map key.

  ```
  List<Brand> selectByCondition(Map map);
  ```

#### 1.4.2 Writing the SQL statement :id=h-195ad6e98b54

In `BrandMapper.xml`, write `statement` using `resultMap` instead of `resultType`.

```xml
<select id="selectByCondition" resultMap="brandResultMap">
    select *
    from tb_brand
    where status = #{status}
    and company_name like #{companyName}
    and brand_name like #{brandName}
</select>
```

#### 1.4.3 Writing the test method :id=h-025bfbfed913

Define a test method in `MybatisTest类中`, in the `com.itheima.mapper` package under `test/java`.

```java
@Test
public void testSelectByCondition() throws IOException {
    // See note 1 below.
    int status = 1;
    String companyName = "华为";
    String brandName = "华为";

    // See note 2 below.
    companyName = "%" + companyName + "%";
    brandName = "%" + brandName + "%";

    // See note 3 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 4 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    // See note 5 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);

    // See note 6 below.
    // See note 7 below.
    //List<Brand> brands = brandMapper.selectByCondition(status, companyName, brandName);
    // See note 8 below.
     // See note 9 below.
    /* Brand brand = new Brand();
        brand.setStatus(status);
        brand.setCompanyName(companyName);
        brand.setBrandName(brandName);*/

    //List<Brand> brands = brandMapper.selectByCondition(brand);

    // See note 10 below.
    Map map = new HashMap();
    map.put("status" , status);
    map.put("companyName", companyName);
    map.put("brandName" , brandName);
    List<Brand> brands = brandMapper.selectByCondition(map);
    System.out.println(brands);

    // See note 11 below.
    sqlSession.close();
}
```

Example notes:

1. Receive parameters
2. Process parameters
3. 1. Obtain SqlSessionFactory
4. 2. Obtain the SqlSession object
5. 3. Obtain the Mapper interface's proxy object
6. 4. Execute the method
7. Approach 1: Call the method whose interface parameters use @Param
8. Approach 2: Call the method whose parameter is an entity object
9. Wrap the data in an object
10. Approach 3: Call the method whose parameter is a map object
11. 5. Release resources

#### 1.4.4 Dynamic SQL :id=h-22435506342f

The implementation above has a major issue: users will not necessarily fill every condition, so our SQL cannot remain fixed.

If the user enters only the current status, the SQL is:

```sql
select * from tb_brand where status = #{status}
```

If the user enters only the company name, the SQL is:

```sql
select * from tb_brand where company_name like #{companName}
```

If the user enters `当前状态` and `企业名称 `, the SQL differs again.

```sql
select * from tb_brand where status = #{status} and company_name like #{companName}
```

Mybatis provides strong support for dynamic SQL to address these requirements:

> - if
>
> - choose (when, otherwise)
>
> - trim (where, set)
>
> - foreach

First, learn the if and where tags:

- if tag: conditional evaluation

  - test attribute: logical expression

  ```xml
  <select id="selectByCondition" resultMap="brandResultMap">
      select *
      from tb_brand
      where
          <if test="status != null">
              and status = #{status}
          </if>
          <if test="companyName != null and companyName != '' ">
              and company_name like #{companyName}
          </if>
          <if test="brandName != null and brandName != '' ">
              and brand_name like #{brandName}
          </if>
  </select>
  ```

  This SQL is assembled dynamically according to parameter values. If status and companyName have values, only those two conditions are added.

  The execution result is:

  ![image-20210729212510291](Resources/image-20210729212510291.png)

  However, there is a problem if the parameter values are:

  ```java
  Map map = new HashMap();
  // map.put("status" , status);
  map.put("companyName", companyName);
  map.put("brandName" , brandName);
  ```

  The resulting SQL becomes:

  ```sql
  select * from tb_brand where and company_name like ? and brand_name like ?
  ```

  Here, where is immediately followed by and, making the SQL invalid. The where tag solves this.

- where tag

  - Purpose:
    - Replaces the where keyword
    - Dynamically removes and before the first condition
    - Adds no where keyword if all parameters have no values

  ```xml
  <select id="selectByCondition" resultMap="brandResultMap">
      select *
      from tb_brand
      <where>
          <if test="status != null">
              and status = #{status}
          </if>
          <if test="companyName != null and companyName != '' ">
              and company_name like #{companyName}
          </if>
          <if test="brandName != null and brandName != '' ">
              and brand_name like #{brandName}
          </if>
      </where>
  </select>
  ```

  > Note: Prefix every condition with and.

### 1.5 A single condition (dynamic SQL) :id=h-1ba926a2538b

<img src="Resources/image-20210729213613029.png" alt="image-20210729213613029" style="zoom:80%;" />

The query above lets users choose only one of `品牌名称`, `当前状态`, or `企业名称`, but we do not know which one they will select. This is dynamic SQL with a single condition.

Implement this with `choose（when，otherwise）标签`. The `choose` tag is similar to a switch statement in Java.

Use these tags in an example.

#### 1.5.1 Writing the interface method :id=h-b68476efb750

Define a single-condition query method in `BrandMapper`.

```java
/* See note 1 below. */
List<Brand> selectByConditionSingle(Brand brand);
```

Example notes:

1. Single-condition dynamic query; @param brand; @return

#### 1.5.2 Writing the SQL statement :id=h-211e1f6c9637

In `BrandMapper.xml`, write `statement` using `resultMap` instead of `resultType`.

```xml
<select id="selectByConditionSingle" resultMap="brandResultMap">
    select *
    from tb_brand
    <where>
        <choose><!-- See note 1 below. -->
            <when test="status != null"><!-- See note 2 below. -->
                status = #{status}
            </when>
            <when test="companyName != null and companyName != '' "><!-- See note 3 below. -->
                company_name like #{companyName}
            </when>
            <when test="brandName != null and brandName != ''"><!-- See note 4 below. -->
                brand_name like #{brandName}
            </when>
        </choose>
    </where>
</select>
```

Example notes:

1. Equivalent to switch
2. Equivalent to case
3. Equivalent to case
4. Equivalent to case

#### 1.5.3 Writing the test method :id=h-af0b7c4dfd73

Define a test method in `MybatisTest类中`, in the `com.itheima.mapper` package under `test/java`.

```java
@Test
public void testSelectByConditionSingle() throws IOException {
    // See note 1 below.
    int status = 1;
    String companyName = "华为";
    String brandName = "华为";

    // See note 2 below.
    companyName = "%" + companyName + "%";
    brandName = "%" + brandName + "%";

    // See note 3 below.
    Brand brand = new Brand();
    //brand.setStatus(status);
    brand.setCompanyName(companyName);
    //brand.setBrandName(brandName);

    // See note 4 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 5 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    // See note 6 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 7 below.
    List<Brand> brands = brandMapper.selectByConditionSingle(brand);
    System.out.println(brands);

    // See note 8 below.
    sqlSession.close();
}
```

Example notes:

1. Receive parameters
2. Process parameters
3. Wrap the data in an object
4. 1. Obtain SqlSessionFactory
5. 2. Obtain the SqlSession object
6. 3. Obtain the Mapper interface's proxy object
7. 4. Execute the method
8. 5. Release resources

The test result is:

<img src="Resources/image-20210729214548756.png" alt="image-20210729214548756" style="zoom:70%;" />

### 1.6 Adding data :id=h-87c7dd18b6f7

<img src="Resources/image-20210729214917317.png" alt="image-20210729214917317" style="zoom:70%;" />

The page above is a typical data-entry page. After entering values and clicking `提交`, the data is added to the database. Next, implement this operation.

- Write the interface method

  <img src="Resources/image-20210729215351651.png" alt="image-20210729215351651" style="zoom:80%;" />

  Parameters: all data except id. The id is the table's primary key and is generated by ==auto-increment==.

- Write the SQL statement

  <img src="Resources/image-20210729215537167.png" alt="image-20210729215537167" style="zoom:80%;" />

- Write and execute the test method

With the implementation steps clarified, carry out the following operations.

#### 1.6.1 Writing the interface method :id=h-36f6c58b02d0

Define an add method in `BrandMapper`.

```java
 /* See note 1 below. */
void add(Brand brand);
```

Example notes:

1. Add

#### 1.6.2 Writing the SQL statement :id=h-21b31ff5c4a6

In `BrandMapper.xml`, write the `statement` for adding data.

```xml
<insert id="add">
    insert into tb_brand (brand_name, company_name, ordered, description, status)
    values (#{brandName}, #{companyName}, #{ordered}, #{description}, #{status});
</insert>
```

#### 1.6.3 Writing the test method :id=h-dfc1f7b9d89d

Define a test method in `MybatisTest类中`, in the `com.itheima.mapper` package under `test/java`.

```java
@Test
public void testAdd() throws IOException {
    // See note 1 below.
    int status = 1;
    String companyName = "波导手机";
    String brandName = "波导";
    String description = "手机中的战斗机";
    int ordered = 100;

    // See note 2 below.
    Brand brand = new Brand();
    brand.setStatus(status);
    brand.setCompanyName(companyName);
    brand.setBrandName(brandName);
    brand.setDescription(description);
    brand.setOrdered(ordered);

    // See note 3 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 4 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    // See note 5 below.
    // See note 6 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 7 below.
    brandMapper.add(brand);
    // See note 8 below.
    sqlSession.commit();
    // See note 9 below.
    sqlSession.close();
}
```

Example notes:

1. Receive parameters
2. Wrap the data in an object
3. 1. Obtain SqlSessionFactory
4. 2. Obtain the SqlSession object
5. SqlSession sqlSession = sqlSessionFactory.openSession(true); // Enable automatic transaction commit; no manual transaction commit is needed
6. 3. Obtain the Mapper interface's proxy object
7. 4. Execute the method
8. Commit the transaction
9. 5. Release resources

The execution result is:

![image-20210729220348255](Resources/image-20210729220348255.png)

#### 1.6.4 Adding records: retrieving the primary key :id=h-dd906c42cf11

After inserting data, you sometimes need its database-generated primary key (which is auto-incremented).

For example, adding an order and its items; the image below shows an order on JD.com.

<img src="Resources/image-20210729221207962.png" alt="image-20210729221207962" style="zoom:80%;" />

Order data is stored in the order table, and items in the order-item table.

- Add the order data

  <img src="Resources/image-20210729221049462.png" alt="image-20210729221049462" style="zoom:80%;" />

- Add order-item data, setting each item's order id

  <img src="Resources/image-20210729221058898.png" alt="image-20210729221058898" style="zoom:80%;" />

Now that we understand when `主键返回`, simulate it by printing id after insertion. If it prints, the key was retrieved.

Modify `statement` in the brand-insertion example's mapping file as follows:

```xml
<insert id="add" useGeneratedKeys="true" keyProperty="id">
    insert into tb_brand (brand_name, company_name, ordered, description, status)
    values (#{brandName}, #{companyName}, #{ordered}, #{description}, #{status});
</insert>
```

> Add these attributes to insert:
>
> - useGeneratedKeys: whether to retrieve the generated primary key; true enables retrieval
> - keyProperty: the property into which the retrieved key is stored

### 1.7 Updating records :id=h-d6a08d1b2003

<img src="Resources/image-20210729222642700.png" alt="image-20210729222642700" style="zoom:80%;" />

On the edit page, the user enters changes and clicks `提交` to update the corresponding database record. If an input is empty, should we replace the field with blank data or keep its previous value? Here, we keep the previous data.

Next, implement this.

#### 1.7.1 Writing the interface method :id=h-422bef540f96

Define an update method in `BrandMapper`.

```java
 /* See note 1 below. */
void update(Brand brand);
```

Example notes:

1. Update

> Brand holds the data to update. Unlike insertion, its id must already have a value.

#### 1.7.2 Writing the SQL statement :id=h-bac4984faaec

In `BrandMapper.xml`, write the `statement` for updating data.

```xml
<update id="update">
    update tb_brand
    <set>
        <if test="brandName != null and brandName != ''">
            brand_name = #{brandName},
        </if>
        <if test="companyName != null and companyName != ''">
            company_name = #{companyName},
        </if>
        <if test="ordered != null">
            ordered = #{ordered},
        </if>
        <if test="description != null and description != ''">
            description = #{description},
        </if>
        <if test="status != null">
            status = #{status}
        </if>
    </set>
    where id = #{id};
</update>
```

> The *set* tag dynamically includes columns to update and ignores those not being updated.

#### 1.7.3 Writing the test method :id=h-a47ee1dfdcd2

Define a test method in `MybatisTest类中`, in the `com.itheima.mapper` package under `test/java`.

```java
@Test
public void testUpdate() throws IOException {
    // See note 1 below.
    int status = 0;
    String companyName = "波导手机";
    String brandName = "波导";
    String description = "波导手机,手机中的战斗机";
    int ordered = 200;
    int id = 6;

    // See note 2 below.
    Brand brand = new Brand();
    brand.setStatus(status);
    //        brand.setCompanyName(companyName);
    //        brand.setBrandName(brandName);
    //        brand.setDescription(description);
    //        brand.setOrdered(ordered);
    brand.setId(id);

    // See note 3 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 4 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    //SqlSession sqlSession = sqlSessionFactory.openSession(true);
    // See note 5 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 6 below.
    int count = brandMapper.update(brand);
    System.out.println(count);
    // See note 7 below.
    sqlSession.commit();
    // See note 8 below.
    sqlSession.close();
}
```

Example notes:

1. Receive parameters
2. Wrap the data in an object
3. 1. Obtain SqlSessionFactory
4. 2. Obtain the SqlSession object
5. 3. Obtain the Mapper interface's proxy object
6. 4. Execute the method
7. Commit the transaction
8. 5. Release resources

The test result is:

![image-20210729224205522](Resources/image-20210729224205522.png)

The resulting SQL shows that only `status` was updated, because only `status` in the Brand entity had a value. This is the effect of `set`.

### 1.8 Deleting one row :id=h-a5b7f9512a90

![image-20210729224549305](Resources/image-20210729224549305.png)

Each row above has a `删除` button that deletes it when clicked. What identifies the record to delete? The primary key id, since it uniquely identifies each table record.

Next, implement this feature.

#### 1.8.1 Writing the interface method :id=h-2cfe338844f2

Define a delete-by-id method in `BrandMapper`.

```java
/* See note 1 below. */
void deleteById(int id);
```

Example notes:

1. Delete by id

#### 1.8.2 Writing the SQL statement :id=h-0453e7c196ba

In `BrandMapper.xml`, write the `statement` for deleting one row.

```xml
<delete id="deleteById">
    delete from tb_brand where id = #{id};
</delete>
```

#### 1.8.3 Writing the test method :id=h-7348a39c258c

Define a test method in `MybatisTest类中`, in the `com.itheima.mapper` package under `test/java`.

```java
 @Test
public void testDeleteById() throws IOException {
    // See note 1 below.
    int id = 6;

    // See note 2 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 3 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    //SqlSession sqlSession = sqlSessionFactory.openSession(true);
    // See note 4 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 5 below.
    brandMapper.deleteById(id);
    // See note 6 below.
    sqlSession.commit();
    // See note 7 below.
    sqlSession.close();
}
```

Example notes:

1. Receive parameters
2. 1. Obtain SqlSessionFactory
3. 2. Obtain the SqlSession object
4. 3. Obtain the Mapper interface's proxy object
5. 4. Execute the method
6. Commit the transaction
7. 5. Release resources

If execution reports no error, check the database directly to see whether the data still exists.

### 1.9 Batch deletion :id=h-580ff9dad357

<img src="Resources/image-20210729225713894.png" alt="image-20210729225713894" style="zoom:70%;" />

Users can select several records and click `删除` above to delete the corresponding database rows.

#### 1.9.1 Writing the interface method :id=h-30918aa86815

Define a method for deleting multiple rows in `BrandMapper`.

```java
/* See note 1 below. */
void deleteByIds(int[] ids);
```

Example notes:

1. Batch deletion

> The parameter is an array containing the ids of multiple records.

#### 1.9.2 Writing the SQL statement :id=h-6362a5f02f31

In `BrandMapper.xml`, write the `statement` for deleting multiple rows.

When writing SQL, iterate over the array to assemble SQL. Mybatis provides `foreach` for this.

**foreach tag**

Iterates over any iterable object, such as an array or collection.

- collection attribute:
  - mybatis wraps an array parameter in a Map.
    - Default: array = the array
    - Use @Param to change the default map key name.
- item attribute: the element obtained in the current iteration.
- separator attribute: the separator between iterated items. `foreach` adds no extra separators, so none is added after the last iteration.
- open attribute: text prepended once before assembling SQL.
- close attribute: text appended once after assembling SQL.

```xml
<delete id="deleteByIds">
    delete from tb_brand where id
    in
    <foreach collection="array" item="id" separator="," open="(" close=")">
        #{id}
    </foreach>
    ;
</delete>
```

> If the id array contains {1,2,3}, the resulting SQL is:
>
> ```sql
> delete from tb_brand where id in (1,2,3);
> ```

#### 1.9.3 Writing the test method :id=h-b34189b09df5

Define a test method in `MybatisTest类中`, in the `com.itheima.mapper` package under `test/java`.

```java
@Test
public void testDeleteByIds() throws IOException {
    // See note 1 below.
    int[] ids = {5,7,8};

    // See note 2 below.
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    // See note 3 below.
    SqlSession sqlSession = sqlSessionFactory.openSession();
    //SqlSession sqlSession = sqlSessionFactory.openSession(true);
    // See note 4 below.
    BrandMapper brandMapper = sqlSession.getMapper(BrandMapper.class);
    // See note 5 below.
    brandMapper.deleteByIds(ids);
    // See note 6 below.
    sqlSession.commit();
    // See note 7 below.
    sqlSession.close();
}
```

Example notes:

1. Receive parameters
2. 1. Obtain SqlSessionFactory
3. 2. Obtain the SqlSession object
4. 3. Obtain the Mapper interface's proxy object
5. 4. Execute the method
6. Commit the transaction
7. 5. Release resources

### 1.10 Parameter passing in Mybatis :id=h-e2d53169bf09

Mybatis interface methods can accept various parameters:

- Multiple parameters
- A single parameter, which can have the following types
  - POJO type
  - Map collection type
  - Collection type
  - List collection type
  - Array type
  - Other types

#### 1.10.1 Multiple parameters :id=h-2b516aec3036

The following method accepts two parameters. Multiple parameters require `@Param`, but why? To understand this, examine how Mybatis handles parameters internally.

```java
User select(@Param("username") String username,@Param("password") String password);
```

```xml
<select id="select" resultType="user">
    select *
    from tb_user
    where
        username=#{username}
        and password=#{password}
</select>
```

Mybatis wraps multiple interface parameters in a Map. Values are the parameter values; without `@Param`, keys follow these naming rules:

- arg prefix: the first parameter is arg0, the second arg1, and so on. For example:

  > map.put("arg0", parameterValue1);
  >
  > map.put("arg1", parameterValue2);

- param prefix: the first parameter is param1, the second param2, and so on. For example:

  > map.put("param1", parameterValue1);
  >
  > map.put("param2", parameterValue2);

**Verify with code:**

- Define the following method in `UserMapper`:

  ```java
  User select(String username,String password);
  ```

- Define SQL in the `UserMapper.xml` mapping file.

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{arg0}
          and password=#{arg1}
  </select>
  ```

  Or

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{param1}
          and password=#{param2}
  </select>
  ```

- The execution result is:

  <img src="Resources/image-20210805230303461.png" alt="image-20210805230303461" style="zoom:80%;" />

  Using `arg` and `param` names in the mapping file's SQL makes the code hard to read. Use `@Param` instead.

When an interface parameter has `@Param`, Mybatis replaces its `arg` key with the annotation's value.

**Verify with code:**

- Define this method in `UserMapper`, adding `@Param` to `username`.

  ```java
  User select(@Param("username") String username, String password);
  ```

  Mybatis now uses these keys when building the Map:

  > map.put("username", parameterValue1);
  >
  > map.put("arg1", parameterValue2);
  >
  > map.put("param1", parameterValue1);
  >
  > map.put("param2", parameterValue2);

- Define SQL in the `UserMapper.xml` mapping file.

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{username}
          and password=#{param2}
  </select>
  ```

- The program runs without errors. However, if `username` in `#{}` is still written as `arg0`:

  ```xml
  <select id="select" resultType="user">
      select *
      from tb_user
      where
          username=#{arg0}
          and password=#{param2}
  </select>
  ```

- Running the program produces an error.

  ![image-20210805231727206](Resources/image-20210805231727206.png)

\==Conclusion: For multiple interface parameters, annotate every parameter with `@Param` to improve readability.==

#### 1.10.2 A single parameter :id=h-6b3e7abb2d1e

- POJO type

  Use directly. `属性名` must match `参数占位符名称`.

- Map collection type

  Use directly. `map集合的键名` must match `参数占位符名称`.

- Collection type

  Mybatis wraps the collection in a map as follows:

  > map.put("arg0", collection);
  >
  > map.put("collection", collection;

  \==Use `@Param` to replace the map's default arg key name.==

- List collection type

  Mybatis wraps the collection in a map as follows:

  > map.put("arg0", list);
  >
  > map.put("collection", list);
  >
  > map.put("list", list);

  \==Use `@Param` to replace the map's default arg key name.==

- Array type

  Mybatis wraps the collection in a map as follows:

  > map.put("arg0", array);
  >
  > map.put("array", array);

  \==Use `@Param` to replace the map's default arg key name.==

- Other types

  For types such as int, `参数占位符名称` can have any name; choose a meaningful one.

<a id="section-17"></a>

## 2. Implementing CRUD with annotations :id=h-780a0c79de5e

Annotation-based development is more convenient than configuration files. The following example uses annotations:

```java
@Select(value = "select * from tb_user where id = #{id}")
public User select(int id);
```

> \==Note:==
>
> - Annotations replace mapping-file configuration, so the corresponding `statement` need not be written in the mapping file.

Mybatis provides clearly named annotations for CURD operations:

- Query: @Select
- Insert: @Insert
- Update: @Update
- Delete: @Delete

Next, use Mybatis annotations in an example.

**Implementation:**

- Comment out the query-by-id `statement` in the previous example's `UserMapper.xml`.

  <img src="Resources/image-20210805235229938.png" alt="image-20210805235229938" style="zoom:70%;" />

- Add an annotation to `selectById` in `UserMapper`.

  <img src="Resources/image-20210805235405070.png" alt="image-20210805235405070" style="zoom:70%;" />

- The test still queries the data successfully.

Only this query annotation is demonstrated here. Implement the others as practice; they are similarly simple.

\==Note:== The official documentation says the following in `入门`:

![image-20210805234302849](Resources/image-20210805234302849.png)

Therefore, ==use annotations for simple features and configuration files for complex ones.==

The earlier dynamic SQL is complex. Implementing it with annotations requires the Mybatis SQL builder; the code is:

<img src="Resources/image-20210805234842497.png" alt="image-20210805234842497" style="zoom:70%;" />

This mixes Java code with SQL, greatly reducing readability.

<a id="section-18"></a>

# Two ways MyBatis obtains parameter values (key topic) :id=h-6637756c2de2

- MyBatis obtains parameter values through ${} and #{}.
- ${} performs string concatenation; #{} binds a value to a placeholder.
- ${} builds SQL by concatenating strings, so values for string or date fields need manually added single quotes. #{} uses parameter placeholders, so string or date values are handled automatically without manually adding single quotes.
  <a id="section-19"></a>

## A single literal-type parameter :id=h-2fb02fd1ec44

- For a single literal-type mapper parameter, ${} and #{} can obtain its value using any name (preferably meaningful). Remember that ${} requires manual single quotes.

```xml
<!--User getUserByUsername(String username);-->
<select id="getUserByUsername" resultType="User">
    select * from t_user where username = #{username}
</select>
```

```xml
<!--User getUserByUsername(String username);-->
<select id="getUserByUsername" resultType="User">
    select * from t_user where username = '${username}'
</select>
```

<a id="section-20"></a>

## Multiple literal-type parameters :id=h-c6aab81f35d9

- For multiple mapper parameters, MyBatis automatically places them in a map.

  1. Keys arg0, arg1, ... map to parameter values;
  2. Keys param1, param2, ... map to parameter values;
- Access those map keys with ${} or #{} to obtain the corresponding values. ${} requires manual single quotes.
- Either arg or param works; arg starts at arg0, while param starts at param1.

```xml
<!--User checkLogin(String username,String password);-->
<select id="checkLogin" resultType="User">
    select * from t_user where username = #{arg0} and password = #{arg1}
</select>
```

```xml
<!--User checkLogin(String username,String password);-->
<select id="checkLogin" resultType="User">
    select * from t_user where username = '${param1}' and password = '${param2}'
</select>
```

<a id="section-21"></a>

## Map-type parameters :id=h-3b3b1f89d892

- For multiple mapper arguments, you can create a map manually and put the data in it. Access its keys through ${} or #{} to obtain values. ${} requires manual single quotes.

```xml
<!--User checkLoginByMap(Map<String,Object> map);-->
<select id="checkLoginByMap" resultType="User">
    select * from t_user where username = #{username} and password = #{password}
</select>
```

```java
@Test
public void checkLoginByMap() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
    Map<String,Object> map = new HashMap<>();
    map.put("usermane","admin");
    map.put("password","123456");
    User user = mapper.checkLoginByMap(map);
    System.out.println(user);
}
```

<a id="section-22"></a>

## Entity-type parameters :id=h-cd15ba511ba1

- For an entity-object mapper parameter, use ${} or #{} with the object's property names to obtain values. ${} requires manual single quotes.

```xml
<!--int insertUser(User user);-->
<insert id="insertUser">
    insert into t_user values(null,#{username},#{password},#{age},#{sex},#{email})
</insert>
```

```java
@Test
public void insertUser() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
    User user = new User(null,"Tom","123456",12,"男","123@321.com");
    mapper.insertUser(user);
}
```

<a id="section-23"></a>

## Identifying parameters with @Param :id=h-7ab544ea7ee2

- Annotate mapper parameters with @Param to place them in a map.

  1. Keys are @Param value attributes, and values are the parameter values;
  2. Keys param1, param2, ... map to parameter values;
- Access map keys with ${} or #{} to obtain the values. ${} requires manual single quotes.

```xml
<!--User CheckLoginByParam(@Param("username") String username, @Param("password") String password);-->
    <select id="CheckLoginByParam" resultType="User">
        select * from t_user where username = #{username} and password = #{password}
    </select>
```

```java
@Test
public void checkLoginByParam() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    ParameterMapper mapper = sqlSession.getMapper(ParameterMapper.class);
    mapper.CheckLoginByParam("admin","123456");
}
```

<a id="section-24"></a>

## Summary :id=h-babcaf88289f

- Handle parameters using two cases:

  1. Entity-type parameters
  2. Identifying parameters with @Param

<a id="section-25"></a>

# Query features in MyBatis :id=h-2ad26506c580

1. If a query returns only one record, receive it using:
   1. An entity object
   2. A List collection
   3. A Map, producing `{password=123456, sex=男, id=1, age=23, username=admin}`
2. If a query returns multiple records, an entity object cannot receive them; doing so throws TooManyResultsException. Use:
   1. A LIst of entity objects
   2. A LIst of Maps
   3. Add @MapKey to the mapper method.
      <a id="section-26"></a>

## Querying an entity object :id=h-125c6169b04f

```java
/* See note 1 below. */
User getUserById(@Param("id") int id);
```

Example notes:

1. Query user information by user id; @param id; @return

```xml
<!--User getUserById(@Param("id") int id);-->
<select id="getUserById" resultType="User">
    select * from t_user where id = #{id}
</select>
```

<a id="section-27"></a>

## Querying a List collection :id=h-9bd352533f4e

```java
/* See note 1 below. */
List<User> getUserList();
```

Example notes:

1. Query all user information; @return

```xml
<!--List<User> getUserList();-->
<select id="getUserList" resultType="User">
    select * from t_user
</select>
```

<a id="section-28"></a>

## Querying a single value :id=h-9ffbd7ff6b0b

```java
/* See note 1 below. */
int getCount();
```

Example notes:

1. Query the total number of users; @return. MyBatis defines aliases for commonly used Java types, for example java.lang.Integer → int|integer, int → \_int|\_integer, Map → map, and List → list.

```xml
<!--int getCount();-->
<select id="getCount" resultType="_integer">
    select count(id) from t_user
</select>
```

<a id="section-29"></a>

## Querying one record as a map :id=h-829d8666e7c2

```java
/* See note 1 below. */
Map<String, Object> getUserToMap(@Param("id") int id);
```

Example notes:

1. Query user information as a map by user id; @param id; @return

```xml
<!--Map<String, Object> getUserToMap(@Param("id") int id);-->
<select id="getUserToMap" resultType="map">
    select * from t_user where id = #{id}
</select>
<!-- See note 1 below. -->
```

Example notes:

1. Result: {password=123456, sex=male, id=1, age=23, username=admin}

<a id="section-30"></a>

## Querying multiple records as maps :id=h-a5b278759a22

### Approach 1 :id=h-7367f8d69ba3

```java
/* See note 1 below. */
List<Map<String, Object>> getAllUserToMap();
```

Example notes:

1. Query all user information as maps; @return. Each row corresponds to one map. Multiple rows produce multiple maps, which can be returned in a list.

```xml
<!--Map<String, Object> getAllUserToMap();-->
<select id="getAllUserToMap" resultType="map">
    select * from t_user
</select>
<!-- See note 1 below. -->
```

Example notes:

1. Result: \[{password=123456, sex=male, id=1, age=23, username=admin}, {password=123456, sex=male, id=2, age=23, username=Zhang San}, {password=123456, sex=male, id=3, age=23, username=Zhang San}]

### Approach 2 :id=h-2f8870fcb873

```java
/* See note 1 below. */
@MapKey("id")
Map<String, Object> getAllUserToMap();
```

Example notes:

1. Query all user information as maps; @return. Each row produces one map. To return multiple row maps inside a single map, set its key using @MapKey; each value is the map for one row.

```xml
<!--Map<String, Object> getAllUserToMap();-->
<select id="getAllUserToMap" resultType="map">
    select * from t_user
</select>
<!-- See note 1 below. -->
```

Example notes:

1. Result: {1={password=123456, sex=male, id=1, age=23, username=admin}, 2={password=123456, sex=male, id=2, age=23, username=Zhang San}, 3={password=123456, sex=male, id=3, age=23, username=Zhang San}}

<a id="section-31"></a>

# Executing special SQL :id=h-9cf1ed312fd7

<a id="section-32"></a>

## Pattern matching queries :id=h-1a32c5b91283

```java
/* See note 1 below. */
List<User> getUserByLike(@Param("username") String username);
```

Example notes:

1. Pattern-match usernames; @param username; @return java.util.List\<com.atguigu.mybatis.pojo.User>; @date 2022/2/26 21:56

```xml
<!--List<User> getUserByLike(@Param("username") String username);-->
<select id="getUserByLike" resultType="User">
    <!--select * from t_user where username like '%${mohu}%'-->
    <!--select * from t_user where username like concat('%',#{mohu},'%')-->
    select * from t_user where username like concat('%', #{username}, '%')
</select>
```

- `select * from t_user where username like concat('%', #{username}, '%')` is the most common approach.
  <a id="section-33"></a>

## Batch deletion :id=h-054feb479839

One #{} binds one value; it cannot expand the string "1,2,3" into three parameters. Pass an ID collection and use foreach to create a placeholder for every ID. Do not concatenate user-provided ID text directly.

The following method belongs to a Mapper interface and requires java.util.List and org.apache.ibatis.annotations.Param imports. Reject null and empty lists before calling it; an empty list must not cause the delete condition to disappear.

```java
/* See note 1 below. */
int deleteMore(@Param("ids") List<Integer> ids);
```

Example notes:

1. Batch-delete by id; @param ids; @return int; @date 2022/2/26 22:06

```xml
<delete id="deleteMore">
    delete from t_user where id in
    <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
    </foreach>
</delete>
```

```java
// See note 1 below.
@Test
public void deleteMore() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    SQLMapper mapper = sqlSession.getMapper(SQLMapper.class);
    int result = mapper.deleteMore(java.util.Arrays.asList(1, 2, 3, 8));
    System.out.println(result);
}
```

Example notes:

1. Test classes

<a id="section-34"></a>

## Setting table names dynamically :id=h-19d8c4095183

- A table name is not a data value and cannot be bound with #{}. If ${} must substitute a table name, first restrict input to table names explicitly allowed by the program. Never concatenate request parameters directly into SQL. Prefer separate methods for fixed tables.

```java
/* See note 1 below. */
List<User> getUserByTable(@Param("tableName") String tableName);
```

Example notes:

1. Query data from a specified table; @param tableName; @return java.util.List\<com.atguigu.mybatis.pojo.User>; @date 2022/2/27 14:41

```xml
<!--List<User> getUserByTable(@Param("tableName") String tableName);-->
<select id="getUserByTable" resultType="User">
    select * from ${tableName}
</select>
```

<a id="section-35"></a>

## Retrieving an auto-increment primary key after insertion :id=h-b285e80ffcc4

- Use case
  - t_clazz(clazz_id,clazz_name)
  - t_student(student_id,student_name,clazz_id)
  1. Add class information
  2. Retrieve the newly added class's id
  3. Assign students to the class by updating a student's class id to the newly added class's id
- Set two attributes on mapper.xml:
  - useGeneratedKeys: enables generated primary keys
  * keyProperty: Since insert, update, and delete return the number of affected rows, store the generated key in a property of the passed user object.

```java
/* See note 1 below. */
void insertUser(User user);
```

Example notes:

1. Add user information; @param user; @date 2022/2/27 15:04

```xml
<!--void insertUser(User user);-->
<insert id="insertUser" useGeneratedKeys="true" keyProperty="id">
    insert into t_user values (null,#{username},#{password},#{age},#{sex},#{email})
</insert>
```

```java
// See note 1 below.
@Test
public void insertUser() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    SQLMapper mapper = sqlSession.getMapper(SQLMapper.class);
    User user = new User(null, "ton", "123", 23, "男", "123@321.com");
    mapper.insertUser(user);
    System.out.println(user);
    // See note 2 below.
}
```

Example notes:

1. Test classes
2. Output: user{id=10, username='ton', password='123', age=23, sex='male', email='<123@321.com>'}. The generated key is stored in user's id property.

<a id="section-36"></a>

# Custom mappings with resultMap :id=h-7deb5025be51

<a id="section-37"></a>

## Mapping columns to properties with resultMap :id=h-eb38e63cd456

- resultMap: defines custom mappings
  - Attributes:
    - id: a unique mapping identifier; duplicates are not allowed
    - type: the entity type to which query data is mapped
  - Child elements:
    - id: defines the primary-key mapping
    - result: defines ordinary column mappings
    - Child-element attributes:
      - property: the entity property name in the mapping
      - column: the table column name in the mapping
- If column names differ from entity property names, use resultMap for custom mappings. In this example, map every property, including those whose names already match.

```xml
<resultMap id="empResultMap" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
</resultMap>
<!--List<Emp> getAllEmp();-->
<select id="getAllEmp" resultMap="empResultMap">
    select * from t_emp
</select>
```

- If differing column and property names follow database conventions (underscores) and Java conventions (camel case), respectively, either of these approaches can handle the mapping:

  1. Give columns aliases matching entity property names.
     ```xml
     <!--List<Emp> getAllEmp();-->
     <select id="getAllEmp" resultType="Emp">
         select eid,emp_name empName,age,sex,email from t_emp
     </select>
     ```
  2. In the `setting` element of MyBatis's core configuration, set the global mapUnderscoreToCamelCase option to automatically convert underscore-separated column names to camel case. For example, column user_name becomes userName when mapUnderscoreToCamelCase is configured. [Core configuration file in detail](#核心配置文件详解)
     ```xml
     ```

    <settings>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
        ```

<a id="section-38"></a>

## Many-to-one mappings :id=h-a2740435ad51

> Query employee information and the corresponding department

```java
public class Emp {
    private Integer eid;
    private String empName;
    private Integer age;
    private String sex;
    private String email;
    private Dept dept;
    // See note 1 below.
}
```

Example notes:

1. ...constructors, get and set methods, etc.

### Handle mappings through property paths :id=h-a3d5aa93bd8f

```xml
<resultMap id="empAndDeptResultMapOne" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
    <result property="dept.did" column="did"></result>
    <result property="dept.deptName" column="dept_name"></result>
</resultMap>
<!--Emp getEmpAndDept(@Param("eid")Integer eid);-->
<select id="getEmpAndDept" resultMap="empAndDeptResultMapOne">
    select * from t_emp left join t_dept on t_emp.did = t_dept.did where t_emp.eid = #{eid}
</select>
```

### Handle mappings with association :id=h-59ffb20af231

- association: handles many-to-one mappings
- property: the property requiring the many-to-one mapping
- javaType: the property's type

```xml
<resultMap id="empAndDeptResultMapTwo" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
    <association property="dept" javaType="Dept">
        <id property="did" column="did"></id>
        <result property="deptName" column="dept_name"></result>
    </association>
</resultMap>
<!--Emp getEmpAndDept(@Param("eid")Integer eid);-->
<select id="getEmpAndDept" resultMap="empAndDeptResultMapTwo">
    select * from t_emp left join t_dept on t_emp.did = t_dept.did where t_emp.eid = #{eid}
</select>
```

### Step-by-step queries :id=h-1bc23c5b87ff

#### 1. Query employee information :id=h-7e1cfb776e7b

- select: the unique SQL identifier for the nested query (namespace.SQLId or the mapper interface's fully qualified name.methodName)
- column: the condition for the nested query

```java
// See note 1 below.
/* See note 2 below. */
Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);
```

Example notes:

1. Methods in EmpMapper
2. Query employees and their departments in steps; step 1: query employee information; @param; @return com.atguigu.mybatis.pojo.Emp; @date 2022/2/27 20:17

```xml
<resultMap id="empAndDeptByStepResultMap" type="Emp">
    <id property="eid" column="eid"></id>
    <result property="empName" column="emp_name"></result>
    <result property="age" column="age"></result>
    <result property="sex" column="sex"></result>
    <result property="email" column="email"></result>
    <association property="dept"
                 select="com.atguigu.mybatis.mapper.DeptMapper.getEmpAndDeptByStepTwo"
                 column="did"></association>
</resultMap>
<!--Emp getEmpAndDeptByStepOne(@Param("eid") Integer eid);-->
<select id="getEmpAndDeptByStepOne" resultMap="empAndDeptByStepResultMap">
    select * from t_emp where eid = #{eid}
</select>
```

#### 2. Query department information :id=h-c84619b94812

```java
// See note 1 below.
/* See note 2 below. */
Dept getEmpAndDeptByStepTwo(@Param("did") Integer did);
```

Example notes:

1. Methods in DeptMapper
2. Query employees and their departments in steps; step 2: query the employee's department by did; @param; @return com.atguigu.mybatis.pojo.Emp; @date 2022/2/27 20:23

```xml
<!-- See note 1 below. -->
<resultMap id="EmpAndDeptByStepTwoResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
</resultMap>
<!--Dept getEmpAndDeptByStepTwo(@Param("did") Integer did);-->
<select id="getEmpAndDeptByStepTwo" resultMap="EmpAndDeptByStepTwoResultMap">
    select * from t_dept where did = #{did}
</select>
```

Example notes:

1. Here, resultMap only maps columns to properties.

<a id="section-39"></a>

## One-to-many mappings :id=h-47403238bad0

```java
public class Dept {
    private Integer did;
    private String deptName;
    private List<Emp> emps;
    // See note 1 below.
}
```

Example notes:

1. ...constructors, get and set methods, etc.

### collection :id=h-b95033f02065

- collection: handles one-to-many mappings
- ofType: the type of data stored in the collection represented by this property

```xml
<resultMap id="DeptAndEmpResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
    <collection property="emps" ofType="Emp">
        <id property="eid" column="eid"></id>
        <result property="empName" column="emp_name"></result>
        <result property="age" column="age"></result>
        <result property="sex" column="sex"></result>
        <result property="email" column="email"></result>
    </collection>
</resultMap>
<!--Dept getDeptAndEmp(@Param("did") Integer did);-->
<select id="getDeptAndEmp" resultMap="DeptAndEmpResultMap">
    select * from t_dept left join t_emp on t_dept.did = t_emp.did where t_dept.did = #{did}
</select>
```

### Step-by-step queries :id=h-38bf91a4fc50

#### 1. Query department information :id=h-c78a01805cfc

```java
/* See note 1 below. */
Dept getDeptAndEmpByStepOne(@Param("did") Integer did);
```

Example notes:

1. Query a department and all its employees in steps; step 1: query the department; @param did; @return com.atguigu.mybatis.pojo.Dept; @date 2022/2/27 22:04

```xml
<resultMap id="DeptAndEmpByStepOneResultMap" type="Dept">
    <id property="did" column="did"></id>
    <result property="deptName" column="dept_name"></result>
    <collection property="emps"
                select="com.atguigu.mybatis.mapper.EmpMapper.getDeptAndEmpByStepTwo"
                column="did"></collection>
</resultMap>
<!--Dept getDeptAndEmpByStepOne(@Param("did") Integer did);-->
<select id="getDeptAndEmpByStepOne" resultMap="DeptAndEmpByStepOneResultMap">
    select * from t_dept where did = #{did}
</select>
```

#### 2. Query every employee in the department by department id :id=h-35933fac8856

```java
/* See note 1 below. */
List<Emp> getDeptAndEmpByStepTwo(@Param("did") Integer did);
```

Example notes:

1. Query a department and all its employees in steps; step 2: query its employees by department id; @param did; @return java.util.List\<com.atguigu.mybatis.pojo.Emp>; @date 2022/2/27 22:10

```xml
<!--List<Emp> getDeptAndEmpByStepTwo(@Param("did") Integer did);-->
<select id="getDeptAndEmpByStepTwo" resultType="Emp">
    select * from t_emp where did = #{did}
</select>
```

<a id="section-40"></a>

## Lazy loading :id=h-556efc5e5ef2

- An advantage of nested queries is lazy loading, but global settings must be configured in the core configuration file:
  - lazyLoadingEnabled: the global lazy-loading switch; enabling it defers loading of associated objects
  - aggressiveLazyLoading: when enabled, calling any method loads all the object's properties; otherwise, each property loads on demand
- This enables on-demand loading: only the SQL for the requested data executes. Set fetchType on association or collection to choose lazy loading for the current nested query, fetchType="lazy (deferred loading)|eager (immediate loading)".

```xml
<settings>
    <!-- See note 1 below. -->
    <setting name="lazyLoadingEnabled" value="true"/>
</settings>
```

Example notes:

1. Enable lazy loading

```java
@Test
public void getEmpAndDeptByStepOne() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    Emp emp = mapper.getEmpAndDeptByStepOne(1);
    System.out.println(emp.getEmpName());
}
```

- With lazy loading disabled, both SQL statements ran. ![](Resources/延迟加载测试1.png)
- With lazy loading enabled, only the SQL for emp runs.
  ![](Resources/延迟加载测试2.png)

```java
@Test
public void getEmpAndDeptByStepOne() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    Emp emp = mapper.getEmpAndDeptByStepOne(1);
    System.out.println(emp.getEmpName());
    System.out.println("----------------");
    System.out.println(emp.getDept());
}
```

- Once enabled, the corresponding SQL runs only when dept is needed. ![](Resources/延迟加载测试3.png)
- fetchType: overrides global lazy-loading settings on association or collection, fetchType="lazy (deferred loading)|eager (immediate loading)".

  ```xml
  <resultMap id="empAndDeptByStepResultMap" type="Emp">
      <id property="eid" column="eid"></id>
      <result property="empName" column="emp_name"></result>
      <result property="age" column="age"></result>
      <result property="sex" column="sex"></result>
      <result property="email" column="email"></result>
      <association property="dept"
                   select="com.atguigu.mybatis.mapper.DeptMapper.getEmpAndDeptByStepTwo"
                   column="did"
                   fetchType="lazy"></association>
  </resultMap>
  ```

<a id="section-41"></a>

# Dynamic SQL :id=h-6d8d59c7efc5

- Mybatis dynamic SQL assembles SQL statements according to specific conditions, addressing the difficulties of concatenating SQL strings.
  <a id="section-42"></a>

## if :id=h-6be7f7d5e886

- The if tag evaluates the expression in test (using the supplied data). If true, its contents execute; otherwise, they do not.
- Add an always-true condition `1=1` after where.
  - This always-true condition does not affect query results.
  - Use `1=1` to assemble `and`, for example when empName is null.
    - Without the always-true condition, SQL becomes `select * from t_emp where and age = ? and sex = ? and email = ?`, with `where` next to `and`, causing a SQL error.
    - With an always-true condition, SQL becomes `select * from t_emp where 1= 1 and age = ? and sex = ? and email = ?` and no error occurs.

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp where 1=1
    <if test="empName != null and empName !=''">
        and emp_name = #{empName}
    </if>
    <if test="age != null">
        and age = #{age}
    </if>
    <if test="sex != null and sex !=''">
        and sex = #{sex}
    </if>
    <if test="email != null and email !=''">
        and email = #{email}
    </if>
</select>
```

<a id="section-43"></a>

## where :id=h-83aa14bd6e3e

- where and if are generally used together:
  - If none of the if conditions inside where match, the where tag does nothing and adds no where keyword.
  - If an if condition matches, where adds the where keyword and removes a redundant and/or from the beginning.

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp
    <where>
        <if test="empName != null and empName !=''">
            emp_name = #{empName}
        </if>
        <if test="age != null">
            and age = #{age}
        </if>
        <if test="sex != null and sex !=''">
            and sex = #{sex}
        </if>
        <if test="email != null and email !=''">
            and email = #{email}
        </if>
    </where>
</select>
```

- Note: where cannot remove a redundant and/or at the end of a condition.

  ```xml
  <!-- See note 1 below. -->
  <if test="empName != null and empName !=''">
  emp_name = #{empName} and
  </if>
  <if test="age != null">
      age = #{age}
  </if>
  ```

Example notes:

1. This usage is incorrect: only and/or before a condition can be removed, not after it.

<a id="section-44"></a>

## trim :id=h-d1a5fe79a597

- trim removes or adds content within the tag.
- Common attributes
  - prefix: adds content before the trim body
  - suffix: adds content after the trim body
  - prefixOverrides: removes content from the beginning of the trim body
  - suffixOverrides: removes content from the end of the trim body
- If no nested condition matches, trim has no effect, leaving only `select * from t_emp`.

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp
    <trim prefix="where" suffixOverrides="and|or">
        <if test="empName != null and empName !=''">
            emp_name = #{empName} and
        </if>
        <if test="age != null">
            age = #{age} and
        </if>
        <if test="sex != null and sex !=''">
            sex = #{sex} or
        </if>
        <if test="email != null and email !=''">
            email = #{email}
        </if>
    </trim>
</select>
```

```java
// See note 1 below.
@Test
public void getEmpByCondition() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
    List<Emp> emps= mapper.getEmpByCondition(new Emp(null, "张三", null, null, null, null));
    System.out.println(emps);
}
```

Example notes:

1. Test classes

![](Resources/trim测试结果.png)
<a id="section-45"></a>

## choose、when、otherwise :id=h-fea6026f0d75

- `choose、when、otherwise` is equivalent to `if...else if..else`.
- There must be at least one when and at most one otherwise.

```xml
<select id="getEmpByChoose" resultType="Emp">
    select * from t_emp
    <where>
        <choose>
            <when test="empName != null and empName != ''">
                emp_name = #{empName}
            </when>
            <when test="age != null and age != ''">
                age = #{age}
            </when>
            <when test="sex != null and sex != ''">
                sex = #{sex}
            </when>
            <when test="email != null and email != ''">
                email = #{email}
            </when>
            <otherwise>
                did = 1
            </otherwise>
        </choose>
    </where>
</select>
```

```java
@Test
public void getEmpByChoose() {
    SqlSession sqlSession = SqlSessionUtils.getSqlSession();
    DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
    List<Emp> emps = mapper.getEmpByChoose(new Emp(null, "张三", 23, "男", "123@qq.com", null));
    System.out.println(emps);
}
```

![](Resources/choose测试结果.png)

- Like `if a else if b else if c else d`, only one branch executes.
  <a id="section-46"></a>

## foreach :id=h-2e85a5bd268b

- Attributes:
  - collection: the array or collection to iterate
  - item: each element in the collection or array
  - separator: the delimiter between iterations, with a space on either side by default, such as `,`
  - open: the opening text for the foreach contents
  - close: the closing text for the foreach contents
- Batch deletion

  ```xml
  <!--int deleteMoreByArray(Integer[] eids);-->
  <delete id="deleteMoreByArray">
      delete from t_emp where eid in
      <foreach collection="eids" item="eid" separator="," open="(" close=")">
          #{eid}
      </foreach>
  </delete>
  ```

  ```java
  @Test
  public void deleteMoreByArray() {
      SqlSession sqlSession = SqlSessionUtils.getSqlSession();
      DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
      int result = mapper.deleteMoreByArray(new Integer[]{6, 7, 8, 9});
      System.out.println(result);
  }
  ```

  ![](Resources/foreach测试结果1.png)
- Batch insertion

  ```xml
  <!--int insertMoreByList(@Param("emps") List<Emp> emps);-->
  <insert id="insertMoreByList">
      insert into t_emp values
      <foreach collection="emps" item="emp" separator=",">
          (null,#{emp.empName},#{emp.age},#{emp.sex},#{emp.email},null)
      </foreach>
  </insert>
  ```

  ```java
  @Test
  public void insertMoreByList() {
      SqlSession sqlSession = SqlSessionUtils.getSqlSession();
      DynamicSQLMapper mapper = sqlSession.getMapper(DynamicSQLMapper.class);
      Emp emp1 = new Emp(null,"a",1,"男","123@321.com",null);
      Emp emp2 = new Emp(null,"b",1,"男","123@321.com",null);
      Emp emp3 = new Emp(null,"c",1,"男","123@321.com",null);
      List<Emp> emps = Arrays.asList(emp1, emp2, emp3);
      int result = mapper.insertMoreByList(emps);
      System.out.println(result);
  }
  ```

  ![](Resources/foreach测试结果2.png)
  <a id="section-47"></a>

## SQL fragments :id=h-14529b4dcfe2

- A sql fragment defines reusable SQL that is included with an include tag where needed.
- Declare a sql fragment: `<sql>`

```xml
<sql id="empColumns">eid,emp_name,age,sex,email</sql>
```

- Reference a sql fragment: `<include>`

```xml
<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
    select <include refid="empColumns"></include> from t_emp
</select>
```

<a id="section-48"></a>

# Caching in MyBatis :id=h-d9aca8ba120b

<a id="section-49"></a>

## First-level cache: reusing results within the same SqlSession :id=h-482405da9e9a

The default cache scope is SESSION. Repeating the same query in the same SqlSession may reuse results directly. Cache keys also include the statement, parameters, pagination, and other information.

- A different SqlSession cannot use the previous session's first-level cache.
- Different query conditions create different cache entries; they do not clear earlier entries.
- Updates, commits, rollbacks, clearCache, and similar operations clear the local cache.
- With localCacheScope=STATEMENT, reuse is limited to one statement execution.

Cached objects may share the same reference; modifying one directly may affect later reads. SqlSession is not thread-safe, so do not share an instance among requests.

<a id="section-50"></a>

## Second-level cache: managed by Mapper namespace :id=h-31b4738608c4

SqlSessionFactory provides cache management, but the default second-level cache is partitioned by namespace, not shared by arbitrary queries throughout the application.

To enable it, set global cacheEnabled to true and add cache to the Mapper XML. Queries are usually published to the second-level cache after session commit or normal completion. Rollback and transaction state affect the result.

```xml
<cache eviction="LRU" size="512" readOnly="false"/>
```

Place this fragment inside the mapper root element. The default read/write cache copies results through serialization, requiring serializable result objects. readOnly=true shares references without the same serialization copying, but callers must not modify cached objects.

| Attribute     | Meaning                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------- |
| eviction      | Eviction policy; default LRU, also FIFO, SOFT, and WEAK                                             |
| size          | Number of cache entries, not bytes                                                                  |
| flushInterval | Refresh interval in milliseconds; unset by default                                                  |
| readOnly      | true shares objects; false returns copies                                                           |
| flushCache    | Whether the statement clears caches; defaults to true for insert/update/delete and false for select |
| useCache      | Whether the query uses second-level caching; select defaults to true                                |

Updates usually clear the current namespace's second-level cache, but this does not guarantee refresh of join-query caches in other namespaces. Multiple Mappers working on the same table can produce stale data; design cache-ref appropriately or avoid second-level caching.

<a id="section-51"></a>

## Query lookup order :id=h-9db972ee86ff

A cache-enabled statement usually checks the second-level cache, then the first-level cache, and finally the database. The second-level cache collects cacheable query results; it does not copy the entire first-level cache.

Reference: [MyBatis caching documentation](https://mybatis.org/mybatis-3/zh_CN/sqlmap-xml.html#cache).

<a id="section-52"></a>

# Integrating the third-party cache EHCache (overview) :id=h-9709e6b7cbd2

### Add dependencies :id=h-5578613a99fd

```xml
<!-- See note 1 below. -->
<dependency>
    <groupId>org.mybatis.caches</groupId>
    <artifactId>mybatis-ehcache</artifactId>
    <version>1.2.1</version>
</dependency>
<!-- See note 2 below. -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

Example notes:

1. Mybatis EHCache integration package
2. A concrete implementation of the slf4j logging facade

### Functions of each jar :id=h-20e0417419db

| Jar filename    | Purpose                                                         |
| --------------- | --------------------------------------------------------------- |
| mybatis-ehcache | Integration package for Mybatis and EHCache                     |
| ehcache         | EHCache core package                                            |
| slf4j-api       | SLF4J logging facade package                                    |
| logback-classic | A concrete implementation supporting the SLF4J facade interface |

### Create the EHCache configuration file ehcache.xml :id=h-a9470fb4addd

- The default filename is ehcache.xml; a custom loading approach can change the path.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="../config/ehcache.xsd">
    <!-- See note 1 below. -->
    <diskStore path="D:\atguigu\ehcache"/>
    <defaultCache
            maxElementsInMemory="1000"
            maxElementsOnDisk="10000000"
            eternal="false"
            overflowToDisk="true"
            timeToIdleSeconds="120"
            timeToLiveSeconds="120"
            diskExpiryThreadIntervalSeconds="120"
            memoryStoreEvictionPolicy="LRU">
    </defaultCache>
</ehcache>
```

Example notes:

1. Disk storage path

### Set the second-level cache type :id=h-848702c14c11

- Set the second-level cache type in xxxMapper.xml.

```xml
<cache type="org.mybatis.caches.ehcache.EhcacheCache"/>
```

### Add logback logging :id=h-477b75891a52

- SLF4J is a logging interface, and Logback is one implementation. Logging depends on MyBatis's logImpl and actual binding. Adding SLF4J does not necessarily disable other implementations. Create logback configuration file `logback.xml`, the default name; settings such as logback.configurationFile can specify another file.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">
    <!-- See note 1 below. -->
    <appender name="STDOUT"
              class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- See note 2 below. -->
            <!-- See note 3 below. -->
            <pattern>[%d{HH:mm:ss.SSS}] [%-5level] [%thread] [%logger] [%msg]%n</pattern>
        </encoder>
    </appender>
    <!-- See note 4 below. -->
    <!-- See note 5 below. -->
    <root level="DEBUG">
        <!-- See note 6 below. -->
        <appender-ref ref="STDOUT" />
    </root>
    <!-- See note 7 below. -->
    <logger name="com.atguigu.crowd.mapper" level="DEBUG"/>
</configuration>
```

Example notes:

1. Specify the log output destination
2. Log output format
3. In order: timestamp, log level, thread name, logging class, message body, newline
4. Set the global log level. Levels in order: DEBUG, INFO, WARN, ERROR
5. Setting a level outputs only that level and the levels following it.
6. Specify the logging appender, referencing the appender configured earlier through STDOUT.
7. Set local log levels for specific requirements

### EHCache configuration file reference :id=h-c37a8c4bdff7

| Attribute name                  | Required? | Purpose                                                                                                                                                                                                                                                   |
| ------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxElementsInMemory             | Yes       | Maximum number of elements cached in memory                                                                                                                                                                                                               |
| maxElementsOnDisk               | Yes       | Maximum number of elements cached on disk; 0 means unlimited                                                                                                                                                                                              |
| eternal                         | Yes       | Whether cached elements never expire. true disables automatic time-based expiration, but explicit clearing or capacity eviction may still occur and database consistency is not guaranteed. If false, also check timeToIdleSeconds and timeToLiveSeconds. |
| overflowToDisk                  | Yes       | Whether overflow elements are stored on disk when memory is insufficient; this is not specifically for expired elements                                                                                                                                   |
| timeToIdleSeconds               | No        | If the interval between two accesses to data in EhCache exceeds timeToIdleSeconds, it is removed. Default 0 means unlimited idle time.                                                                                                                    |
| timeToLiveSeconds               | No        | Lifetime of a cached element; default 0 means unlimited.                                                                                                                                                                                                  |
| diskSpoolBufferSizeMB           | No        | Buffer size for DiskStore (disk cache). Default 30 MB. Each Cache should have its own buffer.                                                                                                                                                             |
| diskPersistent                  | No        | Whether to persist EhCache data on disk across VM restarts; defaults to false.                                                                                                                                                                            |
| diskExpiryThreadIntervalSeconds | No        | Disk-cache cleanup thread interval; defaults to 120 seconds. Every 120 s, the thread cleans up data in EhCache.                                                                                                                                           |
| memoryStoreEvictionPolicy       | No        | Eviction policy when the memory cache is full and a new element arrives. Default LRU (least recently used); alternatives are LFU (least frequently used) and FIFO (first in, first out).                                                                  |
| <a id="section-53"></a>         |

# Reverse engineering with MyBatis :id=h-dea02743a849

- Forward engineering: create Java entity classes first, then let the framework generate tables from them. Hibernate supports this.
- Reverse engineering: create database tables first, then let the framework generate the following resources from them:
  - Java entity classes
  - Mapper interfaces
  - Mapper mapping files
    <a id="section-54"></a>

## Steps for setting up reverse engineering :id=h-19ab7acbfe40

### Add dependencies and the plugin :id=h-b0bf45bbac6a

```xml
<dependencies>
    <!-- See note 1 below. -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.9</version>
    </dependency>
    <!-- See note 2 below. -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>
    <!-- See note 3 below. -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.27</version>
    </dependency>
    <!-- See note 4 below. -->
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
</dependencies>
<!-- See note 5 below. -->
<build>
    <!-- See note 6 below. -->
    <plugins>
        <!-- See note 7 below. -->
        <plugin>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-maven-plugin</artifactId>
            <version>1.3.0</version>
            <!-- See note 8 below. -->
            <dependencies>
                <!-- See note 9 below. -->
                <dependency>
                    <groupId>org.mybatis.generator</groupId>
                    <artifactId>mybatis-generator-core</artifactId>
                    <version>1.3.2</version>
                </dependency>
                <!-- See note 10 below. -->
                <dependency>
                    <groupId>com.mchange</groupId>
                    <artifactId>c3p0</artifactId>
                    <version>0.9.2</version>
                </dependency>
                <!-- See note 11 below. -->
                <dependency>
                    <groupId>mysql</groupId>
                    <artifactId>mysql-connector-java</artifactId>
                    <version>8.0.27</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

Example notes:

1. MyBatis core dependency package
2. junit tests
3. MySQL driver
4. log4j logging
5. Controls Maven configuration during the build
6. Plugins used during the build
7. The specific plugin; reverse engineering runs as a build plugin
8. Plugin dependencies
9. Core reverse-engineering dependency
10. Database connection pool
11. MySQL driver

### Creating the MyBatis core configuration file :id=h-d91e7b3768a2

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <properties resource="jdbc.properties"/>
    <typeAliases>
        <package name=""/>
    </typeAliases>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <package name=""/>
    </mappers>
</configuration>
```

### Create the reverse-engineering configuration file :id=h-91c8bcfe2600

- By default, the Maven plugin reads generatorConfig.xml; its configurationFile option can specify another file. The value replace-with-your-local-password below is a placeholder. Replace it with your own local database password before running the example, and keep real passwords out of the repository.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <!-- See note 1 below. -->
    <context id="DB2Tables" targetRuntime="MyBatis3Simple">
        <!-- See note 2 below. -->
        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/mybatis"
                        userId="root"
                        password="replace-with-your-local-password">
        </jdbcConnection>
        <!-- See note 3 below. -->
        <javaModelGenerator targetPackage="com.atguigu.mybatis.pojo" targetProject=".\src\main\java">
            <property name="enableSubPackages" value="true" />
            <property name="trimStrings" value="true" />
        </javaModelGenerator>
        <!-- See note 4 below. -->
        <sqlMapGenerator targetPackage="com.atguigu.mybatis.mapper"
                         targetProject=".\src\main\resources">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>
        <!-- See note 5 below. -->
        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="com.atguigu.mybatis.mapper" targetProject=".\src\main\java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>
        <!-- See note 6 below. -->
        <!-- See note 7 below. -->
        <!-- See note 8 below. -->
        <table tableName="t_emp" domainObjectName="Emp"/>
        <table tableName="t_dept" domainObjectName="Dept"/>
    </context>
</generatorConfiguration>
```

Example notes:

1. targetRuntime: the reverse-engineering generation variant. MyBatis3Simple generates basic CRUD (the simple edition); MyBatis3 generates conditional CRUD (the full-featured edition).
2. Database connection information
3. Generation strategy for javaBean
4. Generation strategy for SQL mapping files
5. Generation strategy for Mapper interfaces
6. Tables to reverse-engineer
7. Set tableName to \* to match all tables; omit domainObjectName in that case.
8. domainObjectName specifies the generated entity class name.

### Execute the generate goal of the MBG plugin :id=h-44212a13bb65

- ![](Resources/执行MBG插件的generate目标.png)
- If `Exception getting JDBC Driver` occurs, the database driver may be configured incorrectly in pom.xml.
  - Driver in dependency ![](Resources/dependency中的驱动.png)
  - Driver in mybatis-generator-maven-plugin ![](Resources/插件中的驱动.png)
  - The two driver versions should match.
- Execution result ![](Resources/逆向执行结果.png)
  <a id="section-55"></a>

## QBC :id=h-42c616ff3e5b

### Query :id=h-e273b35e1005

- `selectByExample`: queries by conditions using an example object or null; null means no conditions and therefore queries all data.
- `example.createCriteria().xxx`: creates a criteria object. Use andXXX to add query conditions to SQL; conditions are combined with and.
- `example.or().xxx`: combines the previously added conditions with other conditions using or.
  ![](Resources/example的方法.png)

```java
@Test public void testMBG() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    EmpExample example = new EmpExample();
    // See note 1 below.
    example.createCriteria().andEmpNameEqualTo("张三").andAgeGreaterThanOrEqualTo(20);
    // See note 2 below.
    example.or().andDidIsNotNull();
    List<Emp> emps = mapper.selectByExample(example);
    emps.forEach(System.out::println);
}
```

Example notes:

1. Name is Zhang San and age is at least 20
2. Or did is not null

![](Resources/example测试结果.png)

### Insert and update :id=h-652bf9f91963

- `updateByPrimaryKey`: updates by primary key; null values also set the corresponding columns to null.
  - `mapper.updateByPrimaryKey(new Emp(1,"admin",22,null,"456@qq.com",3));`
  - ![](Resources/增删改测试结果1.png)
- `updateByPrimaryKeySelective()`: selectively updates by primary key; null values leave the corresponding columns unchanged.
  - `mapper.updateByPrimaryKeySelective(new Emp(2,"admin2",22,null,"456@qq.com",3));`
  - ![](Resources/增删改测试结果2.png)
    <a id="section-56"></a>

# Pagination plugin :id=h-62de265465d7

<a id="section-57"></a>

## Steps for using the pagination plugin :id=h-f7470b97a97b

### Add dependencies :id=h-2cf1e5c4e42b

```xml
<!-- https://mvnrepository.com/artifact/com.github.pagehelper/pagehelper -->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.2.0</version>
</dependency>
```

### Configure the pagination plugin :id=h-6c519ef0c70a

- Configure the plugin in the MyBatis core configuration (mybatis-config.xml).
- ![](Resources/配置分页插件.png)

```xml
<plugins>
    <!-- See note 1 below. -->
    <plugin interceptor="com.github.pagehelper.PageInterceptor"></plugin>
</plugins>
```

Example notes:

1. Set the pagination plugin

<a id="section-58"></a>

## Using the pagination plugin :id=h-4c3a9b7ef898

### Enable pagination :id=h-533feb82d2de

- Call `PageHelper.startPage(int pageNum, int pageSize)` before the query to enable pagination.
  - pageNum: current page number
  - pageSize: number of records per page

```java
@Test
public void testPageHelper() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    // See note 1 below.
    PageHelper.startPage(1,4);
    List<Emp> emps = mapper.selectByExample(null);
    emps.forEach(System.out::println);
}
```

Example notes:

1. Retrieve page 1 with four records per page

![](Resources/分页测试结果.png)

### Pagination data :id=h-6a2a694b79a7

#### Approach 1: Print directly :id=h-1bd342b4c1b4

```java
@Test
public void testPageHelper() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    // See note 1 below.
    Page<Object> page = PageHelper.startPage(1, 4);
    List<Emp> emps = mapper.selectByExample(null);
    // See note 2 below.
    System.out.println(page);
}
```

Example notes:

1. Retrieve page 1 with four records per page
2. After querying the List, print pagination data.

- Pagination data:

  ```
  Page{count=true, pageNum=1, pageSize=4, startRow=0, endRow=4, total=8, pages=2, reasonable=false, pageSizeZero=false}[Emp{eid=1, empName='admin', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=2, empName='admin2', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=3, empName='王五', age=12, sex='女', email='123@qq.com', did=3}, Emp{eid=4, empName='赵六', age=32, sex='男', email='123@qq.com', did=1}]
  ```

#### Approach 2: Use PageInfo :id=h-8f1140a93985

- After querying the list, use `PageInfo<T> pageInfo = new PageInfo<>(List<T> list, intnavigatePages)` to obtain pagination data.
  - list: data after pagination
  - navigatePages: number of page links in the navigation

```java
@Test
public void testPageHelper() throws IOException {
    InputStream is = Resources.getResourceAsStream("mybatis-config.xml");
    SqlSessionFactoryBuilder sqlSessionFactoryBuilder = new SqlSessionFactoryBuilder();
    SqlSessionFactory sqlSessionFactory = sqlSessionFactoryBuilder.build(is);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
    PageHelper.startPage(1, 4);
    List<Emp> emps = mapper.selectByExample(null);
    PageInfo<Emp> page = new PageInfo<>(emps,5);
    System.out.println(page);
}
```

- Pagination data:

  ```
  PageInfo{
  pageNum=1, pageSize=4, size=4, startRow=1, endRow=4, total=8, pages=2,
  list=Page{count=true, pageNum=1, pageSize=4, startRow=0, endRow=4, total=8, pages=2, reasonable=false, pageSizeZero=false}[Emp{eid=1, empName='admin', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=2, empName='admin2', age=22, sex='男', email='456@qq.com', did=3}, Emp{eid=3, empName='王五', age=12, sex='女', email='123@qq.com', did=3}, Emp{eid=4, empName='赵六', age=32, sex='男', email='123@qq.com', did=1}],
  prePage=0, nextPage=2, isFirstPage=true, isLastPage=false, hasPreviousPage=false, hasNextPage=true, navigatePages=5, navigateFirstPage=1, navigateLastPage=2, navigatepageNums=[1, 2]}
  ```
- The list data is identical to the page data printed directly in approach 1.

#### Common data: :id=h-e1102932cedf

- pageNum: current page number
- pageSize: number of records per page
- size: actual number of records on the current page
- total: total record count
- pages: total page count
- prePage: previous page number
- nextPage: next page number
- isFirstPage/isLastPage: whether this is the first/last page
- hasPreviousPage/hasNextPage: whether a previous/next page exists
- navigatePages: number of page links in the navigation
- navigatepageNums: navigation page numbers, \[1,2,3,4,5]

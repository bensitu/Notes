## JDBC

## JDBC 基础

### 数据持久化

- 把数据保存到可掉电式存储设备中以供之后使用。大多数情况下数据持久化意味着将内存中的数据保存到硬盘上加以”固化”，而持久化的实现过程大多通过各种关系数据库来完成。
- 持久化的主要应用是将内存中的数据存储在关系型数据库中，当然也可以存储在磁盘文件、XML 数据文件中。



### Java 中的数据存储技术

在 Java 中，数据库存取技术可分为3类：

- JDBC 直接访问数据库
- JDO (Java Data Object )技术
- 数据库框架，如 Hibernate, Mybatis 等

JDBC 是 Java 访问数据库的基石，JDO、Hibernate、MyBatis 等只是更好的封装了 JDBC。



### JDBC 概念

- JDBC(Java Database Connectivity)是一个独立于特定数据库管理系统、通用的 SQL 数据库存取和操作的公共接口（一组API），定义了用来访问数据库的标准Java类库（java.sql,javax.sql），使用这些类库可以以一种标准的方法方便地访问数据库资源。
- JDBC 为访问不同的数据库提供*统一的途径，为开发者屏蔽了一些细节问题。
- JDBC 的目标是使 Java 程序员使用 JDBC 可以连接任何提供了 JDBC 驱动程序的数据库系统，这样就使得程序员无需对特定的数据库系统的特点有过多的了解，从而大大简化和加快了开发过程。



### JDBC 体系结构

JDBC 接口（API）包括两个层次：

- 面向应用的API：Java API，抽象接口，供应用程序开发人员使用（连接数据库，执行 SQL 语句，获得结果）。
- 面向数据库的API：Java Driver API，供开发商开发数据库驱动程序用。



### JDBC 编写步骤

1. 导入相应的 jar 包
2. 加载、注册 SQL 驱动
3. 获取 Connection 连接对象
4. 创建 Statement 对象并执行 SQL 语句
5. 使用 ResultSet 对象获取查询结果集
6. 依次关闭 ResultSet、Statement、Connection 对象



## 获取数据库连接

### Driver

- java.sql.Driver 接口是所有 JDBC 驱动程序需要实现的接口。这个接口是提供给数据库厂商使用的，不同数据库厂商提供不同的实现。
- 在程序中不需要直接去访问实现了 Driver 接口的类，而是由驱动程序管理器类(java.sql.DriverManager)去调用这些 Driver 实现。
- MySQL 的驱动： 
  com.mysql.cj.jdbc.Driver   (8.0以上版本)
  com.mysql.jdbc.Driver　(5.7版本)
- Oracle 的驱动：
  oracle.jdbc.driver.OracleDriver

### URL

- JDBC URL 用于标识一个被注册的驱动程序，驱动程序管理器通过这个 URL 选择正确的驱动程序，从而建立到数据库的连接。

- JDBC URL 的标准由三部分组成，各部分间用冒号分隔。

  jdbc:子协议:子名称

  协议：JDBC URL 中的协议总是 jdbc

  子协议：子协议用于标识一个数据库驱动程序

  子名称：一种标识数据库的方法。子名称可以依不同的子协议而变化，用子名称的目的是为了定位数据库提供足够的信息。包含主机名(对应服务端的ip地址)，端口号，数据库名
  

### 连接数据库

首先下载jdbc的jar包：https://dev.mysql.com/downloads/connector/j/

然后在项目中创建一个lib文件夹并将下载好的jar包导入，右键选择add as library.

> 报错试设置useSSL=false;
>
> url=jdbc:mysql:*//localhost:3306/db1?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8&useSSL=false*



#### 使用 DriverManager 连接

```java
public class Driver extends NonRegisteringDriver implements java.sql.Driver {
		public Driver() throws SQLException {}
		
	    static {
	        try {
	            DriverManager.registerDriver(new Driver());
	        } catch (SQLException var1) {
	            throw new RuntimeException("Can't register driver!");
	        }
	    }
	}

	@Test
 public void JDBCConnection() throws Exception {
        //注册驱动（也可省略，jar包文件中已配置，不推荐省略！）
        Class.forName("com.mysql.cj.jdbc.Driver");
        //要连接的数据库url,用户名和密码
        String url="jdbc:mysql://localhost:3306/db1?serverTimezone=UTC";
        String user="root";
        String password="root123!";
        //获取数据库连接
        Connection conn = DriverManager.getConnection(url, user, password);
        //输出连接地址
        System.out.println(conn);
    }
```



#### 通过读取配置文件获取连接

实现数据和代码的分离，实现了解耦。

首先再在src下创建一个配置文件 jdbc.properties

```properties
url=jdbc:mysql://localhost:3306/db1?serverTimezone=UTC
user=root
password=root123!
driver=com.mysql.cj.jdbc.Driver
```

新建类连接

```java
@Test
public void JDBCConnection() throws Exception {
        //读取配置文件信息
        InputStream is = DriverTest.class.getClassLoader().getResourceAsStream("jdbc.properties");
        Properties properties=new Properties();
        properties.load(is); 
        String driver = properties.getProperty("driver");
        String url = properties.getProperty("url");
        String user = properties.getProperty("user");
        String password = properties.getProperty("password");
        
  			//注册驱动
        Class.forName(driver);
        //获取数据库连接
        Connection conn = DriverManager.getConnection(url, user, password);
        //输出连接地址
        System.out.println(conn);
}
```



## CRUD 操作

### PreparedStatement 的使用

#### 概念

- 可以通过调用 Connection 对象的 preparedStatement(String sql) 方法获取 PreparedStatement 对象
- PreparedStatement 接口是 Statement 的子接口，它表示一条预编译过的 SQL 语句
- PreparedStatement 对象所代表的 SQL 语句中的参数用问号(?)来表示，调用 setXxx() 方法来设置这些参数,Xxx是数据库对应字段的类型。
- setXxx() 方法有两个参数，第一个参数是要设置的 SQL 语句中的参数的索引(从 1
  开始)，第二个是设置的 SQL 语句中的参数的值



#### 语法

```java
//1.获取连接
connect = JDBCUtils.getConnection();
//2.预编译sql语句，返回preparedStatement实例
String sql1="insert into user_table values(?,?,?)";     				 //增加记录
String sql2="update user_table set balance=? where user =?";     //更新记录
ps1 = connect.prepareStatement(sql1);
ps2 = connect.prepareStatement(sql2);
//3.填充占位符 setXxx Xxx表示字段类型
ps1.setString(1,"Tom");
ps1.setInt(2,1234);
ps1.setInt(3,2000);
ps2.setInt(1,5000);
ps2.setString(2,"james");
//4.执行sql
ps1.execute();
ps2.execute();
//返回值true代表查询 false代表增删改
```



### JDBC 工具类

```java
public class JDBCUtils {
    //获取数据库连接
    public static Connection getConnection() throws Exception {
        //读取配置文件信息
        InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties");
        Properties properties=new Properties();
        properties.load(is);
        String driver = properties.getProperty("driver");
        String url = properties.getProperty("url");
        String user = properties.getProperty("user");
        String password = properties.getProperty("password");
        //注册驱动
        Class.forName(driver);
        //获取数据库连接
        return DriverManager.getConnection(url, user, password);
    }
    
public static void closeConnection(Connection connection, Statement statement){
        try{
            if(connection!=null)
                connection.close();
        }catch (Exception e){
          e.printStackTrace();
        }
        try{
            if(statement!=null)
                statement.close();
        }catch (Exception e){
          e.printStackTrace();
        }
}

public static void closeConnection(Connection connection, Statement statement, ResultSet resultSet){
        closeConnection(connection,statement);
        try{
            if(resultSet!=null)
                resultSet.close();
        }catch (Exception e){
          e.printStackTrace();
        }
    }
}
```



### 通用的增删改方法

```java
//通用的增删改操作
public void commonUpdate(String sql,Object...args){
        Connection connect=null;
        PreparedStatement ps=null;
        try{
            connect = JDBCUtils.getConnection();
            ps = connect.prepareStatement(sql);
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);//数据库中索引从1开始
            }
            ps.execute();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            JDBCUtils.closeConnection(connect,ps);
        }
}
```



### 通用的查询方法

单表查询通用方法

```java
//通用查询操作
@Test
public Customer query(String sql,Object...args){
        Connection connect=null;
        PreparedStatement ps=null;
        ResultSet rs=null;
        try{
            //1.获取连接
            connect = JDBCUtils.getConnection();
            //2.预编译sql语句，返回preparedStatement实例
            ps = connect.prepareStatement(sql);
            //3.填充占位符 setXxx Xxx表示字段类型
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);
            }
            //4.执行sql
            ResultSet resultSet = ps.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();//获取元数据
            int columnCount = metaData.getColumnCount();//获取列数
            //5.若结果集不为空，对其封装
            if(resultSet.next()){
               Customer customer=new Customer();
               for(int i=0;i<columnCount;i++){
                   Object value = resultSet.getObject(i + 1);//获取列值
                   String columnName = metaData.getColumnName(i + 1);//获取列名
                   Field field = customer.getClass().getDeclaredField(columnName);//获取该属性名对应属性
                   field.setAccessible(true);//设置可操作权限
                   field.set(customer,value);
               }
               return customer;
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            JDBCUtils.closeConnection(connect,ps,rs);
        }
        return null;
}
```



多表查询通用方法

```java
//通用查询操作
@Test
public <T>List<T> query(Class<T> clazz,String sql,Object...args){
        Connection connect=null;
        PreparedStatement ps=null;
        ResultSet rs=null;
        List<T> result=new ArrayList<>();
        try{
            connect = JDBCUtils.getConnection();
            ps = connect.prepareStatement(sql);
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);
            }
            ResultSet resultSet = ps.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();
            while (resultSet.next()){
                T t=clazz.newInstance();
               for(int i=0;i<columnCount;i++){
                   Object value = resultSet.getObject(i + 1);
                   String columnName = metaData.getColumnLabel(i + 1);
                   Field field = clazz.getDeclaredField(columnName);
                   field.setAccessible(true);
                   field.set(t,value);
               }
               result.add(t);
            }
            return result;
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            JDBCUtils.closeConnection(connect,ps,rs);
        }
        return null;
}
```



### Java与SQL对应数据类型转换表

|    **Java类型**    |       **SQL类型**        |
| :----------------: | :----------------------: |
|      boolean       |           BIT            |
|        byte        |         TINYINT          |
|       short        |         SMALLINT         |
|        int         |         INTEGER          |
|        long        |          BIGINT          |
|       String       | CHAR,VARCHAR,LONGVARCHAR |
|     byte array     |   BINARY , VAR BINARY    |
|   java.sql.Date    |           DATE           |
|   java.sql.Time    |           TIME           |
| java.sql.Timestamp |        TIMESTAMP         |



### ResultSet

- PreparedStatement 的 executeQuery() 方法，查询结果是一个 ResultSet 对象
- ResultSet 对象以逻辑表格的形式封装了执行数据库操作的结果集，ResultSet 接口由数据库厂商提供实现
- ResultSet 返回的实际上就是一张数据表，有一个指针指向数据表的第一条记录的前面。
- ResultSet 对象维护了一个指向当前数据行的游标，初始的时候，游标在第一行之前，可以通过 ResultSet 对象的 next() 方法移动到下一行。调用 next()方法检测下一行是否存在。若存在，该方法返回
- true，且指针下移，相当于 Iterator 对象的 hasNext() 和 next() 方法的结合体。
- 可以通过调用 getXxx() 获取每一列的值。

> 注：Java与数据库交互涉及到的相关Java API中的索引都从1开始。



### ResultSetMetaData

- 可用于获取关于 ResultSet 对象中列的类型和属性信息的对象

- 通过调用 ResultSet 对象的 getMetaData() 方法获得 ResultSetMetaData 对象

  getColumnName(int column)：获取指定列的名称

  getColumnLabel(int column)：获取指定列的别名

  getColumnCount()：返回当前 ResultSet 对象中的列数。



### 资源的释放

- 释放 ResultSet, Statement, Connection。
- 数据库连接（Connection）是非常稀有的资源，用完后必须马上释放，如果 Connection 不能及时正确的关闭将导致系统问题。Connection 的使用原则是尽量晚创建，尽量早的释放。
- 可以在 finally 中关闭，保证及时其他代码出现异常，资源也一定能被关闭。



## 批量插入

当需要成批插入或者更新记录时，可以采用 Java 的批量更新机制，这一机制允许多条语句一次性提交给数据库批量处理。通常情况下比单独提交处理更有效率。

JDBC 的批量处理语句包括下面三个方法：

- addBatch(String)：添加需要批量处理的 SQL 语句或是参数；

- executeBatch()：执行批量处理语句；
- clearBatch()：清空缓存的数据

MySQL 服务器默认是关闭批处理的，我们需要通过一个参数，让 MySQL 开启批处理的支持。将 ?rewriteBatchedStatements=true 写在配置文件的 url 后面



### 批量插入实例

```java
@Test
public void insByBatch(){
        Connection connect=null;
        Statement ps=null;
        try{
            connect = JDBCUtils.getConnection();
            connect.setAutoCommit(false);//关闭自动提交
            String sql="insert into insert_test(name) values (?)";
            PreparedStatement preparedStatement = connect.prepareStatement(sql);
            long pre = System.currentTimeMillis();
            for (int i = 1; i <=100 ; i++) {
                preparedStatement.setInt(1, i);
                preparedStatement.addBatch();
                if(i%10==0) {//类似于缓冲区 每“攒”10个执行
                    preparedStatement.executeBatch();
                    preparedStatement.clearBatch();
                }
            }
            connect.commit();//手动提交
            long now = System.currentTimeMillis();
            System.out.println("使用batch批量插入100条数据耗时："+(now-pre)+"毫秒");
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            //5.关闭资源
            JDBCUtils.closeConnection(connect,ps);
        }
}
```



## JDBC 事务处理

数据一旦提交，就不可回滚。

数据什么时候意味着提交？

- 当一个连接对象被创建时，默认情况下是自动提交事务：每次执行一个 SQL 语句时，如果执行成功，就会向数据库自动提交，而不能回滚。
- **关闭数据库连接，数据就会自动的提交。**如果多个操作，每个操作使用的是自己单独的连接，则无法保证事务。即同一个事务的多个操作必须在同一个连接下。

JDBC 程序中为了让多个 SQL 语句作为一个事务执行：

-   调用 Connection 对象的 setAutoCommit(false); 以取消自动提交事务
-   在所有的 SQL 语句都成功执行后，调用 commit(); 方法提交事务
-   在出现异常时，调用 rollback(); 方法回滚事务

若此时 Connection 没有被关闭，还可能被重复使用，则需要恢复其自动提交状态 setAutoCommit(true)。尤其是在使用数据库连接池技术时，执行close()方法前，建议恢复自动提交状态。



### 使用事务实现安全的转账例子

```java
@Test
public void safeTest() {
        Connection connection= null;
        try {
            connection = JDBCUtils.getConnection();
            connection.setAutoCommit(false);

            String sql1="update user_table set balance=balance-? where user=?";
            commonUpdate(connection,sql1, 100,"AA");
            int i=100/0;//模拟错误

            String sql2="update user_table set balance=balance+? where user=?";
            commonUpdate(connection,sql2, 100,"BB");

            connection.commit();
        } catch (Exception e) {
            try {
                connection.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
        }finally {
       		//若此时 Connection 没有被关闭，还可能被重复使用，则需要恢复其自动提交状态 setAutoCommit(true)。
            // 尤其是在使用数据库连接池技术时，执行close()方法前，建议恢复自动提交状态。
            try {
                connection.setAutoCommit(true);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            JDBCUtils.closeConnection(connection,null);
        }


    }

    public int commonUpdate(Connection connect,String sql,Object...args){
        PreparedStatement ps=null;
        try{
            ps = connect.prepareStatement(sql);
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);
            }
            return ps.executeUpdate();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            //保证使用同一个连接 不关闭
            JDBCUtils.closeConnection(null,ps);
        }
        return 0;
}
```



## DAO 及相关实现类

### 概念

- DAO：Data Access Object访问数据信息的类和接口，包括了对数据的CRUD（Create、Retrival、Update、Delete），而不包含任何业务相关的信息。
- 作用：为了实现功能的模块化，更有利于代码的维护和升级。



### 基础 DAO 类

```java
public abstract class Dao {
    //增删改
    public int commonUpdate(Connection connect,String sql,Object...args){
        PreparedStatement ps=null;
        try{
            ps = connect.prepareStatement(sql);
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);
            }
            return ps.executeUpdate();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            JDBCUtils.closeConnection(null,ps);
        }
        return 0;
    }

    //返回一条记录
    public <T>T getInstance(Connection connect,Class<T> clazz,String sql,Object...args){
        PreparedStatement ps=null;
        ResultSet rs=null;
        try{
            ps = connect.prepareStatement(sql);
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);
            }
            ResultSet resultSet = ps.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();
            if (resultSet.next()){
                T t=clazz.newInstance();
                for(int i=0;i<columnCount;i++){
                    Object value = resultSet.getObject(i + 1);
                    String columnName = metaData.getColumnLabel(i + 1);
                    Field field = clazz.getDeclaredField(columnName);
                    field.setAccessible(true);
                    field.set(t,value);
                }
                return t;
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            JDBCUtils.closeConnection(null,ps,rs);
        }
        return null;
    }

    //返回多条记录封装的集合
    public <T> List<T> getList(Connection connect,Class<T> clazz, String sql, Object...args){
        PreparedStatement ps=null;
        ResultSet rs=null;
        List<T> result=new ArrayList<>();
        try{
            connect = JDBCUtils.getConnection();
            ps = connect.prepareStatement(sql);
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);
            }
            ResultSet resultSet = ps.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();
            while (resultSet.next()){
                T t=clazz.newInstance();
                for(int i=0;i<columnCount;i++){
                    Object value = resultSet.getObject(i + 1);
                    String columnName = metaData.getColumnLabel(i + 1);
                    Field field = clazz.getDeclaredField(columnName);
                    field.setAccessible(true);
                    field.set(t,value);
                }
                result.add(t);
            }
            return result;
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            JDBCUtils.closeConnection(null,ps,rs);
        }
        return null;
    }

    //查询特定结果
    public <T>T getValue(Connection connect,String sql,Object...args){
        PreparedStatement ps=null;
        ResultSet rs=null;
        try{
            ps = connect.prepareStatement(sql);
            for(int i=0;i<args.length;i++){
                ps.setObject(i+1,args[i]);
            }
            ResultSet resultSet = ps.executeQuery();
            if (resultSet.next()){
                return (T) resultSet.getObject(1);
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            JDBCUtils.closeConnection(null,ps,rs);
        }
        return null;
    }
}
```

优化后的Customer实现类

```java
public class CustomerDaoImpl extends Dao<Customer> implements CustomerDao {
    @Override
    public void insert(Connection connection, Customer customer) {
        String sql="insert into customers(id,name,email) values (?,?,?)";
        commonUpdate(connection,sql,customer.getId(),customer.getName(),customer.getEmail());
    }

    @Override
    public void deleteById(Connection connection, int id) {
        String sql="delete from customers where id= ?";
        commonUpdate(connection,sql,id);
    }

    @Override
    public void update(Connection connection, Customer customer) {
        String sql="update customers set name = ?,email= ? where id= ?";
        commonUpdate(connection,sql,customer.getName(),customer.getEmail(),customer.getId());
    }

    @Override
    public Customer getCustomerById(Connection connection, int id) {
        String sql="select id,name,email from customers where id=?";
        Customer customer = getInstance(connection,sql, id);
        return customer;
    }

    @Override
    public List<Customer> getAll(Connection connection) {
        String sql="select id,name,email from customers";
        List<Customer> list = getList(connection,sql);
        return list;
    }

    @Override
    public Long getCount(Connection connection) {
        String sql="select count(*) from customers";
        return (Long) getValue(connection, sql);
    }
}
```



## 数据库连接池

### 概念

- 为解决传统开发中的数据库连接问题，可以采用数据库连接池技术。
- 基本思想：就是为数据库连接建立一个“缓冲池”。预先在缓冲池中放入一定数量的连接，当需要建立数据库连接时，只需从“缓冲池”中取出一个，使用完毕之后再放回去。
- 数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是重新建立一个。
- 数据库连接池在初始化时将创建一定数量的数据库连接放到连接池中，这些数据库连接的数量是由最小数据库连接数来设定的。无论这些数据库连接是否被使用，连接池都将一直保证至少拥有这么多的连接数量。连接池的最大数据库连接数量**限定了这个连接池能占有的最大连接数，当应用程序向连接池请求的连接数超过最大连接数量时，这些请求将被加入到等待队列中。



### 数据库连接池分类

- JDBC 的数据库连接池使用 javax.sql.DataSource 来表示，DataSource 只是一个接口，该接口通常由服务器(Weblogic, WebSphere, Tomcat)提供实现，也有一些开源组织提供实现：
  - DBCP 是 Apache 提供的数据库连接池。Tomcat 服务器自带 DBCP 数据库连接池。速度相对 c3p0 较快，但因自身存在 BUG，Hibernate3 已不再提供支持。
  - C3P0 是一个开源组织提供的一个数据库连接池，**速度相对较慢，稳定性还可以。**Hibernate 官方推荐使用
  - Druid 是阿里提供的数据库连接池，据说是集 DBCP 、C3P0 、Proxool 优点于一身的数据库连接池，但是速度不确定是否有BoneCP 快
- DataSource 通常被称为数据源，它包含连接池和连接池管理两个部分，习惯上也经常把 DataSource 称为连接池
- DataSource 用来取代 DriverManager 来获取 Connection，获取速度快，同时可以大幅度提高数据库访问速度。
- 注意：
  - 数据源和数据库连接不同，数据源无需创建多个，它是产生数据库连接的工厂，因此整个应用只需要一个数据源即可。
  - 当数据库访问结束后，程序还是像以前一样关闭数据库连接：conn.close(); 但 conn.close() 并没有关闭数据库的物理连接，它仅仅把数据库连接释放，归还给了数据库连接池。



### C3P0 连接池

首先将 C3P0 的 jar 包像之前导入 MySQL 的 jar 包一样导入项目

获取连接方式1

```java
@Test
public void  getConnection1() throws Exception{
     ComboPooledDataSource cpds = new ComboPooledDataSource();
     cpds.setDriverClass("com.mysql.cj.jdbc.Driver");
     cpds.setJdbcUrl("jdbc:mysql://localhost:3306/test?serverTimezone=UTC");
     cpds.setUser("root");
     cpds.setPassword("sjh2019");
     Connection conn = cpds.getConnection();
     System.out.println(conn);
}
```



获取连接方式2

使用xml配置文件 c3p0-config.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<c3p0-config>
    <named-config name="C3P0DataSource">
        <!-- 获取连接的4个基本信息 -->
        <property name="user">root</property>
        <property name="password">sjh2019</property>
        <property name="jdbcUrl">jdbc:mysql:///test?serverTimezone=UTC</property>
        <property name="driverClass">com.mysql.cj.jdbc.Driver</property>

        <!-- 涉及到数据库连接池的管理的相关属性的设置 -->
        <!-- 若数据库中连接数不足时, 一次向数据库服务器申请多少个连接 -->
        <property name="acquireIncrement">5</property>
        <!-- 初始化数据库连接池时连接的数量 -->
        <property name="initialPoolSize">5</property>
        <!-- 数据库连接池中的最小的数据库连接数 -->
        <property name="minPoolSize">5</property>
        <!-- 数据库连接池中的最大的数据库连接数 -->
        <property name="maxPoolSize">10</property>
        <!-- C3P0 数据库连接池可以维护的 Statement 的个数 -->
        <property name="maxStatements">20</property>
        <!-- 每个连接同时可以使用的 Statement 对象的个数 -->
        <property name="maxStatementsPerConnection">5</property>

    </named-config>
</c3p0-config>
```

```java
//封装到JDBC工具类
public class DButils {
    static DataSource cpds = new ComboPooledDataSource("C3P0DataSource");

    public static Connection getConnByC3p0() throws Exception {
        Connection conn = cpds.getConnection();
        return conn;
    }
}
```



### DBCP 连接池

首先将 DBCP 的 jar 包导入项目

获取连接方式1

```java
@Test
public void  getConnection3() throws Exception {
    BasicDataSource source = new BasicDataSource();
    source.setDriverClassName("com.mysql.cj.jdbc.Driver");
    source.setUrl("jdbc:mysql://localhost:3306/test?serverTimezone=UTC");
    source.setUsername("root");
    source.setPassword("sjh2019");
    Connection conn = source.getConnection();
    System.out.println(conn);
}
```



获取连接方式2

使用properties配置文件

```properties
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/test?serverTimezone=UTC&rewriteBatchedStatements=true
username=root
password=sjh2019
```

```java
//封装到JDBC工具类
public class DButils {
    //使用c3p0连接池
    private static DataSource cpds = new ComboPooledDataSource("myDataSource");
    public static Connection getConnByC3p0() throws Exception {
        Connection conn = cpds.getConnection();
        return conn;
    }


    //使用dbcp连接池
    private static DataSource source = null;
    static{
        try {
            Properties pros = new Properties();
            InputStream is = new FileInputStream("src/dbcp.properties");
            pros.load(is);
            source = BasicDataSourceFactory.createDataSource(pros);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static Connection getConnByDBCP() throws Exception {
        Connection conn = source.getConnection();
        return conn;
    }
}
```



### DRUID 连接池

首先将 Druid 的 jar 包导入项目，使用配置文件方式

```properties
url=jdbc:mysql://localhost:3306/test?serverTimezone=UTC&rewriteBatchedStatements=true
username=root
password=sjh2019
driverClassName=com.mysql.cj.jdbc.Driver

initialSize=10
maxActive=20
maxWait=1000
filters=wall
```

```java
//封装到JDBC工具类
public class DButils {
    //使用c3p0连接池
    private static DataSource cpds = new ComboPooledDataSource("myDataSource");
    public static Connection getConnByC3p0() throws Exception {
        Connection conn = cpds.getConnection();
        return conn;
    }

    //使用dbcp连接池
    private static DataSource source = null;
    static{
        try {
            Properties pros = new Properties();
            InputStream is = new FileInputStream("src/dbcp.properties");
            pros.load(is);
            //根据提供的BasicDataSourceFactory创建对应的DataSource对象
            source = BasicDataSourceFactory.createDataSource(pros);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static Connection getConnByDBCP() throws Exception {
        Connection conn = source.getConnection();
        return conn;
    }

    //使用druid连接池
    private static DataSource source1 = null;
    static{
        try {
            Properties pros = new Properties();
            InputStream is = new FileInputStream("src/druid.properties");
            pros.load(is);
            //根据提供的DruidDataSourceFactory创建对应的DataSource对象
            source1 = DruidDataSourceFactory.createDataSource(pros);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static Connection getConnByDruid() throws Exception {
        Connection conn = source1.getConnection();
        return conn;
    }
}
```



## Apache-DBUtils 实现 CRUD 操作

### Apache-DBUtils 简介

- commons-dbutils 是 Apache 组织提供的一个开源 JDBC工具类库，它是对JDBC的简单封装，学习成本极低，并且使用dbutils能极大简化jdbc编码的工作量，同时也不会影响程序的性能。
- API介绍：
  - org.apache.commons.dbutils.QueryRunner
  - org.apache.commons.dbutils.ResultSetHandler
  - 工具类：org.apache.commons.dbutils.DbUtils



### QueryRunner 的使用

**测试添加**

```java
@Test
public void runnerTest1() throws Exception {
        QueryRunner runner = new QueryRunner();
        Connection connection= DButils.getConnByDruid();
        String sql="insert into user(id,name,password) values (?,?,?)";
        runner.update(connection,sql,50,"david","password");
}
```



**测试删除**

```java
@Test
public void runnerTest2() throws Exception {
        QueryRunner runner = new QueryRunner();
        Connection connection= DButils.getConnByDruid();
        String sql="delete from user where id=?";
        runner.update(connection,sql,50);
}
```



**测试查询**

ResultSetHandler 接口及实现类

- 该接口用于处理 java.sql.ResultSet，将数据按要求转换为另一种形式。
- ResultSetHandler 接口提供了一个单独的方法：Object handle (java.sql.ResultSet .rs)。
- 接口的主要实现类：
  - ArrayHandler：把结果集中的第一行数据转成对象数组。
  - ArrayListHandler：把结果集中的每一行数据都转成一个数组，再存放到List中。
  - BeanHandler：将结果集中的第一行数据封装到一个对应的JavaBean实例中。
  - BeanListHandler：将结果集中的每一行数据都封装到一个对应的JavaBean实例中，存放到List里。
  - ColumnListHandler：将结果集中某一列的数据存放到List中。
  - KeyedHandler(name)：将结果集中的每一行数据都封装到一个Map里，再把这些map再存到一个map里，其key为指定的key。
  - MapHandler：将结果集中的第一行数据封装到一个Map里，key是列名，value就是对应的值。
  - MapListHandler：将结果集中的每一行数据都封装到一个Map里，然后再存放到List
  - ScalarHandler：查询单个值对象

```java

	//查询一条
    @Test
    public void queryOne() throws Exception {
        QueryRunner runner = new QueryRunner();
        Connection connection = DButils.getConnByDruid();
        String sql = "select id,name,email from customers where id=?";
        BeanHandler<Customer> handler = new BeanHandler<>(Customer.class);
        Customer query = runner.query(connection, sql, handler, 1);
        System.out.println(query);
    }

	//查询多条
    @Test
    public void queryAll() throws Exception {
        QueryRunner runner = new QueryRunner();
        Connection connection = DButils.getConnByDruid();
        String sql = "select id,name,email from customers where id>?";
        BeanListHandler<Customer> handler = new BeanListHandler<>(Customer.class);
        List<Customer> query = runner.query(connection, sql, handler, 1);
        query.forEach(System.out::println);
    }

	//查询特定
    @Test
    public void query() throws Exception {
        QueryRunner runner = new QueryRunner();
        Connection connection = DButils.getConnByDruid();
        String sql = "select count(*) from customers ";
        ScalarHandler handler=new ScalarHandler();
        long count = (long) runner.query(connection, sql, handler);
        System.out.println(count);
    }
```


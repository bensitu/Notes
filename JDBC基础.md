# JDBC 基础与事务

从 Java 执行 SQL，并正确处理连接、查询结果、批量写入与事务。

**学习前提与版本：** 先掌握 Java 异常、try-with-resources 与 SQL。完整示例使用 Java 8+、MySQL 8 与 Connector/J 8.4；请先创建文中的练习表。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://dev.mysql.com/doc/connector-j/en/)

**内容导航**

- [JDBC 是什么](#section-1)
- [环境与练习表](#section-2)
- [URL 与连接配置](#section-3)
- [PreparedStatement 与增删改](#section-4)
- [ResultSet 与查询映射](#section-5)
- [资源释放与错误处理](#section-6)
- [批量写入](#section-7)
- [事务：多个操作一起成功或失败](#section-8)
- [DAO 的职责](#section-9)
- [DataSource 与连接池](#section-10)
- [Apache Commons DbUtils](#section-11)


<a id="section-1"></a>

## JDBC 是什么

JDBC 是 Java 访问关系型数据库的标准 API，主要位于 java.sql 和 javax.sql 包。数据库厂商提供 JDBC 驱动，Java 代码通过标准接口调用驱动。MyBatis、JdbcTemplate 等在 JDBC 之上封装了重复工作。

持久化就是把数据保存到重启后仍能读取的存储中，例如数据库或文件。它不只限于关系型数据库。

<a id="section-2"></a>

## 环境与练习表

示例使用 Java 8+、MySQL 8.x、Connector/J 8.x 和 InnoDB。驱动版本与数据库版本是两件事：com.mysql.cj.jdbc.Driver 是驱动类名，不应按数据库的“5.7 / 8.0”直接划分驱动包名。

先在练习数据库建立表。运行示例前，使用自己的数据库账户，不要把真实密码提交到仓库。

```sql
CREATE TABLE account (
    id BIGINT NOT NULL,
    balance DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;
INSERT INTO account (id, balance) VALUES (1, 100.00), (2, 20.00);

CREATE TABLE batch_item (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Maven 中添加驱动依赖，以下固定版本只用于复现本例：

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.4.0</version>
    <scope>runtime</scope>
</dependency>
```

JDBC 4 的驱动通常可以自动注册，只要驱动 JAR 在运行时 classpath 上。Class.forName 可用于兼容旧驱动或排查驱动加载问题，并非每次连接都必须调用。

<a id="section-3"></a>

## URL 与连接配置

JDBC URL 的基本形式是 jdbc:子协议:子名称。MySQL 示例：

```properties
url=jdbc:mysql://localhost:3306/study?characterEncoding=UTF-8
user=study_user
password=replace-with-your-local-password
```

将文件命名为 jdbc.properties，放在 src/main/resources。数据库名 study 和账户必须提前准备。

时区参数应与实际时间处理需求一致，不能为了消除报错一律设置 UTC。SSL 报错需要检查证书、服务器和客户端配置，不要默认通过 useSSL=false 关闭加密。

文件：JDBCUtils.java。

```java
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public final class JDBCUtils {
    private JDBCUtils() {}

    public static Connection getConnection() throws IOException, SQLException {
        Properties properties = new Properties();
        try (InputStream input = JDBCUtils.class.getResourceAsStream("/jdbc.properties")) {
            if (input == null) {
                throw new IOException("jdbc.properties was not found on the classpath");
            }
            properties.load(input);
        }
        return DriverManager.getConnection(
            properties.getProperty("url"),
            properties.getProperty("user"),
            properties.getProperty("password"));
    }
}
```

这个类只演示读取配置和获得连接。生产项目通常使用框架配置与连接池，不应每次查询重新读取配置文件。

<a id="section-4"></a>

## PreparedStatement 与增删改

使用 Connection.prepareStatement(sql)，注意方法名是 prepareStatement。

? 表示待绑定的数据值，参数索引从 1 开始。数据值不会被当成 SQL 结构，所以比字符串拼接更安全。表名、列名、排序方向等 SQL 结构不能用 ? 绑定，必须由程序控制。

文件：JdbcOperations.java。后续事务示例复用这个方法。

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public final class JdbcOperations {
    private JdbcOperations() {}

    public static int update(Connection connection, String sql, Object... values)
            throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            for (int i = 0; i < values.length; i++) {
                statement.setObject(i + 1, values[i]);
            }
            return statement.executeUpdate();
        }
    }
}
```

executeUpdate 返回受影响的行数，不是生成的主键。下面是方法内部片段，需要导入 BigDecimal 和 Connection。

```java
try (Connection connection = JDBCUtils.getConnection()) {
    int rows = JdbcOperations.update(connection,
        "UPDATE account SET balance = ? WHERE id = ?",
        new BigDecimal("120.00"), 1L);
    System.out.println(rows);
}
```

| 方法 | 常见用途 | 返回值 |
| --- | --- | --- |
| executeQuery() | SELECT 查询 | ResultSet |
| executeUpdate() | INSERT / UPDATE / DELETE 等 | 受影响行数，部分其他语句为 0 |
| execute() | 结果类型未知或多个结果 | 第一个结果是否为 ResultSet，不是操作是否成功 |
| getGeneratedKeys() | 获取生成键 | 驱动支持时返回生成键结果集 |

<a id="section-5"></a>

## ResultSet 与查询映射

ResultSet 的游标一开始在第一行之前。next() 移动到下一行，有这一行时返回 true。

```java
try (Connection connection = JDBCUtils.getConnection();
     PreparedStatement statement = connection.prepareStatement(
         "SELECT id, balance AS available_balance FROM account WHERE id = ?")) {
    statement.setLong(1, 1L);
    try (ResultSet result = statement.executeQuery()) {
        if (result.next()) {
            long id = result.getLong("id");
            BigDecimal balance = result.getBigDecimal("available_balance");
            System.out.println(id + ": " + balance);
        }
    }
}
```

片段放在方法中，导入 java.sql.Connection、PreparedStatement、ResultSet 和 java.math.BigDecimal；处理或声明 IOException、SQLException。

| Java 类型 | JDBC / SQL 常见对应 |
| --- | --- |
| int / Integer | INTEGER |
| long / Long | BIGINT |
| BigDecimal | DECIMAL / NUMERIC |
| String | CHAR / VARCHAR / 文本 |
| byte[] | 二进制列 |
| java.sql.Date | DATE |
| java.sql.Time | TIME |
| java.sql.Timestamp | TIMESTAMP |
| LocalDate / LocalDateTime 等 | JDBC 4.2 可通过 getObject / setObject 与驱动支持的日期类型转换 |

SQL NULL 不等于 Java 数字 0。getInt、getLong 等读取 NULL 时可能返回 0，需要 wasNull() 判断；也可使用合适的 getObject 重载得到包装类型。

ResultSetMetaData 描述列信息：getColumnCount 返回列数，getColumnLabel 返回别名或列标签，getColumnName 返回原列名。

用反射自动给对象字段赋值时，还需处理别名、继承属性、空值和类型转换。不能只用 getDeclaredField 加 field.set 就称为适用于所有查询的通用 Mapper；入门先写清楚每列如何映射，再使用成熟框架。

<a id="section-6"></a>

## 资源释放与错误处理

try-with-resources 在离开代码块时关闭资源，即使出现异常也会尝试关闭。上面的嵌套写法先关闭 ResultSet，再关闭 PreparedStatement，最后关闭 Connection。

不能只打印数据库异常并返回 null 或 0：调用者会把“执行失败”误当成“没有记录”或“没有修改”。把 SQLException 继续抛给事务边界或明确的错误处理层。

<a id="section-7"></a>

## 批量写入

PreparedStatement.addBatch() 记录当前参数，executeBatch() 执行已记录的批次。普通 Statement 的 addBatch(String) 接收 SQL 文本，二者不要混淆。

Connector/J 的 rewriteBatchedStatements=true 是驱动层的批量优化，不是 MySQL 服务器“开启批处理”。已有 URL 参数时用 & 追加；没有参数时用 ?。

文件：BatchExample.java。

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BatchExample {
    public static void main(String[] args) throws Exception {
        try (Connection connection = JDBCUtils.getConnection()) {
            connection.setAutoCommit(false);
            try (PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO batch_item (name) VALUES (?)")) {
                for (int i = 1; i <= 23; i++) {
                    statement.setString(1, "item-" + i);
                    statement.addBatch();
                    if (i % 10 == 0) {
                        statement.executeBatch();
                        statement.clearBatch();
                    }
                }
                statement.executeBatch();
                statement.clearBatch();
                connection.commit();
            } catch (SQLException | RuntimeException exception) {
                try {
                    connection.rollback();
                } catch (SQLException rollbackFailure) {
                    exception.addSuppressed(rollbackFailure);
                }
                throw exception;
            }
        }
    }
}
```

这里每 10 条执行一次，最后再执行剩余 3 条，避免遗漏不足一个批次的数据。批次执行与事务提交是两件事：上例执行多次批次后才一起提交。

<a id="section-8"></a>

## 事务：多个操作一起成功或失败

新建 JDBC 连接默认自动提交。调用 setAutoCommit(false) 后，必须明确 commit 或 rollback。不能依赖 close 自动提交；存在活动事务时 close 的行为由驱动实现决定。

同一个本地事务中的 SQL 必须使用同一个 Connection。DAO 不应在中途重新获得另一个连接，也不应替调用方关闭借来的连接。

下面演示转账，金额使用 BigDecimal。数据库中两条账户记录由前面的 SQL 准备。

文件：TransferExample.java。

```java
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;

public class TransferExample {
    public static void transfer(long fromId, long toId, BigDecimal amount)
            throws Exception {
        if (fromId == toId || amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Invalid transfer");
        }
        try (Connection connection = JDBCUtils.getConnection()) {
            connection.setAutoCommit(false);
            try {
                int debited = JdbcOperations.update(connection,
                    "UPDATE account SET balance = balance - ? " +
                    "WHERE id = ? AND balance >= ?",
                    amount, fromId, amount);
                if (debited != 1) {
                    throw new SQLException("Source account is missing or funds are insufficient");
                }
                int credited = JdbcOperations.update(connection,
                    "UPDATE account SET balance = balance + ? WHERE id = ?",
                    amount, toId);
                if (credited != 1) {
                    throw new SQLException("Destination account is missing");
                }
                connection.commit();
            } catch (SQLException | RuntimeException exception) {
                try {
                    connection.rollback();
                } catch (SQLException rollbackFailure) {
                    exception.addSuppressed(rollbackFailure);
                }
                throw exception;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        transfer(1L, 2L, new BigDecimal("10.00"));
    }
}
```

扣款条件包含余额检查，避免负余额。收款失败会抛出异常并回滚扣款。相反方向的并发转账仍可能发生死锁，数据库会使其中一个事务失败；重试需要在整个事务外设计有限次数和幂等性，不能只重试某条 UPDATE。

这个例子自己获得并关闭连接。借用外部连接的工具方法应由调用者管理事务和连接状态。使用连接池时，先完成提交或回滚，再按池的约定恢复状态；setAutoCommit(true) 本身可能提交未完成事务，不能当作回滚的替代。

<a id="section-9"></a>

## DAO 的职责

DAO 封装数据库访问，不代表业务逻辑。推荐从清楚的接口开始：

```java
public interface AccountDao {
    int debit(Connection connection, long id, BigDecimal amount) throws SQLException;
    int credit(Connection connection, long id, BigDecimal amount) throws SQLException;
}
```

这是接口片段，导入对应 java.sql 与 java.math 类型。连接由 Service 的事务边界传入，两次调用使用同一个连接。

查询没有结果可返回 Optional 或空集合；数据库访问失败应抛出异常。不要用同一个 null 同时表示“没有数据”和“执行出错”。

<a id="section-10"></a>

## DataSource 与连接池

DataSource 是获得连接的标准接口，不等于所有实现都带连接池。连接池复用物理连接，减少反复建立连接的成本。

```java
try (Connection connection = dataSource.getConnection()) {
    // Execute database work with this connection.
}
```

dataSource 需要在应用启动时配置。对于池连接，close 通常把连接归还连接池；应用停止时还要关闭池本身。不要每次请求都创建一个新连接池。

| 实现 | 维护项目时需要确认 |
| --- | --- |
| HikariCP | Spring Boot JDBC starter 常见默认池；通过 Boot 管理版本和配置 |
| Druid | 使用与项目 Boot 主版本相匹配的 starter；不要直接复制其他版本的配置 |
| Apache DBCP 2 | 包名为 org.apache.commons.dbcp2，与老 DBCP 1 不同 |
| C3P0 | 常见于旧项目，按实际版本查看配置 |

一个应用可以有多个 DataSource，例如连接两个数据库。不要把“通常一个数据源”当作必须只有一个的规则。

<a id="section-11"></a>

## Apache Commons DbUtils

DbUtils 对 JDBC 的参数绑定和结果处理做进一步封装。QueryRunner 执行 SQL，ResultSetHandler 决定如何映射结果。

| Handler | 结果 |
| --- | --- |
| ArrayHandler / ArrayListHandler | 一行数组 / 多行数组列表 |
| BeanHandler / BeanListHandler | 一个 JavaBean / Bean 列表 |
| MapHandler / MapListHandler | 一行 Map / 多行 Map 列表 |
| ColumnListHandler | 某一列的列表 |
| ScalarHandler | 单个值，例如 COUNT(*) |
| KeyedHandler | 以指定列为键组织各行 Map |

事务中使用接收 Connection 的 QueryRunner 重载，不要在同一事务中改用自行获得连接的重载。Bean 映射仍需要确认列标签与属性名称一致。

参考：[Connection API](https://docs.oracle.com/en/java/javase/17/docs/api/java.sql/java/sql/Connection.html)、[Connector/J 批量优化](https://dev.mysql.com/doc/connector-j/en/connector-j-connp-props-performance-extensions.html)、[DbUtils](https://commons.apache.org/proper/commons-dbutils/)。

# MySQL 数据库

学习建库、建表、字段类型和增删改，开发时核对语法及事务影响。

**学习前提与版本：** 面向 MySQL 8.x，使用 InnoDB 练习事务；历史 5.7 示例另作说明。先创建自己的练习库，employees 等查询示例需要对应数据集。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[文档目录](README.md) · [官方参考](https://dev.mysql.com/doc/refman/8.4/en/)

**内容导航**

- [注释](#section-1)
- [命名规则](#section-2)
- [数据导入指令](#section-3)
- [数据库的基本操作](#section-4)
- [基础知识](#section-5)
- [创建和管理数据库](#section-6)
- [表的基本操作](#section-7)
- [创建和管理表](#section-8)
- [表数据的基本操作](#section-9)
- [生成列（MySQL 5.7 起支持）](#section-10)
- [表的拓展](#section-11)
- [其他命令](#section-12)


<a id="section-1"></a>

## 注释

单行注释：#注释文字 (MySQL特有的方式)
单行注释：-- 注释文字 (--后面必须包含一个空格。)
多行注释：/* 注释文字 */


<a id="section-2"></a>

## 命名规则

- 数据库名、表名和列名通常最多为 64 个字符。不同对象有不同限制，不要把其他数据库的规则套到 MySQL。

- 为了便于跨平台协作，建议使用小写字母、数字和下划线。这是命名约定，不是 MySQL 允许字符的完整列表。

- 数据库名、表名、字段名等对象名中间不要包含空格

- 同一个MySQL软件中，数据库不能同名；同一个库中，表不能重名；同一个表中，字段不能重名

- 必须保证你的字段没有和保留字、数据库系统或常用方法冲突。如果坚持使用，请在SQL语句中使用`（着重号）引起来

- 保持字段名和类型的一致性，在命名字段并为其指定数据类型的时候一定要保证一致性。假如数据类型在一个表里是整数，那在另一个表里可就别变成字符型了

- 表名、字段名必须使用小写字母或数字，不要使用驼峰式命名，禁止出现数字开头，禁止两个下划线中间只出现数字。

  > 数据库名、表名的大小写行为受操作系统和 lower_case_table_names 设置影响；列名通常不区分大小写。统一使用小写可以减少迁移问题，不代表大写名称在语法上非法。
  >
  > 正例：aliyun_admin，rdc_config，level3_name
  >
  > 反例：AliyunAdmin，rdcConfig，level_3_name

举例：

```sql
# See note 1 below.
show databases;
SHOW DATABASES;
# See note 2 below.
# See note 3 below.
create table student_info(...);
# See note 4 below.
CREATE TABLE `order` (id INT);
select id as "编号",name AS "姓名" from t_stu; # See note 5 below.
select id as 编号,name AS 姓名 from t_stu; # See note 6 below.
select id as 编 号,name as 姓 名 from t_stu; # See note 7 below.
```

示例说明：

1. 以下两句是一样的，不区分大小写
2. 创建表格
3. create table student info(...); #表名错误，因为表名有空格
4. 其中order使用飘号，因为order和系统关键字或系统函数名等预定义标识符重名了
5. 起别名时，as都可以省略
6. 如果字段别名中没有空格，那么可以省略""
7. 错误，如果字段别名中有空格，那么不能省略""


<a id="section-3"></a>

## 数据导入指令

在命令行客户端登录mysql，使用source指令导入

```mysql
mysql> source d:\mysqldb.sql
```


<a id="section-4"></a>

# 数据库的基本操作

<a id="section-5"></a>

## 基础知识

### 数据类型

| 类型             | 类型举例                                                     |
| ---------------- | ------------------------------------------------------------ |
| 整数类型         | TINYINT、SMALLINT、MEDIUMINT、INT(或INTEGER)、BIGINT         |
| 浮点类型         | FLOAT、DOUBLE                                                |
| 定点数类型       | DECIMAL                                                      |
| 位类型           | BIT                                                          |
| 日期时间类型     | YEAR、TIME、DATE、DATETIME、TIMESTAMP                        |
| 文本字符串类型   | CHAR、VARCHAR、TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT          |
| 枚举类型         | ENUM                                                         |
| 集合类型         | SET                                                          |
| 二进制字符串类型 | BINARY、VARBINARY、TINYBLOB、BLOB、MEDIUMBLOB、LONGBLOB      |
| JSON类型         | JSON对象、JSON数组                                           |
| 空间数据类型     | 单值:GEOMETRY、POINT、LINESTRING、POLYGON;集合: MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION |

其中，常用的几类类型介绍如下：

| 数据类型 | 含义与边界 |
| --- | --- |
| INT | 有符号范围 -2^31 到 2^31-1，占 4 字节；显示宽度不是最大位数 |
| BIGINT | 有符号占 8 字节；UNSIGNED 扩大正数范围但不允许负数 |
| CHAR(n) | 定长字符类型，n 为字符数，最大 255 |
| VARCHAR(n) | 变长字符类型，n 为字符数，实际容量还受字符集和行大小限制 |
| FLOAT / DOUBLE | 近似浮点数，通常占 4 / 8 字节；不适合要求精确的金额计算 |
| DECIMAL(M,D) | 精确小数，M 为总位数，D 为小数位数；M 最大 65，D 最大 30，存储大小取决于两部分的位数 |
| DATE | 日期，常用输入格式为 'YYYY-MM-DD' |
| DATETIME | 日期和时间，不自动按会话时区换算 |
| TIMESTAMP | 日期和时间，存取涉及会话时区，范围与 DATETIME 不同 |
| BLOB / TEXT | 普通类型最大 65,535 字节，分别用于二进制和文本 |
| MEDIUMBLOB / MEDIUMTEXT | 最大 16,777,215 字节 |
| LONGBLOB / LONGTEXT | 理论上最大 4,294,967,295 字节，实际还受客户端、数据包和存储限制 |

旧式 FLOAT(M,D)、DOUBLE(M,D) 已弃用。金额示例可选择 DECIMAL(10,2)，表示总计 10 位，其中两位小数；这并不等于允许 10 位整数。

参考：[MySQL 数据类型与存储要求](https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html)。

<a id="section-6"></a>

## 创建和管理数据库

### 创建数据库

- 方式1：创建数据库

```sql
CREATE DATABASE 数据库名;
```

- 方式2：创建数据库并指定字符集

```sql
CREATE DATABASE 数据库名 CHARACTER SET 字符集;
```

- 方式3：判断数据库是否已经存在，不存在则创建数据库（推荐 ）

```sql
CREATE DATABASE IF NOT EXISTS 数据库名;
```

- 如果MySQL中已经存在相关的数据库，则忽略创建语句，不再创建数据库。

> 注意：DATABASE 不能改名。一些可视化工具可以改名，它是建新库，把所有表复制到新库，再删旧库完成的。


### 查看和使用数据库

- 查看当前所有的数据库

```sql
SHOW DATABASES; # See note 1 below.
```

示例说明：

1. 有一个S，代表多个数据库


> - “information_schema”是 MySQL 系统自带的数据库，主要保存 MySQL数据库服务器的系统信息，比如数据库的名称、数据表的名称、字段名称、存取权限、数据文件 所在的文件夹和系统使用的文件夹，等等
> - “performance_schema”是 MySQL 系统自带的数据库，可以用来监控 MySQL 的各类性能指标。
> - “sys”数据库是 MySQL 系统自带的数据库，主要作用是以一种更容易被理解的方式展示 MySQL数据库服务器的各类性能指标，帮助系统管理员和开发人员监控 MySQL 的技术性能。
> - “mysql”数据库保存了 MySQL 数据库服务器运行时需要的系统信息，比如数据文件夹、当前使用的字符集、约束检查信息，等等


- 查看当前正在使用的数据库

```sql
SELECT DATABASE();	# See note 1 below.
```

示例说明：

1. 使用的一个 mysql 中的全局函数


- 查看指定库下所有的表

```sql
SHOW TABLES FROM 数据库名;
```


- 查看数据库的创建信息

```sql
SHOW CREATE DATABASE 数据库名;
# See note 1 below.
SHOW CREATE DATABASE 数据库名\G
```

示例说明：

1. 或者：


- 使用/切换数据库

```sql
USE 数据库名;
```

> 注意：要操作表格和数据之前必须先说明是对哪个数据库进行操作，否则就要对所有对象加上“数据库名.”。


### 修改数据库

- 更改数据库字符集

```sql
ALTER DATABASE 数据库名 CHARACTER SET 字符集;	# See note 1 below.
```

示例说明：

1. 比如：gbk、utf8等


### 删除数据库

- 方式1：删除指定的数据库

```sql
DROP DATABASE 数据库名;
```


- 方式2：删除指定的数据库（推荐 ）

```sql
DROP DATABASE IF EXISTS 数据库名;
```


<a id="section-7"></a>

# 表的基本操作

<a id="section-8"></a>

## 创建和管理表

### 创建新的表

语法格式：

```sql
CREATE TABLE 表名称(字段名 数据类型, 字段名 数据类型);

例：
CREATE TABLE peoples(
id int,      # See note 1 below.
name varchar(20), 	# See note 2 below.
sex varchar(1)
);
```

示例说明：

1. MySQL8.x中，不再推荐为 INT 类型指定显示长度
2. 名字不超过20个字符


推荐使用以下方式：

```sql
CREATE TABLE [IF NOT EXISTS] 表名(
字段1, 数据类型 [约束条件] [默认值],
字段2, 数据类型 [约束条件] [默认值],
字段3, 数据类型 [约束条件] [默认值],
……
[表约束条件]
);
```

> 加上了 IF NOT EXISTS 关键字，则表示：如果当前数据库中不存在要创建的数据表，则创建数据表；如果当前数据库中已经存在要创建的数据表，则忽略建表语句，不再创建数据表。

MySQL 在执行建表语句时，将id字段的类型设置为 int(11)，这里的11实际上是 int 类型指定的显示宽度，默认的显示宽度为11。也可以在创建数据表的时候指定数据的显示宽度。在 MySQL 8.x版本中，不再推荐为 INT 类型指定显示长度，并在未来的版本中可能去掉这样的语法


### 查看数据表的创建命令

语法格式：

```sql
SHOW CREATE TABLE 表名;
```


### 显示表结构

使用DESCRIBE 或 DESC 命令，表示表结构。

```sql
DESCRIBE employees;
或
DESC employees;
```

其中，各个字段的含义分别解释如下：
Field：表示字段名称。
Type：表示字段类型，这里 barcode、goodsname 是文本型的，price 是整数类型的。
Null：表示该列是否可以存储NULL值。
Key：表示该列是否已编制索引。PRI表示该列是表主键的一部分；UNI表示该列是UNIQUE索引的一部分；MUL表示在列中某个给定值允许出现多次。
Default：表示该列是否有默认值，如果有，那么值是多少。
Extra：表示可以获取的与给定列有关的附加信息，例如AUTO_INCREMENT等。


### 修改表

#### 追加一个列

使用 **ALTER ... ADD ...** 语法格式如下：

```sql
ALTER TABLE 表名 ADD [COLUMN] 字段名 字段类型 [FIRST|AFTER 字段名];
```

例：

```sql
ALTER TABLE dept80 ADD job_id varchar(15);
```


#### 修改一个列

使用 **ALTER ... MODIFY ...**：

- 可以修改列的数据类型，长度、默认值和位置
- 修改字段数据类型、长度、默认值、位置的语法格式如下：

```sql
ALTER TABLE 表名 MODIFY 字段名1 字段类型 [DEFAULT 默认值][FIRST|AFTER 字段名2];
```

例：

```sql
ALTER TABLE dept80 MODIFY last_name VARCHAR(30);
```

注： 不能重命名列


#### 重命名一个列

使用 **CHANGE** old_column new_column dataType 子句重命名列。语法格式如下：

```sql
ALTER TABLE 表名 CHANGE 列名 新列名 新数据类型;
```

例：

```sql
ALTER TABLE dept80 CHANGE department_name dept_name varchar(15);
```


#### 删除一个列

使用 **ALTER ... DROP ...** 删除表中某个字段的语法格式如下：

```sql
ALTER TABLE 表名 DROP 字段名
```

例：

```sql
ALTER TABLE dept80 DROP COLUMN job_id;
```


### 删除表

- 在MySQL中，当一张数据表没有与其他任何数据表形成关联关系 时，可以将当前数据表直接删除。
- 数据和结构都被删除
- 普通 DROP TABLE 会隐式提交当前会话的事务，不是提交其他连接中所有相关事务；临时表有不同规则。
- 所有相关索引被删除

语法格式：

```sql
DROP TABLE 表名称;
```

推荐使用：

```sql
DROP TABLE IF EXISTS 表名1 [, 表名2, …, 表名n];
```

> IF EXISTS 的含义为：如果当前数据库中存在相应的数据表，则删除数据表；如果当前数据库中不存在相应的数据表，则忽略删除语句，不再执行删除数据表的操作。


### 清空表

TRUNCATE TABLE 语句：

- 删除表中所有的数据
- 释放表的存储空间

```sql
TRUNCATE TABLE detail_dept;
```

**普通 TRUNCATE TABLE 会隐式提交，不能按普通 DML 回滚。DELETE 只有在支持事务的表中、尚未提交时才能回滚。**


### 重命名表

- 方式一：使用RENAME

```sql
RENAME TABLE emp TO myemp;
```


- 方式二：

```sql
ALTER table dept
RENAME [TO] detail_dept;	-- See note 1 below.
```

示例说明：

1. [TO]可以省略


<a id="section-9"></a>

## 表数据的基本操作

### 增加数据

#### 1：VALUES 的方式添加

VALUES 后可以写一组或多组值；一组插入一行，多组用逗号分隔。

**情况1：为表的所有字段按默认顺序插入数据**

```sql
INSERT INTO 目标表名 VALUES (value1,value2,....);
```

例：

```sql
INSERT INTO peoples VALUES(1, 'Tom','m');

INSERT INTO peoples VALUES(2, 'Mary','f');
```

中文能否正常存储取决于连接、数据库和列的字符集，不是 MySQL 5.7 本身不支持中文。通常使用 utf8mb4，并确认客户端编码一致。

**值列表中需要为表的每一个字段指定值，并且值的顺序必须和数据表中字段定义时的顺序相同。**


**情况2：为表的指定字段插入数据**

```sql
INSERT INTO 目标表名(column1 [, column2, …, columnn])
VALUES (value1 [,value2, …, valuen]);
```


为表的指定字段插入数据，就是在INSERT语句中只向部分字段中插入值，而其他字段的值为表定义时的默认值。

在 INSERT 子句中随意列出列名，但是一旦列出，VALUES中要插入的value1,…valuen需要与column1,…columnn列一一对应。如果类型不同，将无法插入，并且MySQL会产生错误。


**情况3：同时插入多条记录**

INSERT语句可以同时向数据表中插入多条记录，插入时指定多个值列表，每个值列表之间用逗号分隔开，基本语法格式如下：

```sql
INSERT INTO 目标表名
VALUES
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
```

或者

```sql
INSERT INTO 目标表名(column1 [, column2, …, columnn])
VALUES
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
```

一个同时插入多行记录的 INSERT 语句等同于多个单行插入的 INSERT 语句，但是多行的 INSERT 语句在处理过程中 效率更高 。因为 MySQL 执行单条 INSERT 语句插入多行数据比使用多条 INSERT 语句快，所以在插入多条记录时最好选择使用单条 INSERT 语句的方式插入。


#### 2：将查询结果插入到表中

INSERT 还可以将 SELECT 语句查询的结果插入到表中，此时不需要把每一条记录的值一个一个输入，只需要使用一条 INSERT 语句和一条 SELECT 语句组成的组合语句即可快速地从一个或多个表中向一个表中插入多行。

基本语法格式如下：

```sql
INSERT INTO 目标表名
(tar_column1 [, tar_column2, …, tar_columnn])
SELECT
src_column1 [, src_column2, …, src_columnn]
FROM 源表名
[WHERE condition]
```

- 在 INSERT 语句中加入子查询。
- 不必书写 VALUES 子句。
- 子查询中的值列表应与 INSERT 子句中的列名对应。


#### 3：插入或替换

如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就**先删除**原记录，再插入新记录。此时，可以使用 `REPLACE` 语句，这样就不必先查询，再决定是否先删除再插入：

```sql
REPLACE INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...);
```

若新行没有与主键或 UNIQUE 索引发生冲突，`REPLACE`语句将插入新记录，否则，与主键或 UNIQUE 索引冲突的记录将被删除，然后再插入新记录。


#### 4：插入或更新

如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就**更新**该记录。此时，可以使用 `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`语句：

```sql
INSERT INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...)
ON DUPLICATE KEY UPDATE column3=value3, column4=value4, column5=value5;
```

若新行没有与主键或 UNIQUE 索引发生冲突，`INSERT ` 语句将插入新记录，否则，与主键或 UNIQUE 索引冲突的记录将被更新，更新的字段由 `UPDATE` 指定。


#### 5：插入或忽略

如果我们希望插入一条新记录（INSERT），但如果记录已经存在，就啥事也不干直接忽略，此时，可以使用 `INSERT IGNORE INTO ...` 语句：

```sql
INSERT IGNORE INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...);
```

若新行没有与主键或 UNIQUE 索引发生冲突，`INSERT` 语句将插入新记录，主键或 UNIQUE 索引冲突时通常忽略该行。IGNORE 还可能把某些其他错误转成警告，所以不能把它只当作“存在则跳过”。


### 更新数据

使用 UPDATE 语句更新数据。语法如下：

```sql
UPDATE 目标表名
SET column1=value1, column2=value2, … , column=valuen
WHERE condition
```

例如：

```sql
UPDATE t_employee
SET name = 'Tom'
WHERE id = 00001;
```

- 可以一次更新多条数据。
- 如果需要回滚数据，需要保证在DML前，进行设置：set autocommit = FALSE;

使用 WHERE 子句指定需要更新的数据。如果省略 WHERE 子句，则表中的所有数据都将被更新。


### 删除数据

使用 DELETE 语句从表中删除数据。语法如下：

```sql
DELETE FROM 目标表名 [WHERE <condition>];
```

目标表名 指定要执行删除操作的表；“[WHERE ]”为可选参数，指定删除条件，如果没有WHERE子句，DELETE语句将删除表中的所有记录。


### 查询数据

#### 基本查询

语法：**SELECT … FROM ...**

```sql
SELECT 标识选择哪些列
FROM 标识从哪个表中选择
```

选择全部列：

```sql
SELECT *
FROM departments;
```

选择特定的列：

```sql
SELECT department_id, location_id
FROM departments;
```


MySQL中的SQL语句是不区分大小写的，因此SELECT和select的作用是相同的。


#### 查询过滤

语法：

```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```

使用 WHERE 子句，将不满足条件的行过滤掉 WHERE 子句紧随 FROM子句。

> WHERE 必须紧跟在 FROM 的后面

举例:

```sql
# 1
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90;

# 2
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90 ORDER BY employee_id DESC;
```


#### 列的别名

**... AS name**

- 重命名一个列
- 便于计算
- 紧跟列名，也可以在列名和别名之间加入关键字AS，别名使用双引号，以便在别名中包含空格或特殊的字符并区分大小写。
- AS 可以省略
- 建议别名简短，见名知意

举例

```sql
SELECT last_name AS name, commission_pct comm
FROM employees;

SELECT employee_id,last_name,department_id
FROM employees;

SELECT employee_id id ,last_name l_nm ,department_id AS dept_id
FROM employees;

SELECT last_name "Name", salary*12 "Annual Salary"
FROM employees;
```


#### 去除重复行

默认情况下，查询会返回全部行，包括重复行。在SELECT语句中使用关键字DISTINCT去除重复行。

```sql
SELECT DISTINCT department_id
FROM employees;
```

针对于：

```sql
SELECT DISTINCT department_id, salary
FROM employees;
```

> 这里有两点需要注意：
>
> 1. DISTINCT 需要放到所有列名的前面，如果写成 SELECT salary, DISTINCT department_id FROM employees 会报错。
> 2. DISTINCT 对所选列的整个组合去重。例如 (department_id, salary) 相同的两行才会合并。结果行数取决于当前数据，不能解释为部门数量；只想统计不同部门时，仅选择 DISTINCT department_id。


#### 空值参与运算

NULL 表示缺少或未知的值。普通算术运算和比较通常会得到 NULL；IS NULL、NULL 安全相等运算符 <=>、COALESCE，以及部分逻辑运算有自己的规则，不能概括为所有运算都返回 NULL。

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

在 MySQL 里面， 空值不等于空字符串。一个空字符串的长度是 0，而LENGTH(NULL) 的结果是 NULL。而且，在 MySQL 里面，空值是占用空间的。null不等同于0、’ ’ 以及’null’.


#### 着重号

**使用一对 ` 包起来。**

错误的:

```sql
SELECT * FROM ORDER;
```

正确的:

```sql
SELECT * FROM `ORDER`;
```

结论:
要保证表中的字段、表名等没有和保留字、数据库系统或常用方法冲突。如果真的相同，请在SQL语句中使用一对``（着重号）引起来。


#### 查询常数

SELECT 查询还可以对常数进行查询。对的，就是在 SELECT 查询结果中增加一列固定的常数列。这列的取值是我们指定的，而不是从数据表中动态取出的。
你可能会问为什么我们还要对常数进行查询呢？
SQL 中的 SELECT 语法的确提供了这个功能，一般来说我们只从一个表中查询数据，通常不需要增加一个固定的常数列，但如果我们想整合不同的数据源，用常数列作为这个表的标记，就需要查询常数。比如说，我们想对 employees 数据表中的员工姓名进行查询，同时**增加一列固定字段 corporation** ，这个字段固定值为“尚硅谷”，可以这样写：

```sql
SELECT 'Atguigu' as corporation, last_name
FROM employees;
```


<a id="section-10"></a>

## 生成列（MySQL 5.7 起支持）

在 MySQL 8.0 中，CREATE TABLE 和 ALTER TABLE 中都支持增加计算列。

举例：定义数据表tb1，然后定义字段id、字段a、字段b和字段c，其中字段c为计算列，用于计算a+b的值。 首先创建测试表tb1，语句如下：

```sql
CREATE TABLE tb1(
id INT,
a INT, b INT,
c INT GENERATED ALWAYS AS (a + b) VIRTUAL );
```

插入演示数据，语句如下：

```sql
INSERT INTO tb1(a,b) VALUES (100,200);
```

查询数据表tb1中的数据，结果如下：

```sql
SELECT * FROM	tb1;
```

 id	a	b	c

NULL	100	200	300


<a id="section-11"></a>

## 表的拓展

【强制 】表名、字段名必须使用小写字母或数字，禁止出现数字开头，禁止两个下划线中间只出现数字。数据库字段名的修改代价很大，因为无法进行预发布，所以字段名称需要慎重考虑。

- 正例：aliyun_admin,rdc_config,level3_name

- 反例：AliyunAdmin，rdcConfig,level_3_name

【 强制 】禁用保留字，如 desc、range、match、delayed 等，请参考 MySQL 官方保留字。
【 强制 】表必备三字段：id, gmt_create, gmt_modified。

- 说明：其中 id 必为主键，类型为BIGINT UNSIGNED、单表时自增、步长为 1。gmt_create,gmt_modified 的类型均为 DATETIME 类型，前者现在时表示主动式创建，后者过去分词表示被动式更新

【推荐 】表的命名最好是遵循 “业务名称_表的作用”。

- 正例：alipay_task 、 force_project、trade_config
  【推荐 】库名与应用名称尽量一致。
  【参考】合适的字符存储长度，不但节约数据库表空间、节约索引存储，更重要的是提升检索速度。
- 正例：无符号值可以避免误存负数，且扩大了表示范围。


<a id="section-12"></a>

## 其他命令

### 查看编码命令

```sql
SHOW variables like 'character_%';

SHOW variables like 'collation_%';
```


### 编码问题

修改MySQL的数据目录下的my.ini配置文件

在 [client] 或 [mysql] 配置段中添加，位置不依赖固定行号：

```ini
default-character-set=utf8mb4
```

在 [mysqld] 配置段中添加，服务器配置修改后需要重新启动服务：

```ini
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

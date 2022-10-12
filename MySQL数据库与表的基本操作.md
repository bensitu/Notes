# MySQL 数据库

## 注释

单行注释：#注释文字 (MySQL特有的方式)
单行注释：-- 注释文字 (--后面必须包含一个空格。)
多行注释：/* 注释文字 */



## 命名规则

- 数据库、表名不得超过30个字符，变量名限制为29个

- 必须只能包含 A–Z, a–z, 0–9, _共63个字符

- 数据库名、表名、字段名等对象名中间不要包含空格

- 同一个MySQL软件中，数据库不能同名；同一个库中，表不能重名；同一个表中，字段不能重名

- 必须保证你的字段没有和保留字、数据库系统或常用方法冲突。如果坚持使用，请在SQL语句中使用`（着重号）引起来

- 保持字段名和类型的一致性，在命名字段并为其指定数据类型的时候一定要保证一致性。假如数据类型在一个表里是整数，那在另一个表里可就别变成字符型了

- 表名、字段名必须使用小写字母或数字，不要使用驼峰式命名，禁止出现数字开头，禁止两个下划线中间只出现数字。

  > 说明：MySQL 在 Windows 下不区分大小写，但在 Linux 下默认是区分大小写。因此，数据库名、表名、字段名，都不允许出现任何大写字母，避免节外生枝。
  >
  > 正例：aliyun_admin，rdc_config，level3_name 
  >
  > 反例：AliyunAdmin，rdcConfig，level_3_name

举例：

```sql
#以下两句是一样的，不区分大小写
show databases;
SHOW DATABASES;
#创建表格
#create table student info(...); #表名错误，因为表名有空格
create table student_info(...);
#其中order使用飘号，因为order和系统关键字或系统函数名等预定义标识符重名了
CREATE TABLEorder();
select id as "编号",nameas "姓名" from t_stu; #起别名时，as都可以省略
select id as 编号,nameas 姓名 from t_stu; #如果字段别名中没有空格，那么可以省略""
select id as 编 号,name as 姓 名 from t_stu; #错误，如果字段别名中有空格，那么不能省略""
```



## 数据导入指令

在命令行客户端登录mysql，使用source指令导入

```mysql
mysql> source d:\mysqldb.sql
```



# 数据库的基本操作

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

| 数据类型      | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| INT           | 从-2^31到2^31 -1的整型数据。存储大小为 4个字节。默认长度为11 |
| CHAR(size)    | 定长字符数据。若未指定，默认为1个字符，最大长度255           |
| VARCHAR(size) | 可变长字符数据，根据字符串实际长度保存，必须指定长度         |
| FLOAT(M,D)    | 单精度，占用4个字节，M=整数位+小数位，D=小数位。 D<=M<=255,0<=D<=30，默认M+D<=6 |
| DOUBLE(M,D)   | 双精度，占用8个字节，D<=M<=255,0<=D<=30，默认M+D<=15         |
| DECIMAL(M,D)  | 高精度小数，占用M+2个字节，D<=M<=65，0<=D<=30，最大取值范围与DOUBLE相同。 |
| DATE          | 日期型数据，格式’YYYY-MM-DD’                                 |
| BLOB          | 二进制形式的长文本数据，最大可达4G                           |
| TEXT          | 长文本数据，最大可达4G                                       |



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
SHOW DATABASES; #有一个S，代表多个数据库
```

> - “information_schema”是 MySQL 系统自带的数据库，主要保存 MySQL数据库服务器的系统信息，比如数据库的名称、数据表的名称、字段名称、存取权限、数据文件 所在的文件夹和系统使用的文件夹，等等
> - “performance_schema”是 MySQL 系统自带的数据库，可以用来监控 MySQL 的各类性能指标。
> - “sys”数据库是 MySQL 系统自带的数据库，主要作用是以一种更容易被理解的方式展示 MySQL数据库服务器的各类性能指标，帮助系统管理员和开发人员监控 MySQL 的技术性能。
> - “mysql”数据库保存了 MySQL 数据库服务器运行时需要的系统信息，比如数据文件夹、当前使用的字符集、约束检查信息，等等



- 查看当前正在使用的数据库

```sql
SELECT DATABASE();	#使用的一个 mysql 中的全局函数
```



- 查看指定库下所有的表

```sql
SHOW TABLES FROM 数据库名;
```



- 查看数据库的创建信息

```sql
SHOW CREATE DATABASE 数据库名;
#或者：
SHOW CREATE DATABASE 数据库名\G
```



- 使用/切换数据库

```sql
USE 数据库名;
```

> 注意：要操作表格和数据之前必须先说明是对哪个数据库进行操作，否则就要对所有对象加上“数据库名.”。



### 修改数据库

- 更改数据库字符集

```sql
ALTER DATABASE 数据库名 CHARACTER SET 字符集;	#比如：gbk、utf8等
```



### 删除数据库

- 方式1：删除指定的数据库

```sql
DROP DATABASE 数据库名;
```



- 方式2：删除指定的数据库（推荐 ）

```sql
DROP DATABASE IF EXISTS 数据库名;
```



# 表的基本操作

## 创建和管理表

### 创建新的表

语法格式：

```sql
CREATE TABLE 表名称(字段名 数据类型, 字段名 数据类型);

例：
CREATE TABLE peoples(
id int,      #MySQL8.x中，不再推荐为 INT 类型指定显示长度
name varchar(20), 	#名字不超过20个字符
sex varchar(1) 
);
```

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
- 所有正在运行的相关事务被提交
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

**TRUNCATE 语句不能回滚，而使用 DELETE 语句删除数据，可以回滚**



### 重命名表

- 方式一：使用RENAME

```sql
RENAME TABLE emp TO myemp;
```



- 方式二：

```sql
ALTER table dept 
RENAME [TO] detail_dept;	-- [TO]可以省略
```



## 表数据的基本操作

### 增加数据

#### 方式1：VALUES 的方式添加

使用这种语法一次只能向表中插入一条数据。

**情况1：为表的所有字段按默认顺序插入数据**

```sql
INSERT INTO 目标表名 VALUES (value1,value2,....);
```

例：

```sql
INSERT INTO peoples VALUES(1, 'Tom','m');

INSERT INTO peoples VALUES(2, 'Mary','f');
```

注：5.7版本下因字符集的问题，添加中文会报错。

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



#### 方式2：将查询结果插入到表中

INSERT 还可以将 SELECT 语句查询的结果插入到表中，此时不需要把每一条记录的值一个一个输入，只需要使用一条 INSERT 语句和一条 SELECT 语句组成的组合语句即可快速地从一个或多个表中向一个表中插入多行。

基本语法格式如下：

```sql
INSERT INTO 目标表名
(tar_column1 [, tar_column2, …, tar_columnn])
SELECT
(src_column1 [, src_column2, …, src_columnn])
FROM 源表名
[WHERE condition]
```

- 在 INSERT 语句中加入子查询。
- 不必书写 VALUES 子句。
- 子查询中的值列表应与 INSERT 子句中的列名对应。



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
> 2. DISTINCT 其实是对后面所有列名的组合进行去重，你能看到最后的结果是 74 条，因为这 74 个部门id不同，都有 salary 这个属性值。如果你想要看都有哪些不同的部门（department_id），只需要写 DISTINCT department_id 即可，后面不需要再加其他的列名了。



#### 空值参与运算

所有运算符或列值遇到null值，运算的结果都为null

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

在 MySQL 里面， 空值不等于空字符串。一个空字符串的长度是 0，而一个空值的长度是空。而且，在 MySQL 里面，空值是占用空间的。null不等同于0、’ ’ 以及’null’.



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





## MySQL8 新特性：计算列

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





## 其他命令

### 查看编码命令

```sql
SHOW variables like 'character_%'; 

SHOW variables like 'collation_%';
```



### 编码问题

修改MySQL的数据目录下的my.ini配置文件

在63行添加：

```ini
default-character-set=utf8
```

在78行添加：

```ini
character-set-server=utf8 
collation-server=utf8_general_ci
```



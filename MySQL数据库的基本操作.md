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

## 基本语句

### 展示所有的数据库

```sql
show databases;
```

> - “information_schema”是 MySQL 系统自带的数据库，主要保存 MySQL数据库服务器的系统信息，比如数据库的名称、数据表的名称、字段名称、存取权限、数据文件 所在的文件夹和系统使用的文件夹，等等
> - “performance_schema”是 MySQL 系统自带的数据库，可以用来监控 MySQL 的各类性能指标。
> - “sys”数据库是 MySQL 系统自带的数据库，主要作用是以一种更容易被理解的方式展示 MySQL数据库服务器的各类性能指标，帮助系统管理员和开发人员监控 MySQL 的技术性能。
> - “mysql”数据库保存了 MySQL 数据库服务器运行时需要的系统信息，比如数据文件夹、当前使用的字符集、约束检查信息，等等



### 使用数据库

```sql
USE 数据库名;
```



### 查看某个数据库的所有表

```sql
SHOW TABLES FROM 数据库名;
```



### 创建新的表

```sql
CREATE TABLE 表名称(字段名 数据类型, 字段名 数据类型);

例：
CREATE TABLE peoples(
id int,
name varchar(20), 	#名字不超过20个字符
sex varchar(1) 
);
```



### 添加一条记录

```sql
INSERT INTO 表名称 VALUES(值列表);
```

例：

```sql
INSERT INTO peoples VALUES(1, 'Tom','m');

INSERT INTO peoples VALUES(2, 'Mary','f');
```

注：5.7版本下因字符集的问题，添加中文会报错。



### 查看表的创建信息

```sql
SHOW CREATE TABLE 表名称;
```



### 查看数据库的创建信息

```sql
SHOW CREATE DATABASE 数据库名;
```



### 删除表

```sql
DROP TBALE 表名称;
```



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



## 基本的 SELECT 语句

**SELECT … FROM ...**

语法：

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



### 列的别名

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



### 去除重复行

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



### 空值参与运算

所有运算符或列值遇到null值，运算的结果都为null

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

在 MySQL 里面， 空值不等于空字符串。一个空字符串的长度是 0，而一个空值的长度是空。而且，在 MySQL 里面，空值是占用空间的。null不等同于0、’ ’ 以及’null’.



### 着重号

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



### 查询常数

SELECT 查询还可以对常数进行查询。对的，就是在 SELECT 查询结果中增加一列固定的常数列。这列的取值是我们指定的，而不是从数据表中动态取出的。
你可能会问为什么我们还要对常数进行查询呢？
SQL 中的 SELECT 语法的确提供了这个功能，一般来说我们只从一个表中查询数据，通常不需要增加一个固定的常数列，但如果我们想整合不同的数据源，用常数列作为这个表的标记，就需要查询常数。比如说，我们想对 employees 数据表中的员工姓名进行查询，同时**增加一列固定字段 corporation** ，这个字段固定值为“尚硅谷”，可以这样写：

```sql
SELECT 'Atguigu' as corporation, last_name
FROM employees;
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





### 查询过滤

语法：

```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```

使用WHERE 子句，将不满足条件的行过滤掉WHERE子句紧随 FROM子句。

> WHERE 必须紧跟在FROM的后面
>

举例:

```sql
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90;

SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90 ORDER BY employee_id DESC;
```


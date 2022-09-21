# MySQL 基础查询

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


MySQL 中的 SQL 语句是不区分大小写的，因此 SELECT 和 select 的作用是相同的。



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

举例:

```sql
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90;

SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90 ORDER BY employee_id DESC;
```





# MySQL 多表查询

### 等值连接

使用多个表中相同名字的列进行关联

```sql
SELECT xxx FROM 表1, 表2
WHERE 表1.某字段=表2.某字段
```

或者

```sql
SELECT 表1.xxx, 表3.xxx FROM 表1, 表2, 表3 
WHERE 表1.某字段=表2.某字段 AND 表2.某字段=表3.某字段
```

例：

```sql
SELECT employees.employee_id, employees.last_name, employees.department_id, departments.department_id, departments.location_id
FROM employees, departments
WHERE employees.department_id = departments.department_id;
```

- 使用别名可以简化查询。
- 列名前使用表名前缀可以提高查询效率。
- 连接 n个表,至少需要n-1个连接条件。比如，连接三个表，至少需要两个连接条件。



### 自连接

使用同一张表进行内链。

例：

```sql
SELECT CONCAT(worker.last_name ,' works for ', manager.last_name)
FROM employees worker, employees manager
WHERE worker.manager_id = manager.employee_id ;
```

- 内连接：合并具有同一列的两个以上的表的行, 结果集中不包含一个表与另一个表不匹配的行
- 外连接：两个表在连接过程中除了返回满足连接条件的行以外还返回左（或右）表中不满足条件的行 ，这种连接称为左（或右）外连接。没有匹配的行时, 结果表中相应的列为空(NULL)。
- 如果是左外连接，则连接条件中左边的表也称为 主表 ，右边的表称为 从表 。 如果是右外连接，则连接条件中右边的表也称为 主表 ，左边的表称为 从表 。



### SQL92: 使用(+)创建连接

- 在 SQL92 中采用（+）代表从表所在的位置。即左或右外连接中，(+) 表示哪个是从表。
- Oracle 对 SQL92 支持较好，而 MySQL 则不支持 SQL92 的外连接。

```sql
#左外连接
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id = departments.department_id(+);
#右外连接
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id(+) = departments.department_id;
```

- 而且在 SQL92 中，只有左外连接和右外连接，没有满（或全）外连接。



### SQL99: 语法实现多表查询

#### 基本语法 (JOIN ON)

使用 **JOIN…ON** 子句创建连接的语法结构：

```sql
SELECT table1.column, table2.column,table3.column
FROM table1
JOIN table2 ON table1 和 table2 的连接条件
JOIN table3 ON table2 和 table3 的连接条件
```

**语法说明：**

- 可以使用 ON 子句指定额外的连接条件。
- 这个连接条件是与其它条件分开的。
- ON 子句使语句具有更高的易读性。
- 关键字 JOIN、INNER JOIN、CROSS JOIN 的含义是一样的，都表示内连接



#### 内连接 (INNER JOIN)

语法：

```sql
SELECT 字段列表
FROM A表 INNER JOIN B表
ON 关联条件
WHERE 等其他子句;
```



#### 左外连接 (LEFT OUTER JOIN)

语法：

```sql
#实现查询结果是A
SELECT 字段列表
FROM A表 LEFT JOIN B表
ON 关联条件
WHERE 等其他子句;
```



#### 右外连接 (RIGHT OUTER JOIN)

语法：

```sql
FROM A表 RIGHT JOIN B表
ON 关联条件
WHERE 等其他子句;
```



#### 满外连接 (FULL OUTER JOIN)

- 满外连接的结果 = 左右表匹配的数据 + 左表没有匹配到的数据 + 右表没有匹配到的数据。
- SQL99是支持满外连接的。使用FULL JOIN 或 FULL OUTER JOIN来实现。
- 需要注意的是，**MySQL不支持FULL JOIN**，但是可以用 LEFT JOIN UNION RIGHT join代替。

```sql
SELECT last_name,department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```



### UNION 的使用

合并查询结果利用 UNION 关键字，可以给出多条 SELECT 语句，并将它们的结果组合成单个结果集。合并时，两个表对应的列数和数据类型必须相同，并且相互对应。各个 SELECT 语句之间使用 UNION 或 UNION ALL 关键字分隔。

语法：

```sql
SELECT column,... FROM table1
UNION [ALL]
SELECT column,... FROM table2
```

**UNION 操作符**

UNION 操作符返回两个查询的结果集的并集，去除重复记录。

**UNION ALL 操作符**

UNION ALL 操作符返回两个查询的结果集的并集。对于两个结果集的重复部分，不去重。

> 注意：执行 UNION ALL 语句时所需要的资源比 UNION 语句少。如果明确知道合并数据后的结果数据不存在重复数据，或者不需要去除重复的数据，则尽量使用 UNION ALL 语句，以提高数据查询的效率

```sql
#UNION 方式1
SELECT * FROM employees WHERE email LIKE '%a%' OR department_id>90;

#UNION 方式2
SELECT * FROM employees WHERE email LIKE '%a%'
UNION
SELECT * FROM employees WHERE department_id>90;


#UNIONALL 方式
SELECT id,cname FROM t_chinamale WHERE csex='男'
UNION ALL
SELECT id,tname FROM t_usmale WHERE tGender='male';
```





### 7种 SQL JOINS 的实现

```sql
#中图：内连接 A∩B
SELECT employee_id,last_name,department_name
FROM employees e JOIN departments d
ON e.department_id = d.department_id;


#左上图：左外连接
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id;


#右上图：右外连接
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id;


#左中图：A - A∩B
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL


#右中图：B-A∩B
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id
WHERE e.department_id IS NULL


#左下图：满外连接
#*左中图 + 右上图 A∪B*
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL
UNION ALL	#没有去重操作，效率高
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id;


#右下图
#左中图 + 右中图	A ∪B- A∩B 或者 (A -	A∩B) ∪ （B - A∩B）
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL
UNION ALL
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id
WHERE e.department_id IS NULL

```
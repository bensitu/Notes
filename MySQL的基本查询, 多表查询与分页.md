# MySQL 基础查询

查 SELECT、去重、排序、连接、子查询和分页写法。

**学习前提与版本：** 面向 MySQL 8.x；employees、departments、locations 属于练习数据集。Oracle 写法只作明确标记的对照，不在 MySQL 执行。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[学习索引与常见词](README.md) · [官方参考](https://dev.mysql.com/doc/refman/8.4/en/select.html)

**内容导航**

- [基本的 SELECT 语句](#section-1)
- [排序数据](#section-2)
- [排序规则](#section-3)
- [分页](#section-4)
- [分页原理](#section-5)
- [拓展](#section-6)
- [MySQL 多表查询](#section-7)


<a id="section-1"></a>

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
> 2. DISTINCT 对所选列的整个组合去重。例如 (department_id, salary) 相同的两行才会合并。结果行数取决于当前数据，不能解释为部门数量；只想统计不同部门时，仅选择 DISTINCT department_id。


### 空值参与运算

NULL 表示缺少或未知的值。普通算术运算和比较通常会得到 NULL；IS NULL、NULL 安全相等运算符 <=>、COALESCE，以及部分逻辑运算有自己的规则，不能概括为所有运算都返回 NULL。

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

在 MySQL 里面， 空值不等于空字符串。一个空字符串的长度是 0，而LENGTH(NULL) 的结果是 NULL。而且，在 MySQL 里面，空值是占用空间的。null不等同于0、’ ’ 以及’null’.


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


<a id="section-2"></a>

# 排序数据

<a id="section-3"></a>

## 排序规则

### 单次排序

使用 ORDER BY 子句排序:

```sql
SELECT 列名 FROM 目标表名 ORDER BY 列名 (ASC/DESC);
```

ASC（ascend）: 升序
DESC（descend）:降序
ORDER BY 子句在SELECT语句的结尾。

```sql
SELECT last_name, job_id, department_id, hire_date
FROM employees ORDER BY hire_date ;
```


### 多次排序

- 可以使用不在SELECT列表中的列排序。
- 在对多列进行排序的时候，首先排序的第一列必须有相同的列值，才会对第二列进行排序。如果第一列数据中所有值都是唯一的，将不再对第二列进行排序。

```sql
SELECT last_name, department_id, salary
FROM employees ORDER BY department_id, salary DESC;
```


<a id="section-4"></a>

# 分页

<a id="section-5"></a>

## 分页原理

所谓分页显示，就是将数据库中的结果集，一段一段显示出来需要的条件。

MySQL中使用 LIMIT 实现分页

格式：

```sql
SELECT 列名 FROM 目标表名 LIMIT 位置偏移量, 行数;
```

第一个“位置偏移量”参数指示MySQL从哪一行开始显示，是一个可选参数，如果不指定“位置偏移量”，将会从表中的第一条记录开始（第一条记录的位置偏移量是0，第二条记录的位置偏移量是1，以此类推）；第二个参数“行数”指示返回的记录条数。

```sql
SELECT * FROM 目标表名 LIMIT 0,10; (返回第1个到第10个)

SELECT * FROM 目标表名 LIMIT 10,10; (返回第11个到第20个)

SELECT * FROM 目标表名 LIMIT 20,10; (返回第21个到第30个)
```


分页偏移量 =（当前页数 - 1）× 每页条数。先在程序中计算偏移量，再把偏移量和条数绑定到 SQL；普通 LIMIT 不能直接放入该算术表达式。下面表示每页 10 条的第 3 页。

```sql
SELECT * FROM employees ORDER BY employee_id LIMIT 20, 10;
```

- 注意：LIMIT 子句必须放在整个SELECT语句的最后！
- 使用 LIMIT 的好处: 约束返回结果的数量可以 减少数据表的网络传输量 ，也可以 提升查询效率 。如果我们知道返回结果只有1 条，就可以使用 LIMIT 1 ，告诉 SELECT 语句只需要返回一条记录即可。这样的好处就是 SELECT 不需要扫描完整的表，只需要检索到一条符合条件的记录即可返回。


<a id="section-6"></a>

## 拓展

在不同的 DBMS 中使用的关键字可能不同。在 MySQL、PostgreSQL、MariaDB 和 SQLite 中使用 LIMIT 关键字，而且需要放到 SELECT 语句的最后面。

- 如果是 SQL Server 和 Access，需要使用 TOP 关键字，比如：

  ```sql
  SELECT TOP 5 name, hp_max FROM heros ORDER BY hp_max DESC
  ```


- 如果是 DB2，使用 FETCH FIRST 5 ROWS ONLY 这样的关键字：

  ```sql
  SELECT name, hp_max FROM heros ORDER BY hp_max DESC FETCH FIRST 5 ROWS ONLY
  ```


- Oracle 12c 起可使用 FETCH FIRST。旧版 ROWNUM 需要先在子查询中排序，再在外层限制条数，否则得到的不是排序后的前几名：

  ```sql
  SELECT last_name, salary FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY;
  ```


<a id="section-7"></a>

# MySQL 多表查询

### 等值连接

使用等号比较两张表中有关联的列。两侧列名可以不同，例如 employee.department_id = department.id。

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
- 表名前缀或表别名用于消除列名歧义、提高可读性，不能据此保证查询更快。性能还取决于索引、数据量和执行计划。
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


### Oracle 旧式外连接语法（了解即可）

- (+) 是 Oracle 的旧式外连接运算符，不是 SQL92 标准语法。它标记可能缺少匹配行的一侧。
- MySQL 不支持 Oracle 的 (+) 写法。MySQL 使用 LEFT JOIN / RIGHT JOIN；下面的 Oracle 示例不能在 MySQL 中直接执行。

```sql
# See note 1 below.
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id = departments.department_id(+);
# See note 2 below.
SELECT last_name,department_name
FROM employees ,departments
WHERE employees.department_id(+) = departments.department_id;
```

示例说明：

1. 左外连接
2. 右外连接


- 标准 SQL 定义了 FULL OUTER JOIN，但 MySQL 没有原生 FULL OUTER JOIN。可用两个外连接组合，注意保留重复行的语义。


### 标准 JOIN 语法

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
- JOIN 通常表示 INNER JOIN。CROSS JOIN 表达笛卡尔积的意图；MySQL 在部分语法上允许与 INNER JOIN 互换，但跨数据库代码不要把二者当成相同概念。


#### 内连接 (INNER JOIN)

隐式内连接：

```sql
SELECT 字段列表
FROM A表, B表
WHERE A表与B表相同的字段名;
```

显式内连接：

```sql
SELECT 字段列表
FROM A表 [INNER] JOIN B表
ON 关联条件
WHERE 等其他子句;
```


#### 左外连接 (LEFT OUTER JOIN)

查询左表的全部信息，以及交集的部分。

语法：

```sql
# See note 1 below.
SELECT 字段列表
FROM A表 LEFT [outer] JOIN B表
ON 关联条件
WHERE 等其他子句;
```

示例说明：

1. 实现查询结果是A


#### 右外连接 (RIGHT OUTER JOIN)

查询右表的全部信息，以及交集的部分。

语法：

```sql
FROM A表 RIGHT [outer] JOIN B表
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
# See note 1 below.
SELECT * FROM employees WHERE email LIKE '%a%' OR department_id>90;

# See note 2 below.
SELECT * FROM employees WHERE email LIKE '%a%'
UNION
SELECT * FROM employees WHERE department_id>90;


# See note 3 below.
SELECT id,cname FROM t_chinamale WHERE csex='男'
UNION ALL
SELECT id,tname FROM t_usmale WHERE tGender='male';
```

示例说明：

1. UNION 方式1
2. UNION 方式2
3. UNIONALL 方式


### 7种 SQL JOINS 的实现

```sql
# See note 1 below.
SELECT employee_id,last_name,department_name
FROM employees e JOIN departments d
ON e.department_id = d.department_id;


# See note 2 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id;


# See note 3 below.
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id;


# See note 4 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL


# See note 5 below.
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id
WHERE e.department_id IS NULL


# See note 6 below.
# See note 7 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL
UNION ALL	# See note 8 below.
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id;


# See note 9 below.
# See note 10 below.
SELECT employee_id,last_name,department_name
FROM employees e LEFT JOIN departments d
ON e.department_id = d.department_id
WHERE d.department_id IS NULL
UNION ALL
SELECT employee_id,last_name,department_name
FROM employees e RIGHT JOIN departments d
ON e.department_id = d.department_id
WHERE e.department_id IS NULL;
```

示例说明：

1. 中图：内连接 A∩B
2. 左上图：左外连接
3. 右上图：右外连接
4. 左中图：A - A∩B
5. 右中图：B-A∩B
6. 左下图：满外连接
7. 左中图 + 右上图 A∪B*
8. 没有去重操作，效率高
9. 右下图
10. 左中图 + 右中图	A ∪B- A∩B 或者 (A -	A∩B) ∪ （B - A∩B）


### 子查询

在查询中嵌套另一个查询。

子查询的结果是**单行单列**时，可以用 = != < >的那个进行判断。

```sql
SELECT 字段列表 FROM 表1 WHERE 字段名 = (子查询);

例如：
SELECT *
FROM employee
WHERE employee.salary < (SELECT AVG(salary) FROM employee);
```


子查询的结果是**多行单列**时，可以用 in 等关键字进行判断。

```sql
SELECT 字段列表 FROM 表1 WHERE 字段名 IN (子查询);

例如：
SELECT *
FROM employee
WHERE dept_id
IN (SELECT id FROM department WHERE name IN ('财务部', '市场部'));
```


子查询的结果是**多行多列**时，可以作为一张虚拟表参与查询。

```sql
SELECT 字段列表 FROM (子查询) WHERE 条件;

例如：
SELECT e.*
FROM employees AS e
JOIN (SELECT department_id FROM departments WHERE location_id = 1700) AS d
  ON e.department_id = d.department_id;
```

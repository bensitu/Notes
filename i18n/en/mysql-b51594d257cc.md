# Basic MySQL queries :id=h-86c5eed5b9ad

Look up SELECT, duplicate removal, sorting, joins, subqueries, and pagination syntax.

**Prerequisites and versions:** This article targets MySQL 8.x. employees, departments, and locations belong to the practice dataset. Oracle syntax is explicitly marked for comparison only; do not execute it in MySQL.

**Using the examples:** Unless a project explicitly lists all files and execution steps, code blocks are independent snippets for each section. Fill in omissions and placeholder names; lines marked as incorrect illustrate problems. Do not combine alternative implementations in the same section.

[Documentation index](README.md) · [Official references](https://dev.mysql.com/doc/refman/8.4/en/select.html)

**Contents**

- [Basic SELECT statements](#section-1)
- [Sorting data](#section-2)
- [Sorting rules](#section-3)
- [Pagination](#section-4)
- [How pagination works](#section-5)
- [Further examples](#section-6)
- [Multi-table queries in MySQL](#section-7)

<a id="section-1"></a>

## Basic SELECT statements :id=h-ae9c59852b89

**SELECT … FROM ...**

Syntax:

```sql
SELECT 标识选择哪些列
FROM 标识从哪个表中选择
```

Select all columns:

```sql
SELECT *
FROM departments;
```

Select specific columns:

```sql
SELECT department_id, location_id
FROM departments;
```

SQL statements in MySQL are case-insensitive, so SELECT and select have the same effect.

### Column aliases :id=h-e6401fa4956b

**... AS name**

- Rename a column
- Make calculations easier
- Place the alias immediately after the column name, optionally inserting AS between them. Use double quotes around the alias to include spaces or special characters and distinguish case.
- AS can be omitted.
- Use short, meaningful aliases.

Example

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

### Removing duplicate rows :id=h-706d16c17479

By default, a query returns all rows, including duplicates. Use DISTINCT in a SELECT statement to remove duplicate rows.

```sql
SELECT DISTINCT department_id
FROM employees;
```

For the following:

```sql
SELECT DISTINCT department_id, salary
FROM employees;
```

> There are two points to note:
>
> 1. DISTINCT must precede all column names. Writing SELECT salary, DISTINCT department_id FROM employees causes an error.
> 2. DISTINCT removes duplicates across the entire combination of selected columns. For example, two rows are merged only when both (department_id, salary) values match. The row count depends on the current data and cannot be interpreted as the number of departments. To obtain distinct departments only, select just DISTINCT department_id.

### Calculations involving null values :id=h-4d86365ec917

NULL represents a missing or unknown value. Ordinary arithmetic and comparisons usually produce NULL. IS NULL, the NULL-safe equality operator <=>, COALESCE, and some logical operations have their own rules, so it is incorrect to say that all operations return NULL.

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

In MySQL, a null value is not an empty string. An empty string has length 0, whereas LENGTH(NULL) returns NULL. Null values also occupy storage in MySQL. null is not equivalent to 0, ' ', or 'null'.

### Backticks :id=h-9c925b35ff1f

**Enclose the name in a pair of backticks (\`).**

Incorrect:

```sql
SELECT * FROM ORDER;
```

Correct:

```sql
SELECT * FROM `ORDER`;
```

Conclusion:
Ensure that column names, table names, and similar identifiers do not conflict with reserved words, database system names, or commonly used methods. If they do, enclose them in backticks in the SQL statement.

### Querying constants :id=h-eea6772d1b49

A SELECT query can also select constants, adding a column with a fixed value to the SELECT result. We specify this value rather than retrieve it dynamically from a table.
Why query a constant?
SQL's SELECT syntax provides this capability. When querying a single table, a fixed column is usually unnecessary. When combining data sources, however, a constant column can identify the source table. For example, to query employee names from employees while **adding a fixed corporation column** whose value is “尚硅谷”, write:

```sql
SELECT 'Atguigu' as corporation, last_name
FROM employees;
```

### Displaying table structure :id=h-2ae081dcedc6

Use DESCRIBE or DESC to display a table's structure.

```sql
DESCRIBE employees;
或
DESC employees;
```

The fields have the following meanings:
Field: the column name.
Type: the column type; here barcode and goodsname are text types, while price is an integer type.
Null: whether the column can store NULL.
Key: whether the column is indexed. PRI means it is part of the primary key; UNI means it is part of a UNIQUE index; MUL means a given value can appear more than once.
Default: whether the column has a default value and, if so, what it is.
Extra: additional information about the column, such as AUTO_INCREMENT.

### Filtering queries :id=h-1ca61c5d832c

Syntax:

```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```

Use WHERE to filter out rows that do not meet the condition. The WHERE clause follows FROM.

> WHERE must immediately follow FROM.

Example:

```sql
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90;

SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90 ORDER BY employee_id DESC;
```

<a id="section-2"></a>

# Sorting data :id=h-feddc492322c

<a id="section-3"></a>

## Sorting rules :id=h-18252eb7e2a4

### Sorting by one column :id=h-644641584086

Sort using ORDER BY:

```sql
SELECT 列名 FROM 目标表名 ORDER BY 列名 (ASC/DESC);
```

ASC (ascend): ascending order
DESC (descend): descending order
ORDER BY goes at the end of a SELECT statement.

```sql
SELECT last_name, job_id, department_id, hire_date
FROM employees ORDER BY hire_date ;
```

### Sorting by multiple columns :id=h-e3e4854e97d6

- You can sort by columns that are not in the SELECT list.
- When sorting by multiple columns, the second column determines order only among rows with equal values in the first column. If every value in the first column is unique, the second column does not affect the order.

```sql
SELECT last_name, department_id, salary
FROM employees ORDER BY department_id, salary DESC;
```

<a id="section-4"></a>

# Pagination :id=h-03953991f1e1

<a id="section-5"></a>

## How pagination works :id=h-cab99cc8b7e6

Pagination displays a database result set in successive portions according to the specified limits.

MySQL uses LIMIT for pagination.

Format:

```sql
SELECT 列名 FROM 目标表名 LIMIT 位置偏移量, 行数;
```

The first, optional offset argument tells MySQL which row to start displaying. If omitted, results start at the first record (offset 0 for the first, 1 for the second, and so on). The second argument, row count, specifies how many records to return.

```sql
SELECT * FROM 目标表名 LIMIT 0,10; (返回第1个到第10个)

SELECT * FROM 目标表名 LIMIT 10,10; (返回第11个到第20个)

SELECT * FROM 目标表名 LIMIT 20,10; (返回第21个到第30个)
```

Page offset = (current page number - 1) × records per page. Calculate the offset in the application, then bind the offset and row count to SQL; a regular LIMIT clause cannot contain this arithmetic expression directly. The following selects page 3 with 10 records per page.

```sql
SELECT * FROM employees ORDER BY employee_id LIMIT 20, 10;
```

- Note: Put LIMIT at the very end of the entire SELECT statement!
- Benefits of LIMIT: limiting the number of returned rows reduces network traffic and can improve query efficiency. If you know that only 1 record will be returned, use LIMIT 1 to tell SELECT to return one record. This lets SELECT return once it finds a matching record instead of scanning the entire table.

<a id="section-6"></a>

## Further examples :id=h-0f9a32202131

Different DBMSs may use different keywords. MySQL, PostgreSQL, MariaDB, and SQLite use LIMIT, placed at the end of SELECT.

- For SQL Server and Access, use TOP, for example:

  ```sql
  SELECT TOP 5 name, hp_max FROM heros ORDER BY hp_max DESC
  ```

- For DB2, use keywords such as FETCH FIRST 5 ROWS ONLY:

  ```sql
  SELECT name, hp_max FROM heros ORDER BY hp_max DESC FETCH FIRST 5 ROWS ONLY
  ```

- Oracle 12c and later support FETCH FIRST. Older ROWNUM syntax requires sorting inside a subquery first, then limiting rows outside it; otherwise, the result is not the first few rows after sorting:

  ```sql
  SELECT last_name, salary FROM employees ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY;
  ```

<a id="section-7"></a>

# Multi-table queries in MySQL :id=h-26bef0493dcf

### Equijoins :id=h-e8ecf5600447

Compare related columns in two tables using equals. Their names may differ, for example employee.department_id = department.id.

```sql
SELECT xxx FROM 表1, 表2
WHERE 表1.某字段=表2.某字段
```

Or

```sql
SELECT 表1.xxx, 表3.xxx FROM 表1, 表2, 表3
WHERE 表1.某字段=表2.某字段 AND 表2.某字段=表3.某字段
```

Example:

```sql
SELECT employees.employee_id, employees.last_name, employees.department_id, departments.department_id, departments.location_id
FROM employees, departments
WHERE employees.department_id = departments.department_id;
```

- Aliases can simplify queries.
- Table-name prefixes or aliases remove ambiguity and improve readability; they do not guarantee faster queries. Performance also depends on indexes, data volume, and execution plans.
- Joining n tables requires at least n-1 join conditions. For example, joining three tables requires at least two conditions.

### Self-joins :id=h-8d8d2f597ee7

Perform an inner join of a table with itself.

Example:

```sql
SELECT CONCAT(worker.last_name ,' works for ', manager.last_name)
FROM employees worker, employees manager
WHERE worker.manager_id = manager.employee_id ;
```

- Inner join: combines rows from two or more tables sharing a column. The result excludes rows in either table that have no match in the other.
- Outer join: returns matching rows plus unmatched rows from the left (or right) table, called a left (or right) outer join. When there is no matching row, the corresponding result columns contain NULL.
- For a left outer join, the left table is also called the main table and the right the subordinate table. For a right outer join, the right table is the main table and the left the subordinate table.

### Legacy Oracle outer join syntax (overview) :id=h-dbddfd4a7854

- (+) is Oracle's legacy outer join operator, not standard SQL92 syntax. It marks the side that may lack a matching row.
- MySQL does not support Oracle's (+) syntax. MySQL uses LEFT JOIN / RIGHT JOIN; the Oracle examples below cannot be executed directly in MySQL.

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

Example notes:

1. Left outer join
2. Right outer join

- Standard SQL defines FULL OUTER JOIN, but MySQL has no native FULL OUTER JOIN. Combine two outer joins instead, taking care to preserve duplicate-row semantics.

### Standard JOIN syntax :id=h-7115475a1e98

#### Basic syntax (JOIN ON) :id=h-770992697352

Syntax for creating a join using **JOIN…ON**:

```sql
SELECT table1.column, table2.column,table3.column
FROM table1
JOIN table2 ON table1 和 table2 的连接条件
JOIN table3 ON table2 和 table3 的连接条件
```

**Syntax notes:**

- Use ON to specify additional join conditions.
- These join conditions are separate from other conditions.
- The ON clause makes statements easier to read.
- JOIN usually means INNER JOIN. CROSS JOIN expresses the intent of a Cartesian product. Some MySQL syntax allows it to be interchanged with INNER JOIN, but do not treat them as identical concepts in cross-database code.

#### Inner join (INNER JOIN) :id=h-a6086b9a8a2f

Implicit inner join:

```sql
SELECT 字段列表
FROM A表, B表
WHERE A表与B表相同的字段名;
```

Explicit inner join:

```sql
SELECT 字段列表
FROM A表 [INNER] JOIN B表
ON 关联条件
WHERE 等其他子句;
```

#### Left outer join (LEFT OUTER JOIN) :id=h-bffb4d6ab174

Query all data from the left table, together with matching data from the intersection.

Syntax:

```sql
# See note 1 below.
SELECT 字段列表
FROM A表 LEFT [outer] JOIN B表
ON 关联条件
WHERE 等其他子句;
```

Example notes:

1. Produce query result A

#### Right outer join (RIGHT OUTER JOIN) :id=h-f941f817d093

Query all data from the right table, together with matching data from the intersection.

Syntax:

```sql
FROM A表 RIGHT [outer] JOIN B表
ON 关联条件
WHERE 等其他子句;
```

#### Full outer join (FULL OUTER JOIN) :id=h-d51966bb6e16

- Full outer join result = matching data from both tables + unmatched data from the left table + unmatched data from the right table.
- SQL99 supports full outer joins using FULL JOIN or FULL OUTER JOIN.
- Note that **MySQL does not support FULL JOIN**, but you can combine LEFT JOIN UNION RIGHT join instead.

```sql
SELECT last_name,department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

### Using UNION :id=h-4543aa51bdbf

Use UNION to combine multiple SELECT statements into one result set. The two results must have the same number of columns, with matching data types and corresponding positions. Separate the SELECT statements with UNION or UNION ALL.

Syntax:

```sql
SELECT column,... FROM table1
UNION [ALL]
SELECT column,... FROM table2
```

**UNION operator**

UNION returns the union of two query result sets, removing duplicate records.

**UNION ALL operator**

UNION ALL returns the combined results of two queries without removing duplicates between the result sets.

> Note: UNION ALL requires fewer resources than UNION. If you know the combined result has no duplicates, or duplicates need not be removed, prefer UNION ALL to improve query efficiency.

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

Example notes:

1. UNION approach 1
2. UNION approach 2
3. UNIONALL approach

### Implementing 7 types of SQL JOINS :id=h-411b2ec4f0a4

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

Example notes:

1. Center diagram: inner join A∩B
2. Upper-left diagram: left outer join
3. Upper-right diagram: right outer join
4. Middle-left diagram: A - A∩B
5. Middle-right diagram: B-A∩B
6. Lower-left diagram: full outer join
7. Middle-left + upper-right diagrams: A∪B\*
8. No duplicate-removal operation, so more efficient
9. Lower-right diagram
10. Middle-left + middle-right diagrams: A ∪ B - A∩B or (A - A∩B) ∪ (B - A∩B)

### Subqueries :id=h-6036f3153ad5

A query nested inside another query.

When a subquery returns **one row and one column**, compare its result with =, !=, <, or >.

```sql
SELECT 字段列表 FROM 表1 WHERE 字段名 = (子查询);

例如：
SELECT *
FROM employee
WHERE employee.salary < (SELECT AVG(salary) FROM employee);
```

When a subquery returns **multiple rows and one column**, use keywords such as in to test the result.

```sql
SELECT 字段列表 FROM 表1 WHERE 字段名 IN (子查询);

例如：
SELECT *
FROM employee
WHERE dept_id
IN (SELECT id FROM department WHERE name IN ('财务部', '市场部'));
```

When a subquery returns **multiple rows and columns**, use it as a virtual table in another query.

```sql
SELECT 字段列表 FROM (子查询) WHERE 条件;

例如：
SELECT e.*
FROM employees AS e
JOIN (SELECT department_id FROM departments WHERE location_id = 1700) AS d
  ON e.department_id = d.department_id;
```

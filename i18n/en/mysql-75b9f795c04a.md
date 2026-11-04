# MySQL Databases :id=h-aeb5ddfd0fb2

Learn database and table creation, column types, and insert/update/delete operations; check syntax and transaction effects during development.

**Prerequisites and versions:** Targets MySQL 8.x and uses InnoDB for transaction exercises. Historical 5.7 examples are identified separately. Create your own practice database first; queries involving employees and similar tables require the corresponding dataset.

**Using the examples:** Unless all files and execution steps are explicitly listed, code blocks are independent fragments for their sections. Complete omitted code and placeholder names. Lines marked as incorrect explain problems. Do not combine alternative implementations from one section.

[Documentation index](README.md) · [Official references](https://dev.mysql.com/doc/refman/8.4/en/)

**Contents**

- [Comments](#section-1)
- [Naming rules](#section-2)
- [Data import commands](#section-3)
- [Basic database operations](#section-4)
- [Background concepts](#section-5)
- [Creating and managing databases](#section-6)
- [Basic table operations](#section-7)
- [Creating and managing tables](#section-8)
- [Basic operations on table data](#section-9)
- [Generated columns (supported from MySQL 5.7)](#section-10)
- [Further table topics](#section-11)
- [Other commands](#section-12)

<a id="section-1"></a>

## Comments :id=h-cd57bc57c579

Single-line comment: # Comment text (MySQL-specific)
Single-line comment: -- Comment text (a space is required after --)
Multiline comment: /\* Comment text \*/

<a id="section-2"></a>

## Naming rules :id=h-81458ffb7afa

- Database, table, and column names generally allow up to 64 characters. Limits vary by object; do not apply another database's rules to MySQL.

- For cross-platform collaboration, use lowercase letters, digits, and underscores. This is a naming convention, not the full set of characters MySQL allows.

- Do not include spaces in object names such as databases, tables, or columns.

- Within one MySQL instance, database names must be unique; within a database, table names must be unique; within a table, column names must be unique.

- Ensure column names do not conflict with reserved words, system names, or commonly used functions. If you must use them, enclose them in backticks (\`) in SQL.

- Keep column names and types consistent. When naming columns and choosing data types, do not use an integer in one table and a character type for the same data in another.

- Use lowercase letters or digits in table and column names. Avoid camelCase, do not begin with a digit, and do not put only digits between two underscores.

  > Case sensitivity of database and table names depends on the operating system and lower_case_table_names. Column names are usually case-insensitive. Consistent lowercase reduces migration issues; uppercase names are not necessarily syntactically invalid.
  >
  > Good: aliyun_admin, rdc_config, level3_name
  >
  > Bad: AliyunAdmin, rdcConfig, level_3_name

Example:

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

Example explanations:

1. These two statements are equivalent and case-insensitive.
2. Create a table
3. create table student info(...); # Invalid table name: contains a space
4. order uses backticks because it conflicts with a predefined identifier such as a system keyword or function name.
5. AS can be omitted when defining aliases.
6. If a column alias contains no spaces, double quotes can be omitted.
7. Incorrect: double quotes cannot be omitted when the column alias contains spaces.

<a id="section-3"></a>

## Data import commands :id=h-b1be3c2bb395

Log in to MySQL with the command-line client and import using source.

```mysql
mysql> source d:\mysqldb.sql
```

<a id="section-4"></a>

# Basic database operations :id=h-15ced04ab640

<a id="section-5"></a>

## Background concepts :id=h-b21704bece99

### Data type :id=h-bb7ea6eeca19

| Type                 | Example types                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Integer types        | TINYINT, SMALLINT, MEDIUMINT, INT (or INTEGER), BIGINT                                                                          |
| Floating-point types | FLOAT、DOUBLE                                                                                                                    |
| Fixed-point types    | DECIMAL                                                                                                                         |
| Bit types            | BIT                                                                                                                             |
| Date and time types  | YEAR、TIME、DATE、DATETIME、TIMESTAMP                                                                                               |
| Text string types    | CHAR、VARCHAR、TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT                                                                                  |
| Enumeration types    | ENUM                                                                                                                            |
| Set types            | SET                                                                                                                             |
| Binary string types  | BINARY、VARBINARY、TINYBLOB、BLOB、MEDIUMBLOB、LONGBLOB                                                                              |
| JSON type            | JSON objects, JSON arrays                                                                                                       |
| Spatial data types   | Single values: GEOMETRY, POINT, LINESTRING, POLYGON; collections: MULTIPOINT, MULTILINESTRING, MULTIPOLYGON, GEOMETRYCOLLECTION |

Some commonly used types are described below:

| Data type               | Meaning and limits                                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| INT                     | Signed range: -2^31 to 2^31-1; 4 bytes. Display width is not the maximum digit count.                                                        |
| BIGINT                  | Signed values use 8 bytes; UNSIGNED expands the positive range but disallows negative values.                                                |
| CHAR(n)                 | Fixed-length character type; n is the character count, up to 255.                                                                            |
| VARCHAR(n)              | Variable-length character type; n counts characters. Actual capacity also depends on character set and row-size limits.                      |
| FLOAT / DOUBLE          | Approximate floating-point values, usually 4 / 8 bytes; unsuitable for exact monetary calculations.                                          |
| DECIMAL(M,D)            | Exact decimal: M is total digits, D fractional digits. Maximum M is 65 and maximum D is 30. Storage depends on the digit count in each part. |
| DATE                    | Date; common input format: 'YYYY-MM-DD'                                                                                                      |
| DATETIME                | Date and time, without automatic session-time-zone conversion                                                                                |
| TIMESTAMP               | Date and time with session-time-zone handling on storage/retrieval; the range differs from DATETIME.                                         |
| BLOB / TEXT             | Regular types allow up to 65,535 bytes, for binary and text respectively.                                                                    |
| MEDIUMBLOB / MEDIUMTEXT | Up to 16,777,215 bytes                                                                                                                       |
| LONGBLOB / LONGTEXT     | Theoretical maximum: 4,294,967,295 bytes; actual limits also depend on clients, packets, and storage.                                        |

Legacy FLOAT(M,D) and DOUBLE(M,D) are deprecated. For money, DECIMAL(10,2) allows 10 total digits, including two fractional digits, not 10 integer digits.

Reference: [MySQL data types and storage requirements](https://dev.mysql.com/doc/refman/8.0/en/storage-requirements.html).

<a id="section-6"></a>

## Creating and managing databases :id=h-4ea9e97d7442

### Create a database :id=h-f445aab59866

- Method 1: create a database

```sql
CREATE DATABASE 数据库名;
```

- Method 2: create a database with a specified character set

```sql
CREATE DATABASE 数据库名 CHARACTER SET 字符集;
```

- Method 3: create the database only if it does not already exist (recommended)

```sql
CREATE DATABASE IF NOT EXISTS 数据库名;
```

- If the database already exists in MySQL, the create statement is ignored and no new database is created.

> A DATABASE cannot be renamed directly. Some graphical tools emulate renaming by creating a new database, copying every table, then deleting the old database.

### Inspect and use databases :id=h-e1b94c588595

- List all current databases

```sql
SHOW DATABASES; # See note 1 below.
```

Example explanations:

1. The S denotes multiple databases.

> - information_schema is a built-in MySQL database containing MySQL server system information, such as database, table, and column names, access permissions, data directories, and system directories.
> - performance_schema is a built-in MySQL database for monitoring various MySQL performance metrics.
> - sys is a built-in MySQL database presenting MySQL server performance metrics in an easier-to-understand form, helping administrators and developers monitor MySQL performance.
> - The mysql database stores system information required by the running MySQL server, such as data directories, the current character set, and constraint-checking information.

- Show the database currently in use

```sql
SELECT DATABASE();	# See note 1 below.
```

Example explanations:

1. Uses a MySQL global function

- List every table in a specified database

```sql
SHOW TABLES FROM 数据库名;
```

- Show the database creation information

```sql
SHOW CREATE DATABASE 数据库名;
# See note 1 below.
SHOW CREATE DATABASE 数据库名\G
```

Example explanations:

1. Or:

- Use/switch databases

```sql
USE 数据库名;
```

> Before operating on tables and data, specify the target database; otherwise prefix every object with databaseName.

### Modify a database :id=h-bfdfdc0ac2fb

- Change the database character set

```sql
ALTER DATABASE 数据库名 CHARACTER SET 字符集;	# See note 1 below.
```

Example explanations:

1. For example: gbk, utf8, and so on

### Delete a database :id=h-431a5d26916b

- Method 1: delete a specified database

```sql
DROP DATABASE 数据库名;
```

- Method 2: delete a specified database (recommended)

```sql
DROP DATABASE IF EXISTS 数据库名;
```

<a id="section-7"></a>

# Basic table operations :id=h-334ae323778e

<a id="section-8"></a>

## Creating and managing tables :id=h-7a0229b08e6e

### Create a new table :id=h-88cc829db8a1

Syntax:

```sql
CREATE TABLE 表名称(字段名 数据类型, 字段名 数据类型);

例：
CREATE TABLE peoples(
id int,      # See note 1 below.
name varchar(20), 	# See note 2 below.
sex varchar(1)
);
```

Example explanations:

1. In MySQL 8.x, specifying display width for INT is no longer recommended.
2. Names up to 20 characters

Recommended approach:

```sql
CREATE TABLE [IF NOT EXISTS] 表名(
字段1, 数据类型 [约束条件] [默认值],
字段2, 数据类型 [约束条件] [默认值],
字段3, 数据类型 [约束条件] [默认值],
……
[表约束条件]
);
```

> IF NOT EXISTS creates the table only if it does not exist in the current database. If it already exists, the create statement is ignored.

When MySQL defines id as int(11), 11 is its display width, whose default is 11. A width can also be specified when creating a table. In MySQL 8.x, specifying an INT display width is no longer recommended, and this syntax may be removed in future versions.

### Show the table creation statement :id=h-e07100eb4d75

Syntax:

```sql
SHOW CREATE TABLE 表名;
```

### Show table structure :id=h-e3a269dbd059

DESCRIBE or DESC displays the table structure.

```sql
DESCRIBE employees;
或
DESC employees;
```

The output fields mean:
Field: column name.
Type: column type; barcode and goodsname are text, while price is an integer.
Null: whether the column accepts NULL.
Key: indexing information. PRI means part of the primary key; UNI means part of a UNIQUE index; MUL allows a given value to occur multiple times.
Default: whether the column has a default and its value.
Extra: additional column information, such as AUTO_INCREMENT.

### Modify a table :id=h-2c0ba8104f59

#### Add a column :id=h-95123f7d2c72

Use **ALTER ... ADD ...** with this syntax:

```sql
ALTER TABLE 表名 ADD [COLUMN] 字段名 字段类型 [FIRST|AFTER 字段名];
```

Example:

```sql
ALTER TABLE dept80 ADD job_id varchar(15);
```

#### Modify a column :id=h-4f4dbc924a37

Use **ALTER ... MODIFY ...**:

- Change a column's data type, length, default value, and position.
- Syntax for changing type, length, default value, and position:

```sql
ALTER TABLE 表名 MODIFY 字段名1 字段类型 [DEFAULT 默认值][FIRST|AFTER 字段名2];
```

Example:

```sql
ALTER TABLE dept80 MODIFY last_name VARCHAR(30);
```

Note: this cannot rename the column.

#### Rename a column :id=h-c3a85dff78e4

Rename a column with **CHANGE** old_column new_column dataType. Syntax:

```sql
ALTER TABLE 表名 CHANGE 列名 新列名 新数据类型;
```

Example:

```sql
ALTER TABLE dept80 CHANGE department_name dept_name varchar(15);
```

#### Delete a column :id=h-c3a6210eae22

Delete a column with **ALTER ... DROP ...**. Syntax:

```sql
ALTER TABLE 表名 DROP 字段名
```

Example:

```sql
ALTER TABLE dept80 DROP COLUMN job_id;
```

### Delete a table :id=h-80576b5e623b

- In MySQL, a table can be deleted directly when it has no relationships with other tables.
- Both data and structure are deleted.
- An ordinary DROP TABLE implicitly commits the current session's transaction, not all related transactions in other connections. Temporary tables follow different rules.
- All associated indexes are deleted.

Syntax:

```sql
DROP TABLE 表名称;
```

Recommended:

```sql
DROP TABLE IF EXISTS 表名1 [, 表名2, …, 表名n];
```

> IF EXISTS deletes the table if it exists in the current database. Otherwise, it ignores the statement without attempting deletion.

### Empty a table :id=h-f79a27946aba

TRUNCATE TABLE:

- Deletes all data in the table
- Releases the table's storage space

```sql
TRUNCATE TABLE detail_dept;
```

**Ordinary TRUNCATE TABLE implicitly commits and cannot be rolled back like ordinary DML. DELETE can be rolled back only for transaction-capable tables before commit.**

### Rename a table :id=h-bac3b7acd5ef

- Method 1: RENAME

```sql
RENAME TABLE emp TO myemp;
```

- Method 2:

```sql
ALTER table dept
RENAME [TO] detail_dept;	-- See note 1 below.
```

Example explanations:

1. \[TO] can be omitted.

<a id="section-9"></a>

## Basic operations on table data :id=h-3da510a5dab0

### Insert data :id=h-59caba76d8d4

#### 1. Insert with VALUES :id=h-49cac083daee

VALUES accepts one or more value groups: one group inserts one row, and multiple groups are separated by commas.

**Case 1: insert all table columns in their default order**

```sql
INSERT INTO 目标表名 VALUES (value1,value2,....);
```

Example:

```sql
INSERT INTO peoples VALUES(1, 'Tom','m');

INSERT INTO peoples VALUES(2, 'Mary','f');
```

Correct Chinese storage depends on the connection, database, and column character sets. MySQL 5.7 does support Chinese. Usually use utf8mb4 and ensure the client encoding matches.

**Provide a value for every column, in the same order as the table's column definitions.**

**Case 2: insert specified columns**

```sql
INSERT INTO 目标表名(column1 [, column2, …, columnn])
VALUES (value1 [,value2, …, valuen]);
```

An INSERT targeting specified columns supplies only those values; other columns use defaults defined by the table.

List columns in any order in INSERT, but the values value1,…,valuen in VALUES must correspond one-to-one with column1,…,columnn. Incompatible types prevent insertion and cause a MySQL error.

**Case 3: insert multiple records at once**

INSERT inserts multiple records by specifying several comma-separated value lists. Basic syntax:

```sql
INSERT INTO 目标表名
VALUES
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
```

Or

```sql
INSERT INTO 目标表名(column1 [, column2, …, columnn])
VALUES
(value1 [,value2, …, valuen]),
(value1 [,value2, …, valuen]),
……
(value1 [,value2, …, valuen]);
```

One multirow INSERT corresponds to several single-row INSERT statements, but the multirow INSERT is more efficient. MySQL processes multiple rows in a single INSERT faster than several INSERT statements, so prefer a single INSERT when inserting multiple records.

#### 2. Insert query results into a table :id=h-1c34b607d041

INSERT can insert SELECT query results. Rather than entering each record's values separately, combine INSERT and SELECT to quickly insert multiple rows from one or more source tables.

Basic syntax:

```sql
INSERT INTO 目标表名
(tar_column1 [, tar_column2, …, tar_columnn])
SELECT
src_column1 [, src_column2, …, src_columnn]
FROM 源表名
[WHERE condition]
```

- Add a subquery to INSERT.
- No VALUES clause is needed.
- The subquery's value list must correspond to the columns in INSERT.

#### 3. Insert or replace :id=h-44f963078284

To insert a new record (INSERT) but **delete** the original first if it already exists, use `REPLACE`. This avoids querying first and deciding whether to delete before insertion.

```sql
REPLACE INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...);
```

If the new row conflicts with neither the primary key nor a UNIQUE index, `REPLACE` inserts it. Otherwise, records conflicting with the primary key or UNIQUE index are deleted before the new row is inserted.

#### 4. Insert or update :id=h-ec27b57ad315

To insert a new record (INSERT) or **update** it if it already exists, use `INSERT INTO ... ON DUPLICATE KEY UPDATE ...`:

```sql
INSERT INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...)
ON DUPLICATE KEY UPDATE column3=value3, column4=value4, column5=value5;
```

If there is no primary-key or UNIQUE conflict, `INSERT ` inserts the row. Otherwise, the record conflicting with the primary key or UNIQUE index is updated, using the columns specified by `UPDATE`.

#### 5. Insert or ignore :id=h-b1680e9fa550

To insert a new record (INSERT) but do nothing if it already exists, use `INSERT IGNORE INTO ...`:

```sql
INSERT IGNORE INTO 目标表名
(column1, column2, column3...)
VALUES
(value1, value2, value3...);
```

If no primary-key or UNIQUE conflict occurs, `INSERT` inserts the row. Primary-key or UNIQUE conflicts normally skip the row. IGNORE can also convert some other errors into warnings, so it is more than simply skip-if-existing.

### Updating data :id=h-6cb20d470a80

Update data with UPDATE. Syntax:

```sql
UPDATE 目标表名
SET column1=value1, column2=value2, … , column=valuen
WHERE condition
```

For example:

```sql
UPDATE t_employee
SET name = 'Tom'
WHERE id = 00001;
```

- Multiple records can be updated at once.
- To roll back data, set the following before DML: set autocommit = FALSE;

WHERE specifies the rows to update. Without WHERE, every row in the table is updated.

### Delete data :id=h-0992366a99e7

Delete data with DELETE. Syntax:

```sql
DELETE FROM 目标表名 [WHERE <condition>];
```

The target table name specifies the table to delete from. \[WHERE ] is optional and specifies the condition. Without WHERE, DELETE deletes every record.

### Query data :id=h-579d716ba32f

#### Basic queries :id=h-7c09abecd8ce

Syntax: **SELECT … FROM ...**

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

#### Query filtering :id=h-11e8b5797810

Syntax:

```sql
SELECT 字段1,字段2
FROM 表名
WHERE 过滤条件
```

WHERE filters out rows that do not meet the condition. The WHERE clause follows FROM.

> WHERE must immediately follow FROM.

Example:

```sql
# 1
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90;

# 2
SELECT employee_id, last_name, job_id, department_id FROM employees WHERE department_id=90 ORDER BY employee_id DESC;
```

#### Column aliases :id=h-585fa328310e

**... AS name**

- Rename a column
- Makes calculations easier
- Place the alias after the column name, optionally with AS between them. Double quotes allow spaces or special characters and preserve case in the alias.
- AS can be omitted.
- Prefer short, self-explanatory aliases.

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

#### Remove duplicate rows :id=h-0f2589414df0

Queries return all rows by default, including duplicates. Use DISTINCT in SELECT to remove duplicates.

```sql
SELECT DISTINCT department_id
FROM employees;
```

Applies to:

```sql
SELECT DISTINCT department_id, salary
FROM employees;
```

> Two points to note:
>
> 1. DISTINCT must precede all column names. SELECT salary, DISTINCT department_id FROM employees causes an error.
> 2. DISTINCT deduplicates the whole selected-column combination. For example, two rows merge only if both (department_id, salary) match. The row count depends on the data and is not a department count. To count distinct departments, select only DISTINCT department_id.

#### Null values in operations :id=h-e60638450768

NULL represents a missing or unknown value. Ordinary arithmetic and comparisons usually yield NULL. IS NULL, the NULL-safe equality operator <=>, COALESCE, and some logical operations have their own rules; not every operation returns NULL.

```sql
SELECT employee_id, salary, commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;
```

In MySQL, a null value is not an empty string. An empty string has length 0, while LENGTH(NULL) returns NULL. Null values also consume space in MySQL. null is not 0, ' ', or 'null'.

#### Backticks :id=h-ba45bed8d6b8

**Enclose in a pair of backticks (\`).**

Incorrect:

```sql
SELECT * FROM ORDER;
```

Correct:

```sql
SELECT * FROM `ORDER`;
```

Conclusion:
Ensure column and table names do not conflict with reserved words, database system names, or common functions. If they do, enclose them in backticks (\`\`) in SQL.

#### Query constants :id=h-210d96bdef0d

SELECT can also query constants: add a fixed-value column to SELECT results. Its value is specified explicitly rather than retrieved dynamically from the table.
Why query constants?
SQL SELECT supports this. A single-table query usually needs no constant column, but when combining data sources, a constant can label the source table. For example, query employee names in employees and **add a fixed corporation column** with value "Shangguigu":

```sql
SELECT 'Atguigu' as corporation, last_name
FROM employees;
```

<a id="section-10"></a>

## Generated columns (supported from MySQL 5.7) :id=h-2542a404e7ad

MySQL 8.0 supports computed columns in both CREATE TABLE and ALTER TABLE.

Example: define tb1 with id, a, b, and c, where c is a computed column for a+b. First create the test table:

```sql
CREATE TABLE tb1(
id INT,
a INT, b INT,
c INT GENERATED ALWAYS AS (a + b) VIRTUAL );
```

Insert sample data:

```sql
INSERT INTO tb1(a,b) VALUES (100,200);
```

Query tb1; the result is:

```sql
SELECT * FROM	tb1;
```

id	a	b	c

NULL	100	200	300

<a id="section-11"></a>

## Further table topics :id=h-d4ec4b50a6ae

\[Mandatory] Use lowercase letters or digits in table and column names. Do not begin with digits or put only digits between underscores. Renaming database columns is costly because pre-release deployment is unavailable, so choose names carefully.

- Good: aliyun_admin, rdc_config, level3_name

- Bad: AliyunAdmin, rdcConfig, level_3_name

\[Mandatory] Avoid reserved words such as desc, range, match, and delayed; consult MySQL's official reserved-word list.
\[Mandatory] Every table has three required columns: id, gmt_create, gmt_modified.

- id must be the primary key, type BIGINT UNSIGNED, auto-incrementing by 1 for a single table. gmt_create and gmt_modified both use DATETIME; the former's present tense indicates active creation, the latter's past participle indicates passive updating.

\[Recommended] Name tables as businessName_tablePurpose.

- Good: alipay_task, force_project, trade_config
  \[Recommended] Keep database and application names as consistent as possible.
  \[Reference] Appropriate character lengths save table and index space and, more importantly, improve retrieval speed.
- Good: unsigned values prevent accidental negative values and expand the range.

<a id="section-12"></a>

## Other commands :id=h-9d51b0abe7e0

### Commands for inspecting encoding :id=h-7d708124ba1c

```sql
SHOW variables like 'character_%';

SHOW variables like 'collation_%';
```

### Encoding issues :id=h-f1c848142a34

Edit my.ini under the MySQL data directory.

Add to \[client] or \[mysql]; placement does not depend on a fixed line number:

```ini
default-character-set=utf8mb4
```

Add to \[mysqld]; restart the service after changing server configuration:

```ini
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

# 排序数据

### 排序规则

#### 单次排序

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



#### 多次排序

- 可以使用不在SELECT列表中的列排序。
- 在对多列进行排序的时候，首先排序的第一列必须有相同的列值，才会对第二列进行排序。如果第一列数据中所有值都是唯一的，将不再对第二列进行排序。

```sql
SELECT last_name, department_id, salary 
FROM employees ORDER BY department_id, salary DESC;
```



# 分页

### 分页原理

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



分页显式公式：（当前页数-1）*每页条数，每页条数:

```sql
SELECT * FROM 目标表名 LIMIT(PageNo - 1)*PageSize,PageSize;
```

- 注意：LIMIT 子句必须放在整个SELECT语句的最后！
- 使用 LIMIT 的好处: 约束返回结果的数量可以 减少数据表的网络传输量 ，也可以 提升查询效率 。如果我们知道返回结果只有1 条，就可以使用 LIMIT 1 ，告诉 SELECT 语句只需要返回一条记录即可。这样的好处就是 SELECT 不需要扫描完整的表，只需要检索到一条符合条件的记录即可返回。
  



#### 拓展

在不同的 DBMS 中使用的关键字可能不同。在 MySQL、PostgreSQL、MariaDB 和 SQLite 中使用 LIMIT 关键字，而且需要放到 SELECT 语句的最后面。

- 如果是 SQL Server 和 Access，需要使用 TOP 关键字，比如：

  ```sql
  SELECT TOP 5 name, hp_max FROM heros ORDER BY hp_max DESC
  ```

  

- 如果是 DB2，使用 FETCH FIRST 5 ROWS ONLY 这样的关键字：

  ```sql
  SELECT name, hp_max FROM heros ORDER BY hp_max DESC FETCH FIRST 5 ROWS ONLY
  ```



- 如果是 Oracle，你需要基于 ROWNUM 来统计行数：

  ```sql
  SELECT rownum, last_name, salary FROM employees WHERE rownum < 5 ORDER BY salary DESC;
  ```
  
  

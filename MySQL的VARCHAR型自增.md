# MySQL：生成带前缀的业务编号

生成带前缀的业务编号，并理解序号分配、并发与事务限制。

**学习前提与版本：** 需要 AUTO_INCREMENT、主键与事务基础。示例面向 MySQL 8.x / InnoDB；DELIMITER 是 mysql 客户端命令，不是 JDBC 要发送的 SQL。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[文档目录](README.md) · [官方参考](https://dev.mysql.com/doc/refman/8.4/en/innodb-auto-increment-handling.html)

**内容导航**

- [区分主键与业务编号](#section-1)
- [方案一：数值主键，查询时格式化](#section-2)
- [方案二：保存字符串编号](#section-3)
- [触发器与事务的区别](#section-4)


<a id="section-1"></a>

## 区分主键与业务编号

需求是生成 BH0001、BH0002 这样的编号。VARCHAR 不能设置 AUTO_INCREMENT。不要使用“查询最大编号，再加一”：空表没有最大值，并发请求也可能读到相同值。

下面的示例基于 MySQL 8.x 和 InnoDB，在独立练习数据库执行。

<a id="section-2"></a>

## 方案一：数值主键，查询时格式化

如果编号只用于展示，数据库只保存自增数值。

```sql
CREATE TABLE employee (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO employee (username) VALUES ('Tom'), ('Mary');

SELECT id,
       CONCAT('BH', LPAD(CAST(id AS CHAR),
           GREATEST(4, CHAR_LENGTH(CAST(id AS CHAR))), '0')) AS employee_code,
       username
FROM employee
ORDER BY id;
```

1 显示为 BH0001，10000 显示为 BH10000。填充长度设为“至少四位”，避免 LPAD('10000', 4, '0') 截断为 1000。

AUTO_INCREMENT 不保证连续无缺号。事务回滚、删除记录等都可能留下间隔，不能把它当作连续账单序号。

<a id="section-3"></a>

## 方案二：保存字符串编号

业务要求把字符串编号保存成主键时，可以用独立序列表分配数值。以下触发器示例包含创建过程和边界检查。

```sql
CREATE TABLE business_sequence (
    sequence_name VARCHAR(50) NOT NULL,
    next_value BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (sequence_name)
) ENGINE=InnoDB;

INSERT INTO business_sequence (sequence_name, next_value)
VALUES ('employee', 1);

CREATE TABLE employee_with_code (
    id VARCHAR(22) NOT NULL,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER //
CREATE TRIGGER employee_code_before_insert
BEFORE INSERT ON employee_with_code
FOR EACH ROW
BEGIN
    DECLARE allocated_value BIGINT UNSIGNED DEFAULT NULL;

    SELECT next_value INTO allocated_value
    FROM business_sequence
    WHERE sequence_name = 'employee'
    FOR UPDATE;

    IF allocated_value IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sequence is missing';
    END IF;

    IF allocated_value = 18446744073709551615 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Sequence is exhausted';
    END IF;

    UPDATE business_sequence
    SET next_value = next_value + 1
    WHERE sequence_name = 'employee';

    SET NEW.id = CONCAT('BH', LPAD(CAST(allocated_value AS CHAR),
        GREATEST(4, CHAR_LENGTH(CAST(allocated_value AS CHAR))), '0'));
END //
DELIMITER ;

INSERT INTO employee_with_code (username) VALUES ('Tom'), ('Mary');
SELECT * FROM employee_with_code ORDER BY id;
```

DELIMITER 是 mysql 客户端命令。使用 JDBC 创建触发器时，不要把 DELIMITER 一起发送给服务器。

FOR UPDATE 锁住序列表的那一行，其他取号事务需要等待。触发器更新序列表和插入员工属于同一事务；两张表都必须使用 InnoDB。这个方案会串行分配同一种编号，不适合无限扩大并发取号量。

触发器覆盖调用者传入的 id。删除员工不会重置序列表。四位编号增长到五位以后，按字符串排序不一定等于按数值排序；需要数值顺序时应另存数值列。

<a id="section-4"></a>

## 触发器与事务的区别

触发器是 INSERT、UPDATE 或 DELETE 发生时，由数据库执行的代码。它可以是单条语句，也可以由 BEGIN ... END 包含多条语句。

触发器不代替业务事务。新增商品并新增库存，仍需明确哪些修改必须一起成功，以及相关表是否支持事务。

参考：[AUTO_INCREMENT](https://dev.mysql.com/doc/refman/8.0/en/example-auto-increment.html)、[锁定读取](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)、[字符串函数](https://dev.mysql.com/doc/refman/8.0/en/string-functions.html)。

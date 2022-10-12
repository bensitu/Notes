## 需求

表中有字段名为id，是varchar类型，根据业务需要自增。

（通常情况下，int类型才能自增）



## 测试数据

创建测试表：

```sql
CREATE TABLE IF NOT EXISTS `user` (
`id` VARCHAR(10) NOT NULL COMMENT '员工ID',
`username` VARCHAR(50) NOT NULL COMMENT '员工名',
PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT = Dynamic;
```

表中仅添加了两列，分别是主键 id 和 name 列，两列都为 varchar 类型。

备注：id内容格式为 BHXXXX，如：BH0001



## 难点

因为主键 id 不是 int 类型，想实现自动自增功能，使用内置的方法肯定是行不通的。

```sql
# 无法自增
`id` VARCHAR(10) NOT NULL AUTO_INCREMENT COMMENT '员工ID'
```

所以，需要使用复杂的查询方法及拼接方式。此方法虽然比较笨，但测试还是可以通过的。






## 详细思路

大致思路：在 MySQL 中新建表时，可以创建触发器为 id 进行自增。



**基本概念**

触发器是一种特殊类型的存储过程，它不同于存储过程，主要是通过事件触发而被执行的，即不是主动调用而执行的；而存储过程则需要主动调用其名字执行。

触发器：trigger，是指事先为某张表绑定一段代码，当表中的某些内容发生改变（增、删、改）的时候，系统会自动触发代码并执行。可在写入数据前，强制检验或者转换数据（保证护数据安全）。



**基本语法**

创建触发器的语法结构是：

```sql
CREATE TRIGGER 触发器名称 
{BEFORE|AFTER} {INSERT|UPDATE|DELETE} ON 
表名 FOR EACH ROW 
(BEGIN)
触发器执行的语句块;
(END)
```

说明：

- 表名 ：表示触发器监控的对象表。
- BEFORE|AFTER ：表示触发的时间。BEFORE 表示在事件之前触发；AFTER 表示在事件之后触发。
- INSERT|UPDATE|DELETE ：表示触发的事件
  - INSERT 表示插入记录时触发；
  - UPDATE 表示更新记录时触发；
  - DELETE 表示删除记录时触发。
- 触发器执行的语句块 ：可以是单条SQL语句，也可以是由BEGIN…END结构组成的复合语句块。



实例：

```sql
DELIMITER // 
CREATE TRIGGER after_insert 
AFTER INSERT ON test_trigger 
FOR EACH ROW 
BEGIN
	INSERT INTO test_trigger_log (t_log) 
	VALUES('after_insert'); 
END // 
DELIMITER ;
```



## 解决过程

   1. 使用查询语句查出表中最后一条数据的 id，语句：

      ```sql
      SELECT id 
      FROM `user` 
      ORDER BY id desc limit 1
      ```

​         得到结果 BH0001



2. 使用 substring 函数截取最后一条 BHXXXX 中数字部分：

   ```sql
   SELECT substring(id, 3, 4) 
   FROM `user`
   WHERE id = (SELECT id FROM `user` ORDER BY id desc limit 1)
   ```

   得到结果 0001。其中，3表示从第3位进行截取，4表示截取长度。

   

3. 使用 concat 语句进行字符串连接：

      ```sql
      concat('BH',
            (SELECT substring(id, 3, 4) 
             FROM `user` 
             WHERE id = (SELECT id FROM `user` ORDER BY id desc limit 1) +1));
      ```
      
      我刚开始认为到这一步的时候，只要给以上结果 +1 ，然后使用 concat 语句连接字符串就可以了，但是，得到的结果并不是我想象中的 BH0002，而是 BH2，所以，在进行字符串连接之前，得将数字2进行填充，使用 LPAD 函数，最终结果如下：
      
      ```sql
      concat('BH',
             lpad(((SELECT substring(id, 3, 4) 
                    FROM `user` 
                    WHERE id = (SELECT id FROM `user` ORDER BY id desc limit 1))+1), 4, 0));
      ```
      
      其中，4表示填充长度，0表示填充内容。



**触发器完整语句：**

```sql
CREATE TRIGGER `trigger` 
BEFORE INSERT ON `user`
FOR EACH ROW 
BEGIN
		SET new.id = concat('SH',
                        lpad(((SELECT substring(id, 3, 4) 
                               FROM `user` 
                               WHERE id = (SELECT id 
                                           FROM `user` 
                                           ORDER BY id desc limit 1))+1), 4, 0));
END;
```

其中，trigger 为触发器名称，user 为表名。





> 在实际开发中，我们经常会遇到这样的情况：
>
> 有 2 个或者多个相互关联的表，如 商品信息 和 库存信息 分别存放在 2 个不同的数据表中，我们在添加一条新商品记录的时候，为了保证数据的完整性，必须同时在库存表中添加一条库存记录。
>
> 这样一来，我们就必须把这两个关联的操作步骤写到程序里面，而且要用 **事务** 包裹起来，确保这两个操作成为一个 原子操作 ，要么全部执行，要么全部不执行。要是遇到特殊情况，可能还需要对数据进行手动维护，这样就很 容易忘记其中的一步 ，导致数据缺失。
>
> 这个时候，咱们可以使用触发器。你可以创建一个触发器，让商品信息数据的插入操作自动触发库存 **数据的插入操作。**这样一来，就不用担心因为忘记添加库存数据而导致的数据缺失了。
> 

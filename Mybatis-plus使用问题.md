# Mybatis-plus使用selectList查询数据为null的问题及解决办法

### 问题概述

使用 Mybatis-plus 的 selectList 查询全部数据封装进 List，打印却为 null。Entity 和数据库字段也能对应上，但是 Postman 测试时候返回的值全是 null。

```json
{
    "flag": true,
    "data": [
            null,
            null,
            null,
            null,
            null,
    				]
}
```

可以看的出来，数据其实已经查询出来，返回数据条数正确，打印了 List 集合，但是集合里的值全是 null，说明数据没有封装进去，那就是 Entity 的问题。

Mybatis-plus 默认开启了驼峰命名规则 而 mybatis 则默认没有开启。



### 解决方案

方法一：可以使用 @TableField 注解，指定数据库表字段名；

方法二：在配置文件中配置 Mybaitis-plus，关闭[自动驼峰命名规则映射](https://baomidou.com/pages/56bac0/#mapunderscoretocamelcase)：

在 application.yml 中添加配置：

```properties
mybatis-plus:
	configuration:
  	map-underscore-to-camel-case: false
```

配置之后就能解决问题了。

```json
{
    "flag": true,
    "data": [
        {
            "record_id": "100012022091401",
            "attendance_date": "2022-09-14",
            "start_time": "09:00",
            "end_time": "18:00",
            "rest_hours": 1.0
        }
      ]
}
```


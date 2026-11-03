# MyBatis-Plus 查询结果出现 null 的排查

区分空结果、空元素与字段为 null，并按映射、配置和 SQL 排查。

**学习前提与版本：** 先理解 MyBatis 映射。本篇面向 MyBatis-Plus 3.x；表名、列名和主键注解要与自己的表对应。

**示例使用：** 除明确列出全部文件和运行步骤的项目外，代码块是各小节的独立片段。省略号、占位名称需要补齐；标明错误的行用于说明问题。同节替代写法不要合并。

[文档目录](README.md) · [官方参考](https://baomidou.com/reference/)

**内容导航**

- [先区分现象](#section-1)
- [推荐的命名与映射](#section-2)
- [配置位置与取舍](#section-3)
- [排查顺序](#section-4)


<a id="section-1"></a>

## 先区分现象

没有记录时，selectList 通常返回空列表 `[]`。如果是 `[null, null]`，说明结果行没有成功映射成对象；如果是 `[{"name": null}]`，说明对象已创建，但部分字段没有映射，或数据库值本来就是 NULL。

```json
{
  "flag": true,
  "data": [null, null]
}
```

不能只看 JSON 就断定是实体命名问题。先确认 SQL、返回列名、实体属性和映射配置。

<a id="section-2"></a>

## 推荐的命名与映射

数据库列使用 record_id，Java 属性使用 recordId。MyBatis-Plus 默认开启下划线转驼峰映射，MyBatis 本身默认关闭该选项。

```java
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("attendance_record")
public class AttendanceRecord {
    @TableId("record_id")
    private String recordId;

    @TableField("attendance_date")
    private java.time.LocalDate attendanceDate;

    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }
    public java.time.LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(java.time.LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }
}
```

@TableId 标识主键，@TableField 指定普通列名。实际项目应补齐需要查询的属性。

<a id="section-3"></a>

## 配置位置与取舍

文件：src/main/resources/application.yml。YAML 缩进使用空格，不能使用 Tab。

```yaml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
```

只有在已有 Java 属性也使用 record_id 等下划线名称、且确认需要按原列名映射时，才考虑设为 false。新代码优先使用 Java 驼峰属性，不要随意改变全局配置。

<a id="section-4"></a>

## 排查顺序

1. 查看 SQL，在数据库中单独运行，确认有数据。
2. 确认连接的数据库、表名和列名。
3. 检查属性名、别名、@TableId、@TableField 或 resultMap。
4. 检查属性类型、访问方法和自定义结果映射。
5. 检查响应序列化是否过滤了已查出的字段。

开发环境可以临时输出 SQL；生产环境应使用日志框架并控制输出内容。下面是独立配置片段，合并到已有 configuration 下，不要创建两个同名 YAML 键。

```yaml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

参考：[MyBatis-Plus 配置](https://baomidou.com/reference/)、[MyBatis 结果映射](https://mybatis.org/mybatis-3/zh_CN/sqlmap-xml.html)。

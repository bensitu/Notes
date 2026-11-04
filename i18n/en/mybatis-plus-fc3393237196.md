# Troubleshooting null query results in MyBatis-Plus :id=h-f240deb3db45

Distinguish empty results, null elements, and null fields, then inspect mappings, configuration, and SQL.

**Prerequisites and versions:** Understand MyBatis mappings first. This article targets MyBatis-Plus 3.x. Table names, column names, and primary-key annotations must match your own tables.

**Using the examples:** Unless a project explicitly lists every file and all steps to run it, code blocks are separate examples for their respective sections. Fill in omitted code and placeholder names. Lines marked as incorrect illustrate a problem. Do not combine alternative implementations from the same section.

[Documentation index](README.md) · [Official references](https://baomidou.com/reference/)

**On this page**

- [Identify the symptom first](#section-1)
- [Recommended names and mappings](#section-2)
- [Configuration location and tradeoffs](#section-3)
- [Troubleshooting order](#section-4)

<a id="section-1"></a>

## Identify the symptom first :id=h-7f7e6c681a9d

With no matching records, selectList normally returns an empty list `[]`. `[null, null]` means rows were not successfully mapped to objects. `[{"name": null}]` means objects were created but some fields were not mapped, or the database values were already NULL.

```json
{
  "flag": true,
  "data": [null, null]
}
```

Do not infer an entity-naming problem from JSON alone. Check the SQL, returned column names, entity properties, and mapping configuration first.

<a id="section-2"></a>

## Recommended names and mappings :id=h-ffe867988bb5

Use record_id for the database column and recordId for the Java property. MyBatis-Plus enables underscore-to-camel-case mapping by default; plain MyBatis disables that option by default.

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

@TableId identifies the primary key, and @TableField specifies an ordinary column name. Add all properties needed by the actual query.

<a id="section-3"></a>

## Configuration location and tradeoffs :id=h-6549e3d56541

File: src/main/resources/application.yml. Indent YAML with spaces, not tabs.

```yaml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
```

Consider false only when existing Java properties also use underscore names such as record_id and you have confirmed that mapping by the original column names is required. Prefer camel-case Java properties in new code; do not change global configuration casually.

<a id="section-4"></a>

## Troubleshooting order :id=h-2cfba327e667

1. Inspect the SQL and run it directly against the database to confirm that matching data exists.
2. Confirm the database connection, table name, and column names.
3. Check property names, aliases, @TableId, @TableField, or resultMap.
4. Check property types, accessors, and custom result mappings.
5. Check whether response serialization filters out fields that were retrieved successfully.

You can temporarily print SQL in development. In production, use a logging framework and control what is logged. Merge the following independent configuration fragment under the existing configuration section; do not create duplicate YAML keys.

```yaml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

References: [MyBatis-Plus configuration](https://baomidou.com/reference/) and [MyBatis result mapping](https://mybatis.org/mybatis-3/zh_CN/sqlmap-xml.html).

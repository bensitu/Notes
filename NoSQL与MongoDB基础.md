# NoSQL 与 MongoDB 基础

学习目标：知道何时采用文档数据库，并掌握建模、查询、索引、原子更新与事务边界。先学习数据库基本概念与 Python 工程化。

**适用范围：** MongoDB 8.0 教学容器、PyMongo 驱动精确版本见 uv.lock。本机容器是 standalone，只练单文档操作；多文档事务需要合适的副本集或分片集群。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [NoSQL 不是一种数据库产品](#section-1)
- [文档怎样建模](#section-2)
- [最小运行步骤](#section-3)
- [查询与索引练习](#section-4)
- [单文档原子更新与事务](#section-5)
- [结构校验、安全与验证](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## NoSQL 不是一种数据库产品

| 模型 | 常见用途 | 学习重点 |
| --- | --- | --- |
| 键值 | 缓存、快速按键读取 | 键设计、TTL、容量与一致性 |
| 文档 | 结构有变化的业务对象 | 文档边界、索引、嵌入与引用 |
| 宽列 | 特定的大规模按键与范围访问 | 分区键与查询模式 |
| 图 | 关系遍历 | 节点、边与路径查询 |

这里选择 MongoDB 补充文档模型；Redis 文档讲缓存。NoSQL 不等于没有结构、没有事务或一定比关系数据库快。

<a id="section-2"></a>

## 文档怎样建模

把经常一起读取、需要一起原子修改的数据放在一个有边界的文档中。不断增长的评论、日志或历史记录不应无限塞进同一个数组。

嵌入减少读取时拼接，但可能重复数据；引用减少重复，却需要额外查询或其他关联设计。先列查询和更新模式，再确定边界。

MongoDB 存储 BSON，不是原样保存 JSON 文本。ObjectId、日期、Decimal128 等类型与 JSON 不完全相同；API 输出时需要有明确转换。

<a id="section-3"></a>

## 最小运行步骤

从贯穿项目目录启动 MongoDB：

```powershell
docker compose --env-file .env --profile tools up -d mongo
```

进入 Python 项目，使用与 .env 一致的演示账户：

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:MONGO_URI = 'mongodb://notes_admin:local_mongo_change_me@127.0.0.1:27017/?authSource=admin'
uv run --locked python -m task_tools.mongo_demo
```

[完整代码](examples/taskboard/python/src/task_tools/mongo_demo.py)创建 externalId 唯一索引，以 upsert 初始化演示记录，再用 version 条件更新单个文档。演示连接使用初始化管理员，生产为应用创建只访问所需数据库的账户。

<a id="section-4"></a>

## 查询与索引练习

以下是 mongosh 片段，需要先连接到同一实例，再选择练习库：

```javascript
const notesDb = db.getSiblingDB('notes_demo');
notesDb.tasks.createIndex({ externalId: 1 }, { unique: true });
notesDb.tasks.find({ done: true }, { title: 1, version: 1 }).sort({ _id: 1 }).limit(20);
notesDb.tasks.find({ externalId: 'notes-demo-1' }).explain('executionStats');
```

对照查询条件与执行计划，再决定复合索引。索引提高部分读取效率，也增加写入与空间成本。TTL 索引的删除由后台机制执行，不能作为精确到秒的业务定时器。

唯一索引创建前，已有重复数据可能导致创建失败。应先核对重复原因与数据修复方案，不直接删库重建。

<a id="section-5"></a>

## 单文档原子更新与事务

版本条件更新是关键：

```python
result = collection.update_one(
    {"_id": document_id, "version": expected_version},
    {"$set": {"done": True}, "$inc": {"version": 1}},
)
```

这是方法片段，collection、document_id、expected_version 由调用上下文提供。matched_count 为零表示没有匹配到该版本，需进一步区分不存在和竞争修改。

单文档原子性不等于跨多个文档、Redis 或外部接口也一起提交。多文档事务还涉及部署形态、读写关注级别、重试和成本，不能在 standalone 演示实例上直接套用。

<a id="section-6"></a>

## 结构校验、安全与验证

文档数据库仍需要字段约定、版本演进和必要的数据库 JSON Schema 校验。不要把来自客户端的完整字典直接当作 MongoDB 查询条件或更新操作；只允许明确字段和类型。

练习验证：重复运行不产生相同 externalId 的第二条记录；相同旧 version 连续更新只能先成功一次；检查查询计划；断开服务时客户端应在有限时间内失败。

| 常见误区 | 正确边界 |
| --- | --- |
| 灵活结构就不用迁移 | 字段更名、类型变化和历史数据仍要演进 |
| 不做关联就没有一致性问题 | 重复数据的同步与冲突仍需设计 |
| 复制就是备份 | 误删除和错误写入也可能复制过去 |
| 写入成功就绝不丢失 | 持久化与故障保证取决于部署和 write concern |
| MongoDB 替代所有 SQL 表 | 按业务查询、约束和运维成本选择 |

真实使用前增加最小权限、网络隔离、备份恢复演练与代表性数据压测；本地练习没有替你完成这些部署工作。

<a id="section-7"></a>

## 官方参考

- [MongoDB 单文档原子性](https://www.mongodb.com/docs/manual/tutorial/model-data-for-atomic-operations/)
- [MongoDB 事务](https://www.mongodb.com/docs/manual/core/transactions/)
- [PyMongo](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/)
- [MongoDB 数据建模](https://www.mongodb.com/docs/manual/data-modeling/)

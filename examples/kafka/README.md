# Apache Kafka 练习

官方 Apache Kafka 4.4.0 单节点 KRaft 环境，Python 客户端采用 confluent-kafka 2.16.1。没有连接托管云，也不使用实际账号或秘密。

## 环境与安装

需要 Docker Linux 容器环境和 uv。Python 3.14 的独立环境是为了匹配所选客户端的 Windows 预编译包；uv 会根据 .python-version 选择解释器，不改其他示例环境。

从仓库根目录开始：

```powershell
Set-Location examples/kafka
uv sync --locked
docker compose config --quiet
docker compose up -d
docker compose ps
docker compose logs --tail 80 kafka
```

等待健康检查通过，再创建 topic：

```powershell
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --create --if-not-exists --topic notes.tasks.v1 --partitions 3 --replication-factor 1
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --describe --topic notes.tasks.v1
```

只开放本机 9092；advertised.listeners 面向本机客户端。其他容器不能直接把该地址当成自己的可达上游。TLS / SASL 与 ACL 未在本机演示配置中启用。

## 发送与处理

```powershell
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
```

在没有其他待处理记录的练习 topic 中，第一次效果为 True，重复事件效果为 False；同一 eventId 对应不同内容会失败。

SQLite 文件 kafka-effects.db 保存本地效果与去重信息。它不是 broker 数据卷，也不自动在多个消费者机器间共享。分布式业务需要共同的可靠去重 / 业务存储，不能给每台机器一个 SQLite 就宣称全局去重。

consume 最多处理 limit 条，或无消息达到 idle-seconds 后退出；这个空闲阈值不等于所有连接和提交操作的整体截止时间。

## 重放与观察

```powershell
uv run --locked notes-kafka consume --group replay-demo --limit 10
docker compose exec kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server 127.0.0.1:9092 --describe --group notes-demo
```

换组读取当前保留范围，不自动清空本地去重信息。消费成功不会立即删除 topic 中的记录；此示例设置 24 小时日志保留。

所有样例记录使用 task-1 时会集中到同一分区。需要观察消费者分工，使用多个不同 task-id，并注意散列不保证少量键均匀分布。

## 检查与已验证范围

```powershell
uv run --locked pytest
uv run --locked ruff check .
uv run --locked ruff format --check .
```

本机 Python 3.14.10 下六项测试通过：重复事件不重复产生效果、数据库失败不提交位移、位移异常或分区级提交失败后重放不重复、无效数据不提交、ID 冲突不被静默接受。测试没有启动真实 broker。

Compose 已通过配置校验；官方镜像 tag 与 manifest digest 已核对。当前主机没有可用 Docker 引擎，因此没有宣称完成镜像启动、生产消费、重平衡或宕机集成测试。上面命令用于具备引擎后的复现。

## 停止与持久化

docker compose down 默认保留命名数据卷。删除卷会删除练习日志与元数据；保留数据卷时，不随意改 cluster ID 或节点身份。

单节点、单副本和组合角色仅用于本机学习，不能作为多节点生产部署的验证。

[Kafka 文档](../../ApacheKafka基础与实践.md) · [文档目录](../../README.md)

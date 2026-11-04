# Apache Kafka 基础与实践

学习目标：理解事件日志、分区、消费者组和位移，再验证可靠发送与可重放处理。示例使用 Apache Kafka 4.4.0 官方镜像、Confluent Python 客户端 2.16.1、独立 Python 3.14 环境。

[文档目录](README.md) · [Kafka 示例说明](examples/kafka/README.md)

**内容导航**

- [Kafka 的模型与 RabbitMQ 的区别](#section-1)
- [最小环境与创建 topic](#section-2)
- [安装客户端并发送、消费](#section-3)
- [分区与顺序](#section-4)
- [位移提交、重复与重放](#section-5)
- [重试、坏消息与 exactly-once 的范围](#section-6)
- [运维检查与验证](#section-7)
- [官方参考](#section-8)


<a id="section-1"></a>

## Kafka 的模型与 RabbitMQ 的区别

Kafka 将记录追加到 topic 的分区日志，消费者保存自己的读取位置。正常消费并提交 offset，不会因此删除已保存记录；清理由 retention / compaction 等策略控制。retention 按保留时间或大小清理旧日志；compaction 按 key 压缩旧值，适合保留各 key 的较新状态，不是收到消息就立即去重。

broker 是保存日志并处理读写请求的服务节点；controller 管理集群元数据与领导者选举。KRaft 使用 Kafka 自身的共识机制管理这些元数据，不需要另外部署 ZooKeeper。

| 概念 | 含义 | 易误解的边界 |
| --- | --- | --- |
| topic | 一类事件的日志集合 | 不是数据库表或唯一键约束 |
| partition | topic 中独立有序的日志 | 顺序不自动跨所有分区成立 |
| key | 可参与分区选择的字节 | 相同 key 不会自动拒绝重复事件 |
| offset | 某分区内记录的位置 | 不是跨分区全局事件 ID |
| consumer group | 一组协同消费的实例 | 不同组可以各自读取同一批记录 |
| committed offset | 组恢复消费的记录位置 | 不证明外部业务系统已完成 |
| lag | 消费位置与日志末端之间的距离 | 还需要结合时间与业务处理速度解释 |

普通消费组中，一个分区在某次分配期间由该组的一个消费者负责；消费者多于分区时会有空闲实例。不同消费组独立处理是正常广播 / 重放方式。

RabbitMQ 经典队列常用逐条确认与路由，Kafka 常用分区日志、保留与重放；两者都能处理多种消息场景，不简单按“谁一定更快”选型。

<a id="section-2"></a>

## 最小环境与创建 topic

先安装可运行 Linux 容器的 Docker，在仓库根目录进入：

```powershell
Set-Location examples/kafka
docker compose config --quiet
docker compose up -d
docker compose ps
docker compose logs --tail 80 kafka
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --create --if-not-exists --topic notes.tasks.v1 --partitions 3 --replication-factor 1
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9092 --describe --topic notes.tasks.v1
```

等待 docker compose ps 显示 kafka 为 healthy，再执行创建 topic 的命令；如果未就绪，先查看日志。

镜像已核对并固定 digest。环境使用单节点 KRaft，broker 与 controller 组合运行，静态投票集合只包含本节点；不是多节点高可用部署。

服务只发布到本机 127.0.0.1:9092，未配置 TLS / SASL。advertised.listeners 是发给客户端继续连接的地址；只把 bootstrap 改成一个可达地址，不代表后续 broker 地址也可达。

<a id="section-3"></a>

## 安装客户端并发送、消费

同一项目目录执行：

```powershell
uv sync --locked
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
```

独立项目固定 Python 3.14，是为了匹配本机可用的客户端预编译 wheel；不修改其他示例的 Python 3.15 环境。客户端是 Confluent 维护的开源库，不要求使用 Confluent Cloud 或其托管账号。

[完整客户端](examples/kafka/src/kafka_notes/demo.py)发送带 schemaVersion、eventId、taskId、title 的 JSON。taskId 作为 key，eventId 用于业务去重；两者目的不同。

生产者是发送记录的客户端，消费者是读取记录的客户端。JSON 中的 schemaVersion 标识数据格式版本，便于消费端验证是否理解该格式。

生产者显式启用幂等发送、acks=all 和投递回调，并检查 flush 的剩余队列与回调错误。produce 返回只表示进入本地发送流程，不能立即打印“业务已完成”。

<a id="section-4"></a>

## 分区与顺序

非空 key 采用固定编码和分区算法时，通常映射到稳定分区。本例选择与 Java 生产者兼容的 Murmur2 分区器；跨语言项目要显式对齐算法，不能假定所有客户端默认相同。

改变分区数或分区器可能改变映射。多个生产者、业务线程与消费并行也会影响可观察顺序；按业务实体有序需要约束整个链路，不只是填写 key。

幂等表示同一操作重复执行时，不额外产生业务效果；它需要明确是发送协议的保证，还是业务数据库的保证。acks=all 要求当前同步副本集合 ISR 中的副本确认，min.insync.replicas 则限制允许成功写入的最少同步副本数。

副本和分区解决不同问题：副本用于容错，分区用于分布与并行。本例只有一个副本，acks=all 也没有额外节点冗余，不能据此宣称高可用或任意故障不丢失。

<a id="section-5"></a>

## 位移提交、重复与重放

客户端关闭自动提交和自动 offset 存储。处理顺序为：解析并校验 → SQLite 事务记录效果与 eventId → 同步提交该消息的后继位置，并检查返回的分区级错误。

若数据库失败，不提交 offset；若数据库提交后、offset 提交前崩溃，记录可能重放。数据库唯一约束让同一 eventId 的同一效果不重复产生，内容不同却复用 ID 会报错。

```powershell
uv run --locked notes-kafka publish --event-id demo-001 --task-id task-1 --title "Learn Kafka"
uv run --locked notes-kafka consume --limit 1
uv run --locked notes-kafka consume --group replay-demo --limit 10
```

第二次发布是另一次应用发送，Kafka 中可能有另一条记录；本地效果应显示 new effect: False。换组可以重读保留范围内的记录，但仍复用同一 SQLite 去重库，所以不应重复产生效果。

auto.offset.reset=earliest 只在没有可用提交位置或位置越界等情况下生效，不会让已有组每次从头开始。earliest 也是当前最早保留的位置，不保证永久保留所有历史。

<a id="section-6"></a>

## 重试、坏消息与 exactly-once 的范围

本例遇到坏消息或数据库错误时停止，不提交相关位置，没有自动死信功能。再次启动可能再次遇到同一问题，需要检查、修复或按受控方案隔离。

正式处理通常需要有界重试、退避、失败主题、稳定事件 ID 和监控。先发失败主题再提交位移也有故障窗口，不能随意跳过记录来让 lag 变小。

业务去重还要区分处理职责：本例换组是重放同一业务效果；两个独立业务处理器应使用各自的去重命名空间，不能共享一个全局 eventId 记录后误跳过另一种业务。

生产者幂等主要减少其协议重试造成的重复，不识别所有重复业务请求。Kafka 事务与 read_committed 能在适用的 Kafka 读写链路提供相应保证，但不能自动把 SQLite、支付或邮件变成全局 exactly-once。

本例的效果只是 SQLite 中一条事件记录；外部调用需要自己的幂等与恢复设计。跨数据库发布可考虑 outbox / CDC，明确业务提交与事件发布如何衔接。

<a id="section-7"></a>

## 运维检查与验证

```powershell
docker compose exec kafka /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server 127.0.0.1:9092 --describe --group notes-demo
uv run --locked pytest
uv run --locked ruff check .
uv run --locked ruff format --check .
```

检查分区、组分配、提交位置与 lag，结合磁盘、保留策略、ISR、重平衡和处理耗时。改变组位移先停止相关消费者并预览计划，重放会再次触发业务处理。

当前本机通过六项处理边界测试、Ruff 与 Compose 配置校验；测试消费者是替身，不能证明真实 broker 已完成生产、消费或重平衡。真实集成步骤见 [示例说明](examples/kafka/README.md)。

| 现象 | 先检查 |
| --- | --- |
| bootstrap 可连但发送失败 | advertised.listeners、网络、topic 和权限 |
| 加消费者却没有更快 | 分区数量、key 分布与瓶颈 |
| 一直重复同一记录 | 失败位置、提交结果和坏消息 |
| 新组也读不到早期记录 | retention、compaction 与实际起点 |
| 重放重复外部效果 | eventId、去重记录与业务副作用边界 |
| 多个生产者顺序不一致 | 分区算法、分区数、并发与业务版本 |


<a id="section-8"></a>

## 官方参考

- [Apache Kafka 快速开始](https://kafka.apache.org/quickstart/)
- [Kafka broker 配置](https://kafka.apache.org/44/configuration/broker-configs/)
- [Kafka 设计](https://kafka.apache.org/44/design/design/)
- [Confluent Python API：提交结果与分区错误](https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html)
- [Confluent Python 客户端](https://docs.confluent.io/kafka-clients/python/current/overview.html)
- [librdkafka 分区与配置](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md)

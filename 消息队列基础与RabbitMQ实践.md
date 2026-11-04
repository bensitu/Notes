# 消息队列基础与 RabbitMQ 实践

学习目标：理解异步解耦、确认、重投与幂等，避免把“发出消息”当成“业务完成”。

**适用范围：** 教学服务端 RabbitMQ 4.2；Python pika 版本见锁文件。示例使用 AMQP 0-9-1、durable 拓扑与手动确认。需要先启动中间件容器。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [一条消息经过哪些步骤](#section-1)
- [最小运行步骤](#section-2)
- [确认与本地业务效果](#section-3)
- [死信与失败处理](#section-4)
- [数据库与消息如何一致](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 一条消息经过哪些步骤

生产者 → exchange 按 routing key 路由 → queue 保存待处理消息 → 消费者执行业务 → 消费者确认。

exchange 不等于 queue。生产者确认只说明 broker 对发送作出了相应确认，不证明消费者业务完成；消费者确认也不能证明生产者已获得回执。

| 机制 | 解决的问题 | 不能自动解决什么 |
| --- | --- | --- |
| Publisher confirm | 发送方知道 broker 是否确认 | 消费是否已经完成 |
| mandatory / return | 发现无法路由的消息 | 后续处理失败 |
| 手动 ack | 处理后再移除消息 | 消费者崩溃窗口产生的重复 |
| 死信路由 | 隔离拒绝或满足死信条件的消息 | 无限重试与人工修复 |
| 幂等 | 同一事件重复到达不重复产生效果 | 所有外部系统的原子提交 |

<a id="section-2"></a>

## 最小运行步骤

先从贯穿项目目录启动：

```powershell
docker compose --env-file .env --profile tools up -d rabbit
```

等待管理界面 <http://127.0.0.1:15672> 可登录。用户名与密码取自 .env，不使用仅允许本机连接的默认 guest 账户。

进入 Python 项目：

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:AMQP_URL = 'amqp://notes_user:local_rabbit_change_me@127.0.0.1:5672/%2F'
uv run --locked python -m task_tools.mq_demo publish --event-id demo-001
uv run --locked python -m task_tools.mq_demo consume
```

[完整代码](examples/taskboard/python/src/task_tools/mq_demo.py)每次 consume 只取一条，队列为空会正常退出，不是持续运行的后台 worker。URL 密码包含特殊字符时需要正确百分号编码。

<a id="section-3"></a>

## 确认与本地业务效果

生产者开启 confirm，消息使用持久化标记，并要求可路由。消费者先把 eventId 与业务效果一起写入本地 SQLite 事务，提交后才 ack。

同一 eventId 再次到达时，数据库唯一键阻止重复插入。演示的“业务效果”就是数据库中的一条记录；它没有发送邮件，也没有声称数据库与外部邮件服务可以一起原子提交。

在干净练习队列中，用相同 eventId 再 publish / consume 一次，预期输出 Committed new effect: False。观察 handled-events.db，而不是只看队列变空。

<a id="section-4"></a>

## 死信与失败处理

无效 JSON、过长消息或字段不合法会被拒绝，不重新入原队列，并按拓扑进入 notes.failed。查看失败原因后，修复并受控重放；重复业务事件保持原 eventId 才能利用幂等保护。

本例为防止无限循环，也把 SQLite 错误移入死信路线。真实系统应区分瞬时与永久失败，设置有上限的重试、延迟和人工恢复流程。

死信转发本身也受队列类型与可用性配置影响。不要把“配置了 DLX”理解为任意故障下绝不丢失。

<a id="section-5"></a>

## 数据库与消息如何一致

业务数据库提交后发送消息，可能在发送前崩溃；先发再提交，可能通知了最终回滚的业务。常见解决方向是把业务与 outbox 记录一起提交，再由发布器发送和确认。

消费者在提交后、ack 前崩溃，消息会重投，因此幂等是正常设计要求。不要靠“正常情况下只发一次”来证明不会重复。

长时间 worker 还需连接恢复、合理 prefetch、优雅停机和监控。多个消费者下的完成顺序不必等于入队顺序；有序业务要明确分组与串行约束。

<a id="section-6"></a>

## 验证与开发速查

| 现象 | 检查 |
| --- | --- |
| confirm 成功但没人处理 | 路由、队列绑定、消费者状态与日志 |
| 消息反复出现 | 失败是否 requeue、是否忘记 ack |
| 同一通知产生两次效果 | eventId 是否稳定、效果和去重是否同事务 |
| 队列参数冲突 | 旧队列是否已用不同参数创建，不能随便删除业务队列 |
| 重启后记录仍在但去重失效 | 是否换了 SQLite 文件路径或丢了持久化存储 |

重试未知结果时先查询状态；不能在每次重试都生成新 eventId，否则唯一键无法识别同一个业务事件。

<a id="section-7"></a>

## 官方参考

- [RabbitMQ 确认机制](https://www.rabbitmq.com/docs/confirms)
- [可靠性说明](https://www.rabbitmq.com/docs/reliability)
- [死信交换机](https://www.rabbitmq.com/docs/dlx)

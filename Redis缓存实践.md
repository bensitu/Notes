# Redis 缓存实践

学习目标：理解缓存命中、过期、淘汰、故障和数据一致性，能运行一个有超时和 TTL 的缓存示例。

**适用范围：** 服务端教学基线 Redis 8.2，Python 客户端固定在项目锁文件。先完成 Docker 与 Python 工程化；当前 Java API 没有启用缓存。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [缓存不是主数据库的替身](#section-1)
- [最小运行步骤](#section-2)
- [Cache-aside 的顺序与竞争](#section-3)
- [过期、容量与雪崩](#section-4)
- [锁与故障边界](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 缓存不是主数据库的替身

缓存保存可重新获得的数据，以降低重复访问成本。先测量慢在哪里，再决定缓存什么；缓存会增加失效、权限隔离和故障处理的复杂度。

| 概念 | 含义 |
| --- | --- |
| 命中 / 未命中 | 找到了缓存 / 需要从可靠数据源读取 |
| TTL | 到期时间，过期后不能继续把旧值当有效缓存 |
| 淘汰 | 内存达到限制后按策略移除数据 |
| 持久化 | Redis 保存数据的机制，不等于业务数据库备份 |
| 热点 | 很多请求集中访问少数键 |

<a id="section-2"></a>

## 最小运行步骤

先在贯穿项目目录启动 Redis：

```powershell
docker compose --env-file .env --profile tools up -d redis
```

另一个终端进入 Python 项目，使用与 .env 一致的密码：

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
$env:REDIS_PASSWORD = 'local_redis_change_me'
uv run --locked python -m task_tools.cache_demo
```

[完整代码](examples/taskboard/python/src/task_tools/cache_demo.py)设置一个 60 秒有效的 JSON 缓存，读取结果、观察 TTL，最后删除自己的演示键。运行需要 Redis 已接受连接；首次启动时先查看服务日志。

这里使用的 notes:task:v1:demo 是练习命名空间，不扫描或清空整个 Redis。示例是独立命令，不会自动缓存 Java 任务接口。

<a id="section-3"></a>

## Cache-aside 的顺序与竞争

常见读取流程：读缓存，未命中时读数据库，再写缓存并设置 TTL。修改时先提交数据库，再删除相关缓存。

这个顺序仍可能出现竞争：另一个旧查询在删除之后把旧数据写回缓存。TTL 限制旧值存活时间，但不提供强一致保证。关键数据应考虑版本校验、受控刷新或直接读权威存储。

不要简单宣称“延迟双删”能解决所有一致性问题。需要明确允许多旧、故障时怎么恢复，以及多个实例如何协调。

<a id="section-4"></a>

## 过期、容量与雪崩

SET 的 ex 参数把值与 TTL 一起设置，避免先写值、进程中途退出导致忘记过期。TTL 可以加入小范围随机扰动，避免大量键同一时刻到期。

热点键失效时，可用请求合并、受控刷新或有边界的互斥减少回源，但等待时间和失败策略都要明确。缓存不存在的数据要设置合理短 TTL，并确保后来新增的数据能及时被看见。

maxmemory 与淘汰策略要根据用途配置。Redis 同时存放不可丢任务和可丢缓存时，不能随意采用会淘汰所有键的策略。

<a id="section-5"></a>

## 锁与故障边界

SET key token NX PX duration 可以作为有租约的互斥起点；释放时必须比较拥有者 token 并原子删除。先 GET 再 DEL 有竞争，不能当作安全解锁实现。

租约过期后旧持有者仍可能继续执行。关键写入需要下游的版本或 fencing 保护；Redis 锁不能替代数据库唯一约束和事务。

连接与读写设置超时。缓存失效时能否降级到数据库，要结合数据库容量、限流和业务正确性决定，不能无限回源。

<a id="section-6"></a>

## 验证与开发速查

| 练习 | 观察 |
| --- | --- |
| 写入后读回 | JSON 字段与 TTL 合理 |
| 等待 TTL 后读取 | 未命中，不把缺失值当空任务成功 |
| 停止 Redis | 超时有边界，错误可定位 |
| 大量并发访问过期键 | 是否导致数据库压力陡增 |
| 修改任务后再读取 | 是否在允许的旧值窗口内恢复 |

缓存键包含必要的租户、用户和版本维度，避免把用户 A 的结果返回给用户 B。生产 Redis 不直接暴露公网，认证、网络、备份与内存监控一起配置。

<a id="section-7"></a>

## 官方参考

- [Redis 开发文档](https://redis.io/docs/latest/develop/)
- [SET 命令](https://redis.io/docs/latest/commands/set/)
- [键淘汰](https://redis.io/docs/latest/develop/reference/eviction/)
- [分布式锁边界](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)

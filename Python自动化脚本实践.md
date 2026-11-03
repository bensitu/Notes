# Python 自动化脚本实践

学习目标：写出输入明确、出错可定位、不会误改源数据的小工具。先掌握 Python 文件、异常和函数。

**适用范围：** 完整示例为项目中的 task-tools CSV 汇总工具；Python 3.15 教学环境。文件操作、HTTP 和子进程示例按各节上下文运行。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [先定义输入、输出与失败](#section-1)
- [最小运行步骤](#section-2)
- [文件处理边界](#section-3)
- [HTTP 请求示例](#section-4)
- [调用外部程序](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 先定义输入、输出与失败

脚本也需要接口约定：接收什么文件，采用什么编码，允许哪些字段，输出到哪里，失败时如何返回。

本例读取 title、done 两列，done 只接受 true / false，标题去掉两端空白后长度为 1 到 100。输出 JSON 汇总，不改输入文件。

<a id="section-2"></a>

## 最小运行步骤

```powershell
Set-Location examples/taskboard/python
uv sync --locked --all-extras
uv run --locked task-tools sample.csv
```

预期输出：

```json
{"total": 2, "completed": 1, "pending": 1}
```

[完整脚本](examples/taskboard/python/src/task_tools/cli.py)使用 argparse、pathlib、csv 和 json。缺少文件、列不完整或某行不合法会输出错误并返回非零退出码；测试验证错误行号和原文件未被改写。

<a id="section-3"></a>

## 文件处理边界

不要用字符串 split(",") 代替 CSV 解析，字段中可能有引号、逗号与换行。大文件按行迭代，不必一次全部读进内存。

输出文件若可能覆盖已有内容，应明确覆盖选项；需要整体替换时先在同一文件系统写临时文件、确认完成，再按平台规则替换。不要把“写了一半”当作成功。

批量改名或清理文件时，先输出将处理的绝对路径与数量，验证范围后再执行。符号链接、相对路径、扩展名大小写和权限都可能改变实际目标。

<a id="section-4"></a>

## HTTP 请求示例

下面是独立脚本，只读取项目健康端点，不会创建任务：

```python
import httpx

with httpx.Client(timeout=httpx.Timeout(5.0, connect=2.0)) as client:
    response = client.get("http://127.0.0.1:8080/actuator/health")
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, dict) or payload.get("status") != "UP":
        raise ValueError("Unexpected health response")
    print("Service is healthy")
```

需要先启动 Java 后端。超时包含不同阶段的限制，不意味着整个批量任务必定在五秒内完成。失败时记录目标、状态和必要的错误信息，不记录密码。

不要对创建、付款、发送通知的 POST 无条件自动重试；超时可能发生在服务器已完成操作之后。需要查询结果或可靠的幂等设计。

<a id="section-5"></a>

## 调用外部程序

```python
import subprocess

result = subprocess.run(
    ["git", "status", "--short"],
    check=True,
    capture_output=True,
    text=True,
    encoding="utf-8",
    timeout=10,
)
print(result.stdout)
```

需要已安装 git，且当前目录是仓库。参数列表避免把输入拼成 shell 语句；check=True 让非零退出码成为异常。捕获输出时还需考虑大输出和编码来源。

<a id="section-6"></a>

## 验证与开发速查

| 输入或故障 | 期望 |
| --- | --- |
| 合法 CSV | 准确统计，不改变源文件 |
| 文件不存在 | 明确路径相关错误、非零退出 |
| 非法 done | 指出行号，不悄悄当 false |
| 后端不可达 | 有限时间内失败 |
| 外部程序失败 | 保留退出状态和必要诊断 |

定时运行时使用绝对路径、明确工作目录和受控环境变量；加入防重入与失败告警。脚本能手动运行一次，不等于可以无人值守长期运行。

<a id="section-7"></a>

## 官方参考

- [argparse](https://docs.python.org/3/library/argparse.html)
- [csv](https://docs.python.org/3/library/csv.html)
- [subprocess](https://docs.python.org/3/library/subprocess.html)
- [HTTPX 超时](https://www.python-httpx.org/advanced/timeouts/)

# Python 基础与标准库

学习目标：从语法走到能处理文件、异常和结构化数据的小程序。已有 Java 或 JavaScript 经验也应检查 Python 自己的语义。

**适用范围：** 教学解释器为 CPython 3.15；项目声明最低 3.11，并避免依赖较新语法。实际验证使用项目 .python-version 与 uv 管理的版本，精确解释器与依赖见验证记录。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [先掌握哪些概念](#section-1)
- [最小可运行示例](#section-2)
- [函数、默认参数与复制](#section-3)
- [文件、编码与异常](#section-4)
- [标准库选择](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 先掌握哪些概念

Python 用缩进组织代码块；变量名绑定到对象，赋值不会自动复制对象。整数、浮点数、字符串、列表、字典、集合是不同的数据类型。

| 写法 | 含义 |
| --- | --- |
| list / dict / set | 可变的列表、映射与集合 |
| tuple | 元组，元素引用不能重新赋值，内部对象仍可能可变 |
| None | 表示缺少值，不是空字符串 |
| == / is | 比较值 / 比较是否同一个对象 |
| def / class | 定义函数 / 类 |
| with | 按对象协议管理资源与退出行为 |

<a id="section-2"></a>

## 最小可运行示例

保存为 hello_tasks.py：

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Task:
    title: str
    done: bool = False


def pending_titles(tasks: list[Task]) -> list[str]:
    return [task.title for task in tasks if not task.done]


if __name__ == "__main__":
    tasks = [Task("Learn Python", True), Task("Write tests")]
    print(pending_titles(tasks))
```

```powershell
python hello_tasks.py
```

预期输出 ['Write tests']。类型标注帮助工具检查，不会在运行时自动拒绝错误类型；frozen 限制字段赋值，也不等于所有引用内容都深度不可变。

<a id="section-3"></a>

## 函数、默认参数与复制

默认参数在函数定义时求值，不要用可变列表保存每次调用的新数据：

```python
def add_title(title: str, titles: list[str] | None = None) -> list[str]:
    result = [] if titles is None else list(titles)
    result.append(title)
    return result
```

这里明确复制传入列表，不修改调用者的列表。浅复制仍共享嵌套对象；需要深复制时先想清楚哪些对象应该共享，而不是对所有数据机械调用 deepcopy。

函数返回多个值通常实际返回元组。不要把打印结果与返回结果混淆；print 用于输出，return 把数据交给调用者。

<a id="section-4"></a>

## 文件、编码与异常

使用 pathlib 表达路径，文本明确编码，CSV 指定 newline=""。UTF-8 文件可能带 BOM，读取这类导出文件可按需要使用 utf-8-sig。

```python
from pathlib import Path

source = Path("tasks.txt")
try:
    with source.open(encoding="utf-8") as stream:
        for line in stream:
            print(line.rstrip("\n"))
except FileNotFoundError:
    print("Input file was not found")
```

只捕获知道如何处理的异常。except Exception 后无条件 pass 会让错误像成功一样继续；错误向上抛出时保留原始原因。

<a id="section-5"></a>

## 标准库选择

| 任务 | 先看 |
| --- | --- |
| 路径与文件 | pathlib、io |
| JSON / CSV | json、csv |
| 日期时间 | datetime、zoneinfo |
| 命令行参数 | argparse |
| 日志 | logging |
| 金额 | decimal |
| 调用外部进程 | subprocess，优先参数列表且避免 shell=True |
| 迭代处理 | itertools、生成器 |

json.loads 解析 JSON，不用 eval。不要加载来源不可信的 pickle；反序列化可能执行代码。

<a id="section-6"></a>

## 验证与开发速查

通过 python --version 确认实际解释器，通过 python -m pip 而不是模糊的 pip 路径定位环境。本仓库使用 uv run 统一解释器与环境，见[工程化文档](Python项目工程化.md)。

为函数测试空输入、正常输入和非法输入。浮点比较、可变默认值、浅复制、文件编码和异常吞掉，是跨语言初学者最容易忽略的边界。

<a id="section-7"></a>

## 官方参考

- [Python 教程](https://docs.python.org/3/tutorial/)
- [标准库](https://docs.python.org/3/library/)
- [Python 版本发布](https://www.python.org/downloads/)

# Python 项目工程化：环境、依赖、检查与测试

学习目标：让另一台机器能够安装、检查和运行同一个项目。先掌握基础语法与命令行。

**适用范围：** 贯穿项目采用 Python 3.15、uv 0.13.7、pyproject.toml、uv.lock、Ruff 与 pytest。各包版本已锁定，不要求读者手工拼装最新依赖。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [项目文件各做什么](#section-1)
- [最小运行步骤](#section-2)
- [添加或升级依赖](#section-3)
- [包、模块与命令行入口](#section-4)
- [测试、格式与类型检查](#section-5)
- [常见错误与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 项目文件各做什么

| 文件或目录 | 用途 | 是否提交 |
| --- | --- | --- |
| pyproject.toml | 项目元数据、依赖与工具配置 | 是 |
| uv.lock | 已解析的依赖与哈希 | 是 |
| .python-version | 项目解释器版本选择 | 是 |
| .venv | 本机虚拟环境 | 否 |
| src/task_tools | 可安装的 Python 包 | 是 |
| tests | 行为测试 | 是 |
| *.db、缓存目录 | 本机运行数据或工具缓存 | 否 |

虚拟环境隔离 Python 包，不自动隔离数据库、操作系统工具或服务端口。不要把 .venv 当成可在所有机器复制运行的制品。

<a id="section-2"></a>

## 最小运行步骤

先从 uv 官方安装说明安装适合本机的 uv，然后：

```powershell
Set-Location examples/taskboard/python
uv --version
uv sync --locked --all-extras
uv run --locked python --version
uv run --locked task-tools sample.csv
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked pytest
```

首次会下载项目要求的解释器与依赖。预期 CSV 汇总为 total=2、completed=1、pending=1。解释器下载需要网络，不要因本机 python 是另一个版本就删除锁文件。

<a id="section-3"></a>

## 添加或升级依赖

```powershell
uv add package-name
uv add --dev development-tool-name
```

这是命令语法模板：先把占位名称换成经过确认的实际包。运行后检查 pyproject.toml 与 uv.lock，再执行检查、测试和实际运行。

CI 使用 --locked，遇到不一致就失败，不在流水线临时修锁。确实升级时在开发分支更新依赖，阅读变化，再提交两个文件。

[本项目配置](examples/taskboard/python/pyproject.toml)把缓存、消息和 MongoDB 客户端放入 services extra。本例测试包含消息去重逻辑，因此统一运行说明使用 --all-extras；按更小范围安装时要明确哪些模块与测试不可用。

<a id="section-4"></a>

## 包、模块与命令行入口

python -m task_tools.cli 按模块运行；task-tools 是安装后由 project.scripts 生成的入口。直接在任意目录执行内部文件，可能破坏包导入路径。

src 布局让测试更接近已安装包的行为，而不是偶然从当前目录导入同名文件。不要将自己的文件命名为 json.py、typing.py 等容易遮蔽标准库的名称。

<a id="section-5"></a>

## 测试、格式与类型检查

Ruff 检查明显错误和所选规则；format 统一格式；pytest 执行行为断言。它们不负责证明业务正确，也不能互相替代。

类型标注不会自动在运行时验证数据。项目需要完整静态类型检查时，可以另选并固定兼容的检查器，逐步补齐第三方类型与边界；当前示例没有把 Ruff 成功宣称为类型检查成功。

测试使用 tmp_path 隔离 SQLite 与 CSV，不连接生产数据库。测试重复消息时验证数据库效果，而不是只断言输出了某句话。

<a id="section-6"></a>

## 常见错误与开发速查

| 问题 | 处理 |
| --- | --- |
| 包安装成功但导入失败 | 检查实际解释器与 uv run 环境 |
| --locked 报不一致 | 有意修改依赖后先在开发环境更新锁，不绕过检查 |
| Python 新版本没有对应 wheel | 核对库支持范围或选择兼容版本，不盲目编译 |
| 缓存硬链接失败后复制 | 常见于跨磁盘缓存；可按需要配置 link mode |
| 出现弃用警告 | 阅读触发来源，计划配套升级，不全局屏蔽警告 |

requirements 文件、锁文件和构建依赖分别有作用；解释器、平台及外部服务也影响可复现性。发布时同时记录这些条件，不能只保留一份 pip freeze。

<a id="section-7"></a>

## 官方参考

- [uv 项目管理](https://docs.astral.sh/uv/guides/projects/)
- [Python 打包指南](https://packaging.python.org/en/latest/)
- [Ruff](https://docs.astral.sh/ruff/)
- [pytest](https://docs.pytest.org/en/stable/)

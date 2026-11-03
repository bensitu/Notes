# GitHub Actions 持续集成

学习目标：让每次修改自动执行与本机相同的验证，失败时阻止合并或发布。先掌握 Git 和各项目的测试命令。

**适用范围：** GitHub Actions 托管 Linux runner；模板中的第三方 Action 固定完整提交 SHA，运行时固定 Java 25、Node 24、Python 3.15 和 uv 版本。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [CI、持续交付与自动部署](#section-1)
- [可直接采用的完整模板](#section-2)
- [模板执行了什么](#section-3)
- [锁文件、缓存与制品](#section-4)
- [权限与不可信输入](#section-5)
- [验证与故障定位](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## CI、持续交付与自动部署

CI 是频繁集成修改并自动检查；持续交付要求软件保持可发布；自动部署则是在满足条件后把制品部署到目标环境。三个概念相关，但不是同一个开关。

工作流通过触发事件运行 job，job 在 runner 上执行若干 step。不同 job 的文件系统默认不共享，需要明确上传与下载制品。

<a id="section-2"></a>

## 可直接采用的完整模板

完整文件见 [learning-examples.yml](examples/taskboard/ci/learning-examples.yml)。在自己的仓库根目录创建 .github/workflows，再复制该文件；路径假设仓库仍包含 examples/taskboard。

```powershell
New-Item -ItemType Directory -Force .github/workflows
Copy-Item examples/taskboard/ci/learning-examples.yml .github/workflows/learning-examples.yml
```

已有同名工作流时先比较内容，不要直接覆盖。模板放在 examples 中时不会自动运行；复制到标准工作流目录并提交后，才会按 push、pull_request 或手动事件触发。

<a id="section-3"></a>

## 模板执行了什么

| job | 核心检查 | 产物 |
| --- | --- | --- |
| java | mvn verify | 已测试的 JAR |
| frontend | npm ci、测试、类型检查与构建 | dist |
| python | 锁定安装、Ruff、pytest | 测试结果 |
| browser | 启动真实后端，运行 Playwright | 真实登录与任务操作结果 |

浏览器 job 为缩短重复工作，用跳过测试的方式构建启动用 JAR；独立 java job 必须运行完整测试。发布门禁必须依赖所有必需 job 成功，不能只依赖 browser。

<a id="section-4"></a>

## 锁文件、缓存与制品

npm ci 检查锁文件；uv sync --locked 在依赖声明与锁不一致时失败。不要在 CI 中自动更新依赖，再把“恰好安装成功”当作可复现构建。

缓存用于加速下载，制品用于传递这次构建的结果。缓存可能被失效或替换，不应作为唯一发布来源。制品记录来源提交、构建号、校验和与保留时间。

模板上传 JAR 与 dist，保留七天。正式发布还需要镜像构建、扫描、仓库权限和环境保护；模板没有假装已配置你的生产服务器。

<a id="section-5"></a>

## 权限与不可信输入

默认只授予 contents:read。发布镜像或部署时，仅在对应 job 增加必要权限。受信云平台可通过 OIDC 获取短期凭证，仍要限制允许的仓库、分支和环境。

不要让外部 PR 的代码在拥有生产秘密的环境中执行。不要把 PR 标题、分支名等不可信值直接拼进 shell 脚本；需要使用时通过参数或环境变量传递并正确引用。

Action 固定 SHA 不意味着永远不更新；应审查来源、维护状态与变更，再更新锁定值。

<a id="section-6"></a>

## 验证与故障定位

先确认本机可以执行同一条命令，再提交工作流。在 GitHub Actions 中看失败的 job、step 与第一条错误，下载必要报告。

| 现象 | 检查 |
| --- | --- |
| 本机通过，CI 失败 | 运行时版本、大小写、路径、时区、环境变量 |
| CI 没有触发 | 文件位置、事件、分支过滤和 YAML |
| 构建成功但没产物 | 上传路径和 if-no-files-found 设置 |
| 测试失败仍发布 | 发布 job 的 needs、条件和退出码 |
| fork PR 缺少 secrets | 正常权限边界，不通过扩大权限绕过 |

将必需检查配置为分支保护或仓库规则，才能让失败真正阻止合并。远端工作流是否成功，需要在实际仓库运行后确认，本机 YAML 解析不能替代。

<a id="section-7"></a>

## 官方参考

- [GitHub Actions 工作流语法](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
- [安全使用参考](https://docs.github.com/en/actions/reference/security/secure-use)
- [OIDC](https://docs.github.com/en/actions/concepts/security/openid-connect)

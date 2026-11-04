# Git 与团队协作：从修改到合并

学习目标：知道文件目前处于哪个状态，能提交小范围修改、处理冲突，并安全撤销已经发布的错误。

**适用范围：** Git 2.x；命令在 PowerShell、Bash 中均可使用。练习应在自己的分支完成。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [先理解四个位置](#section-1)
- [最小练习：修改说明并提交](#section-2)
- [冲突怎样处理](#section-3)
- [撤销操作速查](#section-4)
- [验证与常见错误](#section-5)
- [官方参考](#section-6)

<a id="section-1"></a>

## 先理解四个位置

工作区是磁盘上的文件；暂存区是下一次准备提交的内容；本地提交是已有历史；远端是协作服务器上的仓库。保存文件不会自动暂存，提交也不会自动推送。

| 命令 | 观察或改变什么 |
| --- | --- |
| git status | 查看工作区、暂存区、分支状态 |
| git diff | 查看尚未暂存的修改 |
| git diff --cached | 查看准备提交的修改 |
| git log --oneline -5 | 查看最近提交 |
| git fetch origin | 更新远端跟踪信息，不自动改工作区 |

<a id="section-2"></a>

## 最小练习：修改说明并提交

先在仓库根目录执行。已有未提交修改时，先明确哪些属于本次任务，不要直接全部暂存。

```powershell
git status
git fetch origin
git switch main
git pull --ff-only
git switch -c feature/update-taskboard-guide
```

编辑本项目的说明后，只暂存目标文件：

```powershell
git diff -- examples/taskboard/README.md
git add -- examples/taskboard/README.md
git diff --cached --check
git diff --cached
git commit -m "docs: clarify taskboard startup"
git push -u origin feature/update-taskboard-guide
```

此处文件是练习对象，不要为了练习制造无意义修改。提交内容要能用一句话说明原因；推送后通过 Pull Request 让同伴审阅。

<a id="section-3"></a>

## 冲突怎样处理

冲突表示 Git 无法自动决定两份修改如何组合，不意味着选一边就一定正确。

1. 执行 git status，找出冲突文件。
2. 阅读两边的修改意图，编辑成最终内容，移除冲突标记。
3. 检查相邻段落、链接与示例是否仍一致。
4. 暂存解决后的文件；merge 时提交，rebase 时执行 git rebase --continue。
5. 无法继续当前过程时，使用与当前操作对应的 git merge --abort 或 git rebase --abort。

共享分支上的提交不要随意改写。自己的未发布分支才适合按团队约定整理提交；确需更新已发布分支时先协调，并了解 --force-with-lease 的检查范围。

<a id="section-4"></a>

## 撤销操作速查

| 情况 | 做法 | 要注意的事 |
| --- | --- | --- |
| 暂存了错误文件 | git restore --staged -- 文件名 | 取消暂存，保留工作区内容 |
| 上一次本地提交漏了文件 | 补暂存后 git commit --amend | 会改变提交 ID，不用于随意改共享历史 |
| 已发布提交引入问题 | git revert 提交ID | 新建一个反向提交，再检查与测试 |
| 想丢弃工作区修改 | 先看 diff，再决定是否 git restore -- 文件名 | 会覆盖该文件未提交的内容 |

不要把 reset --hard 或强制推送当作通用修复办法。误操作后先停止继续改写历史，再检查 git reflog；未提交、未备份的数据不保证能恢复。

<a id="section-5"></a>

## 验证与常见错误

提交前检查 staged diff，提交后检查 git show --stat HEAD。推送后 fetch 并比较本地分支和远端分支；“工作区干净”不等于“已经推送”。

合并前至少执行与修改对应的测试和构建。正文与示例同步改动，不把密码、.env、数据库文件、node_modules 或构建目录加入提交。

新增依赖时同时提交锁文件；忽略文件只阻止新文件被跟踪，不会自动从历史中移除已经提交的秘密。秘密泄露时需要撤销凭证并按团队流程处理历史。

<a id="section-6"></a>

## 官方参考

- [Git 官方书籍](https://git-scm.com/book/zh/v2)
- [git restore](https://git-scm.com/docs/git-restore)

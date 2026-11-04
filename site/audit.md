# 中文站点改造审计

审计日期：2026-11-04。基线对应改造前的 3c3b178；站点开发不会改动既有文章正文、Resources 或 examples。

## 仓库现状

- 顶层中文文章 60 篇，另有仓库 README.md；examples 下的说明不作为站点文章发现。
- Resources 内 293 个资源文件，约 38 MiB，保留原始路径。
- README 使用七个技术分类的表格，覆盖现有文章；用这些表格作为首次分类来源。
- 解析 Markdown 链接、引用式链接和原始 HTML 资源属性后，检查到 992 处可用的本地目标或章节引用，未发现本地断链。机器结果保存在 audit-baseline.json。
- 文章中有 49 处远程图片引用。本次未批量请求外部网站；外部图片的可用性、防盗链和远端内容变更不属于已验证的本地链接保证。

## 代表性路径

| 来源 | 需要保留的行为 |
| --- | --- |
| JSF 基础.md | 显式 section-1 等 HTML ID，文章内章节跳转 |
| React基础与组件.md | 指向 examples/react-taskboard 中 README 与 TSX 文件的链接 |
| MyBatis的使用.md | 中文 Resources 路径、Markdown 图片、原始 HTML img、大表格和长代码 |
| VUE基础.md | 长文章、多级标题、远程图片和代码块 |
| 前端基础_HTML&CSS.md、Springboot+JSF+Mybatis.md | &、+ 等文件名字符 |
| MySQL的基本查询, 多表查询与分页.md | 中文、逗号、空格及 URL 编码 |

## 迁移方式

源文件维持原样。构建脚本用 Markdown 语法树修改发布副本的链接和标题 ID，不对全文做字符串替换。文件路径决定 ASCII slug，内容修改不改变文章 URL；Resources 资源按源路径散列为 ASCII 文件名。

首页与左侧导航由顶层文章生成。README 表格只提供已有分类，新增文章可不修改 README；可选 frontmatter 可以覆盖标题、分类和顺序，无配置时归入“其他笔记”。examples 链接经过本地目标存在性检查，发布为 GitHub blob/tree 地址。

既有断链与新增问题分别记录：当前基线为零；后续构建发现无效本地目标、锚点、路径越界或大小写冲突将直接失败，不能通过更新基线自动忽略。

## 版本依据

- npm 的正式 latest 为 Docsify 5.1.0，使用 dist 中的 Core Theme，不使用 lib 中的旧版主题。
- 标题规则对照固定版本源码的 headingCompiler 和 slugify；发布副本注入 ASCII :id=，原文 GitHub 标题锚点与 Docsify 标题锚点都映射到发布 ID。显式 HTML ID 保持不变。
- 导航、搜索、目录、复制、分页和主题通过小型本地脚本实现，减少第三方插件的版本耦合。

参考：[Docsify 官方源码](https://github.com/docsifyjs/docsify/tree/v5.1.0)、[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

# Playground 与本地链接验收记录

验证日期：2026-11-04。环境：Windows、Node.js 24.16.0、npm 11.15.0，Playwright 使用配套 Chromium。以下是本地结果，没有推送代码、部署 Pages 或调用真实翻译 API。

本文保留 Playground 首次实现时的验证结果；表中的译文数量是当时状态。当前翻译维护方式见 [英文与日文翻译](translation.md)。

## 链接边界

14 份 Markdown 中的 18 处裸本地地址补上了明确链接边界。正文中的中文标点和说明不再进入链接；代码块、行内代码、已有明确链接和 HTML 属性保留。浏览器检查确认 Next.js 文章中链接的文字及目标都恰好为 `http://127.0.0.1:3001`，句号和后续说明在链接外。

`npm run check:local-links` 检查结果为 0 处待处理。回归检查覆盖重复执行、中文查询参数、已有链接和相似远程域名；Pages 构建工作流已加入此检查。

## 功能与构建

| 检查 | 本地结果 |
| --- | --- |
| `npm ci --ignore-scripts --no-fund` | 通过；忽略安装脚本后仍可调用 esbuild 构建；安装审计报告 0 个已知漏洞 |
| `npm run test:site` | 8 项通过 |
| `npm run build:site`、`npm run validate:site` | `/Notes/` 和 `/` 两种基路径均通过；60 篇文章、293 个媒体资源、402 个 ASCII 输出路径、1314 个内部链接和资源检查 |
| `npm run test:site:browser` | `/Notes/` 和 `/` 下均为 10 项通过；包括原有文章阅读功能和新增 Playground |
| `npm run test:translations`、`npm run validate:translations` | 11 项测试通过；正式英文、日文译文仍各为 0 篇 |
| `npm run test:translations:browser` | 3 项通过；使用独立的模拟译文，不写入正式翻译目录 |
| `npm run audit:site` | 60 篇文章、293 个资源、993 个源链接检查，无问题；仍记录 49 处外部图片引用 |
| actionlint、JavaScript 语法检查、`git diff --check` | 通过 |

浏览器实际执行了 HTML 编辑与运行、文件切换、重置、停止、草稿保留、React JSX 编译与错误恢复、Vue ref/computed 更新、控制台文本输出、预览不能读取主站 DOM、相关文章往返、SSR 分步流程、模拟禁用 JavaScript、深色主题、320px 布局和三种语言的入口切换。React 示例运行时没有请求外部域名。

另外查看了 1600px 桌面截图和 320px 手机截图。桌面使用编辑器与预览双栏；窄屏按上下顺序排列，SSR 对比卡片也切换为单列。外层主题与文章风格一致，预览保留浅色页面。

## 验证范围

SSR 对比是浏览器中的教学模拟，没有执行 Next.js、Nuxt 或真实服务器渲染。完整工程继续按 examples/ssr/README.md 在本地运行。此次也没有重新验证那些工程的构建，因为只修改了说明中的链接边界，没有改变工程代码或依赖。

没有验证所有浏览器、真实 Pages 部署或每一个外部网址。预览不是处理不可信程序的远程执行平台；运行范围和同步死循环的限制见 [使用说明](playground.md)。

# Nuxt 公共文章示例

完整构建、启动和自动验证见 [SSR 运行说明](../ssr/README.md)。

app/pages 提供页面，server/api 提供公共只读 JSON；useFetch 把初始数据放入 payload，useState 沿用服务器时间与计数初始状态。没有把用户状态放进服务端模块全局 ref。

本项目使用 Nuxt 4 的目录约定与 Node server preset，没有登录、数据库、外部接口或生产代理。已通过类型检查、生产构建及三项生产浏览器测试。

数据类型泛型不代替外部 JSON 验证；请阅读 [Nuxt 文档](../../Nuxt全栈与SSR实践.md)和 [SSR 安全文档](../../SSR部署与缓存安全.md)。精确依赖见 package-lock.json。

## 间接依赖安全更新

2026-11-04 针对 minimatch 与 glob 的资源耗尽漏洞，在 package.json 的 overrides 中分别固定 11.0.4 与 14.0.3，并更新锁文件。overrides 是 npm 为间接依赖指定版本的设置；这些包由 Nitro 的文件追踪和归档工具带入，上游当前版本范围尚未包含已修复的大版本。

Node 24 下已重新通过 npm ci、npm run typecheck、npm run build，以及 SSR 验证项目的六项生产浏览器测试；其中三项直接验证本 Nuxt 示例的初始 HTML、水合、导航、独立浏览器状态和 404。另在临时目录验证了 glob 同步 / 异步扫描和 readdir-glob 匹配接口，覆盖中文与特殊字符路径。

本次 npm audit 已不再包含 minimatch 或 glob，也没有中危、高危或严重项。仍有 7 条低危受影响包记录，来源是同一个 deepmerge 漏洞及其上游依赖链；这不代表七个独立漏洞。deepmerge 当前没有公布修复版本，本次没有把该告警隐藏或标为已修复。

后续升级 Nuxt / Nitro 时，检查它们是否已自然依赖安全版本，再决定移除 overrides；移除后重新安装、审计、类型检查、构建与浏览器测试，避免回退到旧版本。

公告：[minimatch](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249)、[glob](https://github.com/isaacs/node-glob/security/advisories/GHSA-3g3m-2fjr-6pw4)、[仍待处理的 deepmerge](https://github.com/advisories/GHSA-gcqx-w48m-w2h4)。

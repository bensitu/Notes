# Nuxt 公共文章示例

完整构建、启动和自动验证见 [SSR 运行说明](../ssr/README.md)。

app/pages 提供页面，server/api 提供公共只读 JSON；useFetch 把初始数据放入 payload，useState 沿用服务器时间与计数初始状态。没有把用户状态放进服务端模块全局 ref。

本项目使用 Nuxt 4 的目录约定与 Node server preset，没有登录、数据库、外部接口或生产代理。已通过类型检查、生产构建及三项生产浏览器测试。

数据类型泛型不代替外部 JSON 验证；请阅读 [Nuxt 文档](../../Nuxt全栈与SSR实践.md)和 [SSR 安全文档](../../SSR部署与缓存安全.md)。精确依赖见 package-lock.json。

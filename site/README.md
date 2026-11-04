# 中文站点维护与发布

本目录是网站外壳与维护说明，中文原文仍位于仓库顶层。中文、英文和日文入口共用同一站点；没有译文的文章提供中文回退。根 README、Resources 和 examples 保留原路径，翻译机制见 [英文与日文增量翻译](translation.md)。

## 第一次本地运行

需要 Node.js 24 和随附的 npm。先在仓库根目录打开终端；站点本身不需要 Java、Python、Docker 或数据库。

```powershell
npm ci --ignore-scripts
npm run build:site
npm run validate:site
npm run serve:site
```

打开终端显示的地址：<http://127.0.0.1:4173/Notes/#/>。不要直接双击 index.html；浏览器需要通过 HTTP 请求 Markdown。预览命令持续运行，按 Ctrl+C 停止。

构建产物在 .site-dist，已被 Git 忽略。不要修改其中的文章，也不要把它提交到 main；重新构建会清空并生成这个目录。脚本拒绝把源码目录作为输出目录，并检查目录的实际路径。

修改文章或网站外壳后，再运行 build:site。预览服务器只提供现有产物，不自动重新构建。

## 新增与修改文章

直接在仓库顶层新增一个 .md 文件即可。不必修改 README、侧栏或额外清单；构建会自动把未分类文章列入“其他笔记”。已有文章的初始分类来自根 README 表格。

需要自定义时，可在新文章开头写可选的 frontmatter。它是用两行 --- 包住的 YAML 设置；不是正文标题。

```yaml
---
title: 我的新笔记
category: 前端开发
order: 20
---
```

title 控制导航名称，未设置时优先采用现有 README 的链接文字，再使用文章首个标题。category 控制分类；order 是该分类内的排序数字，越小越靠前。标题显示在网页正文时，仍以 Markdown 的 # 标题为准。

内部链接继续使用仓库原路径，例如 `[React](React基础与组件.md)`、`[章节](JSF%20基础.md#section-1)`、`![示意图](Resources/mvc3layers.png)`。不要手写发布 slug；脚本从源路径重建映射。

文章公开路由形如 `#/zh/react-7ab5e33eb99a`，由源路径的 ASCII 部分和 SHA-256 短哈希组成。只改标题或正文不会改变路由；重命名或移动源文件会改变路由，因此本阶段没有改动原文件名。

链接通过 Markdown 语法树转换，覆盖行内、引用式、查询参数、编码路径和章节锚点；代码块内看起来像链接的示例文本不会被改写。原始 HTML 的 a、img、音视频资源属性也处理。Resources 在发布目录改用 ASCII 文件名，源目录不变。examples 的本地目标先检查存在性，再指向 GitHub blob/tree 页面，不作为文章路由。

如果未来需要在原始 HTML 中增加 srcset、CSS url() 或嵌入页面，应先扩展资源转换与验证，再使用这些语法；当前仓库没有此类资源引用，脚本不会声称支持未经验证的写法。

## 测试与审计

```powershell
npm run audit:site
npm run test:site
npm run build:site
npm run validate:site
npx playwright install chromium
npm run test:site:browser
```

test:site 使用 Node 自带的测试运行器验证新增单文件自动导航、稳定 URL、特殊文件名、编码、章节、引用式链接、路径边界和输出目录保护。浏览器测试启动独立 HTTP 服务器，验证真实文章、搜索、复制、主题、导航、图片、移动端和 404 页面；若 4173 已被占用，先停止自己启动的预览服务。

审计记录见 [audit.md](audit.md)，原始基线见 audit-baseline.json。只有重新建立经过人工核对的迁移基线时才使用 `npm run audit:site -- --record`；日常检查不需要覆盖基线。构建发现断链会失败，不会因基线记录而忽略问题。

本次实际执行结果与未验证范围见 [验收记录](validation.md)。

第二阶段的翻译、预算、人工审核与语言回退检查见 [第二阶段验收记录](translation-validation.md)。模拟译文不进入正式内容，真实翻译默认关闭。

validate:site 检查发布路径、内部文档路由、目标 ID、图片、侧栏和入口依赖。它不批量访问外部网站；远程图片、GitHub 权限和外部资料仍需按实际访问情况排查。

## GitHub Pages 首次设置

由仓库所有者打开 GitHub 仓库的 Settings → Pages → Build and deployment，将 Source 设置为 **GitHub Actions**。若组织策略限制 Actions 或 github-pages 环境，按仓库实际规则启用这些官方 Actions，并允许 main 部署。

然后由所有者将本地提交推送到 main。工作流执行安装锁定依赖、测试、构建、产物校验和真实浏览器测试，全部成功后上传并部署。工作流不会自动推送源码，不需要手工创建 gh-pages 分支，也不需要配置 Azure 或第三方服务密钥。

PR 事件只构建和测试，不上传生产 Pages artifact、不运行生产部署；使用 pull_request 而不是 pull_request_target。只有部署 job 拥有 pages:write 与 id-token:write；源码检出不保留 Git 凭证。

预期默认网址是 <https://bensitu.github.io/Notes/>，**实际地址以 configure-pages 读取的配置和部署输出 page_url 为准**。构建会使用 Pages 的 base_path；自定义域名的根路径也能使用。PR 本地测试使用 /Notes/，不要求事先启用 Pages。

手工测试域名根路径时，可以使用：

```powershell
$env:SITE_BASE_PATH = '/'
npm run build:site
npm run validate:site
npm run test:site:browser
Remove-Item Env:SITE_BASE_PATH
npm run build:site
```

没有执行推送、没有运行远程工作流时，只能报告“已本地验证 / 未上线验证”。如果 configure-pages 提示 Pages 未启用，先完成上面的 Source 设置后重新运行工作流；不要把它当成中文站点需要翻译服务。

## 版本与缓存

Docsify 固定为 5.1.0，Prism 固定为 1.30.0，其余直接依赖与完整依赖树见根 package.json 和 package-lock.json。Core Theme 与客户端脚本从 npm 的 dist 目录复制，浏览器不依赖 CDN；复制文件保留对应许可证。

搜索、目录、分页、主题和复制由本地 hook 实现，已与固定 Docsify 版本做浏览器兼容测试。升级 Docsify 时先在本地运行完整测试，特别检查其标题、路由和 Core Theme 行为；不要误用 lib 目录的旧版文件。

每次文章、图片或外壳变化都会改变构建版本。脚本、样式、导航和搜索索引用版本目录隔离；Markdown 与图片请求带版本参数。搜索不写入长期 localStorage，网站不安装 Service Worker。localStorage 仅保存用户的深浅色选择。

重新发布后刷新页面即可读取新版本；已打开的页面保留本次加载的文档快照。GitHub Pages 的入口可能短暂经过浏览器或平台缓存，本仓库不能配置其服务端响应头。遇到版本延迟时先刷新页面，再核对最近部署的提交与完成时间。

参考：[Docsify 官方项目](https://github.com/docsifyjs/docsify)、[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

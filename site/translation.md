# 英文与日文增量翻译

中文文章是内容原文。网站继续从仓库顶层发现文章，译文放在 i18n/en 和 i18n/ja，元信息集中保存在 i18n/manifest.json。不要在发布目录修改译文，也不需要维护第二份文章目录。

英文和日文采用已写入仓库的静态译文，阅读和发布都不需要 Azure、翻译密钥或模型运行环境。中文、英文、日文共用文章目录和章节 ID，新增语言不改变原文地址。

目前使用一次性文件导入的方式准备译文。Azure 的定时工作流已关闭；原有 Azure 客户端和手动工作流作为可选工具保留，不参与这次翻译，也不是站点构建的前置条件。

## 不使用 Azure 的文件翻译流程

以下命令在仓库根目录执行。导出的 JSON 是翻译材料，不是网站产物；其中的 text 保留原文，翻译结果写入同一条目新增加的 translated 字符串字段。

```powershell
node scripts/translation/batch.mjs export .translation-run/manual-input.json
```

可以使用自己的翻译工具或人工处理这个文件。保留 source、slug、language、source_hash、每个文本块的 id 和 text。正文中的 `[[NT0000]]` 等占位符用于保护代码、链接和格式，需要原样保留数量、内容和成对嵌套关系。protected 字段仅说明部分占位符的含义，不能用其内容替换占位符。

完成后，将包含 translated 字段的结果保存为 .translation-run/manual-output.json，再执行：

```powershell
node scripts/translation/batch.mjs import .translation-run/manual-output.json file-import
node scripts/translation/validate.mjs --complete
npm run build:site
npm run validate:site
```

导入会先校验整个批次，再写入译文和 manifest。原文已经变化、块数不匹配、保护标记丢失、代码或链接结构改变时，会拒绝导入。元信息中的 source_revision 记录原文提交，translation_method 记录生成方式；不会自动将 human_reviewed 设置为 true。人工锁定的译文也不能被批次导入覆盖。

`--complete` 额外检查每篇原文都有英文和日文版本，且没有对应旧原文的译文。普通 validate:translations 保留局部发布检查，便于以后新增文章时逐步补齐语言版本。网站不在每篇文章上添加完成度标识；需要对照时可用文末的中文原文链接。

## 本地查看与验证

从仓库根目录执行：

```powershell
npm ci --ignore-scripts
npm run translate:plan
npm run test:translations
npm run validate:translations
npm run build:site
npm run validate:site
npx playwright install chromium
npm run test:site:browser
npm run test:translations:browser
npm run serve:site
```

translate:plan 只读取原文、元信息和已有缓存，输出候选文章与保守字符估算，不调用 API，也不写译文。test:translations 使用模拟 API；浏览器语言测试在被 Git 忽略的独立夹具中生成模拟译文，绝不会把这些测试文本加入正式 i18n 目录。

入口为 `#/`、`#/en/`、`#/ja/`。同一文章沿用中文的 ASCII slug，只替换语言前缀。切换语言时保留目标版本存在的章节 ID。如果以后新增文章暂时只有中文，仍可通过原文入口阅读；过期译文继续展示，并提示参考最新中文。

## 可选：将来启用 Azure 时的配置

在 Azure 门户创建或选择**专用于此仓库的 Translator F0 资源**，检查其定价层、Region、Endpoint、实际配额周期和使用量。官方 F0 当前每月提供 2,000,000 字符免费额度，本项目将英文与日文合计软预算限制在 1,800,000 字符以内。[Azure 官方定价](https://azure.microsoft.com/en-us/pricing/details/translator/)

在 GitHub 的 Settings → Secrets and variables → Actions 中添加以下设置。密钥只保存为仓库 Secret，不写入 Git、文章、终端命令或聊天。

| 类型 | 名称 | 设置与用途 |
| --- | --- | --- |
| Secret | AZURE_TRANSLATOR_KEY | 对应专用 F0 资源的密钥 |
| Variable | AZURE_TRANSLATOR_REGION | 从 Azure 门户复制资源区域 |
| Variable | AZURE_TRANSLATOR_ENDPOINT | 可留空，默认 https://api.cognitive.microsofttranslator.com；也支持资源专用的 https://名称.cognitiveservices.azure.com 根地址 |
| Variable | AZURE_TRANSLATOR_SKU | 在门户核对后填 F0；其他值不会启用翻译 |
| Variable | TRANSLATION_F0_CONFIRMED | 所有者完成门户检查后填 true |
| Variable | TRANSLATION_ENABLED | 最后填 true；未设置或不是 true 时关闭真实调用 |
| Variable | TRANSLATION_PILOT_APPROVED | 首次保持未设置或 false；人工验收试点后才能改为 true |
| Variable | BUDGET_CHARS | 默认 1800000；可降低，不允许超过这个上限 |
| Variable | BILLING_CYCLE_DAY | 默认 1，所有者一次性核对实际周期起始日；支持 1–31，短月份按最后一天处理 |
| Variable | BILLING_CYCLE_TIMEZONE | 默认 UTC；一次性核对与资源周期是否一致，后续保持固定 |
| Variable | TRANSLATION_BATCH_SIZE | 默认每轮最多 3 篇原文，可设为 1–3；每篇的英文、日文分别跟踪 |

这些变量是所有者配置，不是 Azure 服务端 SKU 的独立证明。程序不使用 Azure 管理凭证核查或修改资源层级，不会升级 SKU、切换付费资源或添加付费回退。如果资源选错、与其他程序共享，或者在别处调用同一密钥，本地计数不能保证整个账户没有费用；以门户中的 F0 配置与实际用量为准。

再在 Settings → Actions → General → Workflow permissions 中允许 **Allow GitHub Actions to create and approve pull requests**。这里仅用于允许创建 PR；程序不会批准或合并 PR，不需要 PAT，也不降低 main 的分支保护。生产 Pages 仍保持原来的 GitHub Actions Source 设置。

如果以后决定启用 Azure，由所有者推送相关配置，在 Actions 中手动运行 Review incremental translations。工作流只在受信任的 main 上运行，不接收 PR、fork 或 pull_request_target 的脚本；当前没有定时触发器。

## 首轮试点与日语验收

未设置 TRANSLATION_PILOT_APPROVED=true 时，只处理以下三篇：

- JSF 基础.md：显式 HTML ID 与章节跳转。
- MyBatis的使用.md：长文章、代码、表格与图片。
- React基础与组件.md：文档相对链接和 examples 源码入口。

这些原文当前仍存在，因此没有替换试点文章。英文与日文分别生成候选文件；只有整篇结构校验通过的文件才加入自动 PR。预算、超时或服务错误导致尚未完成的文章只保留文本块缓存，后续运行继续。

同一时间只维护一个待审核翻译 PR。检测到自动分支、translation 标签或修改 i18n 的其他开放 PR（包含草稿）时暂停下一批，不更新已有 PR，也不覆盖其中的人工修订。

每个 PR 列出文件、语言进度、预计字符量、请求预留计数和审核要点。请至少检查一篇长文的日语术语和语义，再核对代码、表格、链接、图片及章节；可以直接在 PR 中修订自然语言，保留原有段落、表格、代码、链接目标与 :id= 标记。

自动创建 PR 前，工作流已执行模拟测试、译文校验、站点构建和真实浏览器验证。GITHUB_TOKEN 创建的 PR 仍可能显示 **Approve workflows to run**，需要有仓库写入权限的人批准运行检查；不能假设 PR 创建后全部检查会自动执行。[GitHub 官方说明](https://docs.github.com/en/actions/concepts/security/github_token)

所有者验收并手工合并试点后，再将 TRANSLATION_PILOT_APPROVED 改为 true，开放后续小批次。后续优先级为：新增原文 → 对应译文需要更新的原文 → 历史未译文章；同级稳定排序，两种语言独立判断。

## 人工审校与更新

完成语言审校后，在该 PR 的本地检出中执行：

```powershell
npm run translate:review -- --source "MyBatis的使用.md" --language ja
npm run validate:translations
```

review 命令会检查译文的结构、代码和章节 ID 是否与当前原文一致，然后更新对应元信息并设置 human_reviewed=true。它只登记人的审核结果，不会替代语言审校，也不会调用翻译 API。将元信息修改提交到同一 PR，再由人合并。

human_reviewed=true 会锁定该篇该语言译文。中文后来变化时，页面显示 outdated 提示，继续提供已审校版本和最新中文入口，自动任务不会改写文件或清除标记。

需要重新生成已过期译文时，所有者可以显式解除这一篇的锁定，并通过正常 PR 提交元信息变更：

```powershell
npm run translate:review -- --source "MyBatis的使用.md" --language ja --unlock
```

也可以手工更新译文，再执行 review 命令重新审校。结构变化时，应先调整译文中的相应段落、代码、表格和源章节 ID；命令不会把未同步结构的旧译文误标为最新。

源文件改名或删除时，会在候选 PR 中生成 i18n/maintenance.md，列出待确认条目和能按内容识别出的新路径。程序保留人工锁定文件和标记，发布时暂不展示失去源路径的译文。请在该 PR 中确认路径、元信息和链接的迁移或删除；程序不猜测内容不同的重命名，也不自动批量删除人工译文。

## 预算、缓存与故障

translation-state 是仅由机器维护的状态分支，首次需要保存状态时自动创建为独立提交历史。里面只有 usage.json 和四个缓存分片，不保存完整发布译文；公开译文始终通过 PR 进入 main。

usage.json 保存周期、estimated_used、paused_for_quota 和用于识别新增原文的路径快照。周期按已配置的起始日与固定时区推算，跨周期自动恢复计数和暂停状态；缓存继续保留。不要删除状态分支或手工清零同一周期的用量。

缓存以语义块、目标语言、术语表和转换版本为键。原文不变时跳过整篇；只改一个段落时复用其他块。长段落按句子或安全字符边界切块，不切断占位符。每次请求最多 100 个小片段，保守字符总量不超过 8,000；官方上限为跨目标语言合计 50,000 字符。[官方请求限制](https://learn.microsoft.com/en-us/azure/ai-services/translator/service-limits)

所有请求串行并控制间隔。每次尝试前先预留预算并保存状态，成功后按批保存缓存。计数包括请求中的保护标记和重试，比实际账单更保守；它不是精确的 Azure 账单，也不是交易账本。状态保存失败时停止继续请求，保留中文发布。

403001 会暂停当前周期；429 有限退避，最多三次尝试，不会一概标记为月额度耗尽。认证错误直接停止，服务错误、超时和占位符错误有限重试；程序不输出密钥或完整服务错误正文。[官方错误码](https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/reference/status-response-codes)

Azure 翻译阶段每轮约 20 分钟的内部时间上限，完整手动工作流另有 45 分钟上限。遇到预算或时间限制时，待处理文章保留在缓存里，下次手动运行继续；预算周期变化会自动恢复周期计数。这些限制不影响已经导入的静态译文。

## 技术边界

翻译以完整标题、段落、列表项段落和表格单元格为单位。粗体、链接和行内代码不会把一句话拆成多次独立翻译。编号占位符保护代码、目标路径、HTML 属性、术语和技术标识符；回复必须完整、唯一地保留这些标记，恢复时校验格式嵌套。

代码块、缩进代码和行内代码原样保留，代码注释不翻译。Markdown 图片说明可翻译，目标文件名不译；HTML 属性保持原值。Azure 请求使用完整 HTML 元素，并使用官方 notranslate / translate=no 保护标记，不依赖尚未核实的中日动态词典能力。[官方保护方法](https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/how-to/prevent-translation)

每篇保存源路径、规范化源哈希、同步源版本、源章节 ID、结构指纹和人工锁定标记；状态不写进可读正文。状态由 main 的已合并内容与当前中文推断，待审核状态由开放 PR 表示，不另维护重复任务清单。

生产站点只由 main 的 Pages 工作流部署。PR 构建可以校验候选译文，但不会发布生产。若 main 中译文文件或结构无效，发布构建会跳过该译文并回退中文；严格译文检查仍会阻止损坏的候选 PR。缓存与翻译服务都不是中文发布依赖。

发布构建只读取本地译文目录和元信息，不加载 Azure 或 GitHub 翻译客户端。翻译专用测试位于独立的 PR 校验 job 与翻译工作流中，main 的 Pages 发布 job 不依赖这些任务，也不接收 Azure Secret。

自动检查能发现结构破损，不能保证机翻语义或日语术语完全正确。当前实际运行范围见 [第二阶段验收记录](translation-validation.md)。

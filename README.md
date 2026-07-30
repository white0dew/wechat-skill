# md2wechat

把 Markdown 或精细排版 HTML 转成微信公众号可用内容，并支持保存到公众号草稿箱。

推荐入口是仓库内的 `post-to-wechat` skill。它会根据文章和发布要求选择正确流程：

- 标准文章：`https://wechat.reshub.vip` + Chrome CDP
- 精细视觉排版：内置 `gzh-design` skill
- 非原创文章草稿：微信 API adapter
- 原创声明：微信公众号后台 CDP 流程

## 安装 skills

仓库包含两个 skill：

```text
skill/post-to-wechat
skill/gzh-design
```

可将它们链接到 agent 的 skill 目录。安装后以 `post-to-wechat` 作为统一入口；`gzh-design` 由它在需要复杂视觉版式时调用。

## 路由说明

### 标准 CDP 流程

标准 Markdown 转换、主题选择、复制富文本、填写标题/作者/摘要/封面、原创声明和保存草稿，统一由 `skill/post-to-wechat/scripts/cdp_export.ts` 驱动真实网站与公众号后台。

默认站点是：

```text
https://wechat.reshub.vip
```

除非明确进行本地开发或调试，否则不需要启动本地 Web 服务。

### 精细视觉排版

`skill/gzh-design` 提供独立的公众号主题、组件库、格式归一化与 HTML 校验工具。它用于视觉要求明显高于标准主题的文章，输出微信公众号正文 HTML 片段。

这部分来源于 [isjiamu/gzh-design-skill](https://github.com/isjiamu/gzh-design-skill)，作者为甲木 (Jiamu) × 摸鱼小李 (Moyu Xiaoli)，按 AGPL-3.0-or-later 集成和适配。完整说明见 `skill/gzh-design/NOTICE.md` 与 `skill/gzh-design/LICENSE`。

Web 与 Core 共用以下六套 `gzh-design` 视觉 tokens 和渲染主题，Markdown 渲染得到的标题、正文、引用、代码、链接、图片、强调、列表与分隔线均使用对应内联样式：

- 摸鱼绿（`moyu-green`）
- 红白色系（`red-white`）
- 石墨极简风（`graphite-minimal`）
- 留白禅意风（`zen-whitespace`）
- 摸鱼票据风（`moyu-ticket`）
- 橄榄手记（`olive-journal`）

Web/Core 负责标准 Markdown 结构的统一视觉表现；章节编号、签名卡、关键词自动标记等复杂组件化布局仍由 `gzh-design` skill 负责。

### 非原创 API 草稿

`skill/post-to-wechat/scripts/publish_draft.mjs` 接收 HTML 片段，补齐最小文档外壳，然后通过 vendored baoyu runtime 调用微信 API 创建草稿。它仅用于非原创草稿，不做预览、原创声明或群发。

凭证优先从进程环境读取，缺失值再从 `skill/post-to-wechat/.baoyu-skills/.env` 读取。模板见 `.env.example`。API 细节见 `skill/post-to-wechat/references/api-draft-publish.md`。

vendored runtime 来源、固定 revision 与许可证状态见 `skill/post-to-wechat/scripts/vendor/baoyu-post-to-wechat/THIRD_PARTY_NOTICES.md`。

### 原创声明

原创声明必须走微信公众号后台的 CDP 路径。API adapter 不声明原创，也不应被描述为原创发布方案。

## 项目结构

```text
.
├── apps/web/                         # Next.js 网站
├── packages/core/                    # Markdown -> WeChat HTML 核心渲染
└── skill/
    ├── post-to-wechat/               # 统一路由、CDP 与 API 草稿 adapter
    └── gzh-design/                   # 精细公众号排版组件与工具
```

## 本地开发

仅在修改或调试项目代码时安装依赖并启动开发服务：

```bash
npm install
npm run dev
```

本地默认地址为 `http://127.0.0.1:3000`。项目的构建和测试命令分别是 `npm run build` 与 `npm run test`。

## 微信兼容性

兼容性以公众号导入和草稿回显为准，不以普通浏览器渲染为准。标准渲染器输出正文 HTML 片段、内联样式，并限制标签、属性和样式；具体约束见 `docs/wechat-compatibility.md`。

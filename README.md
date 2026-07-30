# md2wechat

`md2wechat` 提供两层能力：先生成微信公众号兼容 HTML，再把已完成的 HTML 保存到公众号草稿箱。

```text
Markdown / 原始内容
  -> Web editor 或 gzh-design
  -> 已排版、内联样式的 HTML
  -> post-to-wechat
  -> 微信公众号草稿
```

## 两个 Skill 的边界

```text
skill/gzh-design
  负责：内容归一化、主题选择、组件化视觉排版、HTML 校验

skill/post-to-wechat
  负责：已经排版完成的 HTML -> 微信公众号草稿
```

`post-to-wechat` 不将 Markdown 转成 HTML，不选择主题，也不访问 Web 编辑器生成正文。先用 `gzh-design`、本仓库 Web 编辑器或其他前序工具产出 HTML，再交给它投递。

仓库包含：

```text
skill/post-to-wechat
skill/gzh-design
```

可将它们链接到 Agent 的 skill 目录。

## HTML 草稿投递

普通非原创草稿使用：

```bash
node skill/post-to-wechat/scripts/publish_draft.mjs \
  --html "article.html" \
  --title "文章标题" \
  --author "作者" \
  --summary "文章摘要" \
  --cover "cover.png" \
  --dry-run
```

输入是已经排版完成的 `.html` 文件，且应使用元素级内联样式。脚本会上传正文图片、上传封面，并在非 dry-run 时通过 API 创建普通草稿。

- 正文图片会上传并替换为微信托管 URL。
- 封面会上传为永久素材并作为 `thumb_media_id` 使用。
- 凭据优先读取 `WECHAT_APP_ID` / `WECHAT_APP_SECRET` 环境变量；缺失值才从 `skill/post-to-wechat/.baoyu-skills/.env` 读取。
- 首次使用前，在 `skill/post-to-wechat/scripts/vendor/baoyu-post-to-wechat/scripts/` 执行 `npm install`。

API 草稿**不声明原创**、不预览、不群发。需要原创声明时，必须在登录的微信公众号后台完成原创声明 UI 后再保存草稿，不能由 API 返回的 `media_id` 推断。

完整输入约定、凭据和常见失败处理见：

```text
skill/post-to-wechat/references/api-draft-publish.md
```

## GZH 主题统一

`gzh-design` 来源于 [isjiamu/gzh-design-skill](https://github.com/isjiamu/gzh-design-skill)，作者为甲木 (Jiamu) × 摸鱼小李 (Moyu Xiaoli)，按 AGPL-3.0-or-later 集成和适配。完整归属见 `skill/gzh-design/NOTICE.md` 与 `skill/gzh-design/LICENSE`。

Web 与 Core 共用以下六套 GZH 视觉 tokens 和 Markdown 渲染主题：

- 摸鱼绿（`moyu-green`）
- 红白色系（`red-white`）
- 石墨极简风（`graphite-minimal`）
- 留白禅意风（`zen-whitespace`）
- 摸鱼票据风（`moyu-ticket`）
- 橄榄手记（`olive-journal`）

Web/Core 负责标准 Markdown 结构的主题化内联样式。章节编号、签名卡、关键词标记等复杂组件化布局由 `gzh-design` Skill 生成。

## 项目结构

```text
.
├── apps/web/                         # Next.js Web 编辑器
├── packages/core/                    # Markdown -> WeChat HTML 核心渲染
└── skill/
    ├── gzh-design/                   # 精细公众号排版组件与工具
    └── post-to-wechat/               # HTML -> 微信公众号草稿投递
```

## 本地开发

仅在修改或调试项目代码时：

```bash
npm install
npm run dev
```

本地默认地址为 `http://127.0.0.1:3000`。构建与测试命令：

```bash
npm run build
npm run test
```

## 微信兼容性

兼容性以公众号导入和草稿回显为准，不以普通浏览器渲染为准。HTML 正文应采用内联样式，并避免脚本、`<style>` 块、CSS class/id 与微信不支持的布局能力。具体约束见 `docs/wechat-compatibility.md`。

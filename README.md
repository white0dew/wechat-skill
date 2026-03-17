# md2wechat

把 Markdown 转成更适合微信公众号的内容，并且支持两条路径：

- 生成微信兼容 HTML
- 通过 Chrome CDP 驱动网站与公众号后台，完成富文本复制、粘贴、填写元数据、保存草稿

项目不是单纯的“导出一段 HTML”。它同时覆盖了：

- `core`：Markdown -> WeChat-friendly HTML 的渲染引擎
- `web`：可视化编辑、实时预览、主题切换、主题实验室
- `cli`：命令行转换
- `skill`：给 Codex / agent 使用的自动化工作流，支持 CDP 发布到公众号后台

## 适用场景

- 把 `.md` 文章排版成微信公众号可接受的正文
- 在本地网站里调主题，再复制富文本到公众号
- 用 CDP 自动打开网站、点击“复制富文本”、切到公众号后台粘贴
- 自动填写标题、作者、摘要、封面、原创声明并保存草稿

## 项目结构

```text
.
├── apps/
│   └── web/                 # Next.js 网站
├── packages/
│   ├── core/                # Markdown -> WeChat HTML 核心渲染
│   └── cli/                 # CLI
├── skill/
│   └── md-to-wechat/        # Codex skill，含 CDP 自动化脚本
└── docs/
    └── wechat-compatibility.md
```

## 快速开始

安装依赖：

```bash
npm install
```

启动网站：

```bash
npm run dev
```

默认会启动 `apps/web`，本地访问：

```text
http://127.0.0.1:3000
```

## 常用命令

构建全部包：

```bash
npm run build
```

运行测试：

```bash
npm run test
```

## Web 能力

网站侧目前支持：

- Markdown 编辑
- 实时预览
- 一键复制富文本
- 导出 HTML
- 主题切换
- 通过 `?theme=<name>` 直接选中主题
- 主题实验室中保存本地主题
- 本地主题导入 / 导出

示例：

```text
http://127.0.0.1:3000/?theme=default
http://127.0.0.1:3000/?theme=minimal
```

## CLI 用法

先构建：

```bash
npm run build --workspace @md2wechat/core
npm run build --workspace @md2wechat/cli
```

然后转换 Markdown：

```bash
node packages/cli/dist/cli.js article.md --theme minimal --out wechat.html
```

也支持 stdin：

```bash
echo '# 标题' | node packages/cli/dist/cli.js --theme default
```

## CDP 自动化用法

`skill/md-to-wechat/scripts/cdp_export.mjs` 会做两件事中的一种或两种：

- 打开 md2wechat 网站，写入 Markdown，点击“复制富文本”
- 打开微信公众号后台，粘贴正文，填写标题 / 作者 / 摘要 / 封面，标记原创并保存草稿

只复制富文本：

```bash
node skill/md-to-wechat/scripts/cdp_export.mjs \
  --markdown-file test.md \
  --app http://127.0.0.1:3000 \
  --cdp http://127.0.0.1:9222 \
  --action copy-rich
```

复制并进入公众号后台保存草稿：

```bash
node skill/md-to-wechat/scripts/cdp_export.mjs \
  --markdown-file test.md \
  --app http://127.0.0.1:3000/?theme=default \
  --cdp http://127.0.0.1:9222 \
  --action copy-rich \
  --wechat \
  --title "测试标题" \
  --author "测试作者" \
  --summary "这是一段测试摘要。"
```

常见参数：

- `--theme`：主题名
- `--app`：网站地址
- `--cdp`：Chrome DevTools endpoint
- `--wechat`：进入公众号后台继续操作
- `--title` `--author` `--summary` `--cover`：覆盖 Markdown frontmatter
- `--no-original`：不标记原创
- `--no-submit`：不保存草稿
- `--delay-scale` `--jitter-ms`：增加等待时间和随机抖动

说明：

- 默认优先点击网站上的“复制富文本”按钮，而不是直接框选预览区
- 默认开启原创声明
- 默认保存草稿

## Skill 用法

仓库内置了一个 skill：

```text
skill/md-to-wechat
```

核心说明在：

- [skill/md-to-wechat/SKILL.md](/Users/jun/Desktop/Code/skill/md2wechat/skill/md-to-wechat/SKILL.md)

这个 skill 明确了：

- 什么时候用 CLI
- 什么时候走 CDP 自动化
- 默认行为和关键参数
- theme URL、主题实验室、公众号后台自动化的执行约束

## 微信兼容性

兼容策略不是“浏览器能显示就算可以”，而是以公众号导入和草稿回显为准。

详细约束见：

- [docs/wechat-compatibility.md](/Users/jun/Desktop/Code/skill/md2wechat/docs/wechat-compatibility.md)

当前策略重点包括：

- 只输出正文 HTML 片段
- 使用内联样式
- 限制标签、属性、样式白名单
- 以公众号实际行为为验收标准

## 二维码

如果你想直接关注或测试配套公众号，可以扫描下面这个二维码：

<img src="./apps/web/public/wechat-qr.jpg" alt="WeChat QR Code" width="240" />

二维码原图路径：

- [apps/web/public/wechat-qr.jpg](/Users/jun/Desktop/Code/skill/md2wechat/apps/web/public/wechat-qr.jpg)

## 当前状态

已完成：

- Markdown -> 微信兼容 HTML
- 网站预览与富文本复制
- `?theme=` 选主题
- 主题实验室本地保存、导入、导出
- CDP 驱动公众号后台草稿流程

仍需持续打磨：

- 微信后台选择器稳定性
- 封面上传兼容性
- 原创声明流程在不同账号 / 不同 UI 版本下的鲁棒性

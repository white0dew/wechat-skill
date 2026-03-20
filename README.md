# md2wechat

把 Markdown 转成更适合微信公众号的内容，并支持通过 Chrome CDP 直接驱动网站与公众号后台，完成富文本复制、粘贴、填写元数据、保存草稿。

如果你是给 AI / agent 用，这个仓库最重要的不是本地开发，而是：

1. 先安装 `skill/post-to-wechat`
2. 默认直接访问线上站点 `https://wechat.reshub.vip`
3. 不要默认本地启动 web 服务器，除非用户明确要求本地开发或调试

## 先安装 Skill

仓库内置 skill：

```text
skill/post-to-wechat
```

安装到 Codex 的推荐方式：

```bash
mkdir -p ~/.codex/skills
ln -s "$(pwd)/skill/post-to-wechat" ~/.codex/skills/post-to-wechat
```

安装后重启 Codex。

Skill 入口说明见：

- [skill/post-to-wechat/SKILL.md](/Users/jun/Desktop/Code/skill/md2wechat/skill/post-to-wechat/SKILL.md)

这个 skill 明确了：

- 什么时候只做 Markdown -> HTML
- 什么时候走 CDP 自动化
- 默认走“复制富文本”按钮
- 默认保存草稿、默认标记原创
- 什么时候该访问线上站点，什么时候才需要本地起服务

## AI 使用约定

- 默认站点：`https://wechat.reshub.vip`
- 默认不要执行 `npm run dev`
- 只有在用户明确要求“本地开发 / 调试 / 修改前端页面并本地验证”时，才启动本地服务

对 agent 来说，优先使用这条路径：

```text
Markdown -> https://wechat.reshub.vip -> 复制富文本 -> 微信公众号后台
```

## 最常用的方式

### 1. 直接访问线上站点

站点地址：

```text
https://wechat.reshub.vip
```

支持：

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
https://wechat.reshub.vip/?theme=default
https://wechat.reshub.vip/?theme=minimal
```

### 2. 用 CDP 自动完成网站到公众号后台

`skill/post-to-wechat/scripts/cdp_export.ts` 可以：

- 打开 md2wechat 网站
- 写入 Markdown
- 点击“复制富文本”
- 打开微信公众号后台
- 粘贴正文
- 填写标题 / 作者 / 摘要 / 封面
- 标记原创
- 保存草稿

只复制富文本：

```bash
node skill/post-to-wechat/scripts/cdp_export.ts \
  --markdown-file test.md \
  --app https://wechat.reshub.vip \
  --cdp http://127.0.0.1:9222 \
  --action copy-rich
```

复制并进入公众号后台保存草稿：

```bash
node skill/post-to-wechat/scripts/cdp_export.ts \
  --markdown-file test.md \
  --app "https://wechat.reshub.vip/?theme=default" \
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

默认行为：

- 默认优先点击网站上的“复制富文本”按钮，而不是直接框选预览区
- 默认开启原创声明
- 默认保存草稿

## 项目结构

```text
.
├── apps/
│   └── web/                 # Next.js 网站
├── packages/
│   ├── core/                # Markdown -> WeChat HTML 核心渲染
│   └── cli/                 # CLI
├── skill/
│   └── post-to-wechat/      # Codex skill，含 CDP 自动化脚本
└── docs/
    └── wechat-compatibility.md
```

## 本地开发

只有在需要修改网站或调试本地行为时，才需要本地启动。

安装依赖：

```bash
npm install
```

启动网站：

```bash
npm run dev
```

默认本地地址：

```text
http://127.0.0.1:3000
```

构建全部包：

```bash
npm run build
```

运行测试：

```bash
npm run test
```

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

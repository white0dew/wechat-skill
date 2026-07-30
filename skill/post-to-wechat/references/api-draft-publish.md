# API 草稿发布：HTML-only

此路径只接收**已经排版完成**的微信公众号兼容 HTML，并通过公众号 API 保存为普通草稿。它不做 Markdown 转 HTML、不选择主题、不预览、不群发，也不声明原创。

## 输入契约

调用 `scripts/publish_draft.mjs` 前，准备：

- 非空 HTML 文件：`--html article.html`。
- 元素级内联 `style="..."`。微信公众号会移除或忽略 `<style>` 块、脚本、CSS class/id 和部分浏览器专有布局。
- 标题：优先传 `--title`；未传时可从 HTML 的 `<title>` 或 `<h1>` 提取。
- 封面：普通 `news` 草稿建议显式传 `--cover`。
- 正文图片：使用发布机器可读取的本地路径，或可公开获取的绝对 `http/https` URL。

HTML 应由 `gzh-design`、Web 编辑器或其他前序排版器生成。本脚本不会改写文章的版式结构，只在发布时上传图片并将正文图片 URL 替换为微信素材 URL。

## 凭据

凭据解析顺序：

1. 进程环境变量 `WECHAT_APP_ID` 与 `WECHAT_APP_SECRET`。
2. 对缺失值，读取本 Skill 的 `.baoyu-skills/.env`。

初始化本地文件：

```bash
cp skill/post-to-wechat/.baoyu-skills/.env.example \
  skill/post-to-wechat/.baoyu-skills/.env
```

真实 `.env` 不能提交到 Git。

## 安装最小运行时

```bash
cd skill/post-to-wechat/scripts/vendor/baoyu-post-to-wechat/scripts
npm install
```

只安装 `jimp` 与 `@jsquash/webp`，用于处理微信素材上传的图片格式。

## 命令

先做无网络验证：

```bash
node skill/post-to-wechat/scripts/publish_draft.mjs \
  --html article.html \
  --title "文章标题" \
  --author "作者" \
  --summary "文章摘要" \
  --cover "cover.png" \
  --dry-run
```

创建非原创草稿时删除 `--dry-run`：

```bash
node skill/post-to-wechat/scripts/publish_draft.mjs \
  --html article.html \
  --title "文章标题" \
  --author "作者" \
  --summary "文章摘要" \
  --cover "cover.png"
```

可选参数：

- `--account <alias>`：选择多账号配置。
- `--article-type news|newspic`：默认 `news`。
- `--need-open-comment 0|1`：评论开关。
- `--only-fans-can-comment 0|1`：限制仅粉丝评论。

## 微信素材语义

- 正文图片调用图片上传接口，并将 HTML 中的对应 URL 替换为微信托管 URL。
- 封面调用永久素材接口，并以返回的 `thumb_media_id` 创建草稿。
- `40113 unsupported file type` 常见于封面扩展名或图片格式不被接受。使用扩展名与实际格式一致的 `.jpg` 或 `.png` 文件后重试。
- `40164 invalid ip` 表示当前出口 IP 未加入公众号 API 白名单。先将该出口 IP 加入白名单，再重试。

## 原创声明

API 草稿的 `media_id` 只表示普通草稿创建成功，**不代表原创声明成功**。需要原创时，必须在登录的微信公众号后台完成原创声明 UI 后再保存草稿；不要以本 API 路径替代该步骤。

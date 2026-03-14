# md-to-wechat

将 Markdown 转成更适合粘贴进微信公众号后台、并且还能继续编辑的内联样式 HTML。

## 何时使用

- 用户要求把一段 Markdown 或 `.md` 文件转成微信公众号可用 HTML
- 用户希望切换排版主题后导出 HTML
- 用户希望先在本地预览，再复制到公众号后台

## 输入

- 一段 Markdown 文本
- 或一个 `.md` 文件路径
- 可选主题：`default`、`minimal`

## 输出

- 一份微信兼容 HTML
- 可选输出到指定文件

## 调用方式

优先使用 CLI：

```bash
npm run build --workspace @md2wechat/core
npm run build --workspace @md2wechat/cli
node packages/cli/dist/cli.js article.md --theme minimal --out wechat.html
```

也支持 stdin：

```bash
echo '# 标题' | node packages/cli/dist/cli.js --theme default
```

也支持通过 CDP 自动把远程网页正文写进当前 Web App，再触发复制或导出：

```bash
node skills/md-to-wechat/scripts/cdp_export.mjs \
  --source "https://example.com/article" \
  --app "http://127.0.0.1:4173/#/" \
  --cdp "http://127.0.0.1:9222" \
  --selector "article" \
  --action export-html
```

如果本地还没启动带 CDP 的 Chrome，也可以让脚本直接拉起本地浏览器：

```bash
node skills/md-to-wechat/scripts/cdp_export.mjs \
  --launch-local \
  --source "https://example.com/article" \
  --selector "article" \
  --action copy-rich
```

## 注意事项

- Web Demo、CLI 和后续后端都必须走同一个 `@md2wechat/core`
- 当前图片仍以外链占位，不包含素材上传
- 若用户要求新增普通主题，优先新增 theme token，不要复制渲染逻辑
- `cdp_export.mjs` 适合把网页正文抽取后写进当前 Web App，再触发 `复制富文本` 或 `导出 HTML`
- 对复杂站点建议显式传 `--selector`，不要默认依赖整页 `document.body.innerText`

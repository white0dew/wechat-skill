# WeChat Compatibility

本文档定义 `md2wechat` 的“微信公众号兼容白名单策略”。

目标不是生成浏览器意义上的任意 HTML，而是生成足够稳定、可被微信公众号编辑器和草稿接口接受的 HTML 子集。

## 适用范围

- 前端预览后复制到公众号编辑器
- 后端通过草稿接口提交 `articles[].content`
- 主题扩展和 block override

## 官方明确约束

以下规则来自微信官方文档，属于硬约束：

- 草稿接口的 `articles[].content` 是 HTML 内容，不是富文本剪贴板数据。
- 微信会去除 `content` 中的 JS，不允许依赖脚本能力。
- 正文中的图片 URL 需要通过“上传图文消息内的图片获取 URL”接口处理后再写入正文。
- 该图片上传接口只接受 `jpg` / `png`，且图片大小小于 `1MB`。

参考：

- `Add draft`:
  `https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Add_draft.html`
- `media/uploadimg`:
  `https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=ACCESS_TOKEN`

说明：

- 微信官方公开文档没有给出一份可直接照搬的“完整标签/样式白名单表”。
- 因此本仓库采用“官方硬约束 + 工程保守白名单”的方式控制输出。

## 输出原则

- 只输出正文 HTML 片段，不输出 `<!doctype>`、`html`、`head`、`body`。
- 所有可视样式必须以内联 `style` 表达。
- 结构必须在删除自定义属性后仍然成立。
- 浏览器预览不是验收标准，公众号实际导入和草稿回显才是验收标准。

## 标签白名单

### Block 级标签

允许：

- `section`
- `h1` `h2` `h3` `h4` `h5` `h6`
- `p`
- `blockquote`
- `ul`
- `ol`
- `li`
- `pre`
- `code`
- `img`
- `hr`

说明：

- `section` 只作为轻量分组容器，不能承载业务语义。
- 如果某个容器被公众号清洗掉，内容本身仍然要可读。

### Inline 标签

允许：

- `strong`
- `em`
- `del`
- `a`
- `code`
- `br`

### 禁止输出的标签

禁止：

- `style`
- `script`
- `iframe`
- `video`
- `audio`
- `canvas`
- `svg`
- `form`
- `input`
- `button`
- `textarea`
- `select`
- `table`
- `thead`
- `tbody`
- `tr`
- `td`
- `th`

说明：

- Markdown 原生 HTML 片段不做透传；应转义或丢弃，不能原样注入正文。
- 当前 `core` 已按“转义 raw html”处理，这条规则必须保持。

## 属性白名单

允许：

- 通用：`style`
- `a`：`href`、`title`
- `img`：`src`、`alt`
- `ol`：`start`

禁止：

- `class`
- `id`
- 任意 `data-*`
- 任意事件属性，如 `onclick`、`onload`
- `target`
- `rel`
- `role`
- `aria-*`

说明：

- 最终正文不得依赖自定义属性承载状态或主题信息。
- 预览层需要的元信息，应停留在应用层 DOM，不进入导出 HTML。

## 样式属性白名单

当前主题系统允许使用以下内联样式属性：

- `color`
- `background-color`
- `font-family`
- `font-size`
- `font-weight`
- `font-style`
- `line-height`
- `letter-spacing`
- `text-align`
- `text-decoration`
- `text-transform`
- `margin`
- `margin-top`
- `padding`
- `padding-left`
- `border`
- `border-top`
- `border-left`
- `border-bottom`
- `border-radius`
- `max-width`
- `overflow-x`
- `opacity`

### 样式禁用项

禁止在主题或 override 中使用：

- `position`
- `top` `right` `bottom` `left`
- `display:flex`
- `display:grid`
- `float`
- `z-index`
- `transform`
- `filter`
- `backdrop-filter`
- `box-shadow`
- CSS 变量
- 选择器能力
- 伪类 / 伪元素
- 动画和过渡

说明：

- 这些能力即使在浏览器里可用，也不应进入公众号正文基线。
- 若未来验证出新的稳定属性，应先补本文档，再修改主题系统。

## 链接策略

- 默认只接受 `http` / `https` 链接。
- 不依赖 `target="_blank"`。
- 链接样式只控制颜色和装饰线，不做复杂交互。

## 图片策略

- 编辑器预览阶段可以先保留 HTTPS 外链，便于本地调试。
- 面向草稿接口提交前，正文图片必须替换为 `media/uploadimg` 返回的 URL。
- 图片格式收敛到 `jpg` / `png`。
- 单图大小控制在官方限制内，当前基线为 `< 1MB`。
- 正文布局只依赖 `img` 本身和外层轻量容器，不依赖复杂 figure 结构。

## 主题与 Override 规则

- 优先通过 token 调整颜色、字号、边框、间距。
- override 只允许重组兼容标签，不允许引入新标签族。
- override 不得新增白名单之外的属性和样式。
- 主题预览所需的辅助属性、调试标记、运行时状态，不能进入导出 HTML。

## 验收流程

每次调整渲染结构或主题能力时，至少做以下验证：

1. 本地预览确认结构未破坏。
2. 复制渲染后的富文本内容到公众号编辑器，确认不是源码显示。
3. 用草稿接口提交 `content`，确认回显后的结构和样式仍成立。
4. 抽查标题、引用、列表、代码块、图片、链接六类常见 block。

## 后续维护规则

- 本文档是兼容白名单的唯一基线。
- 若新增标签、属性或样式能力，必须先更新本文档。
- 若微信后台行为变化，以官方文档和实测结果为准，及时回收能力范围。

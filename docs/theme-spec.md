# Theme Spec

`@md2wechat/core` 的主题对象由两部分组成：

1. `styles`
2. `overrides`

主题输出还必须遵守微信公众号兼容白名单策略，见 [`wechat-compatibility.md`](./wechat-compatibility.md)。

## `styles`

`styles` 负责普通主题切换，包含：

- `container`
- `paragraph`
- `headings`
- `blockquote`
- `list`
- `codeBlock`
- `inlineCode`
- `link`
- `strong`
- `emphasis`
- `delete`
- `image`
- `thematicBreak`

所有字段都输出为内联样式，面向微信公众号兼容环境。

新增样式字段前，先确认它属于兼容白名单；不要把浏览器专用布局能力直接放进主题 token。

## `overrides`

`overrides` 只用于少量结构级定制，例如：

- 给某个标题层级加胶囊样式
- 把引用块改成卡片
- 调整图片说明的 HTML 结构

普通主题切换优先改 token；只有出现结构差异时才添加 override。

override 也不能突破兼容白名单：允许重组兼容结构，不允许引入新的不兼容标签、属性或样式能力。

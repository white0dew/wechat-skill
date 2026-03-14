export const examples: Array<{
  id: string;
  label: string;
  markdown: string;
}> = [
  {
    id: "strategy",
    label: "产品说明",
    markdown: `# 用 Markdown 写公众号，为什么这次要先做 Core

如果只是一次性脚本，第一版当然很快。但只要你想切主题、做实时预览、接 CLI，结构就必须先稳定下来。

## MVP 目标

- 一套 Markdown 输入
- 两套主题
- 一个统一渲染内核

> Web Demo、CLI 和后续的发布适配层，应该消费同一份 block 结构。

### 这次支持什么

1. 标题、段落与分隔线
2. **粗体**、*斜体*、~~删除线~~、[链接](https://developers.weixin.qq.com/)
3. 列表、引用、图片与代码块

---

\`\`\`ts
export function renderMarkdownToWechat(markdown: string) {
  return markdown;
}
\`\`\`

![设计草图](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80)
`
  },
  {
    id: "ops",
    label: "运营周报",
    markdown: `# 运营周报

本周重点围绕内容生产效率展开，结论非常明确：先统一格式，再谈自动发布。

## 数据摘要

1. 新增主题样式：2 套
2. 已验证的 Markdown 文章：6 篇
3. 需要在第二阶段处理的能力：图片上传、草稿发布

> 同一篇内容如果在预览站、CLI 和发布端输出不一致，后面的所有自动化都没有意义。

### 风险提示

- 表格暂不做高保真
- 图片仍使用外链占位
- 公众号后台兼容性还需要真机验证
`
  },
  {
    id: "deep-dive",
    label: "技术长文",
    markdown: `# 从 Markdown 到公众号 HTML，这一层抽象为什么不能省

很多团队一开始都会觉得：先做个正则替换脚本，把标题、段落、引用拼起来，不就够了吗？

但实际走到第二套主题，问题就会集中爆发：

- Web 预览和实际导出不是一套逻辑
- 一改样式就要改渲染代码
- 列表、引用、代码块的表现开始互相影响

## 什么时候必须引入 Core

当你要同时满足下面三件事时，就不能再把逻辑散落在页面里：

1. 支持多主题切换
2. 需要 CLI 或 Skill 批量调用
3. 后续还想接草稿发布能力

> 最危险的方案不是“做得慢”，而是“先做快版本，后面再推倒重来”。

### 兼容性要点

1. 输出以内联样式为主
2. 结构尽量保守，避免过深嵌套
3. 图片先保留占位 URL，上传适配放在 Core 之外

### 真实内容通常还会包含

- 多段长文本
- [外链引用](https://developers.weixin.qq.com/)
- \`inline code\`
- 多个二三级标题交替出现

---

\`\`\`ts
type RenderResult = {
  html: string;
  meta: {
    title?: string;
    excerpt?: string;
  };
};
\`\`\`

![系统结构示意](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80)
`
  }
];

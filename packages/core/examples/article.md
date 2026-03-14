# 用 Markdown 写公众号，为什么还要做 Core

如果这个项目只是一次性脚本，第一版确实会很快。但只要你想切第二套主题，或者把同一套规则复用到网站预览和 CLI，结构就必须先稳定下来。

## 这次 MVP 要解决什么

- 一套 Markdown 输入
- 两套主题切换
- 一个共享的渲染内核

> Web Demo、CLI 和后续的发布适配层，都应该消费同一份 block 结构与渲染规则。

### 支持的语法

1. 标题与段落
2. **粗体**、*斜体*、~~删除线~~
3. [链接](https://developers.weixin.qq.com/)
4. `inline code` 与代码块

---

```ts
export function greet(name: string) {
  return `hello, ${name}`;
}
```

![示意图](https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80)

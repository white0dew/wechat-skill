import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  listThemes,
  renderMarkdownToWechat,
  resolveTheme
} from "../src";

const themeIds = [
  "moyu-green",
  "red-white",
  "graphite-minimal",
  "zen-whitespace",
  "moyu-ticket",
  "olive-journal"
] as const;

const exampleMarkdown = readFileSync(
  resolve(import.meta.dirname, "../examples/article.md"),
  "utf8"
);

describe("renderMarkdownToWechat", () => {
  it("renders core markdown features into wechat-safe html", () => {
    const result = renderMarkdownToWechat(exampleMarkdown, {
      theme: "moyu-green"
    });

    expect(result.meta.title).toBe("用 Markdown 写公众号，为什么还要做 Core");
    expect(result.html).toContain("<h1");
    expect(result.html).toContain("<blockquote");
    expect(result.html).toContain("<pre");
    expect(result.html).toContain("<img");
    expect(result.blocks.some((block) => block.type === "list")).toBe(true);
  });

  it("exposes only the registered gzh-design themes in index order", () => {
    expect(listThemes().map((theme) => theme.name)).toEqual(themeIds);
  });

  it("defaults unknown and missing theme ids to moyu-green", () => {
    expect(resolveTheme().name).toBe("moyu-green");
    expect(resolveTheme("unknown-theme").name).toBe("moyu-green");
  });

  it.each(themeIds)("resolves %s to itself", (themeId) => {
    expect(resolveTheme(themeId).name).toBe(themeId);
  });

  it("switches theme without changing block structure", () => {
    const greenResult = renderMarkdownToWechat(exampleMarkdown, {
      theme: "moyu-green"
    });
    const graphiteResult = renderMarkdownToWechat(exampleMarkdown, {
      theme: "graphite-minimal"
    });

    expect(greenResult.blocks).toEqual(graphiteResult.blocks);
    expect(greenResult.html).not.toEqual(graphiteResult.html);
    expect(graphiteResult.html).toContain("<section style=");
    expect(graphiteResult.html).not.toContain("data-wechat-theme=");
  });

  it("inlines gzh-design styles across rendered markdown elements", () => {
    const markdown = `# 标题

> 引用

**重点**、*强调*、~~删除~~、\`inline\` 和 [链接](https://example.com)

- 列表

\`\`\`ts
const value = true;
\`\`\`

![配图](https://example.com/image.png)

---`;
    const result = renderMarkdownToWechat(markdown, { theme: "moyu-green" });

    expect(result.html).toContain("background-color:#FFFFFF");
    expect(result.html).toContain("border-bottom:3px solid #059669");
    expect(result.html).toContain("border-left:4px solid #059669");
    expect(result.html).toContain("background-color:#111827");
    expect(result.html).toContain("background-color:#F3F4F6;color:#1F2937");
    expect(result.html).toContain("color:#059669;text-decoration:none");
    expect(result.html).toContain("border:1px solid #BBF7D0");
    expect(result.html).toContain("<strong style=\"color:#059669");
    expect(result.html).toContain("<ul style=");
    expect(result.html).toContain("<hr style=");
  });

  it("drops non-article mp.weixin.qq.com links", () => {
    const result = renderMarkdownToWechat(
      "[微信首页](https://mp.weixin.qq.com/) 和 [普通外链](https://example.com/)"
    );

    expect(result.html).not.toContain('href="https://mp.weixin.qq.com/"');
    expect(result.html).toContain('href="https://example.com/"');
    expect(result.html).toContain("微信首页");
    expect(result.html).not.toContain(">微信首页</a>");
  });

  it("keeps article links on mp.weixin.qq.com", () => {
    const result = renderMarkdownToWechat(
      "[图文链接](https://mp.weixin.qq.com/s?__biz=MzA3MDAxMjA0Mw==&mid=2650000000&idx=1&sn=abcdef)"
    );

    expect(result.html).toContain(
      'href="https://mp.weixin.qq.com/s?__biz=MzA3MDAxMjA0Mw==&amp;mid=2650000000&amp;idx=1&amp;sn=abcdef"'
    );
  });

  it("renders single newlines inside a paragraph as hard breaks", () => {
    const result = renderMarkdownToWechat("1\n2\n3\n4");

    expect(result.blocks).toMatchObject([
      {
        type: "paragraph",
        text: "1\n2\n3\n4",
        children: [
          { type: "text", value: "1" },
          { type: "break" },
          { type: "text", value: "2" },
          { type: "break" },
          { type: "text", value: "3" },
          { type: "break" },
          { type: "text", value: "4" }
        ]
      }
    ]);
    expect(result.html).toContain("1<br />2<br />3<br />4");
  });

  it("keeps images as standalone blocks even without blank lines around them", () => {
    const result = renderMarkdownToWechat(
      "前文\n![设计草图](https://example.com/image.png)\n后文"
    );

    expect(result.blocks).toMatchObject([
      { type: "paragraph", text: "前文" },
      {
        type: "image",
        src: "https://example.com/image.png",
        alt: "设计草图"
      },
      { type: "paragraph", text: "后文" }
    ]);
    expect(result.html).toContain('<img src="https://example.com/image.png"');
    expect(result.html).toContain(">前文</p>");
    expect(result.html).toContain(">后文</p>");
  });
});

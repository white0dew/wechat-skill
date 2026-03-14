import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderMarkdownToWechat } from "../src";

const exampleMarkdown = readFileSync(
  resolve(import.meta.dirname, "../examples/article.md"),
  "utf8"
);

describe("renderMarkdownToWechat", () => {
  it("renders core markdown features into wechat-safe html", () => {
    const result = renderMarkdownToWechat(exampleMarkdown, {
      theme: "default"
    });

    expect(result.meta.title).toBe("用 Markdown 写公众号，为什么还要做 Core");
    expect(result.html).toContain("<h1");
    expect(result.html).toContain("<blockquote");
    expect(result.html).toContain("<pre");
    expect(result.html).toContain("<img");
    expect(result.blocks.some((block) => block.type === "list")).toBe(true);
  });

  it("switches theme without changing block structure", () => {
    const defaultResult = renderMarkdownToWechat(exampleMarkdown, {
      theme: "default"
    });
    const minimalResult = renderMarkdownToWechat(exampleMarkdown, {
      theme: "minimal"
    });

    expect(defaultResult.blocks).toEqual(minimalResult.blocks);
    expect(defaultResult.html).not.toEqual(minimalResult.html);
    expect(minimalResult.html).toContain("<section style=");
    expect(minimalResult.html).not.toContain("data-wechat-theme=");
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
});

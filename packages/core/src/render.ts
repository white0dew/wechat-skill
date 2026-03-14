import type {
  Block,
  BlockRenderer,
  InlineNode,
  RenderContext,
  StyleMap,
  Theme
} from "./types";

type RendererMap = {
  [K in Block["type"]]: BlockRenderer<K>;
};

const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:"]);
const WECHAT_ARTICLE_PATHS = new Set(["/s", "/mp/appmsg/show"]);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toKebabCase(input: string): string {
  return input.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function styleToString(style: StyleMap): string {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${toKebabCase(key)}:${String(value)}`)
    .join(";");
}

function inlineToText(nodes: InlineNode[]): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
        case "inline_code":
          return node.value;
        case "break":
          return "\n";
        case "strong":
        case "emphasis":
        case "delete":
        case "link":
          return inlineToText(node.children);
      }
    })
    .join("");
}

function sanitizeLinkUrl(rawUrl: string): string | null {
  if (!rawUrl.trim()) {
    return null;
  }

  try {
    const url = new URL(rawUrl);

    if (!SAFE_LINK_PROTOCOLS.has(url.protocol)) {
      return null;
    }

    if (url.hostname === "mp.weixin.qq.com") {
      if (!WECHAT_ARTICLE_PATHS.has(url.pathname)) {
        return null;
      }

      if (url.pathname === "/s" && !url.searchParams.has("__biz")) {
        return null;
      }
    }

    return url.toString();
  } catch {
    return null;
  }
}

function renderInline(nodes: InlineNode[], theme: Theme): string {
  return nodes
    .map((node) => {
      switch (node.type) {
        case "text":
          return escapeHtml(node.value);
        case "break":
          return "<br />";
        case "inline_code":
          return `<code style="${styleToString(theme.styles.inlineCode)}">${escapeHtml(
            node.value
          )}</code>`;
        case "strong":
          return `<strong style="${styleToString(
            theme.styles.strong
          )}">${renderInline(node.children, theme)}</strong>`;
        case "emphasis":
          return `<em style="${styleToString(
            theme.styles.emphasis
          )}">${renderInline(node.children, theme)}</em>`;
        case "delete":
          return `<del style="${styleToString(
            theme.styles.delete
          )}">${renderInline(node.children, theme)}</del>`;
        case "link": {
          const sanitizedUrl = sanitizeLinkUrl(node.url);
          if (!sanitizedUrl) {
            return renderInline(node.children, theme);
          }

          const title = node.title
            ? ` title="${escapeHtml(node.title)}"`
            : "";
          return `<a href="${escapeHtml(sanitizedUrl)}"${title} style="${styleToString(
            theme.styles.link
          )}">${renderInline(node.children, theme)}</a>`;
        }
      }
    })
    .join("");
}

function defaultRenderers(theme: Theme): RendererMap {
  return {
    heading: ((block: Extract<Block, { type: "heading" }>, context) => {
      const tag = `h${block.level}`;
      const headingStyle = context.styleToString(
        theme.styles.headings[block.level]
      );
      return `<section><${tag} style="${headingStyle}">${context.renderInline(
        block.children
      )}</${tag}></section>`;
    }) as BlockRenderer<"heading">,
    paragraph: ((block: Extract<Block, { type: "paragraph" }>, context) =>
      `<section><p style="${context.styleToString(
        theme.styles.paragraph
      )}">${context.renderInline(block.children)}</p></section>`) as BlockRenderer<"paragraph">,
    blockquote: ((block: Extract<Block, { type: "blockquote" }>, context) => {
      const rendered = block.children
        .map((child) => {
          if (child.type === "paragraph") {
            return `<p style="${context.styleToString(
              theme.styles.blockquote.paragraph
            )}">${context.renderInline(child.children)}</p>`;
          }
          return context.renderBlocks([child]);
        })
        .join("");

      return `<section><blockquote style="${context.styleToString(
        theme.styles.blockquote.container
      )}">${rendered}</blockquote></section>`;
    }) as BlockRenderer<"blockquote">,
    list: ((block: Extract<Block, { type: "list" }>, context) => {
      const tag = block.ordered ? "ol" : "ul";
      const start =
        block.ordered && block.start && block.start > 1
          ? ` start="${block.start}"`
          : "";
      const items = block.items
        .map(
          (item) =>
            `<li style="${context.styleToString(
              theme.styles.list.item
            )}">${item.children
              .map((child) => {
                if (child.type === "paragraph") {
                  return context.renderInline(child.children);
                }
                return context.renderBlocks([child]);
              })
              .join("")}</li>`
        )
        .join("");

      return `<section><${tag}${start} style="${context.styleToString(
        theme.styles.list.container
      )}">${items}</${tag}></section>`;
    }) as BlockRenderer<"list">,
    list_item: (() => "") as BlockRenderer<"list_item">,
    code_block: ((block: Extract<Block, { type: "code_block" }>, context) => {
      const code = context.escapeHtml(block.code);
      const language = block.language
        ? `<div style="margin-bottom:8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.72;">${context.escapeHtml(
            block.language
          )}</div>`
        : "";
      return `<section><pre style="${context.styleToString(
        theme.styles.codeBlock.pre
      )}">${language}<code style="${context.styleToString(
        theme.styles.codeBlock.code
      )}">${code}</code></pre></section>`;
    }) as BlockRenderer<"code_block">,
    image: ((block: Extract<Block, { type: "image" }>, context) => {
      const alt = block.alt ?? "";
      const caption = alt
        ? `<p style="${context.styleToString(
            theme.styles.image.caption
          )}">${context.escapeHtml(alt)}</p>`
        : "";
      return `<section style="${context.styleToString(
        theme.styles.image.wrapper
      )}"><img src="${context.escapeHtml(block.src)}" alt="${context.escapeHtml(
        alt
      )}" style="${context.styleToString(theme.styles.image.image)}" />${caption}</section>`;
    }) as BlockRenderer<"image">,
    thematic_break: ((_block: Extract<Block, { type: "thematic_break" }>, context) =>
      `<section><hr style="${context.styleToString(
        theme.styles.thematicBreak
      )}" /></section>`) as BlockRenderer<"thematic_break">,
    html: ((block: Extract<Block, { type: "html" }>, context) =>
      `<section><div>${context.escapeHtml(block.value)}</div></section>`) as BlockRenderer<"html">
  };
}

export function renderBlocks(blocks: Block[], theme: Theme): string {
  const context: RenderContext = {
    theme,
    escapeHtml,
    styleToString,
    inlineToText,
    renderInline: (nodes) => renderInline(nodes, theme),
    renderBlocks: (nextBlocks) => renderBlocks(nextBlocks, theme)
  };

  const baseRenderers = defaultRenderers(theme);

  const inner = blocks
    .map((block) => {
      const override = theme.overrides?.[block.type] as BlockRenderer | undefined;
      const rendered = override?.(block as never, context);
      if (rendered) {
        return rendered;
      }

      return baseRenderers[block.type](block as never, context);
    })
    .join("");

  return `<section style="${styleToString(theme.styles.container)}">${inner}</section>`;
}

import type {
  Block,
  InlineNode,
  ListItemBlock,
  ParagraphBlock
} from "./types";
import type { MarkdownNode, MarkdownRoot } from "./parse";

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

function normalizeInline(node: MarkdownNode): InlineNode[] {
  switch (node.type) {
    case "text":
      return [{ type: "text", value: node.value ?? "" }];
    case "strong":
      return [{ type: "strong", children: normalizeInlineChildren(node) }];
    case "emphasis":
      return [{ type: "emphasis", children: normalizeInlineChildren(node) }];
    case "delete":
      return [{ type: "delete", children: normalizeInlineChildren(node) }];
    case "inlineCode":
      return [{ type: "inline_code", value: node.value ?? "" }];
    case "link":
      return [
        {
          type: "link",
          url: node.url ?? "",
          title: node.title ?? undefined,
          children: normalizeInlineChildren(node)
        }
      ];
    case "break":
      return [{ type: "break" }];
    case "image":
      return [{ type: "text", value: node.alt ?? node.url ?? "" }];
    default:
      return normalizeInlineChildren(node);
  }
}

function normalizeInlineChildren(node: MarkdownNode): InlineNode[] {
  return (node.children ?? []).flatMap((child) => normalizeInline(child));
}

function ensureParagraph(children: Block[]): ParagraphBlock {
  const firstParagraph = children.find((block) => block.type === "paragraph");
  if (firstParagraph && firstParagraph.type === "paragraph") {
    return firstParagraph;
  }

  return {
    type: "paragraph",
    children: [{ type: "text", value: children.map(blockToText).join(" ") }],
    text: children.map(blockToText).join(" ")
  };
}

function blockToText(block: Block): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return block.text;
    case "code_block":
      return block.code;
    case "image":
      return block.alt ?? "";
    case "blockquote":
      return block.children.map(blockToText).join(" ");
    case "list":
      return block.items
        .map((item) => item.children.map(blockToText).join(" "))
        .join(" ");
    case "list_item":
      return block.children.map(blockToText).join(" ");
    case "html":
      return "";
    case "thematic_break":
      return "";
  }
}

function normalizeListItem(node: MarkdownNode): ListItemBlock {
  const blocks = (node.children ?? []).flatMap((child) => normalizeBlock(child)).filter(Boolean) as Block[];

  return {
    type: "list_item",
    children: blocks.length > 0 ? blocks : [ensureParagraph([])]
  };
}

function normalizeBlock(node: MarkdownNode): Block[] {
  switch (node.type) {
    case "heading": {
      const children = normalizeInlineChildren(node);
      return [
        {
          type: "heading",
          level: (node.depth ?? 1) as 1 | 2 | 3 | 4 | 5 | 6,
          children,
          text: inlineToText(children).trim()
        }
      ];
    }
    case "paragraph": {
      if ((node.children ?? []).length === 1 && node.children?.[0]?.type === "image") {
        return normalizeBlock(node.children[0]);
      }

      const children = normalizeInlineChildren(node);
      return [
        {
          type: "paragraph",
          children,
          text: inlineToText(children).trim()
        }
      ];
    }
    case "blockquote":
      return [
        {
          type: "blockquote",
          children: (node.children ?? []).flatMap((child) => normalizeBlock(child))
        }
      ];
    case "list":
      return [
        {
          type: "list",
          ordered: Boolean(node.ordered),
          start: node.start ?? undefined,
          items: (node.children ?? []).map((child) => normalizeListItem(child))
        }
      ];
    case "code":
      return [
        {
          type: "code_block",
          language: node.lang ?? undefined,
          code: node.value ?? ""
        }
      ];
    case "image":
      return [
        {
          type: "image",
          src: node.url ?? "",
          alt: node.alt ?? undefined,
          title: node.title ?? undefined
        }
      ];
    case "thematicBreak":
      return [{ type: "thematic_break" }];
    case "html":
      return [{ type: "html", value: node.value ?? "" }];
    default:
      return (node.children ?? []).flatMap((child) => normalizeBlock(child));
  }
}

export function normalizeAst(ast: MarkdownRoot): Block[] {
  return ast.children.flatMap((child) => normalizeBlock(child));
}

export function extractMeta(blocks: Block[]) {
  const heading = blocks.find((block) => block.type === "heading");
  const paragraph = blocks.find((block) => block.type === "paragraph");

  return {
    title: heading && heading.type === "heading" ? heading.text : undefined,
    excerpt:
      paragraph && paragraph.type === "paragraph"
        ? paragraph.text.slice(0, 140)
        : undefined
  };
}

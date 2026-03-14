export type InlineNode =
  | { type: "text"; value: string }
  | { type: "strong"; children: InlineNode[] }
  | { type: "emphasis"; children: InlineNode[] }
  | { type: "delete"; children: InlineNode[] }
  | { type: "link"; url: string; title?: string; children: InlineNode[] }
  | { type: "inline_code"; value: string }
  | { type: "break" };

export type ListItemBlock = {
  type: "list_item";
  children: Block[];
};

export type HeadingBlock = {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: InlineNode[];
  text: string;
};

export type ParagraphBlock = {
  type: "paragraph";
  children: InlineNode[];
  text: string;
};

export type BlockquoteBlock = {
  type: "blockquote";
  children: Block[];
};

export type ListBlock = {
  type: "list";
  ordered: boolean;
  start?: number;
  items: ListItemBlock[];
};

export type CodeBlock = {
  type: "code_block";
  language?: string;
  code: string;
};

export type ImageBlock = {
  type: "image";
  src: string;
  alt?: string;
  title?: string;
};

export type ThematicBreakBlock = {
  type: "thematic_break";
};

export type HtmlBlock = {
  type: "html";
  value: string;
};

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | BlockquoteBlock
  | ListBlock
  | ListItemBlock
  | CodeBlock
  | ImageBlock
  | ThematicBreakBlock
  | HtmlBlock;

export type StyleMap = Record<string, string | number | undefined>;

export type ThemeStyles = {
  container: StyleMap;
  paragraph: StyleMap;
  headings: Record<1 | 2 | 3 | 4 | 5 | 6, StyleMap>;
  blockquote: {
    container: StyleMap;
    paragraph: StyleMap;
  };
  list: {
    container: StyleMap;
    item: StyleMap;
  };
  codeBlock: {
    pre: StyleMap;
    code: StyleMap;
  };
  inlineCode: StyleMap;
  link: StyleMap;
  strong: StyleMap;
  emphasis: StyleMap;
  delete: StyleMap;
  image: {
    wrapper: StyleMap;
    image: StyleMap;
    caption: StyleMap;
  };
  thematicBreak: StyleMap;
};

export type RenderContext = {
  renderBlocks: (blocks: Block[]) => string;
  renderInline: (nodes: InlineNode[]) => string;
  inlineToText: (nodes: InlineNode[]) => string;
  styleToString: (style: StyleMap) => string;
  escapeHtml: (value: string) => string;
  theme: Theme;
};

export type BlockRenderer<K extends Block["type"] = Block["type"]> = (
  block: Extract<Block, { type: K }>,
  context: RenderContext
) => string;

export type Theme = {
  name: string;
  label: string;
  summary: string;
  featured?: boolean;
  styles: ThemeStyles;
  overrides?: Partial<{
    [K in Block["type"]]: BlockRenderer<K>;
  }>;
};

export type RenderOptions = {
  theme?: Theme | string;
};

export type RenderMeta = {
  title?: string;
  excerpt?: string;
};

export type RenderResult = {
  html: string;
  blocks: Block[];
  meta: RenderMeta;
  theme: Theme;
};

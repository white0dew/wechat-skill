import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

export type MarkdownNode = {
  type: string;
  children?: MarkdownNode[];
  value?: string;
  depth?: number;
  url?: string;
  alt?: string;
  title?: string;
  lang?: string | null;
  ordered?: boolean;
  start?: number | null;
};

export type MarkdownRoot = MarkdownNode & {
  type: "root";
  children: MarkdownNode[];
};

export function parseMarkdown(markdown: string): MarkdownRoot {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown) as MarkdownRoot;
}

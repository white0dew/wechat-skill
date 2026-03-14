import { normalizeAst, extractMeta } from "./normalize";
import { parseMarkdown } from "./parse";
import { renderBlocks } from "./render";
import { listThemes, resolveTheme, themes } from "./themes";
import type { RenderOptions, RenderResult } from "./types";

export * from "./types";
export * from "./parse";
export * from "./normalize";
export * from "./render";
export * from "./themes";

export function renderMarkdownToWechat(
  markdown: string,
  options: RenderOptions = {}
): RenderResult {
  const ast = parseMarkdown(markdown);
  const blocks = normalizeAst(ast);
  const theme = resolveTheme(options.theme);
  const html = renderBlocks(blocks, theme);
  const meta = extractMeta(blocks);

  return {
    html,
    blocks,
    meta,
    theme
  };
}

export { listThemes, resolveTheme, themes };

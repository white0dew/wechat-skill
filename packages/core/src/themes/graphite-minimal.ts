import { createGzhTheme } from "./gzh-helpers";

export const graphiteMinimalTheme = createGzhTheme({
  name: "graphite-minimal",
  label: "石墨极简风",
  summary: "设计、科技评论、专业观点、高端品牌（极简克制、留白理性、全灰阶）",
  accent: "#52525B",
  accentSoft: "#FAFAFA",
  background: "#FFFFFF",
  text: "#52525B",
  heading: "#27272A",
  muted: "#A1A1AA",
  border: "#E4E4E7",
  bodyFontSize: "15px",
  lineHeight: 1.8,
  letterSpacing: "0.3px",
  container: { padding: "0 10px" },
  headings: {
    1: { fontWeight: 700, borderTop: "1px solid #E4E4E7", paddingTop: "20px" },
    2: { borderTop: "1px solid #E4E4E7", borderBottom: "1px solid #E4E4E7", padding: "12px 0" },
    3: { color: "#3F3F46", fontWeight: 600 }
  },
  blockquote: { container: { backgroundColor: "#FFFFFF", borderLeft: 0, borderTop: "1px solid #E4E4E7", borderBottom: "1px solid #E4E4E7", padding: "24px 8px" } },
  codeBlock: { pre: { backgroundColor: "#27272A", border: "1px solid #3F3F46", borderRadius: 0 } },
  inlineCode: { backgroundColor: "#F4F4F5", color: "#3F3F46", borderRadius: 0 },
  link: { color: "#27272A", borderBottom: "1px solid #52525B" },
  strong: { color: "#27272A" },
  emphasis: { color: "#3F3F46" },
  image: { image: { border: "1px solid #E4E4E7", borderRadius: 0 } },
  thematicBreak: { borderTop: "1px solid #52525B" }
});

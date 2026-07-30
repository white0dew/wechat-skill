import { createGzhTheme } from "./gzh-helpers";

export const moyuGreenTheme = createGzhTheme({
  name: "moyu-green",
  label: "摸鱼绿",
  summary: "教程、测评、清单、工具盘点（卡片丰富、信息密度高，默认推荐）",
  accent: "#059669",
  accentSoft: "#ECFDF5",
  background: "#FFFFFF",
  text: "#374151",
  heading: "#111827",
  muted: "#9CA3AF",
  border: "#BBF7D0",
  bodyFontSize: "14px",
  lineHeight: 1.9,
  letterSpacing: "0.5px",
  headings: {
    1: { fontWeight: 900, borderBottom: "3px solid #059669", paddingBottom: "10px" },
    2: { color: "#111827", borderLeft: "5px solid #059669", borderBottom: 0, padding: "6px 0 6px 14px" },
    3: { color: "#059669", backgroundColor: "#F0FDF4", padding: "8px 12px", borderRadius: "4px" }
  },
  blockquote: { container: { borderLeft: "4px solid #059669", borderRadius: "0 8px 8px 0" } },
  codeBlock: { pre: { backgroundColor: "#111827", border: "1px solid #34D399" } },
  inlineCode: { backgroundColor: "#F3F4F6", color: "#1F2937", fontWeight: 600 },
  strong: { color: "#059669" },
  emphasis: { color: "#111827", backgroundColor: "#FDE68A", padding: "0 3px" },
  image: { image: { border: "1px solid #BBF7D0", borderRadius: "10px" } },
  thematicBreak: { borderTop: "2px solid #A7F3D0" }
});

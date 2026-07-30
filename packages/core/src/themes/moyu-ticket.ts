import { createGzhTheme } from "./gzh-helpers";

export const moyuTicketTheme = createGzhTheme({
  name: "moyu-ticket",
  label: "摸鱼票据风",
  summary: "测评、工具对比、创意评测（票据/门票视觉隐喻，星级评分+编号+硬阴影卡片）",
  accent: "#059669",
  accentSoft: "#F0FDF4",
  background: "#fffef8",
  text: "#555555",
  heading: "#1a1a1a",
  muted: "#888888",
  border: "#1a1a1a",
  bodyFontSize: "14px",
  lineHeight: 1.9,
  letterSpacing: "0.5px",
  headings: {
    1: { fontWeight: 900, backgroundColor: "#059669", color: "#fffef8", padding: "12px 16px", border: "2px solid #1a1a1a", boxShadow: "4px 4px 0 #1a1a1a" },
    2: { color: "#1a1a1a", border: "2px solid #1a1a1a", borderBottom: "2px dashed #A7F3D0", padding: "12px 16px", boxShadow: "3px 3px 0 #1a1a1a" },
    3: { color: "#059669", borderLeft: "6px solid #059669", paddingLeft: "12px" }
  },
  blockquote: { container: { backgroundColor: "#fffef8", border: "2px solid #1a1a1a", borderLeft: "6px solid #059669", boxShadow: "3px 3px 0 #1a1a1a" } },
  list: { container: { borderLeft: "2px dashed #A7F3D0", paddingLeft: "28px" } },
  codeBlock: { pre: { backgroundColor: "#F3F4F6", color: "#1F2937", border: "2px solid #1a1a1a", boxShadow: "3px 3px 0 #1a1a1a" } },
  inlineCode: { backgroundColor: "#F3F4F6", color: "#1F2937", border: "1px solid #1a1a1a" },
  link: { color: "#059669", borderBottom: "2px dashed #A7F3D0" },
  strong: { color: "#059669", fontWeight: 800 },
  emphasis: { color: "#1a1a1a", backgroundColor: "#A7F3D0", padding: "0 3px" },
  image: { image: { border: "2px solid #1a1a1a", borderRadius: 0, boxShadow: "4px 4px 0 #1a1a1a" } },
  thematicBreak: { borderTop: "2px dashed #A7F3D0" }
});

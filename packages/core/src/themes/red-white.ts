import { createGzhTheme } from "./gzh-helpers";

export const redWhiteTheme = createGzhTheme({
  name: "red-white",
  label: "红白色系",
  summary: "深度分析、观点、力量感话题（经典编辑风，编号章节+引言卡+签名区，红色克制点睛）",
  accent: "#DC2626",
  accentSoft: "#FEF2F2",
  background: "#FFFFFF",
  text: "#374151",
  heading: "#1C1917",
  muted: "#9CA3AF",
  border: "#FECACA",
  bodyFontSize: "15px",
  lineHeight: 1.8,
  letterSpacing: "0.5px",
  container: { padding: "0 10px" },
  headings: {
    1: { fontWeight: 900, color: "#1C1917" },
    2: { color: "#1C1917", borderBottom: "2px solid #FECACA" },
    3: { color: "#991B1B", borderLeft: "4px solid #DC2626", paddingLeft: "12px" }
  },
  blockquote: { container: { backgroundColor: "#FEF2F2", borderLeft: "4px solid #DC2626", borderRadius: "6px" } },
  codeBlock: { pre: { backgroundColor: "#1C1917", border: "1px solid #DC2626" } },
  inlineCode: { backgroundColor: "#FEE2E2", color: "#991B1B" },
  emphasis: { color: "#991B1B", backgroundColor: "#FEF2F2", padding: "0 3px" },
  image: { image: { border: "1px solid #FECACA", borderRadius: "4px" } },
  thematicBreak: { borderTop: "2px solid #DC2626" }
});

import { createGzhTheme } from "./gzh-helpers";

export const oliveJournalTheme = createGzhTheme({
  name: "olive-journal",
  label: "橄榄手记",
  summary: "内刊手记、深度评测、案例复盘、系统性说明文档（编辑部内刊质感，分节形式多样，信息密度偏高）",
  accent: "#ed7b2f",
  accentSoft: "#eeefe9",
  background: "#fdfdf8",
  text: "#4d4f46",
  heading: "#23251d",
  muted: "#9ea096",
  border: "#bfc1b7",
  bodyFontSize: "14px",
  lineHeight: 1.9,
  letterSpacing: "0px",
  fontFamily: "'IBM Plex Sans', -apple-system, system-ui, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  container: { padding: "8px" },
  headings: {
    1: { fontWeight: 800, borderBottom: "3px solid #e5e7e0", paddingBottom: "10px" },
    2: { color: "#23251d", backgroundColor: "#eeefe9", borderLeft: "5px solid #1e1f23", borderBottom: 0, padding: "10px 14px", borderRadius: "6px" },
    3: { color: "#ed7b2f", borderBottom: "1px solid #bfc1b7", paddingBottom: "8px" }
  },
  blockquote: { container: { backgroundColor: "#eeefe9", borderLeft: "4px solid #ed7b2f", borderRadius: "6px" } },
  codeBlock: { pre: { backgroundColor: "#1e1f23", border: "1px solid #bfc1b7", borderRadius: "6px", color: "#fdfdf8" } },
  inlineCode: { backgroundColor: "#e5e7e0", color: "#23251d", borderRadius: "3px" },
  link: { color: "#ed7b2f", borderBottom: "1px solid #ed7b2f" },
  strong: { color: "#23251d", borderBottom: "2px solid #ed7b2f" },
  emphasis: { color: "#65675e", backgroundColor: "#eeefe9", padding: "0 3px" },
  image: { image: { border: "1px solid #bfc1b7", borderRadius: "6px" } },
  thematicBreak: { borderTop: "1px solid #bfc1b7" }
});

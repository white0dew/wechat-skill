import { createGzhTheme } from "./gzh-helpers";

const serifFont = "'Noto Serif SC', Georgia, 'Times New Roman', serif";

export const zenWhitespaceTheme = createGzhTheme({
  name: "zen-whitespace",
  label: "留白禅意风",
  summary: "禅意冥想、极简生活、深度随笔、艺术留白（呼吸感最强）",
  accent: "#4A5D52",
  accentSoft: "#EEF3F0",
  background: "#FFFFFF",
  text: "#525252",
  heading: "#2B2B2B",
  muted: "#A3A3A3",
  border: "#E8E8E8",
  bodyFontSize: "15px",
  lineHeight: 1.9,
  letterSpacing: "0.3px",
  headingFontFamily: serifFont,
  container: { padding: "0 16px" },
  paragraph: { marginBottom: "26px" },
  headings: {
    1: { fontFamily: serifFont, fontWeight: 600, textAlign: "center", margin: "48px 0 32px" },
    2: { fontFamily: serifFont, fontWeight: 600, borderBottom: "1px solid #E8E8E8", paddingBottom: "16px", marginTop: "64px" },
    3: { fontFamily: serifFont, color: "#4A5D52", fontWeight: 500, marginTop: "48px" }
  },
  blockquote: { container: { backgroundColor: "#FFFFFF", borderLeft: 0, borderTop: "1px solid #E8E8E8", borderBottom: "1px solid #E8E8E8", padding: "32px 20px", textAlign: "center" }, paragraph: { fontFamily: serifFont, color: "#2B2B2B" } },
  codeBlock: { pre: { backgroundColor: "#EEF3F0", border: "1px solid #E8E8E8", color: "#3D5046", borderRadius: 0 } },
  inlineCode: { backgroundColor: "#EEF3F0", color: "#3D5046", borderRadius: 2 },
  link: { color: "#4A5D52", borderBottom: "1px solid #B5C8BC" },
  strong: { color: "#3D5046", fontWeight: 600 },
  emphasis: { color: "#2B2B2B", fontFamily: serifFont },
  image: { wrapper: { margin: "40px 0" }, image: { border: "1px solid #E8E8E8", borderRadius: 0 } },
  thematicBreak: { margin: "56px 0", borderTop: "1px solid #E8E8E8" }
});

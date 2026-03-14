import type { Theme } from "../types";

export const defaultTheme: Theme = {
  name: "default",
  label: "Journal",
  summary: "偏公众号成稿的杂志感风格，适合专栏、方法论和品牌内容。",
  featured: true,
  styles: {
    container: {
      color: "#1f2937",
      fontFamily: "Source Han Serif SC, Noto Serif SC, Georgia, serif",
      fontSize: "16px",
      lineHeight: "1.85",
      backgroundColor: "#fffdf8"
    },
    paragraph: {
      margin: "0 0 18px",
      letterSpacing: "0.02em"
    },
    headings: {
      1: {
        fontSize: "30px",
        fontWeight: "700",
        lineHeight: "1.35",
        margin: "0 0 22px",
        color: "#111827"
      },
      2: {
        fontSize: "24px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "32px 0 16px",
        color: "#9f1239",
        borderBottom: "2px solid #fecdd3",
        paddingBottom: "8px"
      },
      3: {
        fontSize: "20px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "24px 0 14px",
        color: "#1f2937"
      },
      4: {
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "22px 0 12px",
        color: "#1f2937"
      },
      5: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "18px 0 10px",
        color: "#374151"
      },
      6: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "16px 0 8px",
        color: "#4b5563"
      }
    },
    blockquote: {
      container: {
        margin: "20px 0",
        padding: "14px 18px",
        backgroundColor: "#fff1f2",
        borderLeft: "4px solid #e11d48",
        color: "#4c0519"
      },
      paragraph: {
        margin: "0 0 10px"
      }
    },
    list: {
      container: {
        margin: "0 0 18px",
        paddingLeft: "24px"
      },
      item: {
        margin: "8px 0"
      }
    },
    codeBlock: {
      pre: {
        margin: "20px 0",
        padding: "16px 18px",
        backgroundColor: "#111827",
        borderRadius: "12px",
        overflowX: "auto"
      },
      code: {
        color: "#f9fafb",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "14px",
        lineHeight: "1.7"
      }
    },
    inlineCode: {
      backgroundColor: "#ffe4e6",
      color: "#9f1239",
      padding: "2px 6px",
      borderRadius: "6px",
      fontSize: "0.92em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#be123c",
      textDecoration: "underline"
    },
    strong: {
      color: "#111827",
      fontWeight: "700"
    },
    emphasis: {
      color: "#7c2d12"
    },
    delete: {
      color: "#6b7280"
    },
    image: {
      wrapper: {
        margin: "24px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "14px",
        border: "1px solid #fbcfe8"
      },
      caption: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#6b7280"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #fbcfe8",
      margin: "28px 0"
    }
  }
};

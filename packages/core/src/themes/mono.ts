import type { Theme } from "../types";

export const monoTheme: Theme = {
  name: "mono",
  label: "Mono",
  summary: "高对比黑白排版，适合公告、流程与规范文档。",
  featured: true,
  styles: {
    container: {
      color: "#0a0a0a",
      fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, sans-serif",
      fontSize: "16px",
      lineHeight: "1.75",
      backgroundColor: "#ffffff"
    },
    paragraph: {
      margin: "0 0 16px"
    },
    headings: {
      1: {
        fontSize: "32px",
        fontWeight: "700",
        lineHeight: "1.2",
        margin: "0 0 22px",
        color: "#0a0a0a",
        letterSpacing: "-0.02em",
        borderBottom: "3px solid #0a0a0a",
        paddingBottom: "8px"
      },
      2: {
        fontSize: "24px",
        fontWeight: "700",
        lineHeight: "1.35",
        margin: "28px 0 14px",
        color: "#ffffff",
        backgroundColor: "#0a0a0a",
        padding: "6px 10px",
        display: "inline-block"
      },
      3: {
        fontSize: "20px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "22px 0 12px",
        color: "#0a0a0a"
      },
      4: {
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "20px 0 10px",
        color: "#111827"
      },
      5: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "18px 0 8px",
        color: "#1f2937"
      },
      6: {
        fontSize: "15px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#374151"
      }
    },
    blockquote: {
      container: {
        margin: "20px 0",
        padding: "12px 16px",
        backgroundColor: "#f4f4f5",
        borderLeft: "4px solid #0a0a0a",
        color: "#0a0a0a"
      },
      paragraph: {
        margin: "0 0 10px"
      }
    },
    list: {
      container: {
        margin: "0 0 16px",
        paddingLeft: "22px"
      },
      item: {
        margin: "6px 0"
      }
    },
    codeBlock: {
      pre: {
        margin: "18px 0",
        padding: "16px",
        backgroundColor: "#0a0a0a",
        borderRadius: "10px",
        overflowX: "auto"
      },
      code: {
        color: "#f5f5f5",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "13px",
        lineHeight: "1.65"
      }
    },
    inlineCode: {
      backgroundColor: "#e5e7eb",
      color: "#111827",
      padding: "2px 6px",
      borderRadius: "6px",
      fontSize: "0.92em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#0a0a0a",
      textDecoration: "underline"
    },
    strong: {
      fontWeight: "700",
      color: "#0a0a0a"
    },
    emphasis: {
      color: "#111827"
    },
    delete: {
      color: "#6b7280"
    },
    image: {
      wrapper: {
        margin: "22px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "10px",
        border: "1px solid #111827"
      },
      caption: {
        marginTop: "8px",
        fontSize: "12px",
        color: "#374151",
        letterSpacing: "0.06em",
        textTransform: "uppercase"
      }
    },
    thematicBreak: {
      borderTop: "2px solid #0a0a0a",
      margin: "26px 0"
    }
  }
};

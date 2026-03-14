import type { Theme } from "../types";

export const minimalTheme: Theme = {
  name: "minimal",
  label: "Blueprint",
  summary: "更利落的蓝灰信息风格，适合报告、周报和产品说明。",
  featured: true,
  styles: {
    container: {
      color: "#0f172a",
      fontFamily: "IBM Plex Sans, Helvetica Neue, sans-serif",
      fontSize: "16px",
      lineHeight: "1.8",
      backgroundColor: "#f8fafc"
    },
    paragraph: {
      margin: "0 0 16px"
    },
    headings: {
      1: {
        fontSize: "28px",
        fontWeight: "700",
        lineHeight: "1.3",
        margin: "0 0 22px",
        color: "#020617",
        letterSpacing: "-0.02em",
        textTransform: "uppercase"
      },
      2: {
        fontSize: "22px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "30px 0 14px",
        color: "#0f172a"
      },
      3: {
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "24px 0 12px",
        color: "#1d4ed8"
      },
      4: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "20px 0 10px",
        color: "#1e293b"
      },
      5: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "18px 0 8px",
        color: "#334155"
      },
      6: {
        fontSize: "15px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#475569"
      }
    },
    blockquote: {
      container: {
        margin: "20px 0",
        padding: "14px 16px",
        backgroundColor: "#e0f2fe",
        borderRadius: "10px",
        color: "#0f172a"
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
        margin: "20px 0",
        padding: "16px",
        backgroundColor: "#e2e8f0",
        borderRadius: "10px",
        overflowX: "auto"
      },
      code: {
        color: "#0f172a",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "13px",
        lineHeight: "1.65"
      }
    },
    inlineCode: {
      backgroundColor: "#dbeafe",
      color: "#1d4ed8",
      padding: "2px 6px",
      borderRadius: "6px",
      fontSize: "0.92em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#1d4ed8",
      textDecoration: "underline"
    },
    strong: {
      fontWeight: "700",
      color: "#020617"
    },
    emphasis: {
      color: "#0f766e"
    },
    delete: {
      color: "#64748b"
    },
    image: {
      wrapper: {
        margin: "22px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "8px",
        border: "1px solid #cbd5e1"
      },
      caption: {
        marginTop: "8px",
        fontSize: "12px",
        color: "#475569",
        letterSpacing: "0.06em",
        textTransform: "uppercase"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #cbd5e1",
      margin: "26px 0"
    }
  },
  overrides: {
    heading: (block, context) => {
      if (block.level !== 2) {
        return "";
      }

      const style = context.styleToString({
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "999px",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        fontSize: "15px",
        fontWeight: "700",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        margin: "30px 0 14px"
      });

      return `<section><h2 style="${style}">${context.renderInline(
        block.children
      )}</h2></section>`;
    }
  }
};

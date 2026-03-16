import type { Theme } from "../types";

export const auroraTheme: Theme = {
  name: "aurora",
  label: "Aurora",
  summary: "清爽的青绿极光配色，适合科技、增长与清新风内容。",
  featured: true,
  styles: {
    container: {
      color: "#0f172a",
      fontFamily: "PingFang SC, Source Han Sans SC, -apple-system, sans-serif",
      fontSize: "16px",
      lineHeight: "1.85",
      backgroundColor: "#f1fbf9"
    },
    paragraph: {
      margin: "0 0 18px",
      letterSpacing: "0.01em"
    },
    headings: {
      1: {
        fontSize: "30px",
        fontWeight: "700",
        lineHeight: "1.35",
        margin: "0 0 22px",
        color: "#0f172a"
      },
      2: {
        fontSize: "24px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "32px 0 16px",
        color: "#0f766e",
        borderBottom: "2px solid #5eead4",
        paddingBottom: "8px"
      },
      3: {
        fontSize: "20px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "24px 0 14px",
        color: "#115e59"
      },
      4: {
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "22px 0 12px",
        color: "#0f172a"
      },
      5: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "18px 0 10px",
        color: "#334155"
      },
      6: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "16px 0 8px",
        color: "#475569"
      }
    },
    blockquote: {
      container: {
        margin: "20px 0",
        padding: "14px 18px",
        backgroundColor: "#ecfeff",
        borderLeft: "4px solid #06b6d4",
        color: "#0f172a"
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
        backgroundColor: "#0f172a",
        borderRadius: "12px",
        overflowX: "auto",
        border: "1px solid #5eead4"
      },
      code: {
        color: "#e2e8f0",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "14px",
        lineHeight: "1.7"
      }
    },
    inlineCode: {
      backgroundColor: "#ccfbf1",
      color: "#0f766e",
      padding: "2px 6px",
      borderRadius: "6px",
      fontSize: "0.92em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#0e7490",
      textDecoration: "underline"
    },
    strong: {
      color: "#0f172a",
      fontWeight: "700"
    },
    emphasis: {
      color: "#0f766e"
    },
    delete: {
      color: "#64748b"
    },
    image: {
      wrapper: {
        margin: "24px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "14px",
        border: "1px solid #5eead4"
      },
      caption: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#64748b"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #99f6e4",
      margin: "28px 0"
    }
  }
};

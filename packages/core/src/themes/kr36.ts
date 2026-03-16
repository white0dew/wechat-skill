import type { Theme } from "../types";

export const kr36Theme: Theme = {
  name: "kr36",
  label: "36Kr",
  summary: "灵感来自 36Kr 的科技创业报道风格，清爽、理性、信息密度高。",
  featured: true,
  styles: {
    container: {
      color: "#0f172a",
      fontFamily: "Manrope, HarmonyOS Sans SC, -apple-system, sans-serif",
      fontSize: "16px",
      lineHeight: "1.8",
      backgroundColor: "#f8fafc"
    },
    paragraph: {
      margin: "0 0 16px",
      letterSpacing: "0.01em"
    },
    headings: {
      1: {
        fontSize: "30px",
        fontWeight: "700",
        lineHeight: "1.3",
        margin: "0 0 22px",
        color: "#0f172a"
      },
      2: {
        fontSize: "23px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "30px 0 14px",
        color: "#1d4ed8",
        borderBottom: "2px solid #bfdbfe",
        paddingBottom: "8px"
      },
      3: {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "24px 0 12px",
        color: "#2563eb"
      },
      4: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "20px 0 10px",
        color: "#0f172a"
      },
      5: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "18px 0 8px",
        color: "#1e293b"
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
        margin: "18px 0",
        padding: "12px 16px",
        backgroundColor: "#e0f2fe",
        borderLeft: "4px solid #38bdf8",
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
        margin: "18px 0",
        padding: "16px",
        backgroundColor: "#0f172a",
        borderRadius: "10px",
        overflowX: "auto",
        border: "1px solid #38bdf8"
      },
      code: {
        color: "#e2e8f0",
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
      color: "#2563eb",
      textDecoration: "underline"
    },
    strong: {
      fontWeight: "700",
      color: "#0f172a"
    },
    emphasis: {
      color: "#1d4ed8"
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
        borderRadius: "10px",
        border: "1px solid #bfdbfe"
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
      borderTop: "1px solid #cbd5f5",
      margin: "26px 0"
    }
  }
};

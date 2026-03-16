import type { Theme } from "../types";

export const caixinTheme: Theme = {
  name: "caixin",
  label: "财新",
  summary: "灵感来自财新式的财经报道排版，稳重克制、蓝色强调。",
  featured: true,
  styles: {
    container: {
      color: "#0f172a",
      fontFamily: "Source Han Serif SC, Noto Serif SC, Georgia, serif",
      fontSize: "16px",
      lineHeight: "1.88",
      backgroundColor: "#f8fafc"
    },
    paragraph: {
      margin: "0 0 18px",
      letterSpacing: "0.015em"
    },
    headings: {
      1: {
        fontSize: "30px",
        fontWeight: "700",
        lineHeight: "1.3",
        margin: "0 0 22px",
        color: "#0f172a",
        borderBottom: "2px solid #cbd5f5",
        paddingBottom: "8px"
      },
      2: {
        fontSize: "24px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "32px 0 16px",
        color: "#1e3a8a",
        borderLeft: "4px solid #1e3a8a",
        paddingLeft: "10px"
      },
      3: {
        fontSize: "20px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "24px 0 14px",
        color: "#1e3a8a"
      },
      4: {
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "22px 0 12px",
        color: "#0f172a"
      },
      5: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "18px 0 10px",
        color: "#334155"
      },
      6: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#475569"
      }
    },
    blockquote: {
      container: {
        margin: "20px 0",
        padding: "14px 18px",
        backgroundColor: "#e2e8f0",
        borderLeft: "4px solid #1e3a8a",
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
        border: "1px solid #1e3a8a"
      },
      code: {
        color: "#e2e8f0",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "14px",
        lineHeight: "1.7"
      }
    },
    inlineCode: {
      backgroundColor: "#dbeafe",
      color: "#1e3a8a",
      padding: "2px 6px",
      borderRadius: "6px",
      fontSize: "0.92em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#1e40af",
      textDecoration: "underline"
    },
    strong: {
      color: "#0f172a",
      fontWeight: "700"
    },
    emphasis: {
      color: "#1e3a8a"
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
        borderRadius: "12px",
        border: "1px solid #cbd5f5"
      },
      caption: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#64748b"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #cbd5f5",
      margin: "28px 0"
    }
  }
};

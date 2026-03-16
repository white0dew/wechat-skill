import type { Theme } from "../types";

export const huxiuTheme: Theme = {
  name: "huxiu",
  label: "虎嗅",
  summary: "灵感来自虎嗅的商业评论版式，深色标题与橙色强调。",
  featured: true,
  styles: {
    container: {
      color: "#111827",
      fontFamily: "Noto Sans SC, PingFang SC, -apple-system, sans-serif",
      fontSize: "16px",
      lineHeight: "1.85",
      backgroundColor: "#fff7ed"
    },
    paragraph: {
      margin: "0 0 18px",
      letterSpacing: "0.01em"
    },
    headings: {
      1: {
        fontSize: "30px",
        fontWeight: "700",
        lineHeight: "1.3",
        margin: "0 0 22px",
        color: "#111827",
        borderBottom: "3px solid #fb923c",
        paddingBottom: "8px"
      },
      2: {
        fontSize: "23px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "30px 0 14px",
        color: "#c2410c"
      },
      3: {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "24px 0 12px",
        color: "#9a3412"
      },
      4: {
        fontSize: "17px",
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
        color: "#374151"
      },
      6: {
        fontSize: "15px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#6b7280"
      }
    },
    blockquote: {
      container: {
        margin: "18px 0",
        padding: "12px 16px",
        backgroundColor: "#ffedd5",
        borderLeft: "4px solid #f97316",
        color: "#7c2d12"
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
        backgroundColor: "#111827",
        borderRadius: "10px",
        overflowX: "auto",
        border: "1px solid #fb923c"
      },
      code: {
        color: "#fde68a",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "13px",
        lineHeight: "1.65"
      }
    },
    inlineCode: {
      backgroundColor: "#ffedd5",
      color: "#c2410c",
      padding: "2px 6px",
      borderRadius: "6px",
      fontSize: "0.92em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#c2410c",
      textDecoration: "underline"
    },
    strong: {
      fontWeight: "700",
      color: "#111827"
    },
    emphasis: {
      color: "#9a3412"
    },
    delete: {
      color: "#9ca3af"
    },
    image: {
      wrapper: {
        margin: "22px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "10px",
        border: "1px solid #fdba74"
      },
      caption: {
        marginTop: "8px",
        fontSize: "12px",
        color: "#6b7280"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #fdba74",
      margin: "26px 0"
    }
  }
};

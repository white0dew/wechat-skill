import type { Theme } from "../types";

export const zhihuTheme: Theme = {
  name: "zhihu",
  label: "Zhihu",
  summary: "靠近知乎专栏的蓝白风格，层级明显，适合知识型内容。",
  featured: true,
  styles: {
    container: {
      color: "#1f2329",
      fontFamily: "PingFang SC, Helvetica Neue, Arial, sans-serif",
      fontSize: "16px",
      lineHeight: "1.8",
      backgroundColor: "#ffffff"
    },
    paragraph: {
      margin: "0 0 16px"
    },
    headings: {
      1: {
        fontSize: "30px",
        fontWeight: "700",
        lineHeight: "1.28",
        margin: "0 0 22px",
        color: "#0f172a"
      },
      2: {
        fontSize: "23px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "32px 0 14px",
        color: "#175199",
        borderLeft: "4px solid #175199",
        paddingLeft: "10px"
      },
      3: {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "24px 0 12px",
        color: "#175199"
      },
      4: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "20px 0 10px",
        color: "#1f2937"
      },
      5: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "18px 0 8px",
        color: "#475569"
      },
      6: {
        fontSize: "15px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#64748b"
      }
    },
    blockquote: {
      container: {
        margin: "20px 0",
        padding: "14px 16px",
        backgroundColor: "#f6faff",
        borderLeft: "4px solid #dbeafe",
        color: "#334155"
      },
      paragraph: {
        margin: "0 0 8px"
      }
    },
    list: {
      container: {
        margin: "0 0 16px",
        paddingLeft: "24px"
      },
      item: {
        margin: "6px 0"
      }
    },
    codeBlock: {
      pre: {
        margin: "20px 0",
        padding: "16px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        overflowX: "auto",
        border: "1px solid #e2e8f0"
      },
      code: {
        color: "#0f172a",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "13px",
        lineHeight: "1.7"
      }
    },
    inlineCode: {
      backgroundColor: "#eff6ff",
      color: "#175199",
      padding: "2px 5px",
      borderRadius: "4px",
      fontSize: "0.9em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#175199",
      textDecoration: "underline"
    },
    strong: {
      fontWeight: "700",
      color: "#0f172a"
    },
    emphasis: {
      color: "#175199"
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
        borderRadius: "8px"
      },
      caption: {
        marginTop: "8px",
        fontSize: "12px",
        color: "#64748b"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #dbeafe",
      margin: "26px 0"
    }
  }
};

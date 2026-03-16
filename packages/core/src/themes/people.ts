import type { Theme } from "../types";

export const peopleTheme: Theme = {
  name: "people",
  label: "人民日报",
  summary: "灵感来自人民日报公众号的权威新闻排版，正式稳重、红色强调。",
  featured: true,
  styles: {
    container: {
      color: "#1f2937",
      fontFamily: "Source Han Serif SC, Songti SC, STSong, serif",
      fontSize: "16px",
      lineHeight: "1.9",
      backgroundColor: "#fffaf7"
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
        color: "#7f1d1d",
        letterSpacing: "0.02em"
      },
      2: {
        fontSize: "24px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "32px 0 16px",
        color: "#991b1b",
        borderBottom: "2px solid #fecaca",
        paddingBottom: "8px"
      },
      3: {
        fontSize: "20px",
        fontWeight: "700",
        lineHeight: "1.5",
        margin: "24px 0 14px",
        color: "#7f1d1d"
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
        backgroundColor: "#fef2f2",
        borderLeft: "4px solid #b91c1c",
        color: "#7f1d1d"
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
        overflowX: "auto",
        border: "1px solid #fecaca"
      },
      code: {
        color: "#f9fafb",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "14px",
        lineHeight: "1.7"
      }
    },
    inlineCode: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      padding: "2px 6px",
      borderRadius: "6px",
      fontSize: "0.92em",
      fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    },
    link: {
      color: "#b91c1c",
      textDecoration: "underline"
    },
    strong: {
      color: "#111827",
      fontWeight: "700"
    },
    emphasis: {
      color: "#7f1d1d"
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
        borderRadius: "12px",
        border: "1px solid #fecaca"
      },
      caption: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#6b7280"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #fecaca",
      margin: "28px 0"
    }
  }
};

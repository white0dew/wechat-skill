import type { Theme } from "../types";

export const mediumTheme: Theme = {
  name: "medium",
  label: "Medium",
  summary: "偏长文阅读的 Medium 风格，适合叙事性强的公众号文章。",
  featured: true,
  styles: {
    container: {
      color: "#242424",
      fontFamily: "Charter, Georgia, Cambria, Times New Roman, serif",
      fontSize: "18px",
      lineHeight: "1.9",
      backgroundColor: "#ffffff"
    },
    paragraph: {
      margin: "0 0 20px"
    },
    headings: {
      1: {
        fontSize: "34px",
        fontWeight: "700",
        lineHeight: "1.15",
        margin: "0 0 26px",
        color: "#242424"
      },
      2: {
        fontSize: "28px",
        fontWeight: "700",
        lineHeight: "1.25",
        margin: "36px 0 18px",
        color: "#242424"
      },
      3: {
        fontSize: "22px",
        fontWeight: "700",
        lineHeight: "1.35",
        margin: "28px 0 14px",
        color: "#242424"
      },
      4: {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "24px 0 12px",
        color: "#242424"
      },
      5: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "20px 0 10px",
        color: "#4b5563"
      },
      6: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "18px 0 8px",
        color: "#6b7280"
      }
    },
    blockquote: {
      container: {
        margin: "26px 0",
        padding: "4px 0 4px 18px",
        borderLeft: "3px solid #242424",
        color: "#3f3f46"
      },
      paragraph: {
        margin: "0 0 10px"
      }
    },
    list: {
      container: {
        margin: "0 0 20px",
        paddingLeft: "26px"
      },
      item: {
        margin: "7px 0"
      }
    },
    codeBlock: {
      pre: {
        margin: "22px 0",
        padding: "18px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        overflowX: "auto"
      },
      code: {
        color: "#111827",
        fontFamily: "Menlo, Monaco, Consolas, monospace",
        fontSize: "13px",
        lineHeight: "1.7"
      }
    },
    inlineCode: {
      backgroundColor: "#f3f4f6",
      color: "#111827",
      padding: "2px 5px",
      borderRadius: "4px",
      fontSize: "0.88em",
      fontFamily: "Menlo, Monaco, Consolas, monospace"
    },
    link: {
      color: "#166534",
      textDecoration: "underline"
    },
    strong: {
      fontWeight: "700",
      color: "#111827"
    },
    emphasis: {
      color: "#111827"
    },
    delete: {
      color: "#6b7280"
    },
    image: {
      wrapper: {
        margin: "26px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "4px"
      },
      caption: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#6b7280"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #e5e7eb",
      margin: "30px 0"
    }
  }
};

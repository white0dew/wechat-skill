import type { Theme } from "../types";

export const notionTheme: Theme = {
  name: "notion",
  label: "Notion",
  summary: "接近 Notion 的留白与中性灰系统，适合教程和知识库。",
  featured: true,
  styles: {
    container: {
      color: "#37352f",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      fontSize: "16px",
      lineHeight: "1.8",
      backgroundColor: "#ffffff"
    },
    paragraph: {
      margin: "0 0 15px"
    },
    headings: {
      1: {
        fontSize: "32px",
        fontWeight: "700",
        lineHeight: "1.2",
        margin: "0 0 22px",
        color: "#2f3437"
      },
      2: {
        fontSize: "24px",
        fontWeight: "700",
        lineHeight: "1.3",
        margin: "30px 0 14px",
        color: "#2f3437"
      },
      3: {
        fontSize: "19px",
        fontWeight: "600",
        lineHeight: "1.4",
        margin: "22px 0 12px",
        color: "#2f3437"
      },
      4: {
        fontSize: "17px",
        fontWeight: "600",
        lineHeight: "1.45",
        margin: "18px 0 10px",
        color: "#37352f"
      },
      5: {
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#57534e"
      },
      6: {
        fontSize: "15px",
        fontWeight: "600",
        lineHeight: "1.45",
        margin: "14px 0 8px",
        color: "#78716c"
      }
    },
    blockquote: {
      container: {
        margin: "18px 0",
        padding: "2px 0 2px 14px",
        borderLeft: "3px solid #d4d4d8",
        color: "#57534e"
      },
      paragraph: {
        margin: "0 0 8px"
      }
    },
    list: {
      container: {
        margin: "0 0 15px",
        paddingLeft: "22px"
      },
      item: {
        margin: "5px 0"
      }
    },
    codeBlock: {
      pre: {
        margin: "18px 0",
        padding: "16px",
        backgroundColor: "#f7f6f3",
        borderRadius: "10px",
        overflowX: "auto"
      },
      code: {
        color: "#44403c",
        fontFamily: "SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: "13px",
        lineHeight: "1.65"
      }
    },
    inlineCode: {
      backgroundColor: "#f1f1ef",
      color: "#eb5757",
      padding: "2px 5px",
      borderRadius: "4px",
      fontSize: "0.9em",
      fontFamily: "SFMono-Regular, Menlo, Consolas, monospace"
    },
    link: {
      color: "#0f766e",
      textDecoration: "underline"
    },
    strong: {
      fontWeight: "700",
      color: "#2f3437"
    },
    emphasis: {
      color: "#57534e"
    },
    delete: {
      color: "#a8a29e"
    },
    image: {
      wrapper: {
        margin: "24px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "12px"
      },
      caption: {
        marginTop: "8px",
        fontSize: "12px",
        color: "#78716c"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #e7e5e4",
      margin: "24px 0"
    }
  }
};

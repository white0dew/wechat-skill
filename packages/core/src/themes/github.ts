import type { Theme } from "../types";

export const githubTheme: Theme = {
  name: "github",
  label: "GitHub",
  summary: "面向技术文章的 GitHub 风格，清晰、克制、偏文档。",
  featured: true,
  styles: {
    container: {
      color: "#24292f",
      fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif",
      fontSize: "16px",
      lineHeight: "1.75",
      backgroundColor: "#ffffff"
    },
    paragraph: {
      margin: "0 0 16px"
    },
    headings: {
      1: {
        fontSize: "30px",
        fontWeight: "700",
        lineHeight: "1.25",
        margin: "0 0 24px",
        color: "#24292f",
        borderBottom: "1px solid #d0d7de",
        paddingBottom: "12px"
      },
      2: {
        fontSize: "24px",
        fontWeight: "700",
        lineHeight: "1.35",
        margin: "30px 0 16px",
        color: "#24292f",
        borderBottom: "1px solid #d0d7de",
        paddingBottom: "8px"
      },
      3: {
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "1.4",
        margin: "24px 0 14px",
        color: "#24292f"
      },
      4: {
        fontSize: "18px",
        fontWeight: "600",
        lineHeight: "1.45",
        margin: "20px 0 12px",
        color: "#24292f"
      },
      5: {
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "1.45",
        margin: "18px 0 10px",
        color: "#57606a"
      },
      6: {
        fontSize: "15px",
        fontWeight: "600",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#57606a"
      }
    },
    blockquote: {
      container: {
        margin: "18px 0",
        padding: "0 16px",
        borderLeft: "4px solid #d0d7de",
        color: "#57606a"
      },
      paragraph: {
        margin: "0 0 10px"
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
        margin: "18px 0",
        padding: "16px",
        backgroundColor: "#f6f8fa",
        borderRadius: "8px",
        overflowX: "auto",
        border: "1px solid #d0d7de"
      },
      code: {
        color: "#24292f",
        fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace",
        fontSize: "13px",
        lineHeight: "1.65"
      }
    },
    inlineCode: {
      backgroundColor: "rgba(175,184,193,0.2)",
      color: "#24292f",
      padding: "2px 5px",
      borderRadius: "6px",
      fontSize: "0.9em",
      fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    },
    link: {
      color: "#0969da",
      textDecoration: "none"
    },
    strong: {
      fontWeight: "600",
      color: "#24292f"
    },
    emphasis: {
      color: "#24292f"
    },
    delete: {
      color: "#57606a"
    },
    image: {
      wrapper: {
        margin: "22px 0",
        textAlign: "center"
      },
      image: {
        maxWidth: "100%",
        borderRadius: "8px",
        border: "1px solid #d0d7de"
      },
      caption: {
        marginTop: "8px",
        fontSize: "12px",
        color: "#57606a"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #d8dee4",
      margin: "24px 0"
    }
  }
};

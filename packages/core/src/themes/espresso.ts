import type { Theme } from "../types";

export const espressoTheme: Theme = {
  name: "espresso",
  label: "Espresso",
  summary: "暖咖啡与米纸质感，适合随笔、文化与品牌故事。",
  featured: true,
  styles: {
    container: {
      color: "#3f2d23",
      fontFamily: "Source Han Serif SC, Noto Serif SC, Georgia, serif",
      fontSize: "17px",
      lineHeight: "1.9",
      backgroundColor: "#fff6ed"
    },
    paragraph: {
      margin: "0 0 20px",
      letterSpacing: "0.015em"
    },
    headings: {
      1: {
        fontSize: "32px",
        fontWeight: "700",
        lineHeight: "1.25",
        margin: "0 0 24px",
        color: "#3f2d23"
      },
      2: {
        fontSize: "25px",
        fontWeight: "700",
        lineHeight: "1.4",
        margin: "34px 0 16px",
        color: "#9a3412",
        borderBottom: "2px solid #fed7aa",
        paddingBottom: "8px"
      },
      3: {
        fontSize: "21px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "26px 0 14px",
        color: "#7c2d12"
      },
      4: {
        fontSize: "19px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "22px 0 12px",
        color: "#3f2d23"
      },
      5: {
        fontSize: "17px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "18px 0 10px",
        color: "#6b3f2a"
      },
      6: {
        fontSize: "16px",
        fontWeight: "700",
        lineHeight: "1.45",
        margin: "16px 0 8px",
        color: "#7c5e4a"
      }
    },
    blockquote: {
      container: {
        margin: "22px 0",
        padding: "14px 18px",
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
        margin: "0 0 18px",
        paddingLeft: "24px"
      },
      item: {
        margin: "8px 0"
      }
    },
    codeBlock: {
      pre: {
        margin: "22px 0",
        padding: "16px 18px",
        backgroundColor: "#2b211c",
        borderRadius: "12px",
        overflowX: "auto",
        border: "1px solid #f97316"
      },
      code: {
        color: "#fef3c7",
        fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
        fontSize: "14px",
        lineHeight: "1.7"
      }
    },
    inlineCode: {
      backgroundColor: "#fed7aa",
      color: "#9a3412",
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
      color: "#3f2d23",
      fontWeight: "700"
    },
    emphasis: {
      color: "#9a3412"
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
        borderRadius: "14px",
        border: "1px solid #fdba74"
      },
      caption: {
        marginTop: "10px",
        fontSize: "13px",
        color: "#8b5e34"
      }
    },
    thematicBreak: {
      borderTop: "1px solid #fed7aa",
      margin: "28px 0"
    }
  }
};

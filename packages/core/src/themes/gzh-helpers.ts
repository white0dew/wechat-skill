import type { StyleMap, Theme, ThemeStyles } from "../types";

const sansFont =
  "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif";

type GzhThemeOptions = {
  name: string;
  label: string;
  summary: string;
  accent: string;
  accentSoft: string;
  background: string;
  text: string;
  heading: string;
  muted: string;
  border: string;
  bodyFontSize: string;
  lineHeight: number;
  letterSpacing: string;
  fontFamily?: string;
  headingFontFamily?: string;
  container?: StyleMap;
  paragraph?: StyleMap;
  headings?: Partial<ThemeStyles["headings"]>;
  blockquote?: Partial<ThemeStyles["blockquote"]>;
  list?: Partial<ThemeStyles["list"]>;
  codeBlock?: Partial<ThemeStyles["codeBlock"]>;
  inlineCode?: StyleMap;
  link?: StyleMap;
  strong?: StyleMap;
  emphasis?: StyleMap;
  delete?: StyleMap;
  image?: Partial<ThemeStyles["image"]>;
  thematicBreak?: StyleMap;
};

export function createGzhTheme(options: GzhThemeOptions): Theme {
  const headingBase: StyleMap = {
    color: options.heading,
    fontFamily: options.headingFontFamily ?? options.fontFamily ?? sansFont,
    fontWeight: 700,
    lineHeight: 1.45,
    margin: "32px 0 16px"
  };
  const headings: ThemeStyles["headings"] = {
    1: { ...headingBase, fontSize: "24px", marginTop: "16px" },
    2: { ...headingBase, fontSize: "21px", borderBottom: `2px solid ${options.accentSoft}`, paddingBottom: "8px" },
    3: { ...headingBase, fontSize: "18px", color: options.accent },
    4: { ...headingBase, fontSize: "16px" },
    5: { ...headingBase, fontSize: "15px", color: options.text },
    6: { ...headingBase, fontSize: "14px", color: options.muted }
  };

  return {
    name: options.name,
    label: options.label,
    summary: options.summary,
    styles: {
      container: {
        maxWidth: "677px",
        margin: "0 auto",
        padding: "0 20px",
        boxSizing: "border-box",
        overflowX: "hidden",
        backgroundColor: options.background,
        color: options.text,
        fontFamily: options.fontFamily ?? sansFont,
        fontSize: options.bodyFontSize,
        lineHeight: options.lineHeight,
        letterSpacing: options.letterSpacing,
        ...options.container
      },
      paragraph: {
        margin: "0 0 18px",
        fontSize: options.bodyFontSize,
        lineHeight: options.lineHeight,
        textAlign: "justify",
        ...options.paragraph
      },
      headings: {
        1: { ...headings[1], ...options.headings?.[1] },
        2: { ...headings[2], ...options.headings?.[2] },
        3: { ...headings[3], ...options.headings?.[3] },
        4: { ...headings[4], ...options.headings?.[4] },
        5: { ...headings[5], ...options.headings?.[5] },
        6: { ...headings[6], ...options.headings?.[6] }
      },
      blockquote: {
        container: {
          margin: "24px 0",
          padding: "18px 20px",
          backgroundColor: options.accentSoft,
          borderLeft: `4px solid ${options.accent}`,
          color: options.text,
          ...options.blockquote?.container
        },
        paragraph: {
          margin: 0,
          color: options.text,
          fontSize: options.bodyFontSize,
          lineHeight: options.lineHeight,
          ...options.blockquote?.paragraph
        }
      },
      list: {
        container: {
          margin: "0 0 20px",
          paddingLeft: "24px",
          color: options.text,
          ...options.list?.container
        },
        item: {
          marginBottom: "8px",
          paddingLeft: "4px",
          lineHeight: options.lineHeight,
          ...options.list?.item
        }
      },
      codeBlock: {
        pre: {
          margin: "24px 0",
          padding: "18px 20px",
          overflowX: "auto",
          backgroundColor: options.heading,
          border: `1px solid ${options.border}`,
          borderRadius: "6px",
          color: options.background,
          ...options.codeBlock?.pre
        },
        code: {
          fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', monospace",
          fontSize: "13px",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          ...options.codeBlock?.code
        }
      },
      inlineCode: {
        padding: "2px 6px",
        backgroundColor: options.accentSoft,
        color: options.accent,
        borderRadius: "4px",
        fontFamily: "SFMono-Regular, Consolas, 'Liberation Mono', monospace",
        fontSize: "0.9em",
        ...options.inlineCode
      },
      link: {
        color: options.accent,
        textDecoration: "none",
        borderBottom: `1px solid ${options.accent}`,
        ...options.link
      },
      strong: {
        color: options.accent,
        fontWeight: 700,
        ...options.strong
      },
      emphasis: {
        color: options.text,
        fontStyle: "italic",
        ...options.emphasis
      },
      delete: {
        color: options.muted,
        textDecoration: "line-through",
        ...options.delete
      },
      image: {
        wrapper: {
          margin: "28px 0",
          textAlign: "center",
          ...options.image?.wrapper
        },
        image: {
          display: "block",
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          boxSizing: "border-box",
          border: `1px solid ${options.border}`,
          borderRadius: "6px",
          ...options.image?.image
        },
        caption: {
          margin: "8px 0 0",
          color: options.muted,
          fontSize: "12px",
          lineHeight: 1.6,
          textAlign: "center",
          ...options.image?.caption
        }
      },
      thematicBreak: {
        margin: "36px 0",
        border: 0,
        borderTop: `1px solid ${options.border}`,
        ...options.thematicBreak
      }
    }
  };
}

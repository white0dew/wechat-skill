import { resolveTheme, themes, type Theme, type ThemeStyles } from "@md2wechat/core";

export type ThemeDraft = {
  id: string;
  label: string;
  summary: string;
  baseThemeName: Extract<keyof typeof themes, string>;
  fontFamily: string;
  bodyColor: string;
  headingColor: string;
  accentColor: string;
  backgroundColor: string;
  quoteBackground: string;
  codeBackground: string;
  imageBorder: string;
};

const STORAGE_KEY = "md2wechat-theme-drafts";

function sanitizeId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "") || "local-theme";
}

export function normalizeThemeId(value: string) {
  return sanitizeId(value);
}

function normalizeColor(value: string | number | undefined, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function extractBorderColor(value: string | number | undefined, fallback: string) {
  if (typeof value === "string") {
    const token = value.trim().split(" ").at(-1);
    if (token) {
      return token;
    }
  }
  return fallback;
}

function buildHeadingStyles(
  styles: ThemeStyles,
  headingColor: string,
  accentColor: string
): ThemeStyles["headings"] {
  return {
    1: {
      ...styles.headings[1],
      color: headingColor
    },
    2: {
      ...styles.headings[2],
      color: accentColor,
      borderBottom:
        "borderBottom" in styles.headings[2] && styles.headings[2].borderBottom
          ? `2px solid ${accentColor}33`
          : styles.headings[2].borderBottom,
      borderLeft:
        "borderLeft" in styles.headings[2] && styles.headings[2].borderLeft
          ? `4px solid ${accentColor}`
          : styles.headings[2].borderLeft
    },
    3: {
      ...styles.headings[3],
      color: accentColor
    },
    4: {
      ...styles.headings[4],
      color: headingColor
    },
    5: {
      ...styles.headings[5],
      color: styles.headings[5].color ?? headingColor
    },
    6: {
      ...styles.headings[6],
      color: styles.headings[6].color ?? headingColor
    }
  };
}

export function createEmptyDraft(): ThemeDraft {
  return {
    id: "custom-sandbox",
    label: "Custom Sandbox",
    summary: "本地实验主题，用来验证新配色和标题风格。",
    baseThemeName: "default",
    fontFamily: "Source Han Serif SC, Noto Serif SC, Georgia, serif",
    bodyColor: "#1f2937",
    headingColor: "#111827",
    accentColor: "#ea580c",
    backgroundColor: "#fffdf8",
    quoteBackground: "#fff7ed",
    codeBackground: "#172033",
    imageBorder: "#fdba74"
  };
}

export function createDraftFromTheme(theme: Theme): ThemeDraft {
  const fallback = createEmptyDraft();
  const baseThemeName = (theme.name in themes ? theme.name : fallback.baseThemeName) as ThemeDraft["baseThemeName"];
  const bodyColor = normalizeColor(theme.styles.container.color, fallback.bodyColor);
  const headingColor = normalizeColor(theme.styles.headings[1].color, bodyColor);
  const accentColor =
    normalizeColor(theme.styles.link.color, "") ||
    normalizeColor(theme.styles.headings[2].color, "") ||
    headingColor;
  const backgroundColor = normalizeColor(
    theme.styles.container.backgroundColor,
    fallback.backgroundColor
  );
  const quoteBackground = normalizeColor(
    theme.styles.blockquote.container.backgroundColor,
    fallback.quoteBackground
  );
  const codeBackground = normalizeColor(
    theme.styles.codeBlock.pre.backgroundColor,
    fallback.codeBackground
  );
  const imageBorder = extractBorderColor(theme.styles.image.image.border, accentColor);
  const idBase = sanitizeId(theme.name);
  const labelBase = theme.label?.trim() || "Custom Theme";

  return {
    id: `custom-${idBase}`,
    label: `${labelBase} 变体`,
    summary: `基于 ${labelBase} 的自定义主题。`,
    baseThemeName,
    fontFamily: normalizeColor(theme.styles.container.fontFamily, fallback.fontFamily),
    bodyColor,
    headingColor,
    accentColor,
    backgroundColor,
    quoteBackground,
    codeBackground,
    imageBorder
  };
}

export function draftToTheme(draft: ThemeDraft): Theme {
  const baseTheme = resolveTheme(draft.baseThemeName);
  const styles = baseTheme.styles;

  return {
    ...baseTheme,
    name: sanitizeId(draft.id),
    label: draft.label.trim() || "Custom Theme",
    summary: draft.summary.trim() || "本地保存的实验主题。",
    featured: true,
    styles: {
      ...styles,
      container: {
        ...styles.container,
        color: draft.bodyColor,
        backgroundColor: draft.backgroundColor,
        fontFamily: draft.fontFamily
      },
      headings: buildHeadingStyles(styles, draft.headingColor, draft.accentColor),
      blockquote: {
        ...styles.blockquote,
        container: {
          ...styles.blockquote.container,
          backgroundColor: draft.quoteBackground,
          borderLeft: `4px solid ${draft.accentColor}`,
          color: draft.headingColor
        }
      },
      codeBlock: {
        ...styles.codeBlock,
        pre: {
          ...styles.codeBlock.pre,
          backgroundColor: draft.codeBackground,
          border: `1px solid ${draft.imageBorder}55`
        }
      },
      inlineCode: {
        ...styles.inlineCode,
        color: draft.accentColor
      },
      link: {
        ...styles.link,
        color: draft.accentColor
      },
      strong: {
        ...styles.strong,
        color: draft.headingColor
      },
      emphasis: {
        ...styles.emphasis,
        color: draft.accentColor
      },
      image: {
        ...styles.image,
        image: {
          ...styles.image.image,
          border: `1px solid ${draft.imageBorder}`
        }
      },
      thematicBreak: {
        ...styles.thematicBreak,
        borderTop: `1px solid ${draft.imageBorder}`
      }
    }
  };
}

export function loadThemeDrafts(): ThemeDraft[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ThemeDraft[];
    const seen = new Set<string>();
    return parsed
      .filter((item) => Boolean(item.id && item.label))
      .map((item) => ({
        ...item,
        id: normalizeThemeId(item.id)
      }))
      .filter((item) => {
        if (seen.has(item.id)) {
          return false;
        }
        seen.add(item.id);
        return true;
      });
  } catch {
    return [];
  }
}

export function saveThemeDrafts(drafts: ThemeDraft[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function exportThemeCode(draft: ThemeDraft): string {
  const generated = draftToTheme(draft);
  const styleCode = JSON.stringify(generated.styles, null, 2);

  return `import type { Theme } from "@md2wechat/core";
import { themes } from "@md2wechat/core";

export const ${sanitizeId(draft.id).replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())}Theme: Theme = {
  name: ${JSON.stringify(generated.name)},
  label: ${JSON.stringify(generated.label)},
  summary: ${JSON.stringify(generated.summary)},
  featured: true,
  styles: ${styleCode},
  overrides: themes[${JSON.stringify(draft.baseThemeName)}].overrides
};
`;
}

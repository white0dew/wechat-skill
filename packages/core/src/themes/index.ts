import type { Theme } from "../types";
import { defaultTheme } from "./default";
import { githubTheme } from "./github";
import { minimalTheme } from "./minimal";
import { mediumTheme } from "./medium";
import { notionTheme } from "./notion";
import { zhihuTheme } from "./zhihu";

export const themes = {
  default: defaultTheme,
  minimal: minimalTheme,
  github: githubTheme,
  notion: notionTheme,
  medium: mediumTheme,
  zhihu: zhihuTheme
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

export function resolveTheme(theme?: Theme | string): Theme {
  if (!theme) {
    return themes.default;
  }

  if (typeof theme !== "string") {
    return theme;
  }

  return themes[theme as ThemeName] ?? themes.default;
}

export function listThemes(): Theme[] {
  return Object.values(themes);
}

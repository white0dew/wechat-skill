import type { Theme } from "../types";
import { auroraTheme } from "./aurora";
import { caixinTheme } from "./caixin";
import { defaultTheme } from "./default";
import { espressoTheme } from "./espresso";
import { githubTheme } from "./github";
import { huxiuTheme } from "./huxiu";
import { minimalTheme } from "./minimal";
import { monoTheme } from "./mono";
import { kr36Theme } from "./kr36";
import { mediumTheme } from "./medium";
import { notionTheme } from "./notion";
import { peopleTheme } from "./people";
import { zhihuTheme } from "./zhihu";

export const themes = {
  default: defaultTheme,
  aurora: auroraTheme,
  people: peopleTheme,
  kr36: kr36Theme,
  huxiu: huxiuTheme,
  caixin: caixinTheme,
  espresso: espressoTheme,
  minimal: minimalTheme,
  github: githubTheme,
  notion: notionTheme,
  mono: monoTheme,
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

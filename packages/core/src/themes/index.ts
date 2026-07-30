import type { Theme } from "../types";
import { graphiteMinimalTheme } from "./graphite-minimal";
import { moyuGreenTheme } from "./moyu-green";
import { moyuTicketTheme } from "./moyu-ticket";
import { oliveJournalTheme } from "./olive-journal";
import { redWhiteTheme } from "./red-white";
import { zenWhitespaceTheme } from "./zen-whitespace";

export const themes = {
  "moyu-green": moyuGreenTheme,
  "red-white": redWhiteTheme,
  "graphite-minimal": graphiteMinimalTheme,
  "zen-whitespace": zenWhitespaceTheme,
  "moyu-ticket": moyuTicketTheme,
  "olive-journal": oliveJournalTheme
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof themes;

export function resolveTheme(theme?: Theme | string): Theme {
  if (!theme) {
    return themes["moyu-green"];
  }

  if (typeof theme !== "string") {
    return theme;
  }

  return themes[theme as ThemeName] ?? themes["moyu-green"];
}

export function listThemes(): Theme[] {
  return Object.values(themes);
}

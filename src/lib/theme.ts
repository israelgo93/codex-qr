export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "codexqr-theme";

export const LIGHT_LOGO_SRC = "/logos/codex.png";
export const DARK_LOGO_SRC = "/logos/Codex 256 x 256.png";

export function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function getNextTheme(theme: ThemeMode): ThemeMode {
  if (theme === "light") return "dark";
  if (theme === "dark") return "system";
  return "light";
}

export function logoForResolvedTheme(theme: ResolvedTheme): string {
  return theme === "light" ? LIGHT_LOGO_SRC : DARK_LOGO_SRC;
}

export function logoNeedsDarkBadge(src: string): boolean {
  const normalizedSrc = decodeURI(src.split("?")[0] ?? src);
  return normalizedSrc === DARK_LOGO_SRC || normalizedSrc.endsWith(DARK_LOGO_SRC);
}

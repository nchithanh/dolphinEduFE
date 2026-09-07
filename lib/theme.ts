export type EduTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "edu-theme";

export function isEduTheme(value: string): value is EduTheme {
  return value === "light" || value === "dark";
}

export function applyDocumentTheme(theme: EduTheme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function readStoredTheme(): EduTheme {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && isEduTheme(raw)) return raw;
  } catch {
    /* private mode */
  }
  return "light";
}

export function writeStoredTheme(theme: EduTheme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
}

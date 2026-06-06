import { settingsStore } from "@/lib/settings-store";

export function resolveDark(theme: "light" | "dark" | "system") {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(theme: "light" | "dark" | "system") {
  if (typeof document === "undefined") return;
  const dark = resolveDark(theme);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export function initTheme() {
  applyTheme(settingsStore.get().theme);
}

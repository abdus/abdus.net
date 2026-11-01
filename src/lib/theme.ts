export type ThemePreference = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs inline in <head> before first paint: resolves the stored preference
 * and puts `.light` or `.dark` (plus `.js`) on <html>, so there is no flash.
 */
export const themeScript = `(function(){try{
var d=document.documentElement,p=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";
var dark=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
d.classList.add(dark?"dark":"light","js");d.dataset.theme=p;
}catch(e){document.documentElement.classList.add("js")}})()`;

export function applyTheme(pref: ThemePreference) {
  const root = document.documentElement;
  const dark =
    pref === "dark" ||
    (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  root.classList.toggle("light", !dark);
  root.dataset.theme = pref;
  try {
    if (pref === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* private mode */
  }
}

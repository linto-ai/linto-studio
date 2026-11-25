// The app language, as the app picks it at startup (src/i18n.js): the one
// chosen in the app (same key as the classic language switcher), else the
// browser's. Storage failures fall back to the browser's.
export function readLanguagePreference() {
  try {
    return localStorage.getItem("lang") || navigator.language
  } catch {
    return navigator.language
  }
}

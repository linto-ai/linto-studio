import themes from "../../themes/index.js"

export default function getCurrentTheme() {
  // Check runtime config first, then build-time env
  const runtimeTheme = typeof window !== 'undefined'
    ? window.VUE_APP_CONFIG?.VUE_APP_THEME
    : undefined
  const THEME = runtimeTheme ?? process.env.VUE_APP_THEME ?? "LinTO-green"
  return themes[THEME] || themes["LinTO-green"]
}

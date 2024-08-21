import themes from "../../themes/index.js"

export default function getCurrentTheme() {
  const THEME = process.env.VUE_APP_THEME ?? "LinTO-green"

  console.log("Loading theme", THEME)
  return themes[THEME] || themes["LinTO-green"]
}

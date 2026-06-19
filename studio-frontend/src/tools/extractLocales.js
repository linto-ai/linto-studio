// Picks the label matching the active locale from a localized map
// (e.g. { fr: "...", en: "..." }), falling back to English.
export default function extractLocales(value, locale = "en") {
  if (!value) return ""
  const lang = locale.split("-")[0] || "en"
  return value[lang] || value["en"] || ""
}

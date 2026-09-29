// Localized name of a gateway document template (fr/en fields, legacy name)
export function getTemplateDisplayName(template, locale = "fr") {
  if (!template) return ""
  const localized = locale.startsWith("fr")
    ? template.name_fr || template.name_en
    : template.name_en || template.name_fr
  return localized || template.name || ""
}

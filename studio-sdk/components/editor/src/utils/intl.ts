import type { Translation } from "../types/editor"

export function getLanguageDisplayName(
  code: string,
  locale: string,
  wildcardLabel = "*",
): string {
  if (code === "*") return wildcardLabel
  try {
    const display = new Intl.DisplayNames([locale], { type: "language" })
    return display.of(code) ?? code
  } catch {
    return code
  }
}

export function buildTranslationItems(
  translations: Translation[],
  locale: string,
  originalLabel: string,
  wildcardLabel = "*",
): { value: string; label: string }[] {
  return translations.map((tr) => ({
    value: tr.id,
    label:
      tr.languages
        .map((code) => getLanguageDisplayName(code, locale, wildcardLabel))
        .join(", ") + (tr.isSource ? ` (${originalLabel})` : ""),
  }))
}

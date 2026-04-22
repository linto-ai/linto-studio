export function getLanguageDisplayName(
  code: string,
  locale: string,
  wildcardLabel = "*",
): string {
  if (code === "*") return wildcardLabel
  const langCode: string = code.split("-")[0] ?? code
  try {
    const display = new Intl.DisplayNames([locale], { type: "language" })
    return display.of(langCode) ?? langCode
  } catch {
    return code
  }
}

export function buildTranslationItems(
  translations: { id: string; languages: string[]; isSource: boolean }[],
  locale: string,
  originalLabel: string,
  wildcardLabel = "*",
): { value: string; label: string; originalLabel?: string }[] {
  return [...translations]
    .sort((tr1, tr2) => {
      if (tr1.isSource) return -1
      if (tr2.isSource) return 1
      const a = getLanguageDisplayName(
        tr1.languages[0] ?? "",
        locale,
        wildcardLabel,
      )
      const b = getLanguageDisplayName(
        tr2.languages[0] ?? "",
        locale,
        wildcardLabel,
      )
      return a.localeCompare(b, locale)
    })
    .map((tr) => ({
      value: tr.id,
      label: tr.languages
        .map((code) => getLanguageDisplayName(code, locale, wildcardLabel))
        .join(", "),
      ...(tr.isSource && { originalLabel }),
    }))
}

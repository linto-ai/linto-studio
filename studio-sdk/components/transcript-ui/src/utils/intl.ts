export function getLanguageDisplayName(
  code: string,
  locale: string,
  wildcardLabel = "*",
  stripRegion = true,
): string {
  if (code === "*") return wildcardLabel
  const lookup = stripRegion ? (code.split("-")[0] ?? code) : code
  try {
    const display = new Intl.DisplayNames([locale], { type: "language" })
    return display.of(lookup) ?? display.of(code.split("-")[0] ?? code) ?? code
  } catch {
    return code
  }
}

export function buildTranslationItems(
  translations: { id: string; languages: string[]; isSource: boolean }[],
  locale: string,
  originalLabel: string,
  wildcardLabel = "*",
): { value: string; label: string }[] {
  const sorted = [...translations].sort(
    (a, b) => Number(b.isSource) - Number(a.isSource),
  )
  return sorted.map((tr) => ({
    value: tr.id,
    label: tr.isSource
      ? originalLabel
      : tr.languages
          .map((code) =>
            getLanguageDisplayName(code, locale, wildcardLabel, false),
          )
          .join(", "),
  }))
}

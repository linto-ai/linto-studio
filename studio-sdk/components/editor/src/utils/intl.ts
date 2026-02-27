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

export function buildLanguageItems(
  languages: string[],
  locale: string,
  originalLabel: string,
  wildcardLabel = "*",
): { value: string; label: string }[] {
  return languages.map((code, i) => ({
    value: code,
    label:
      getLanguageDisplayName(code, locale, wildcardLabel) +
      (i === 0 ? ` (${originalLabel})` : ""),
  }))
}

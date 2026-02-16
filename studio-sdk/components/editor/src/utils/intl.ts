export function getLanguageDisplayName(code: string, locale: string): string {
  try {
    const display = new Intl.DisplayNames([locale], { type: 'language' })
    return display.of(code) ?? code
  } catch {
    return code
  }
}

export function buildLanguageItems(
  languages: string[],
  locale: string,
  originalLabel: string,
): { value: string; label: string }[] {
  const displayNames = new Intl.DisplayNames([locale], { type: 'language' })
  return languages.map((code, i) => ({
    value: code,
    label: (displayNames.of(code) ?? code)
      + (i === 0 ? ` (${originalLabel})` : ''),
  }))
}

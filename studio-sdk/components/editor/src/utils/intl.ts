export function getLanguageDisplayName(code: string, locale: string): string {
  try {
    const display = new Intl.DisplayNames([locale], { type: 'language' })
    return display.of(code) ?? code
  } catch {
    return code
  }
}

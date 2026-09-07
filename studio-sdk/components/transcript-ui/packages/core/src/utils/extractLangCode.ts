/**
 * Normalize a language tag to its base code, dropping any region/subtag.
 * e.g. "fr-FR" → "fr", "en" → "en".
 */
export function extractLangCode(language: string): string {
  return language.split("-")[0]!
}

import { extractLangCode } from "./extractLangCode"

/**
 * Compare two language tags ignoring region/subtag — "fr-FR" matches "fr".
 * Returns false when either tag is missing.
 */
export function isSameLanguage(
  a: string | undefined,
  b: string | undefined,
): boolean {
  if (a == null || b == null) return false
  return extractLangCode(a) === extractLangCode(b)
}

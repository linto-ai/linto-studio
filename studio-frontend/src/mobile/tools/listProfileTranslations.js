import {
  extractTranslationLangCode,
  normalizeAvailableTranslations,
} from "../../tools/translationUtils.js"

/**
 * Translation targets offered by a live profile (config.availableTranslations,
 * legacy array or {discrete, external} shape), with a display name in the
 * user's language, sorted by name.
 * @param {{ config?: { availableTranslations?: object|Array } }} profile
 * @param {string} locale
 * @returns {{ code: string, label: string }[]}
 */
export function listProfileTranslations(profile, locale) {
  const names = new Intl.DisplayNames([locale], { type: "language" })
  const codes = normalizeAvailableTranslations(
    profile?.config?.availableTranslations,
  ).map(extractTranslationLangCode)
  return [...new Set(codes)]
    .map((code) => ({ code, label: names.of(code) ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label, locale))
}

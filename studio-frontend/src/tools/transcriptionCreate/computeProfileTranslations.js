import {
  extractTranslationLangCode,
  normalizeAvailableTranslations,
} from "../transcription/translationUtils.js"

/**
 * Translation targets a transcriber profile offers.
 * @param {{ config?: { availableTranslations?: object|Array } }} profile
 * @returns {string[]}
 */
export function computeProfileTranslations(profile) {
  const codes = normalizeAvailableTranslations(
    profile.config?.availableTranslations,
  ).map(extractTranslationLangCode)
  return [...new Set(codes)]
}

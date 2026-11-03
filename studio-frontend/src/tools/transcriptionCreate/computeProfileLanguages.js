import { computeLanguageCode } from "../computeLanguageCode.js"

/**
 * Bare languages a transcriber profile can hear ("fr-FR" and "fr-CA" → "fr").
 * @param {{ config?: { languages?: { candidate: string }[] } }} profile
 * @returns {string[]}
 */
export function computeProfileLanguages(profile) {
  const codes = (profile.config?.languages ?? []).map((language) =>
    computeLanguageCode(language.candidate),
  )
  return [...new Set(codes)]
}

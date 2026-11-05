import { computeCompatibleProfiles } from "./computeCompatibleProfiles.js"
import { computeProfileTranslations } from "./computeProfileTranslations.js"

/**
 * Translations to offer for a draft: those a profile hearing the chosen
 * languages can add to the chosen ones. A chosen translation is always listed,
 * so that it can be removed.
 * @param {object} draft
 * @param {object} catalog - see reconcileDraft
 * @returns {{ code: string }[]}
 */
export function computeTranslationOptions(draft, catalog) {
  const profiles = computeCompatibleProfiles(catalog.profiles, draft)
  const codes = new Set([
    ...profiles.flatMap(computeProfileTranslations),
    ...draft.translations,
  ])
  return [...codes].map((code) => ({ code }))
}

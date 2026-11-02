import { computeCompatibleProfiles } from "./computeCompatibleProfiles.js"
import { computeCompatibleServices } from "./computeCompatibleServices.js"
import { isLiveRequested } from "./isLiveRequested.js"
import { isOfflineRequested } from "./isOfflineRequested.js"

/**
 * Whether an engine exists for these languages, for each requested timing.
 * Chosen translations don't count: they give way to the languages.
 * @param {object} draft
 * @param {{ profiles: object[], services: object[] }} catalog
 * @param {string[]} languages
 * @returns {boolean}
 */
export function isLanguageSelectionPossible(draft, catalog, languages) {
  const { securityLevel } = draft
  const hasProfile =
    computeCompatibleProfiles(catalog.profiles, {
      securityLevel,
      languages,
      translations: [],
    }).length > 0
  const hasService =
    computeCompatibleServices(catalog.services, { securityLevel, languages })
      .length > 0
  return (
    (!isLiveRequested(draft) || hasProfile) &&
    (!isOfflineRequested(draft) || hasService)
  )
}

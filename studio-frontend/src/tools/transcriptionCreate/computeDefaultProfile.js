import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { computeProfileLanguages } from "./computeProfileLanguages.js"

/**
 * Profile to start from: with detection the one hearing the most languages,
 * otherwise the one hearing the fewest beyond the chosen ones, so that it
 * doesn't detect languages nobody asked for. The first of the list wins a tie.
 * @param {object[]} compatibleProfiles - see computeCompatibleProfiles
 * @param {string[]} languages - draft.languages
 * @returns {object|null}
 */
export function computeDefaultProfile(compatibleProfiles, languages) {
  if (compatibleProfiles.length === 0) return null
  const direction = languages.includes(AUTO_LANGUAGE) ? 1 : -1
  return compatibleProfiles.reduce((best, profile) =>
    direction * countLanguages(profile) > direction * countLanguages(best)
      ? profile
      : best,
  )
}

function countLanguages(profile) {
  return computeProfileLanguages(profile).length
}

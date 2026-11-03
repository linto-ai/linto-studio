import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { filterByMetaSecurityLevel } from "../rights/filterBySecurityLevel.js"
import { computeProfileLanguages } from "./computeProfileLanguages.js"
import { computeProfileTranslations } from "./computeProfileTranslations.js"

/**
 * Transcriber profiles meeting the security level, hearing every chosen
 * language and offering every chosen translation. Detection doesn't exist on
 * profiles: any of them handles it, within the languages it hears.
 * @param {object[]} profiles
 * @param {{ securityLevel: number, languages: string[], translations: string[] }} choices
 * @returns {object[]}
 */
export function computeCompatibleProfiles(
  profiles,
  { securityLevel, languages, translations },
) {
  const explicitLanguages = languages.filter((code) => code !== AUTO_LANGUAGE)
  return filterByMetaSecurityLevel(profiles, securityLevel).filter(
    (profile) =>
      containsAll(computeProfileLanguages(profile), explicitLanguages) &&
      containsAll(computeProfileTranslations(profile), translations),
  )
}

function containsAll(list, values) {
  return values.every((value) => list.includes(value))
}

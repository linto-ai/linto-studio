import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { computeServiceLanguage } from "./computeServiceLanguage.js"

/**
 * Service to start from: the first one, among those following the chosen
 * languages rather than detecting when there are some.
 * @param {object[]} compatibleServices - see computeCompatibleServices
 * @param {string[]} languages - draft.languages
 * @returns {object|null}
 */
export function computeDefaultService(compatibleServices, languages) {
  const following = compatibleServices.filter(
    (service) => computeServiceLanguage(service, languages) !== AUTO_LANGUAGE,
  )
  if (following.length > 0) return following[0]
  return compatibleServices[0] ?? null
}

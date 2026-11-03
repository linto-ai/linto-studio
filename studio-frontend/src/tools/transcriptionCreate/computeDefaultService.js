import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { pickRecommendedService } from "../../mobile/tools/pickRecommendedService.js"
import { computeServiceLanguage } from "./computeServiceLanguage.js"

/**
 * Service to start from: the recommended one, among those following the chosen
 * languages rather than detecting when there are some.
 * @param {object[]} compatibleServices - see computeCompatibleServices
 * @param {string[]} languages - draft.languages
 * @returns {object|null}
 */
export function computeDefaultService(compatibleServices, languages) {
  const following = compatibleServices.filter(
    (service) => computeServiceLanguage(service, languages) !== AUTO_LANGUAGE,
  )
  return pickRecommendedService(
    following.length > 0 ? following : compatibleServices,
  )
}

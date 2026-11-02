import { filterBySecurityLevel } from "../rights/filterBySecurityLevel.js"
import { computeServiceLanguage } from "./computeServiceLanguage.js"

/**
 * Transcription services meeting the security level and able to handle the
 * chosen languages.
 * @param {object[]} services
 * @param {{ securityLevel: number, languages: string[] }} choices
 * @returns {object[]}
 */
export function computeCompatibleServices(
  services,
  { securityLevel, languages },
) {
  return filterBySecurityLevel(services, securityLevel).filter(
    (service) => computeServiceLanguage(service, languages) !== null,
  )
}

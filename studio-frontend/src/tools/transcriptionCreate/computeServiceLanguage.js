import { AUTO_LANGUAGE } from "../../const/transcriptionCreate.js"
import { computeLanguageCode } from "../computeLanguageCode.js"
import { computeServiceLanguages } from "./computeServiceLanguages.js"

/**
 * Language to send to a transcription service for the chosen languages. A
 * service takes one value: several languages can only go through detection,
 * which a single language also falls back to on a detection-only service.
 * @param {{ language?: string }} service - one entry of GET /services
 * @param {string[]} languages - draft.languages
 * @returns {string|null} null when the service can't handle the languages
 */
export function computeServiceLanguage(service, languages) {
  const offered = computeServiceLanguages(service)
  const detects = offered.includes(AUTO_LANGUAGE)
  if (languages.length !== 1 || languages[0] === AUTO_LANGUAGE) {
    return detects ? AUTO_LANGUAGE : null
  }
  const exactMatch = offered.find(
    (code) => computeLanguageCode(code) === languages[0],
  )
  return exactMatch ?? (detects ? AUTO_LANGUAGE : null)
}

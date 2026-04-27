import computeSessionTurnUniqueId from "../const/computeSessionTurnUniqueId.js"
import classifySessionTurn from "./classifySessionTurn.js"
import { computeTurnStartDate, computeTurnEndDate } from "./computeTurnTime.js"

/**
 * Converts closedCaptions + translatedCaptions into LiveFinalEvent[].
 * Shared by sessionToEditorDocument and SessionLiveNG.
 *
 * @param {object} options
 * @param {Array} options.closedCaptions
 * @param {Array} options.translatedCaptions
 * @param {boolean} options.diarization
 * @param {string} options.defaultLanguage
 * @returns {Array} LiveFinalEvent[]
 */
export default function processSessionCaptions({
  closedCaptions,
  translatedCaptions,
  diarization,
  defaultLanguage,
}) {
  return (closedCaptions ?? [])
    .filter((c) => c.segmentId != null)
    .filter((c) => classifySessionTurn(c, diarization) === "original")
    .map((c) => {
      return {
        turnId: computeSessionTurnUniqueId(c),
        text: c.text ?? null,
        words: [],
        speakerId: c.locutor ?? null,
        startDate: computeTurnStartDate(c),
        endDate: computeTurnEndDate(c),
        language: c.lang ?? defaultLanguage,
        translations:
          translatedCaptions && c.segmentId in translatedCaptions
            ? translatedCaptions[c.segmentId].map((tr) => ({
                translationId: tr.targetLang,
                text: tr.text ?? null,
                language: tr.targetLang,
              }))
            : [],
      }
    })
}

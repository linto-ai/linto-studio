import computeSessionTurnUniqueId from "../const/computeSessionTurnUniqueId.js"
import classifySessionTurn from "./classifySessionTurn.js"
import { computeTurnStartTime, computeTurnEndTime } from "./computeTurnTime.js"

/**
 * Converts closedCaptions + translatedCaptions into LiveFinalEvent[].
 * Shared by sessionToEditorDocument and SessionLiveNG.
 *
 * @param {object} options
 * @param {Array} options.closedCaptions
 * @param {Array} options.translatedCaptions
 * @param {number} options.sessionStartMs
 * @param {boolean} options.diarization
 * @param {string} options.defaultLanguage
 * @returns {Array} LiveFinalEvent[]
 */
export default function processSessionCaptions({
  closedCaptions,
  translatedCaptions,
  sessionStartMs,
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
        startTime: computeTurnStartTime(c, sessionStartMs),
        endTime: computeTurnEndTime(c, sessionStartMs),
        language: c.lang ?? defaultLanguage,
        translations:
          c.segmentId in translatedCaptions
            ? translatedCaptions[c.segmentId].map((tr) => ({
                translationId: tr.targetLang,
                text: tr.text ?? null,
                language: tr.targetLang,
              }))
            : [],
      }
    })
}

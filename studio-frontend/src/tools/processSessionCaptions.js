import computeSessionTurnUniqueId from "../const/computeSessionTurnUniqueId.js"
import classifySessionTurn from "./classifySessionTurn.js"

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
  function toSessionTime(astart, offset) {
    if (!astart) return offset
    return Math.max(
      0,
      (new Date(astart).getTime() - sessionStartMs) / 1000 + offset,
    )
  }

  // Index translations by segmentId
  const translationsBySegmentId = {}
  for (const tc of translatedCaptions ?? []) {
    if (!translationsBySegmentId[tc.segmentId]) {
      translationsBySegmentId[tc.segmentId] = []
    }
    translationsBySegmentId[tc.segmentId].push({
      translationId: tc.targetLang,
      text: tc.text ?? null,
      language: tc.targetLang,
    })
  }

  return (closedCaptions ?? [])
    .filter((c) => c.segmentId != null)
    .filter((c) => classifySessionTurn(c, diarization) === "original")
    .map((c) => ({
      turnId: computeSessionTurnUniqueId(c),
      text: c.text ?? null,
      words: [],
      speakerId: c.locutor ?? null,
      startTime: toSessionTime(c.astart, c.start),
      endTime: toSessionTime(c.astart, c.end),
      language: c.lang ?? defaultLanguage,
      translations: translationsBySegmentId[c.segmentId],
    }))
}

import computeSessionTurnUniqueId from "@/const/computeSessionTurnUniqueId"
import classifySessionTurn from "@/tools/classifySessionTurn"

/**
 * Converts an array of closedCaptions (API format) into LiveFinalEvent[]
 * suitable for editor.live.prependFinalBatch().
 *
 * @param {Array} closedCaptions - Array of caption objects from API
 * @param {number} sessionStartMs - session.startTime as milliseconds
 * @param {boolean} hasDiarization - whether the channel has diarization
 * @param {string} defaultLanguage - fallback language code
 * @returns {Array} LiveFinalEvent[]
 */
export default function closedCaptionsToLiveFinalEvents(
  closedCaptions,
  sessionStartMs,
  hasDiarization,
  defaultLanguage,
) {
  return closedCaptions
    .filter((c) => c.segmentId != null)
    .filter((c) => classifySessionTurn(c, hasDiarization) === "original")
    .map((c) => ({
      turnId: computeSessionTurnUniqueId(c),
      speakerId: c.locutor ?? null,
      words: [],
      startTime: Math.max(
        0,
        (new Date(c.astart).getTime() - sessionStartMs) / 1000 + c.start,
      ),
      endTime: Math.max(
        0,
        (new Date(c.astart).getTime() - sessionStartMs) / 1000 + c.end,
      ),
      language: c.lang ?? defaultLanguage,
      text: c.text ?? null,
    }))
}

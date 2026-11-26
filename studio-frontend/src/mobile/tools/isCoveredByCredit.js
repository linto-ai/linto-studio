const MINUTE_MS = 60_000

/**
 * Whether the transcription minutes available cover a recording of this
 * duration, a started minute counting as a whole one. False when the
 * minutes are unknown.
 * @param {number} durationMs
 * @param {number|null} availableMinutes
 * @returns {boolean}
 */
export function isCoveredByCredit(durationMs, availableMinutes) {
  if (availableMinutes == null) return false
  return Math.ceil(durationMs / MINUTE_MS) <= availableMinutes
}

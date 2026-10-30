const MINUTE_MS = 60_000

/**
 * Whether the transcription minutes available cover a recording, a started
 * minute counting as a whole one. False when the minutes are unknown.
 * @param {{ durationMs?: number }} recording
 * @param {number|null} availableMinutes
 * @returns {boolean}
 */
export function isCoveredByCredit(recording, availableMinutes) {
  if (availableMinutes == null) return false
  return Math.ceil((recording.durationMs || 0) / MINUTE_MS) <= availableMinutes
}

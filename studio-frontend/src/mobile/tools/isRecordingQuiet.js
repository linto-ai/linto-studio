const QUIET_PEAK_LEVEL = 0.12

/**
 * A recording whose meter never really moved: the wrong input, or a muted
 * one. Unknown peaks (older recordings) are not flagged.
 * @param {{ peakLevel?: number } | null} recording
 * @returns {boolean}
 */
export function isRecordingQuiet(recording) {
  const peak = recording?.peakLevel
  return typeof peak === "number" && peak < QUIET_PEAK_LEVEL
}

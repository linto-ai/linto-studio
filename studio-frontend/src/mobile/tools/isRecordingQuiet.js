const QUIET_PEAK_LEVEL = 0.12

/**
 * A recording whose meter never really moved: the wrong input, or a muted
 * one. Unknown peaks (older recordings) are not flagged.
 * @param {import("../types/localRecording.ts").RecordedAudio | null} audio
 * @returns {boolean}
 */
export function isRecordingQuiet(audio) {
  const peak = audio?.peakLevel
  return typeof peak === "number" && peak < QUIET_PEAK_LEVEL
}

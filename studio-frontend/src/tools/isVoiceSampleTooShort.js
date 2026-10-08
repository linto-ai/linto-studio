import { VOICE_SAMPLE_DURATION } from "./voiceprintConstants.js"

// An unknown duration is let through: the server checks the real length.
export function isVoiceSampleTooShort(durationSeconds) {
  if (!Number.isFinite(durationSeconds)) return false
  return durationSeconds < VOICE_SAMPLE_DURATION.MIN_SECONDS
}

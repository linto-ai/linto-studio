import { AUDIO_CONSTRAINTS } from "../const/audioConstraints.js"

/**
 * getUserMedia constraints for a voice recording, pinned to a device when
 * the user picked one (null or "default" = browser default input).
 * @param {string|null} deviceId
 * @returns {{ audio: object }}
 */
export function buildAudioConstraints(deviceId) {
  const pinned = deviceId && deviceId !== "default"
  return {
    audio: pinned
      ? { ...AUDIO_CONSTRAINTS, deviceId: { exact: deviceId } }
      : { ...AUDIO_CONSTRAINTS },
  }
}

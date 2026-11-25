/**
 * Bytes of audio the listed recordings hold on the phone.
 * @param {import("../types/localRecording.ts").LocalRecording[]} recordings
 * @returns {number}
 */
export function sumRecordingBytes(recordings) {
  return recordings.reduce((total, item) => total + item.audio.sizeBytes, 0)
}

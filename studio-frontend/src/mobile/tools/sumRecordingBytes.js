/**
 * Bytes of audio the listed recordings hold on the phone.
 * @param {{ sizeBytes?: number }[]} recordings
 * @returns {number}
 */
export function sumRecordingBytes(recordings) {
  return recordings.reduce((total, item) => total + (item.sizeBytes || 0), 0)
}

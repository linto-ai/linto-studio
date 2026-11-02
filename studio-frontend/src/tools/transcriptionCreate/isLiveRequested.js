/**
 * Whether the draft asks for a transcription during the recording.
 * @param {{ source: string, timing: string }} draft
 * @returns {boolean}
 */
export function isLiveRequested({ source, timing }) {
  return source !== "file" && timing !== "offline"
}

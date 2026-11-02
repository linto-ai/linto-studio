/**
 * Whether the draft asks for a transcription once the audio is complete.
 * @param {{ source: string, timing: string }} draft
 * @returns {boolean}
 */
export function isOfflineRequested({ source, timing }) {
  return source === "file" || timing !== "live"
}

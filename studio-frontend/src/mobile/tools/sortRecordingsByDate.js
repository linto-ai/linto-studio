/**
 * Newest first, without mutating the input.
 * @param {{ createdAt: number }[]} recordings
 * @returns {{ createdAt: number }[]}
 */
export function sortRecordingsByDate(recordings) {
  return [...recordings].sort((a, b) => b.createdAt - a.createdAt)
}

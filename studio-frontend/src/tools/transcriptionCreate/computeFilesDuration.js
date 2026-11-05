/**
 * Real duration of a set of files. Not what they cost: see computeFilesMinutes.
 * @param {(number|null)[]} durations - seconds, null when unknown
 * @returns {{ seconds: number, isPartial: boolean }} isPartial: some durations
 *   are unknown, the files last at least these seconds
 */
export function computeFilesDuration(durations) {
  const known = durations.filter((seconds) => seconds !== null)
  return {
    seconds: known.reduce((total, seconds) => total + seconds, 0),
    isPartial: known.length < durations.length,
  }
}

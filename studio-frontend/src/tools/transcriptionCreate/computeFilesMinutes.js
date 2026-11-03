const SECONDS_PER_MINUTE = 60

/**
 * Transcription minutes a set of files needs, a started minute counting as a
 * whole one for each file.
 * @param {(number|null)[]} durations - seconds, null when unknown
 * @returns {{ minutes: number, isPartial: boolean }} isPartial: some durations
 *   are unknown, the files need at least these minutes
 */
export function computeFilesMinutes(durations) {
  const known = durations.filter((seconds) => seconds !== null)
  return {
    minutes: known.reduce(
      (total, seconds) => total + Math.ceil(seconds / SECONDS_PER_MINUTE),
      0,
    ),
    isPartial: known.length < durations.length,
  }
}

/**
 * Progress reports in a row that found the recording file no bigger than
 * at the report before. The native recorder raises no error when it stops
 * writing (storage full, media server restarted): its file just stops
 * growing. A pause, or a size that could not be read, resets the count.
 * @param {{ count: number, previousSize: number|null,
 *   sizeBytes: number|null, paused: boolean }} report
 * @returns {number}
 */
export function countStalledReports({
  count,
  previousSize,
  sizeBytes,
  paused,
}) {
  switch (true) {
    case paused || previousSize === null || sizeBytes === null:
      return 0
    case sizeBytes <= previousSize:
      return count + 1
    default:
      return 0
  }
}

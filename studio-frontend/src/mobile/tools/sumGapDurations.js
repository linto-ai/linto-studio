/**
 * Total time not recorded during automatic pauses.
 * @param {{ durationMs: number }[] | undefined} gaps
 * @returns {number} milliseconds
 */
export function sumGapDurations(gaps) {
  return (gaps || []).reduce((total, gap) => total + gap.durationMs, 0)
}

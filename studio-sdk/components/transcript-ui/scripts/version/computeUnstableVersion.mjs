/** <stable>-unstable.<UTC minute, YYYYMMDDHHMM>: a prerelease of the NEXT
 *  stable, so it sorts above the last one published, and unstable builds
 *  sort by time. */
export function computeUnstableVersion(stableVersion, date) {
  const stamp = date.toISOString().slice(0, 16).replace(/\D/g, "")
  return `${stableVersion}-unstable.${stamp}`
}

const STABLE_VERSION = /^(\d+)\.(\d+)\.(\d+)$/

/** [major, minor, patch] of a plain x.y.z version, null for anything else
 *  (a prerelease such as 0.9.24-unstable.202610151200 included). */
export function parseStableVersion(version) {
  const match = STABLE_VERSION.exec(version)
  return match ? match.slice(1).map(Number) : null
}

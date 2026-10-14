/**
 * @param {Array<{ versionNumber: number }>} versions - mapped versions
 * @returns {number|null} the highest version number, null without versions
 */
export function computeLatestVersionNumber(versions) {
  if (versions.length === 0) return null
  return Math.max(...versions.map((version) => version.versionNumber))
}

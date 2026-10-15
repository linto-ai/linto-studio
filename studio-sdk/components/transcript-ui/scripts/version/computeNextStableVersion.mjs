import { parseStableVersion } from "./parseStableVersion.mjs"

/** The next stable version: the registry's last stable with its patch
 *  bumped, unless package.json's version (the floor) is higher — a minor or
 *  major release is a bump committed there. Prereleases are ignored. */
export function computeNextStableVersion(publishedVersions, floorVersion) {
  const floor = parseStableVersion(floorVersion)
  const lastStable = publishedVersions
    .map(parseStableVersion)
    .filter(Boolean)
    .sort(compareVersions)
    .at(-1)
  if (!lastStable) return floorVersion
  const bumped = [lastStable[0], lastStable[1], lastStable[2] + 1]
  return (compareVersions(bumped, floor) >= 0 ? bumped : floor).join(".")
}

function compareVersions(a, b) {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
}

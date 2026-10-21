/**
 * The pack checked first in a pack choice: the middle one of three or more
 * (a better hourly price than the smallest), the smallest one otherwise.
 * @param {Array<{packKey: string, minutes: number}>} packs
 * @returns {string|null} its packKey, or null without any pack
 */
export function computeRecommendedPackKey(packs) {
  if (!Array.isArray(packs) || packs.length === 0) return null
  const sorted = [...packs].sort((a, b) => a.minutes - b.minutes)
  const index = sorted.length >= 3 ? Math.floor(sorted.length / 2) : 0
  return sorted[index].packKey
}

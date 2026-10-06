import { computePackGroups } from "./computePackGroups.js"

/**
 * The pack the purchase modal checks first: the first card it shows (first
 * kind, smallest pack), whatever order the catalog came in.
 * @param {Array} packs - purchasable packs (see computePurchasablePacks)
 * @returns {string|null} its packKey, or null without any pack
 */
export function computeDefaultPackKey(packs) {
  const [firstGroup] = computePackGroups(packs)
  return firstGroup?.packs[0]?.packKey ?? null
}

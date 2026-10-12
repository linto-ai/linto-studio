/**
 * Packs of the catalog an organization on `plan` may buy. Mirrors the API
 * rule (packAllowedForPlan in linto-studio-cloud-service src/plans/packs.js):
 * a pack restricted to some plans checks its list; an unrestricted one (empty
 * `plans`) is sold to every plan whose live.minutes credit is purchasable.
 * @param {Array<{packKey: string, plans?: string[]}>} packs - from GET /cloud/packs
 * @param {{planKey: string, entitlements?: object}|null} plan - the org's catalog plan
 * @returns {Array} the purchasable packs, catalog order kept
 */
export function computePurchasablePacks(packs, plan) {
  if (!Array.isArray(packs) || !plan) return []
  return packs.filter((pack) => isPackAllowedForPlan(pack, plan))
}

function isPackAllowedForPlan(pack, plan) {
  if (pack.plans?.length) return pack.plans.includes(plan.planKey)
  const rule = plan.entitlements?.["live.minutes"]
  return rule?.type === "credit" && !!rule.purchasable
}

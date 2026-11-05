// Display name of a plan of the catalog, the key itself when the catalog lacks it
export function getPlanDisplayName(plans, planKey) {
  const plan = plans.find((candidate) => candidate.planKey === planKey)
  return plan ? plan.displayName : planKey
}

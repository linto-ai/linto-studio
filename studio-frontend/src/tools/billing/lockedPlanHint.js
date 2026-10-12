// Why a feature is locked: the cheapest plan that unlocks it, or paid plans
// in general while the catalog is loading.
export function lockedPlanHint(translate, plan) {
  if (plan?.displayName) {
    return translate("billing.feature_locked_plan", { plan: plan.displayName })
  }
  return translate("billing.feature_locked_paid")
}

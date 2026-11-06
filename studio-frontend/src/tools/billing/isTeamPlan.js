// A team plan grants collaboration: the only plan a team organization may hold
// without being locked. Mirrors the cloud plugin's rule.
export function isTeamPlan(plan) {
  return plan?.entitlements?.collaboration?.value === true
}

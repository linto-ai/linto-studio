// Plan filter of the backoffice organisation list -> query of
// GET /administration/organizations. "<planKey>" keeps the organisations on
// that plan, "<planKey>:expired" those whose paid plan ended, "all" every one.
export function buildPlanFilterQuery(value) {
  if (!value || value === "all") return {}
  const [plan, state] = value.split(":")
  return { plan, planState: state || "active" }
}

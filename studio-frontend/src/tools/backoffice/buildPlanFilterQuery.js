// PopoverList value of the plan filter ("all", "<planKey>", "<planKey>:expired")
// to the plan / planState query of GET /administration/organizations.
export function buildPlanFilterQuery(value) {
  if (!value || value === "all") return {}
  const [plan, state] = value.split(":")
  return { plan, planState: state || "active" }
}

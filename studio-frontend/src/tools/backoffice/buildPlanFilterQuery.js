import {
  PLAN_FILTER_ALL,
  PLAN_FILTER_STATE_SEPARATOR,
  PLAN_STATE_ACTIVE,
} from "../../const/organizationPlan.js"

// Value of the plan filter to the plan / planState query of GET /administration/organizations
export function buildPlanFilterQuery(value) {
  if (!value || value === PLAN_FILTER_ALL) return {}
  const [plan, state] = value.split(PLAN_FILTER_STATE_SEPARATOR)
  return { plan, planState: state || PLAN_STATE_ACTIVE }
}

import { isTeamPlan } from "../billing/isTeamPlan.js"
import {
  PLAN_FILTER_ALL,
  PLAN_FILTER_STATE_SEPARATOR,
  PLAN_STATE_EXPIRED,
} from "../../const/organizationPlan.js"

// Items of the backoffice plan filter: every plan of the catalog, then the
// expired variant of the team plans, the only ones whose end locks the organization.
export function buildPlanFilterItems(translate, plans) {
  const items = [
    {
      value: PLAN_FILTER_ALL,
      name: translate("backoffice.organisation_list.plan_filter.all"),
    },
  ]
  for (const plan of plans) {
    items.push({ value: plan.planKey, name: plan.displayName })
  }
  for (const plan of plans.filter(isTeamPlan)) {
    items.push({
      value: `${plan.planKey}${PLAN_FILTER_STATE_SEPARATOR}${PLAN_STATE_EXPIRED}`,
      name: translate("backoffice.organisation_list.plan_filter.expired", {
        plan: plan.displayName,
      }),
    })
  }
  return items
}

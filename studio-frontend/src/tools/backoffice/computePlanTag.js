import { PLAN_STATE_EXPIRED } from "../../const/organizationPlan.js"

// i18n key of the tag shown next to an organization's plan, null for a plain
// active subscription.
export function computePlanTag(plan) {
  if (plan.state === PLAN_STATE_EXPIRED) return "orga_table.plan.expired"
  if (plan.mode !== "normal") return `billing.mode.${plan.mode}`
  if (plan.source === "manual") return "orga_table.plan.manual"
  return null
}

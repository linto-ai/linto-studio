import { PLAN_STATE_EXPIRED } from "../../const/organizationPlan.js"

// The date shown under an organization's plan with its i18n key, null when none
export function computePlanDate(plan) {
  if (plan.renewsAt)
    return { key: "orga_table.plan.renews_on", date: plan.renewsAt }
  if (!plan.endsAt) return null
  const key =
    plan.state === PLAN_STATE_EXPIRED
      ? "orga_table.plan.ended_on"
      : "orga_table.plan.ends_on"
  return { key, date: plan.endsAt }
}

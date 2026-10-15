import { computeBillingInterval } from "./computeBillingInterval.js"
import { isCollaboratorRole } from "../seats/isCollaboratorRole.js"

// Statuses that keep a plan (Subscription.ACTIVE_STATUSES in linto-studio-cloud-service)
const ACTIVE_STATUSES = ["active", "trialing", "past_due"]

/**
 * What the reactivation of a lost per-seat plan starts from: the seats and
 * the billing period of the last subscription the organization had on it,
 * never fewer seats than its collaborators (the API would raise them silently,
 * the total shown would be wrong) nor than the plan floor.
 * @param {object} params
 * @param {object} params.plan - catalog plan to reactivate ({ planKey, pricing })
 * @param {Array} params.subscriptions - GET /cloud/subscriptions, most recent first
 * @param {Array<{role: number}>} params.members - the organization members
 * @returns {{minSeats: number, seats: number, billingPeriod: "monthly"|"annual"}}
 */
export function computeReactivationDefaults({ plan, subscriptions, members }) {
  const collaboratorCount = (members || []).filter((member) =>
    isCollaboratorRole(member.role),
  ).length
  const minSeats = Math.max(plan.pricing.seatsIncluded || 1, collaboratorCount)
  const previous = (subscriptions || []).find(
    (subscription) =>
      subscription.planKey === plan.planKey &&
      !ACTIVE_STATUSES.includes(subscription.status),
  )
  if (!previous) return { minSeats, seats: minSeats, billingPeriod: "monthly" }
  return {
    minSeats,
    seats: Math.max(minSeats, previous.seats || 0),
    billingPeriod: computeBillingInterval(
      previous.currentPeriodStart,
      previous.currentPeriodEnd,
    ),
  }
}

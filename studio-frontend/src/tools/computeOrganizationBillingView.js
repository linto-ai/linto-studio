import { computeQuotaMeters } from "./billingMeters.js"

const FREE_PLAN_KEY = "free_payg"

// Quotas shown on the billing tab, in display order, with their label.
// api.calls is left out: it only matters to API integrators.
const DISPLAYED_METERS = [
  { key: "import.minutes", labelKey: "billing.settings.meter.import" },
  { key: "ai.generations", labelKey: "billing.settings.meter.ai" },
  { key: "ai.chat", labelKey: "billing.settings.meter.chat" },
]

/**
 * What the billing settings tab shows for one organization, derived from its
 * usage summary, its subscription row and the plan catalog. Pure: no i18n and
 * no formatting, and never an amount (proration and tax make any client-side
 * price wrong; amounts come from Stripe through GET /cloud/billing).
 * @param {object} params
 * @param {object|null} params.organization - studio organization ({ personal })
 * @param {object|null} params.usage - GET /cloud/usage/:orgId
 * @param {object|null} params.subscription - the active row of GET /cloud/subscriptions
 * @param {Array} params.plans - GET /cloud/plans
 * @returns {object} the view model
 */
export function computeOrganizationBillingView({
  organization,
  usage,
  subscription,
  plans,
}) {
  const planKey = usage?.planKey || subscription?.planKey || FREE_PLAN_KEY
  const plan = (plans || []).find((p) => p.planKey === planKey) || null
  const isFree = planKey === FREE_PLAN_KEY
  const meters = computeDisplayedMeters(usage?.capabilities)

  return {
    planKey,
    plan,
    isFree,
    isUnmetered: !!usage?.mode && usage.mode !== "normal",
    isLocked: usage?.locked === true,
    isPerSeat: plan?.pricing?.perSeat === true,
    // Premium is only sold to personal orgs; free team orgs get no plan
    // action until their offer is decided.
    canUpgradeToPremium: isFree && organization?.personal === true,
    // The portal needs a Stripe customer: a plan set at the backoffice
    // (manual, comp, managed) has none.
    canManageSubscription: !isFree && !!subscription?.stripeSubscriptionId,
    meters,
    liveCredit: computeLiveCredit(usage?.live),
    quotaResetAt: meters.find((meter) => meter.resetAt)?.resetAt || null,
    renewalAt: subscription?.currentPeriodEnd || null,
    cancelsAtPeriodEnd: subscription?.cancelAtPeriodEnd === true,
  }
}

function computeDisplayedMeters(capabilities) {
  const meters = computeQuotaMeters(capabilities)
  return DISPLAYED_METERS.map(({ key, labelKey }) => {
    const meter = meters.find((m) => m.key === key)
    return meter ? { ...meter, labelKey } : null
  }).filter(Boolean)
}

// usage.live is an org-wide prepaid balance, not a per-period quota: it gets
// its own tile rather than a used/limit meter.
function computeLiveCredit(live) {
  if (!live) return null
  return {
    balance: live.balance || 0,
    expiresAt: live.expiresAt || null,
    unmetered: live.unmetered === true,
  }
}

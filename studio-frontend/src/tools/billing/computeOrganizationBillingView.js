const FREE_PLAN_KEY = "free_payg"

// comp and managed orgs are billed outside the SaaS: whatever plan the
// backoffice set, they read like a free plan with no plan action at all.
const UNMETERED_PLAN = {
  isFree: true,
  isPerSeat: false,
  canUpgradeToPremium: false,
  canManageSubscription: false,
  renewalAt: null,
  cancelsAtPeriodEnd: false,
}

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
  const mode = usage?.mode || "normal"

  const view = {
    planKey,
    plan,
    mode,
    isFree,
    isUnmetered: mode !== "normal",
    isLocked: usage?.locked === true,
    isPerSeat: plan?.pricing?.perSeat === true,
    // Premium is only sold to personal orgs; free team orgs get no plan
    // action until their offer is decided.
    canUpgradeToPremium: isFree && organization?.personal === true,
    // The portal needs a Stripe customer: a plan set at the backoffice
    // (manual, comp, managed) has none.
    canManageSubscription: !isFree && !!subscription?.stripeSubscriptionId,
    renewalAt: subscription?.currentPeriodEnd || null,
    cancelsAtPeriodEnd: subscription?.cancelAtPeriodEnd === true,
  }
  return view.isUnmetered ? { ...view, ...UNMETERED_PLAN } : view
}

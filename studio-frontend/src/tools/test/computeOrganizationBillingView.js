import test from "ava"
import { computeOrganizationBillingView } from "../computeOrganizationBillingView.js"

const PLANS = [
  { planKey: "free_payg", displayName: "Free", pricing: { perSeat: false } },
  { planKey: "premium", displayName: "Premium", pricing: { perSeat: false } },
  { planKey: "business", displayName: "Business", pricing: { perSeat: true } },
]

const RESET_AT = "2026-10-28T00:00:00.000Z"

function quota(used, limit, unit = "count") {
  return { type: "quota", used, limit, unit, resetAt: RESET_AT }
}

function usageFor(planKey, extra = {}) {
  return {
    planKey,
    mode: "normal",
    capabilities: {
      "api.calls": quota(3, 100),
      "ai.chat": quota(12, 80),
      "import.minutes": quota(30, 120, "minutes"),
      "ai.generations": quota(2, 20),
      collaboration: { type: "boolean", enabled: false },
    },
    live: { balance: 45, expiresAt: "2027-09-01", unmetered: false },
    ...extra,
  }
}

const STRIPE_SUBSCRIPTION = {
  planKey: "premium",
  stripeSubscriptionId: "sub_1",
  currentPeriodEnd: "2026-10-28T10:00:00.000Z",
  cancelAtPeriodEnd: false,
}

test("a free personal organization can upgrade to Premium", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: true },
    usage: usageFor("free_payg"),
    subscription: null,
    plans: PLANS,
  })
  t.is(view.planKey, "free_payg")
  t.is(view.plan.displayName, "Free")
  t.true(view.isFree)
  t.true(view.canUpgradeToPremium)
  t.false(view.canManageSubscription)
  t.is(view.renewalAt, null)
})

test("a free team organization gets no plan action", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: false },
    usage: usageFor("free_payg"),
    subscription: null,
    plans: PLANS,
  })
  t.false(view.canUpgradeToPremium)
  t.false(view.canManageSubscription)
})

test("a plan billed by Stripe is managed through the portal", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: true },
    usage: usageFor("premium"),
    subscription: STRIPE_SUBSCRIPTION,
    plans: PLANS,
  })
  t.false(view.isFree)
  t.false(view.canUpgradeToPremium)
  t.true(view.canManageSubscription)
  t.is(view.renewalAt, STRIPE_SUBSCRIPTION.currentPeriodEnd)
  t.false(view.cancelsAtPeriodEnd)
})

test("a comp organization reads like a free plan with no plan action", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: false },
    usage: usageFor("business", { mode: "comp" }),
    subscription: {
      planKey: "business",
      source: "manual",
      currentPeriodEnd: "2026-10-28T10:00:00.000Z",
    },
    plans: PLANS,
  })
  t.is(view.mode, "comp")
  t.true(view.isUnmetered)
  t.true(view.isFree)
  t.false(view.isPerSeat)
  t.false(view.canUpgradeToPremium)
  t.false(view.canManageSubscription)
  t.is(view.renewalAt, null)
})

test("a managed personal organization on Free is not offered Premium", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: true },
    usage: usageFor("free_payg", { mode: "managed" }),
    subscription: null,
    plans: PLANS,
  })
  t.is(view.mode, "managed")
  t.true(view.isUnmetered)
  t.false(view.canUpgradeToPremium)
})

test("an organization without a mode is a normal one", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: true },
    usage: usageFor("free_payg", { mode: undefined }),
    subscription: null,
    plans: PLANS,
  })
  t.is(view.mode, "normal")
  t.false(view.isUnmetered)
})

test("a cancellation at period end is reported", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: true },
    usage: usageFor("premium"),
    subscription: { ...STRIPE_SUBSCRIPTION, cancelAtPeriodEnd: true },
    plans: PLANS,
  })
  t.true(view.cancelsAtPeriodEnd)
})

test("keeps the displayed quotas only, in display order", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: true },
    usage: usageFor("free_payg"),
    subscription: null,
    plans: PLANS,
  })
  t.deepEqual(
    view.meters.map((meter) => [meter.key, meter.labelKey]),
    [
      ["import.minutes", "billing.settings.meter.import"],
      ["ai.generations", "billing.settings.meter.ai"],
      ["ai.chat", "billing.settings.meter.chat"],
    ],
  )
  t.is(view.meters[0].used, 30)
  t.is(view.meters[0].limit, 120)
  t.is(view.meters[0].unit, "minutes")
  t.is(view.quotaResetAt, RESET_AT)
})

test("the live balance gets its own tile", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: true },
    usage: usageFor("free_payg"),
    subscription: null,
    plans: PLANS,
  })
  t.deepEqual(view.liveCredit, {
    balance: 45,
    expiresAt: "2027-09-01",
    unmetered: false,
  })
})

test("a locked team organization is reported", (t) => {
  const view = computeOrganizationBillingView({
    organization: { personal: false },
    usage: usageFor("free_payg", { locked: true }),
    subscription: null,
    plans: PLANS,
  })
  t.true(view.isLocked)
})

test("an organization without usage yet falls back to the free plan", (t) => {
  const view = computeOrganizationBillingView({
    organization: null,
    usage: null,
    subscription: null,
    plans: [],
  })
  t.is(view.planKey, "free_payg")
  t.is(view.plan, null)
  t.true(view.isFree)
  t.false(view.canUpgradeToPremium)
  t.false(view.isUnmetered)
  t.deepEqual(view.meters, [])
  t.is(view.liveCredit, null)
  t.is(view.quotaResetAt, null)
})

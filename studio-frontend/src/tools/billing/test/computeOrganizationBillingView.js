import test from "ava"
import { computeOrganizationBillingView } from "../computeOrganizationBillingView.js"

const PLANS = [
  { planKey: "free_payg", displayName: "Free", pricing: { perSeat: false } },
  { planKey: "premium", displayName: "Premium", pricing: { perSeat: false } },
  { planKey: "business", displayName: "Business", pricing: { perSeat: true } },
]

function usageFor(planKey, extra = {}) {
  return { planKey, mode: "normal", ...extra }
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
})

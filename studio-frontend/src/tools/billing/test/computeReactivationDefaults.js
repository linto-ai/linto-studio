import test from "ava"
import { computeReactivationDefaults } from "../computeReactivationDefaults.js"
import { ORGANIZATION_ROLES } from "../../../const/organizationRoles.js"

const business = {
  planKey: "business",
  pricing: { perSeat: true, seatsIncluded: 2 },
}

function membersWith(collaborators, readers = 0) {
  return [
    ...Array.from({ length: collaborators }, () => ({
      role: ORGANIZATION_ROLES.UPLOADER,
    })),
    ...Array.from({ length: readers }, () => ({
      role: ORGANIZATION_ROLES.MEMBER,
    })),
  ]
}

test("without a past subscription: the plan floor, monthly", (t) => {
  t.deepEqual(
    computeReactivationDefaults({
      plan: business,
      subscriptions: [],
      members: membersWith(1, 5),
    }),
    { minSeats: 2, seats: 2, billingPeriod: "monthly" },
  )
})

test("never fewer seats than the collaborators, readers left out", (t) => {
  const defaults = computeReactivationDefaults({
    plan: business,
    subscriptions: null,
    members: membersWith(4, 10),
  })
  t.is(defaults.minSeats, 4)
  t.is(defaults.seats, 4)
})

test("takes back the seats and the period of the ended subscription", (t) => {
  const subscriptions = [
    {
      planKey: "business",
      status: "canceled",
      seats: 6,
      currentPeriodStart: "2025-03-01T00:00:00Z",
      currentPeriodEnd: "2026-03-01T00:00:00Z",
    },
  ]
  t.deepEqual(
    computeReactivationDefaults({
      plan: business,
      subscriptions,
      members: membersWith(3),
    }),
    { minSeats: 3, seats: 6, billingPeriod: "annual" },
  )
})

test("the collaborators win over fewer seats bought before", (t) => {
  const subscriptions = [{ planKey: "business", status: "unpaid", seats: 2 }]
  const defaults = computeReactivationDefaults({
    plan: business,
    subscriptions,
    members: membersWith(5),
  })
  t.is(defaults.seats, 5)
  t.is(defaults.billingPeriod, "monthly")
})

test("ignores active rows and other plans, keeps the most recent ended one", (t) => {
  const subscriptions = [
    { planKey: "premium", status: "canceled", seats: 1 },
    { planKey: "business", status: "active", seats: 40 },
    { planKey: "business", status: "canceled", seats: 8 },
    { planKey: "business", status: "canceled", seats: 3 },
  ]
  t.is(
    computeReactivationDefaults({ plan: business, subscriptions, members: [] })
      .seats,
    8,
  )
})

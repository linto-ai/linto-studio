import test from "ava"
import { computePlanDate } from "../computePlanDate.js"

test("a renewing plan shows its next renewal", (t) => {
  t.deepEqual(
    computePlanDate({ state: "active", renewsAt: "2026-11-21", endsAt: null }),
    {
      key: "orga_table.plan.renews_on",
      date: "2026-11-21",
    },
  )
})

test("a plan with an end shows it as planned or past", (t) => {
  t.deepEqual(
    computePlanDate({ state: "active", renewsAt: null, endsAt: "2027-01-01" }),
    {
      key: "orga_table.plan.ends_on",
      date: "2027-01-01",
    },
  )
  t.deepEqual(
    computePlanDate({ state: "expired", renewsAt: null, endsAt: "2026-09-22" }),
    {
      key: "orga_table.plan.ended_on",
      date: "2026-09-22",
    },
  )
})

test("a plan without any date shows nothing", (t) => {
  t.is(computePlanDate({ state: "active", renewsAt: null, endsAt: null }), null)
})

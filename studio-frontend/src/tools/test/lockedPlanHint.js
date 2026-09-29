import test from "ava"
import { lockedPlanHint } from "../lockedPlanHint.js"

function translate(key, values) {
  return values ? `${key}:${values.plan}` : key
}

test("names the plan that unlocks the feature", (t) => {
  t.is(
    lockedPlanHint(translate, { displayName: "Premium" }),
    "billing.feature_locked_plan:Premium",
  )
})

test("falls back to paid plans while the catalog is loading", (t) => {
  t.is(lockedPlanHint(translate, null), "billing.feature_locked_paid")
  t.is(lockedPlanHint(translate, {}), "billing.feature_locked_paid")
})

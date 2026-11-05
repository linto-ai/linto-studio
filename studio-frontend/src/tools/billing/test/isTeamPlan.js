import test from "ava"
import { isTeamPlan } from "../isTeamPlan.js"

test("a plan granting collaboration is a team plan", (t) => {
  t.true(isTeamPlan({ entitlements: { collaboration: { value: true } } }))
})

test("a plan without collaboration is not", (t) => {
  t.false(isTeamPlan({ entitlements: { collaboration: { value: false } } }))
  t.false(isTeamPlan({ entitlements: {} }))
  t.false(isTeamPlan(null))
})

import test from "ava"
import { getPlanDisplayName } from "../getPlanDisplayName.js"

const PLANS = [{ planKey: "business", displayName: "Business" }]

test("returns the catalog display name", (t) => {
  t.is(getPlanDisplayName(PLANS, "business"), "Business")
})

test("falls back to the key for a plan the catalog lacks", (t) => {
  t.is(getPlanDisplayName(PLANS, "legacy"), "legacy")
  t.is(getPlanDisplayName([], "business"), "business")
})

import test from "ava"
import { computePlanTag } from "../computePlanTag.js"

test("an expired plan is tagged expired whatever its mode or source", (t) => {
  t.is(
    computePlanTag({ state: "expired", mode: "normal", source: "manual" }),
    "orga_table.plan.expired",
  )
})

test("a non normal mode is tagged with the mode", (t) => {
  t.is(
    computePlanTag({ state: "active", mode: "comp", source: "system" }),
    "billing.mode.comp",
  )
  t.is(
    computePlanTag({ state: "active", mode: "managed", source: "stripe" }),
    "billing.mode.managed",
  )
})

test("a manual plan is tagged on quote, a Stripe one has no tag", (t) => {
  t.is(
    computePlanTag({ state: "active", mode: "normal", source: "manual" }),
    "orga_table.plan.manual",
  )
  t.is(
    computePlanTag({ state: "active", mode: "normal", source: "stripe" }),
    null,
  )
})

import test from "ava"
import { computeValidityDuration } from "../computeValidityDuration.js"

test("counts a year of days as 12 months", (t) => {
  t.deepEqual(computeValidityDuration(365), { value: 12, unit: "month" })
  t.deepEqual(computeValidityDuration(730), { value: 24, unit: "month" })
})

test("counts roughly a month from four weeks on", (t) => {
  t.deepEqual(computeValidityDuration(30), { value: 1, unit: "month" })
  t.deepEqual(computeValidityDuration(90), { value: 3, unit: "month" })
})

test("keeps days under four weeks", (t) => {
  t.deepEqual(computeValidityDuration(14), { value: 14, unit: "day" })
})

test("returns null without a positive duration", (t) => {
  t.is(computeValidityDuration(0), null)
  t.is(computeValidityDuration(undefined), null)
  t.is(computeValidityDuration(-3), null)
})

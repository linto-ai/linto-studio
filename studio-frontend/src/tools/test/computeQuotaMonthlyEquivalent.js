import test from "ava"
import { computeQuotaMonthlyEquivalent } from "../computeQuotaMonthlyEquivalent.js"

test("computeQuotaMonthlyEquivalent() multiplies a weekly limit by 4", (t) => {
  t.is(computeQuotaMonthlyEquivalent(60, "weekly"), 240)
  t.is(computeQuotaMonthlyEquivalent(5, "weekly"), 20)
  t.is(computeQuotaMonthlyEquivalent(20, "weekly"), 80)
})

test("computeQuotaMonthlyEquivalent() returns a monthly limit unchanged", (t) => {
  t.is(computeQuotaMonthlyEquivalent(1800, "monthly"), 1800)
})

test("computeQuotaMonthlyEquivalent() returns the limit unchanged for unknown periods", (t) => {
  t.is(computeQuotaMonthlyEquivalent(100, "yearly"), 100)
})

test("computeQuotaMonthlyEquivalent() returns 0 for null/undefined/NaN limits", (t) => {
  t.is(computeQuotaMonthlyEquivalent(null, "monthly"), 0)
  t.is(computeQuotaMonthlyEquivalent(undefined, "weekly"), 0)
  t.is(computeQuotaMonthlyEquivalent(NaN, "monthly"), 0)
})

test("computeQuotaMonthlyEquivalent() handles a zero limit", (t) => {
  t.is(computeQuotaMonthlyEquivalent(0, "weekly"), 0)
})

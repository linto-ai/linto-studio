import test from "ava"
import { computeAnnualPriceInfo } from "../computeAnnualPriceInfo.js"

test("computeAnnualPriceInfo() computes the monthly equivalent and free months (Premium)", (t) => {
  t.deepEqual(computeAnnualPriceInfo(1900, 19200), {
    monthlyEquivalentCents: 1600,
    freeMonths: 2,
  })
})

test("computeAnnualPriceInfo() computes the monthly equivalent and free months (Business)", (t) => {
  t.deepEqual(computeAnnualPriceInfo(1500, 14400), {
    monthlyEquivalentCents: 1200,
    freeMonths: 2,
  })
})

test("computeAnnualPriceInfo() returns null when there is no annual price", (t) => {
  t.is(computeAnnualPriceInfo(1900, 0), null)
  t.is(computeAnnualPriceInfo(1900, null), null)
})

test("computeAnnualPriceInfo() returns null for a free plan (no monthly price)", (t) => {
  t.is(computeAnnualPriceInfo(0, 0), null)
})

test("computeAnnualPriceInfo() returns 0 free months when the annual price is a plain x12", (t) => {
  t.deepEqual(computeAnnualPriceInfo(1000, 12000), {
    monthlyEquivalentCents: 1000,
    freeMonths: 0,
  })
})

import test from "ava"
import { isQuotaUnlimited } from "../billingMeters.js"

test("no limit is unlimited", (t) => {
  t.true(isQuotaUnlimited(null, "minutes"))
  t.true(isQuotaUnlimited(undefined, "count"))
})

test("a minutes quota above 100 h is unlimited", (t) => {
  t.false(isQuotaUnlimited(1800, "minutes"))
  t.true(isQuotaUnlimited(24000, "minutes"))
})

test("a credits quota above 1000 is unlimited", (t) => {
  t.false(isQuotaUnlimited(300, "credits"))
  t.false(isQuotaUnlimited(1000, "credits"))
  t.true(isQuotaUnlimited(4000, "credits"))
})

test("a plain count is never unlimited by its size", (t) => {
  t.false(isQuotaUnlimited(40000, "count"))
})

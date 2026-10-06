import test from "ava"
import { computeUsageStatus } from "../computeUsageStatus.js"

test("success under 80 % used", (t) => {
  t.is(computeUsageStatus(0, 120), "success")
  t.is(computeUsageStatus(95, 120), "success")
})

test("warning from 80 % used", (t) => {
  t.is(computeUsageStatus(96, 120), "warning")
  t.is(computeUsageStatus(119, 120), "warning")
})

test("danger once all of it is used, or more", (t) => {
  t.is(computeUsageStatus(120, 120), "danger")
  t.is(computeUsageStatus(150, 120), "danger")
})

test("a missing or zero limit counts as 1", (t) => {
  t.is(computeUsageStatus(0, 0), "success")
  t.is(computeUsageStatus(1, null), "danger")
})

import test from "ava"
import { formatUsageAmount } from "../formatUsageAmount.js"

test("minutes read as a duration", (t) => {
  t.is(formatUsageAmount(90, "minutes"), "1 h 30 min")
  t.is(formatUsageAmount(45, "minutes"), "45 min")
})

test("counts read as a round number", (t) => {
  t.is(formatUsageAmount(41, "count"), "41")
  t.is(formatUsageAmount(41.4, "count"), "41")
})

test("no consumption reads as zero, never as a blank", (t) => {
  t.is(formatUsageAmount(0, "count"), "0")
  t.is(formatUsageAmount(undefined, "minutes"), "0 min")
})

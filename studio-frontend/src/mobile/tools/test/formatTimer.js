import test from "ava"
import { formatTimer } from "../formatTimer.js"

test("formatTimer() pads minutes and seconds", (t) => {
  t.is(formatTimer(0), "00:00")
  t.is(formatTimer(7_000), "00:07")
  t.is(formatTimer(767_000), "12:47")
})

test("formatTimer() adds hours past sixty minutes", (t) => {
  t.is(formatTimer(3_600_000), "1:00:00")
  t.is(formatTimer(4_338_000), "1:12:18")
})

test("formatTimer() clamps negative values", (t) => {
  t.is(formatTimer(-5_000), "00:00")
})

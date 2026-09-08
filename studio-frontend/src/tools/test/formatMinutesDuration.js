import test from "ava"
import { formatMinutesDuration } from "../formatMinutesDuration.js"

test("formatMinutesDuration formats zero minutes", (t) => {
  t.is(formatMinutesDuration(0), "0 min")
})

test("formatMinutesDuration formats null/undefined as zero", (t) => {
  t.is(formatMinutesDuration(null), "0 min")
  t.is(formatMinutesDuration(undefined), "0 min")
})

test("formatMinutesDuration formats minutes only", (t) => {
  t.is(formatMinutesDuration(45), "45 min")
})

test("formatMinutesDuration formats exact hours", (t) => {
  t.is(formatMinutesDuration(60), "1 h")
  t.is(formatMinutesDuration(120), "2 h")
})

test("formatMinutesDuration formats hours and minutes", (t) => {
  t.is(formatMinutesDuration(90), "1 h 30 min")
})

test("formatMinutesDuration rounds fractional minutes", (t) => {
  t.is(formatMinutesDuration(59.6), "1 h")
})

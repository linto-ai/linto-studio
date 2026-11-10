import test from "ava"
import { sumGapDurations } from "../sumGapDurations.js"

test("sumGapDurations() adds the gaps", (t) => {
  t.is(
    sumGapDurations([
      { atMs: 1000, durationMs: 60_000, reason: "background" },
      { atMs: 5000, durationMs: 30_000, reason: "microphone" },
    ]),
    90_000,
  )
})

test("sumGapDurations() is 0 without gaps", (t) => {
  t.is(sumGapDurations([]), 0)
  t.is(sumGapDurations(undefined), 0)
})

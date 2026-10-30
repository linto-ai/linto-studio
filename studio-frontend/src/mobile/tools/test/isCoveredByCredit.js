import test from "ava"
import { isCoveredByCredit } from "../isCoveredByCredit.js"

test("isCoveredByCredit() rounds a started minute up", (t) => {
  const recording = { durationMs: 60_001 }
  t.false(isCoveredByCredit(recording, 1))
  t.true(isCoveredByCredit(recording, 2))
})

test("isCoveredByCredit() is false when the minutes are unknown", (t) => {
  t.false(isCoveredByCredit({ durationMs: 1000 }, null))
})

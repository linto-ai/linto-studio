import test from "ava"
import { computeFilesDuration } from "../computeFilesDuration.js"

test("adds the real seconds, without rounding each file", (t) => {
  t.deepEqual(computeFilesDuration([20, 20, 20]), {
    seconds: 60,
    isPartial: false,
  })
})

test("an unknown duration makes the total partial", (t) => {
  t.deepEqual(computeFilesDuration([90, null]), {
    seconds: 90,
    isPartial: true,
  })
})

test("no duration known", (t) => {
  t.deepEqual(computeFilesDuration([null]), { seconds: 0, isPartial: true })
})

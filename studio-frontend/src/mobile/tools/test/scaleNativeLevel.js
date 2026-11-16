import test from "ava"
import { scaleNativeLevel } from "../scaleNativeLevel.js"

test("scaleNativeLevel() boosts the peak", (t) => {
  t.is(scaleNativeLevel(0.2), 0.4)
})

test("scaleNativeLevel() stays between 0 and 1", (t) => {
  t.is(scaleNativeLevel(0.8), 1)
  t.is(scaleNativeLevel(-1), 0)
  t.is(scaleNativeLevel(undefined), 0)
})

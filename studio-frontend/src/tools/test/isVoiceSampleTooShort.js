import test from "ava"
import { isVoiceSampleTooShort } from "../isVoiceSampleTooShort.js"

test("a sample under 20 seconds is too short", (t) => {
  t.true(isVoiceSampleTooShort(0))
  t.true(isVoiceSampleTooShort(19.9))
})

test("a sample of 20 seconds or more is accepted", (t) => {
  t.false(isVoiceSampleTooShort(20))
  t.false(isVoiceSampleTooShort(125))
})

test("an unknown duration is let through", (t) => {
  t.false(isVoiceSampleTooShort(null))
  t.false(isVoiceSampleTooShort(undefined))
  t.false(isVoiceSampleTooShort(NaN))
})

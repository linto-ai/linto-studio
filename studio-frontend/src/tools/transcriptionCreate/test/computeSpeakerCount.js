import test from "ava"
import { computeSpeakerCount } from "../computeSpeakerCount.js"

test("keeps a count in range", (t) => {
  t.is(computeSpeakerCount("5", 2), 5)
})

test("brings a count back in range", (t) => {
  t.is(computeSpeakerCount("1", 3), 2)
  t.is(computeSpeakerCount("500", 3), 100)
})

test("drops the decimals", (t) => {
  t.is(computeSpeakerCount("4.7", 2), 4)
})

test("an empty field keeps the previous count", (t) => {
  t.is(computeSpeakerCount("", 3), 3)
})

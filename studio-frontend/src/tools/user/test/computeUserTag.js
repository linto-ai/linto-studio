import test from "ava"
import { computeUserTag } from "../computeUserTag.js"

test("computeUserTag() is stable for the same id", (t) => {
  const id = "6650c1f2a1b2c3d4e5f60718"
  t.deepEqual(computeUserTag(id), computeUserTag(id))
})

test("computeUserTag() returns a 4-character uppercase alphanumeric code", (t) => {
  t.regex(computeUserTag("6650c1f2a1b2c3d4e5f60718").code, /^[0-9A-Z]{4}$/)
})

test("computeUserTag() returns a hue between 0 and 359", (t) => {
  const { hue } = computeUserTag("6650c1f2a1b2c3d4e5f60718")
  t.true(Number.isInteger(hue))
  t.true(hue >= 0 && hue < 360)
})

test("computeUserTag() separates ObjectIds that only differ by their counter", (t) => {
  const first = computeUserTag("6650c1f2a1b2c3d4e5f60718")
  const second = computeUserTag("6650c1f2a1b2c3d4e5f60719")
  t.not(first.code, second.code)
  t.not(first.hue, second.hue)
})

test("computeUserTag() returns null without id", (t) => {
  t.is(computeUserTag(null), null)
  t.is(computeUserTag(undefined), null)
  t.is(computeUserTag(""), null)
})

import test from "ava"
import { parseSeatCount } from "../parseSeatCount.js"

test("reads a whole seat count, flooring a fraction", (t) => {
  t.is(parseSeatCount("5"), 5)
  t.is(parseSeatCount("2.7"), 2)
  t.is(parseSeatCount(3), 3)
})

test("empty, zero, negative or non-numeric is null", (t) => {
  t.is(parseSeatCount(""), null)
  t.is(parseSeatCount("0"), null)
  t.is(parseSeatCount("-2"), null)
  t.is(parseSeatCount(null), null)
  t.is(parseSeatCount("abc"), null)
})

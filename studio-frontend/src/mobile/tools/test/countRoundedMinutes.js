import test from "ava"
import { countRoundedMinutes } from "../countRoundedMinutes.js"

test("countRoundedMinutes() rounds to the nearest minute", (t) => {
  t.is(countRoundedMinutes(20_000), 0)
  t.is(countRoundedMinutes(40_000), 1)
  t.is(countRoundedMinutes(4 * 60_000 + 10_000), 4)
})

test("countRoundedMinutes() never goes below 0", (t) => {
  t.is(countRoundedMinutes(-5000), 0)
})

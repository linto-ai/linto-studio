import test from "ava"
import { arraySum } from "../arraySum.js"

test("sum of an non empty array", (t) => {
  t.is(arraySum([2, 5, 1]), 8)
})

test("sum of an empty array", (t) => {
  t.is(arraySum([]), 0)
})

import test from "ava"
import { clampNumber } from "../clampNumber.js"

test("keeps a value inside the bounds", (t) => {
  t.is(clampNumber(5, 2, 10), 5)
})

test("raises a value below the minimum", (t) => {
  t.is(clampNumber(0, 2, 10), 2)
})

test("lowers a value above the maximum", (t) => {
  t.is(clampNumber(12, 2, 10), 10)
})

test("a null maximum leaves the top open", (t) => {
  t.is(clampNumber(1000, 2, null), 1000)
  t.is(clampNumber(1, 2), 2)
})

test("a null minimum leaves the bottom open", (t) => {
  t.is(clampNumber(-5, null, 10), -5)
  t.is(clampNumber(-5), -5)
})

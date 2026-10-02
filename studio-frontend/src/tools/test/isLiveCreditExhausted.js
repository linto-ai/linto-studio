import test from "ava"
import { isLiveCreditExhausted } from "../isLiveCreditExhausted.js"

test("an empty balance is exhausted", (t) => {
  t.true(isLiveCreditExhausted({ balance: 0, unmetered: false }))
  t.true(isLiveCreditExhausted({ unmetered: false }))
})

test("a remaining balance is not exhausted", (t) => {
  t.false(isLiveCreditExhausted({ balance: 12, unmetered: false }))
})

test("an unmetered balance is never exhausted", (t) => {
  t.false(isLiveCreditExhausted({ balance: 0, unmetered: true }))
})

test("an unknown balance is not exhausted", (t) => {
  t.false(isLiveCreditExhausted(null))
})

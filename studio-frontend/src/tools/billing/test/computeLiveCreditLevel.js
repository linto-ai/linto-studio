import test from "ava"
import { computeLiveCreditLevel } from "../computeLiveCreditLevel.js"

test("an empty or negative balance is exhausted", (t) => {
  t.is(computeLiveCreditLevel({ balance: 0, lowBalance: true }), "exhausted")
  t.is(computeLiveCreditLevel({ balance: -3, lowBalance: true }), "exhausted")
})

test("a balance under the server threshold is low", (t) => {
  t.is(computeLiveCreditLevel({ balance: 8, lowBalance: true }), "low")
})

test("a comfortable balance is no concern", (t) => {
  t.is(computeLiveCreditLevel({ balance: 120, lowBalance: false }), null)
})

test("an unmetered org is never a concern", (t) => {
  t.is(computeLiveCreditLevel({ balance: 0, unmetered: true }), null)
})

test("an unknown balance is no concern", (t) => {
  t.is(computeLiveCreditLevel(null), null)
})

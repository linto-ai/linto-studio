import test from "ava"
import { computeSeatPrice } from "../computeSeatPrice.js"

const PRICING = { amountCents: 2999, amountCentsYearly: 28800 }

test("monthly period uses the monthly price", (t) => {
  t.deepEqual(computeSeatPrice(PRICING, "monthly"), {
    amountCents: 2999,
    isAnnual: false,
  })
})

test("annual period uses the yearly price", (t) => {
  t.deepEqual(computeSeatPrice(PRICING, "annual"), {
    amountCents: 28800,
    isAnnual: true,
  })
})

test("annual period falls back to the monthly price without a yearly one", (t) => {
  t.deepEqual(computeSeatPrice({ amountCents: 2999 }, "annual"), {
    amountCents: 2999,
    isAnnual: false,
  })
})

test("missing pricing costs nothing", (t) => {
  t.deepEqual(computeSeatPrice(undefined, "monthly"), {
    amountCents: 0,
    isAnnual: false,
  })
})

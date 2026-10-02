import test from "ava"
import { computeProratedSeatPrice } from "../computeProratedSeatPrice.js"

const PERIOD = {
  periodStart: "2026-09-01T00:00:00.000Z",
  periodEnd: "2026-10-01T00:00:00.000Z",
}

test("a seat added on the first day costs the whole period", (t) => {
  const price = computeProratedSeatPrice({
    ...PERIOD,
    unitCents: 2999,
    quantity: 1,
    now: new Date("2026-09-01T00:00:00.000Z"),
  })
  t.is(price.amountCents, 2999)
  t.is(price.ratio, 1)
})

test("halfway through the period, half the price", (t) => {
  const price = computeProratedSeatPrice({
    ...PERIOD,
    unitCents: 2999,
    quantity: 1,
    now: new Date("2026-09-16T00:00:00.000Z"),
  })
  t.is(price.amountCents, 1500)
})

test("several seats multiply the prorated unit price", (t) => {
  const price = computeProratedSeatPrice({
    ...PERIOD,
    unitCents: 2999,
    quantity: 3,
    now: new Date("2026-09-16T00:00:00.000Z"),
  })
  t.is(price.amountCents, 4499)
})

test("nothing is due once the period is over", (t) => {
  const price = computeProratedSeatPrice({
    ...PERIOD,
    unitCents: 2999,
    quantity: 2,
    now: new Date("2026-10-15T00:00:00.000Z"),
  })
  t.is(price.amountCents, 0)
  t.is(price.ratio, 0)
})

test("a date before the period never bills more than the period", (t) => {
  const price = computeProratedSeatPrice({
    ...PERIOD,
    unitCents: 2999,
    quantity: 1,
    now: new Date("2026-08-01T00:00:00.000Z"),
  })
  t.is(price.ratio, 1)
})

test("an unknown period yields no estimate at all", (t) => {
  t.is(
    computeProratedSeatPrice({
      unitCents: 2999,
      quantity: 1,
      periodStart: null,
      periodEnd: null,
      now: new Date(),
    }),
    null,
  )
})

test("an inconsistent period yields no estimate", (t) => {
  t.is(
    computeProratedSeatPrice({
      unitCents: 2999,
      quantity: 1,
      periodStart: "2026-10-01T00:00:00.000Z",
      periodEnd: "2026-09-01T00:00:00.000Z",
      now: new Date("2026-09-16T00:00:00.000Z"),
    }),
    null,
  )
})

test("Date objects work as well as ISO strings", (t) => {
  const price = computeProratedSeatPrice({
    periodStart: new Date("2026-09-01T00:00:00.000Z"),
    periodEnd: new Date("2026-10-01T00:00:00.000Z"),
    unitCents: 1000,
    quantity: 1,
    now: new Date("2026-09-16T00:00:00.000Z"),
  })
  t.is(price.amountCents, 500)
})

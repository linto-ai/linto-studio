import test from "ava"
import { computeBillingInterval } from "../computeBillingInterval.js"

test("a month-long period is monthly", (t) => {
  t.is(
    computeBillingInterval(
      "2026-09-01T00:00:00.000Z",
      "2026-10-01T00:00:00.000Z",
    ),
    "monthly",
  )
})

test("a year-long period is annual", (t) => {
  t.is(
    computeBillingInterval(
      "2026-09-01T00:00:00.000Z",
      "2027-09-01T00:00:00.000Z",
    ),
    "annual",
  )
})

test("a short month is still monthly", (t) => {
  t.is(
    computeBillingInterval(
      "2026-02-01T00:00:00.000Z",
      "2026-03-01T00:00:00.000Z",
    ),
    "monthly",
  )
})

test("an unknown period falls back to monthly", (t) => {
  t.is(computeBillingInterval(null, null), "monthly")
  t.is(computeBillingInterval("nope", "neither"), "monthly")
})

test("an inconsistent period falls back to monthly", (t) => {
  t.is(
    computeBillingInterval(
      "2027-09-01T00:00:00.000Z",
      "2026-09-01T00:00:00.000Z",
    ),
    "monthly",
  )
})

test("Date objects are accepted", (t) => {
  t.is(
    computeBillingInterval(
      new Date("2026-09-01T00:00:00.000Z"),
      new Date("2027-09-01T00:00:00.000Z"),
    ),
    "annual",
  )
})

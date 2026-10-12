import test from "ava"
import { computeEpochMs } from "../computeEpochMs.js"

test("computeEpochMs() parses a server ISO string with offset", (t) => {
  t.is(
    computeEpochMs("2026-09-30T10:00:00+02:00"),
    Date.UTC(2026, 8, 30, 8, 0, 0),
  )
})

test("computeEpochMs() keeps a finite epoch ms number", (t) => {
  t.is(computeEpochMs(1700000000000), 1700000000000)
  t.is(computeEpochMs(0), 0)
})

test("computeEpochMs() converts a Date", (t) => {
  t.is(computeEpochMs(new Date(1700000000000)), 1700000000000)
})

test("computeEpochMs() returns null for missing values", (t) => {
  t.is(computeEpochMs(null), null)
  t.is(computeEpochMs(undefined), null)
  t.is(computeEpochMs(""), null)
})

test("computeEpochMs() returns null for invalid values", (t) => {
  t.is(computeEpochMs("not a date"), null)
  t.is(computeEpochMs(NaN), null)
  t.is(computeEpochMs(Infinity), null)
  t.is(computeEpochMs(new Date("invalid")), null)
  t.is(computeEpochMs({}), null)
  t.is(computeEpochMs(true), null)
})

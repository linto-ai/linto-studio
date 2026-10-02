import test from "ava"
import { computeSeatSummary } from "../computeSeatSummary.js"

test("reports what is used and what is left", (t) => {
  t.deepEqual(computeSeatSummary(7, 10), {
    used: 7,
    capacity: 10,
    available: 3,
    isFull: false,
  })
})

test("a full plan has no seat left", (t) => {
  t.deepEqual(computeSeatSummary(10, 10), {
    used: 10,
    capacity: 10,
    available: 0,
    isFull: true,
  })
})

test("more collaborators than seats never reports a negative capacity", (t) => {
  t.deepEqual(computeSeatSummary(12, 10), {
    used: 12,
    capacity: 10,
    available: 0,
    isFull: true,
  })
})

test("no capacity means no cap and no figure", (t) => {
  t.deepEqual(computeSeatSummary(4, null), {
    used: 4,
    capacity: null,
    available: null,
    isFull: false,
  })
})

test("an empty organization uses no seat", (t) => {
  t.deepEqual(computeSeatSummary(0, 2), {
    used: 0,
    capacity: 2,
    available: 2,
    isFull: false,
  })
})

import test from "ava"
import { computeScrollEdges } from "../computeScrollEdges.js"

test("content that fits scrolls nowhere", (t) => {
  t.deepEqual(
    computeScrollEdges({ scrollLeft: 0, clientWidth: 600, scrollWidth: 600 }),
    { canScrollPrev: false, canScrollNext: false },
  )
})

test("at the start, only forward", (t) => {
  t.deepEqual(
    computeScrollEdges({ scrollLeft: 0, clientWidth: 600, scrollWidth: 1000 }),
    { canScrollPrev: false, canScrollNext: true },
  )
})

test("in the middle, both ways", (t) => {
  t.deepEqual(
    computeScrollEdges({
      scrollLeft: 200,
      clientWidth: 600,
      scrollWidth: 1000,
    }),
    { canScrollPrev: true, canScrollNext: true },
  )
})

test("at the end, only back, sub-pixel offsets included", (t) => {
  t.deepEqual(
    computeScrollEdges({
      scrollLeft: 399.6,
      clientWidth: 600,
      scrollWidth: 1000,
    }),
    { canScrollPrev: true, canScrollNext: false },
  )
})

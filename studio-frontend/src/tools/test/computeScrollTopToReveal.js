import test from "ava"
import { computeScrollTopToReveal } from "../computeScrollTopToReveal.js"

const VISIBLE_RECT = { top: 150, bottom: 450 }

test("leaves a visible item where it is", (t) => {
  t.is(
    computeScrollTopToReveal({
      scrollTop: 200,
      itemRect: { top: 200, bottom: 236 },
      visibleRect: VISIBLE_RECT,
    }),
    200,
  )
})

test("scrolls up until an item hidden under the header shows", (t) => {
  t.is(
    computeScrollTopToReveal({
      scrollTop: 200,
      itemRect: { top: 130, bottom: 166 },
      visibleRect: VISIBLE_RECT,
    }),
    180,
  )
})

test("scrolls down until an item hidden under the footer shows", (t) => {
  t.is(
    computeScrollTopToReveal({
      scrollTop: 200,
      itemRect: { top: 440, bottom: 476 },
      visibleRect: VISIBLE_RECT,
    }),
    226,
  )
})

test("reveals an item far below the band", (t) => {
  t.is(
    computeScrollTopToReveal({
      scrollTop: 0,
      itemRect: { top: 1000, bottom: 1036 },
      visibleRect: VISIBLE_RECT,
    }),
    586,
  )
})

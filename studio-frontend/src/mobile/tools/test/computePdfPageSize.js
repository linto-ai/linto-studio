import test from "ava"
import { computePdfPageSize } from "../computePdfPageSize.js"

test("computePdfPageSize() fits an A4 page to the screen width", (t) => {
  const size = computePdfPageSize({
    pageWidth: 595,
    pageHeight: 842,
    targetWidth: 360,
    pixelRatio: 1,
  })
  t.is(size.cssWidth, 360)
  t.is(size.cssHeight, 509)
  t.true(Math.abs(size.renderScale - 360 / 595) < 1e-9)
})

test("computePdfPageSize() renders sharper on dense screens", (t) => {
  const size = computePdfPageSize({
    pageWidth: 595,
    pageHeight: 842,
    targetWidth: 360,
    pixelRatio: 3,
  })
  t.is(size.cssWidth, 360)
  t.true(Math.abs(size.renderScale - (3 * 360) / 595) < 1e-9)
})

test("computePdfPageSize() ignores a missing pixel ratio", (t) => {
  const size = computePdfPageSize({
    pageWidth: 100,
    pageHeight: 200,
    targetWidth: 50,
    pixelRatio: 0,
  })
  t.is(size.renderScale, 0.5)
  t.is(size.cssHeight, 100)
})

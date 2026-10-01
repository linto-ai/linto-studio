import test from "ava"
import { truncateTitle } from "../truncateTitle.js"

test("keeps a short title untouched", (t) => {
  t.is(truncateTitle("Quick question"), "Quick question")
})

test("trims surrounding whitespace", (t) => {
  t.is(truncateTitle("  Quick question  "), "Quick question")
})

test("truncates a long title with an ellipsis", (t) => {
  t.is(
    truncateTitle("What was decided about the budget for next year?"),
    "What was decided about the bud...",
  )
})

test("drops trailing whitespace before the ellipsis", (t) => {
  t.is(
    truncateTitle("aaaa bbbb cccc dddd eeee ffff gggg", 25),
    "aaaa bbbb cccc dddd eeee...",
  )
})

test("honors a custom max length", (t) => {
  t.is(truncateTitle("abcdefghij", 5), "abcde...")
})

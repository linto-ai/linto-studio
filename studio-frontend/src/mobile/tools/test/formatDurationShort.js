import test from "ava"
import { formatDurationShort } from "../formatDurationShort.js"

test("formatDurationShort() rounds to minutes", (t) => {
  t.is(formatDurationShort(20_000), "< 1 min")
  t.is(formatDurationShort(42 * 60_000 + 20_000), "42 min")
})

test("formatDurationShort() switches to hours", (t) => {
  t.is(formatDurationShort(72 * 60_000), "1 h 12")
  t.is(formatDurationShort(120 * 60_000), "2 h 00")
})

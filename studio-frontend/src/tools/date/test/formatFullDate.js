import test from "ava"
import { formatFullDate } from "../formatFullDate.js"

test("formatFullDate returns empty string for null/undefined", (t) => {
  t.is(formatFullDate(null), "")
  t.is(formatFullDate(undefined), "")
})

test("formatFullDate returns empty string for an invalid date", (t) => {
  t.is(formatFullDate("not-a-date"), "")
})

test("formatFullDate spells the month out and keeps the year", (t) => {
  t.is(formatFullDate("2026-10-28T12:00:00Z", "fr-FR"), "28 octobre 2026")
  t.is(formatFullDate("2026-10-28T12:00:00Z", "en-US"), "October 28, 2026")
})

import test from "ava"
import { formatDateDayMonth } from "../formatDateDayMonth.js"

test("formatDateDayMonth returns empty string for null/undefined", (t) => {
  t.is(formatDateDayMonth(null), "")
  t.is(formatDateDayMonth(undefined), "")
})

test("formatDateDayMonth returns empty string for an invalid date", (t) => {
  t.is(formatDateDayMonth("not-a-date"), "")
})

test("formatDateDayMonth formats a valid date without year or time", (t) => {
  const result = formatDateDayMonth("2026-09-14T00:00:00Z")
  t.truthy(result)
  t.true(result.includes("14"))
  t.false(result.includes("2026"))
})

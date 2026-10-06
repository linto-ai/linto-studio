import test from "ava"
import { formatShortDate } from "../formatShortDate.js"

test("formats a numeric date in the locale order", (t) => {
  t.is(formatShortDate("2027-03-12T12:00:00Z", "fr-FR"), "12/03/2027")
  t.is(formatShortDate("2027-03-12T12:00:00Z", "en-US"), "03/12/2027")
})

test("empty or invalid input gives an empty string", (t) => {
  t.is(formatShortDate(null), "")
  t.is(formatShortDate("not a date"), "")
})

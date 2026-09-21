import test from "ava"
import { formatMediaDate } from "../formatMediaDate.js"

const now = new Date(2026, 8, 14)

test("formatMediaDate() omits the year within the current year", (t) => {
  t.is(formatMediaDate("2026-09-08T10:00:00Z", "fr-FR", now), "8 sept.")
})

test("formatMediaDate() keeps the year for older media", (t) => {
  t.is(formatMediaDate("2025-03-02T10:00:00Z", "fr-FR", now), "2 mars 2025")
})

test("formatMediaDate() returns an empty string for missing or invalid values", (t) => {
  t.is(formatMediaDate(undefined, "fr-FR", now), "")
  t.is(formatMediaDate("not a date", "fr-FR", now), "")
})

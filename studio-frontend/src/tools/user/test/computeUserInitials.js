import test from "ava"
import { computeUserInitials } from "../computeUserInitials.js"

test("computeUserInitials() takes first+last name initials for a full name", (t) => {
  t.is(computeUserInitials("John Doe"), "JD")
})

test("computeUserInitials() takes the first and last of a multi-word name", (t) => {
  t.is(computeUserInitials("Jean de la Fontaine"), "JF")
})

test("computeUserInitials() takes the first 2 characters of a single word", (t) => {
  t.is(computeUserInitials("Madonna"), "MA")
})

test("computeUserInitials() trims surrounding whitespace", (t) => {
  t.is(computeUserInitials("  John Doe  "), "JD")
})

test("computeUserInitials() collapses repeated whitespace between words", (t) => {
  t.is(computeUserInitials("John   Doe"), "JD")
})

test("computeUserInitials() returns an empty string for null/undefined/empty input", (t) => {
  t.is(computeUserInitials(null), "")
  t.is(computeUserInitials(undefined), "")
  t.is(computeUserInitials(""), "")
})

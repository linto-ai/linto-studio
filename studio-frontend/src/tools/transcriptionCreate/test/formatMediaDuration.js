import test from "ava"
import { formatMediaDuration } from "../formatMediaDuration.js"

function formatWithPlainSpaces(durationInSeconds) {
  return formatMediaDuration(durationInSeconds, "fr-FR").replace(/\s/g, " ")
}

test("an unknown duration has no text", (t) => {
  t.is(formatMediaDuration(null, "fr-FR"), null)
})

test("under a minute, in seconds", (t) => {
  t.is(formatWithPlainSpaces(20), "20 s")
})

test("minutes", (t) => {
  t.is(formatWithPlainSpaces(48 * 60), "48 min")
})

test("hours and minutes", (t) => {
  t.is(formatWithPlainSpaces(2 * 3600 + 15 * 60), "2 h 15 min")
})

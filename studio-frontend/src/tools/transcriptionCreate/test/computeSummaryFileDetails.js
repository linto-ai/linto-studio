import test from "ava"
import { computeSummaryFileDetails } from "../computeSummaryFileDetails.js"

function computeWithPlainSpaces(file, duration, percent) {
  return computeSummaryFileDetails(file, duration, percent, "fr-FR").replace(
    /\s/g,
    " ",
  )
}

const file = { name: "meeting.M4A" }

test("extension and duration", (t) => {
  t.is(computeWithPlainSpaces(file, 48 * 60, null), "m4a · 48 min")
})

test("an unknown duration is left out", (t) => {
  t.is(computeWithPlainSpaces(file, null, null), "m4a")
})

test("a missing extension is left out", (t) => {
  t.is(computeWithPlainSpaces({ name: "meeting" }, 48 * 60, null), "48 min")
})

test("the percent replaces the duration while sending", (t) => {
  t.is(computeWithPlainSpaces(file, 48 * 60, 25), "m4a · 25 %")
})

test("sending starts at 0 %", (t) => {
  t.is(computeWithPlainSpaces(file, 48 * 60, 0), "m4a · 0 %")
})

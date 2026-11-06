import test from "ava"
import { computeFileDetails } from "../computeFileDetails.js"

const THREE_MEGABYTES = 3 * 1024 * 1024

function computeWithPlainSpaces(file, durationInSeconds, locale = "fr-FR") {
  return computeFileDetails(file, durationInSeconds, locale).replace(/\s/g, " ")
}

test("extension, size and duration", (t) => {
  const file = { name: "meeting.MP3", size: THREE_MEGABYTES }
  t.is(computeWithPlainSpaces(file, 48 * 60), "mp3 · 3 Mo · 48 min")
})

test("an unknown duration is left out", (t) => {
  const file = { name: "meeting.mp3", size: THREE_MEGABYTES }
  t.is(computeWithPlainSpaces(file, null), "mp3 · 3 Mo")
})

test("a missing extension is left out", (t) => {
  const file = { name: "meeting", size: THREE_MEGABYTES }
  t.is(computeWithPlainSpaces(file, null), "3 Mo")
})

test("under a minute, the duration is in seconds", (t) => {
  const file = { name: "note.m4a", size: THREE_MEGABYTES }
  t.is(computeWithPlainSpaces(file, 20.4, "en-US"), "m4a · 3 MB · 20 sec")
})

test("a duration rounding to a minute is in minutes", (t) => {
  const file = { name: "note.m4a", size: THREE_MEGABYTES }
  t.is(computeWithPlainSpaces(file, 59.6), "m4a · 3 Mo · 1 min")
})

test("hours and minutes", (t) => {
  const file = { name: "note.m4a", size: THREE_MEGABYTES }
  t.is(computeWithPlainSpaces(file, 72 * 60), "m4a · 3 Mo · 1 h 12 min")
})

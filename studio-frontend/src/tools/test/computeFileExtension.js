import test from "ava"
import { computeFileExtension } from "../computeFileExtension.js"

test("the extension is in lowercase", (t) => {
  t.is(computeFileExtension("meeting.MP3"), "mp3")
})

test("only the last extension counts", (t) => {
  t.is(computeFileExtension("meeting.v2.webm"), "webm")
})

test("no extension", (t) => {
  t.is(computeFileExtension("meeting"), null)
})

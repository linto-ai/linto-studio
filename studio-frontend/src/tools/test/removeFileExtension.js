import test from "ava"
import { removeFileExtension } from "../removeFileExtension.js"

test("removes the last extension only", (t) => {
  t.is(removeFileExtension("meeting.mp3"), "meeting")
  t.is(removeFileExtension("meeting.2026.mp3"), "meeting.2026")
})

test("keeps a name without extension", (t) => {
  t.is(removeFileExtension("meeting"), "meeting")
})

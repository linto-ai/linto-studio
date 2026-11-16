import test from "ava"
import { fileNameOfUri } from "../fileNameOfUri.js"

test("fileNameOfUri() keeps the last segment of a file URI", (t) => {
  t.is(
    fileNameOfUri(
      "file:///data/user/0/ai.linto.studio/cache/capacitor-audio-recorder/recording-1.aac",
    ),
    "recording-1.aac",
  )
})

test("fileNameOfUri() decodes an encoded name", (t) => {
  t.is(
    fileNameOfUri("file:///files/recordings/my%20meeting.aac"),
    "my meeting.aac",
  )
})

test("fileNameOfUri() keeps a name that is not valid encoding", (t) => {
  t.is(fileNameOfUri("file:///files/100%.aac"), "100%.aac")
})

test("fileNameOfUri() gives an empty name without URI", (t) => {
  t.is(fileNameOfUri(null), "")
  t.is(fileNameOfUri(undefined), "")
})

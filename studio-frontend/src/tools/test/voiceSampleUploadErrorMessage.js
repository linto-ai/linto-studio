import test from "ava"
import { voiceSampleUploadErrorMessage } from "../voiceSampleUploadErrorMessage.js"

function t(key) {
  return `t:${key}`
}

test("a known status gives a translated detail", (t_) => {
  const error = { status: 422, message: "server text" }
  t_.is(
    voiceSampleUploadErrorMessage(error, t),
    "t:speaker_diarization.upload_error_mismatch",
  )
})

test("an unknown status falls back to the server message", (t_) => {
  const error = { status: 500, message: "server text" }
  t_.is(voiceSampleUploadErrorMessage(error, t), "server text")
})

test("no detail at all gives the generic message", (t_) => {
  t_.is(
    voiceSampleUploadErrorMessage(undefined, t),
    "t:speaker_diarization.upload_error",
  )
  t_.is(
    voiceSampleUploadErrorMessage({ message: "" }, t),
    "t:speaker_diarization.upload_error",
  )
})

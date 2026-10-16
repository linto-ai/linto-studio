import test from "ava"
import { computeSpeakerLabel } from "../computeSpeakerLabel.js"

function t(key, params) {
  return params ? `${key}:${params.number}` : key
}

test("keeps the number of a diarization tag", (t_) => {
  t_.is(
    computeSpeakerLabel("spk2", t),
    "conversation.speaker_toolbox.placeholder_name:2",
  )
})

test("keeps the number of an unidentified speaker", (t_) => {
  t_.is(
    computeSpeakerLabel("Unknown speaker 3", t),
    "conversation.speaker_toolbox.placeholder_name:3",
  )
})

test("drops the leading zeros", (t_) => {
  t_.is(
    computeSpeakerLabel("speaker01", t),
    "conversation.speaker_toolbox.placeholder_name:1",
  )
})

test("falls back to an unnumbered label without a number", (t_) => {
  t_.is(
    computeSpeakerLabel("Unknown speaker", t),
    "conversation.speaker_toolbox.placeholder_name_unnumbered",
  )
  t_.is(
    computeSpeakerLabel(undefined, t),
    "conversation.speaker_toolbox.placeholder_name_unnumbered",
  )
})

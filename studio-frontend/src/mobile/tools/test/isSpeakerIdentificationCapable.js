import test from "ava"
import { isSpeakerIdentificationCapable } from "../isSpeakerIdentificationCapable.js"

const capable = {
  sub_services: {
    diarization: [
      { service_name: "pyannote", info: { speaker_identification: true } },
    ],
  },
}

test("isSpeakerIdentificationCapable() needs the flag and the sub-service capability", (t) => {
  t.true(isSpeakerIdentificationCapable(capable, true))
  t.false(isSpeakerIdentificationCapable(capable, false))
  t.false(
    isSpeakerIdentificationCapable(
      { sub_services: { diarization: [{ info: {} }] } },
      true,
    ),
  )
  t.false(isSpeakerIdentificationCapable({}, true))
  t.false(isSpeakerIdentificationCapable(null, true))
})

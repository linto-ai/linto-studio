import test from "ava"
import { computeConversationSettings } from "../computeConversationSettings.ts"

const whisper = {
  serviceName: "whisper",
  model_type: "whisper",
  language: "fr-FR,en-US",
  endpoints: [{ endpoint: "/stt/transcribe" }],
  sub_services: {
    diarization: [
      { service_name: "pyannote", info: { speaker_identification: true } },
    ],
  },
}

const choices = {
  serviceName: "whisper",
  language: "en-US",
  diarization: true,
  voiceCollections: ["c1"],
  membersRight: 3,
  folderId: "f1",
}

test("computeConversationSettings() turns the choices into request fields", (t) => {
  const { transcription, sharing } = computeConversationSettings(
    [whisper],
    choices,
    true,
  )
  t.is(transcription.serviceName, "whisper")
  t.is(transcription.endpoint, "stt/transcribe")
  t.is(transcription.lang, "en-US")
  t.true(transcription.transcriptionConfig.diarizationConfig.enableDiarization)
  t.deepEqual(transcription.speakerIdentificationCollections, ["c1"])
  t.false("diarization" in transcription)
  t.deepEqual(sharing, { membersRight: 3, folderId: "f1" })
})

test("computeConversationSettings() drops the voices the service cannot recognize", (t) => {
  const { transcription } = computeConversationSettings(
    [whisper],
    choices,
    false,
  )
  t.deepEqual(transcription.speakerIdentificationCollections, [])
})

test("computeConversationSettings() keeps the sharing without any service", (t) => {
  t.deepEqual(computeConversationSettings([], choices, true), {
    transcription: null,
    sharing: { membersRight: 3, folderId: "f1" },
  })
})

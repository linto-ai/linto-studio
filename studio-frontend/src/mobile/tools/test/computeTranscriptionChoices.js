import test from "ava"
import { computeTranscriptionChoices } from "../computeTranscriptionChoices.js"

const services = [
  { serviceName: "a", language: "en-US,fr-FR" },
  { serviceName: "b", language: "de-DE,it-IT" },
]

test("computeTranscriptionChoices() restores the remembered choices", (t) => {
  const choices = computeTranscriptionChoices(
    services,
    {
      language: "en-US",
      diarization: false,
      membersRight: 3,
      folderId: "f1",
    },
    "fr-FR",
  )
  t.deepEqual(choices, {
    language: "en-US",
    diarization: false,
    voiceCollections: [],
    membersRight: 3,
    folderId: "f1",
  })
})

test("computeTranscriptionChoices() falls back to the app language", (t) => {
  const choices = computeTranscriptionChoices(services, null, "fr-FR")
  t.is(choices.language, "fr-FR")
  t.true(choices.diarization)
})

test("computeTranscriptionChoices() takes the first language when the app one is missing", (t) => {
  const choices = computeTranscriptionChoices(
    services,
    { language: "es-ES" },
    "de-DE",
  )
  t.is(choices.language, "en-US")
})

test("computeTranscriptionChoices() detects the language when no service is offered", (t) => {
  const choices = computeTranscriptionChoices([], null, "fr-FR")
  t.is(choices.language, "*")
})

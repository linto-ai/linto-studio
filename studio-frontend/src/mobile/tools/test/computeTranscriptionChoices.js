import test from "ava"
import { computeTranscriptionChoices } from "../computeTranscriptionChoices.js"

const services = [
  { serviceName: "a", order: 1, language: "en-US,fr-FR" },
  { serviceName: "b", order: 2, language: "de-DE,it-IT" },
]

test("computeTranscriptionChoices() restores the remembered service and language", (t) => {
  const choices = computeTranscriptionChoices(
    services,
    {
      serviceName: "b",
      language: "it-IT",
      diarization: false,
      membersRight: 3,
      folderId: "f1",
    },
    "fr-FR",
  )
  t.deepEqual(choices, {
    serviceName: "b",
    language: "it-IT",
    diarization: false,
    voiceCollections: [],
    membersRight: 3,
    folderId: "f1",
  })
})

test("computeTranscriptionChoices() falls back to the app language", (t) => {
  const choices = computeTranscriptionChoices(services, null, "fr-FR")
  t.is(choices.serviceName, "a")
  t.is(choices.language, "fr-FR")
  t.true(choices.diarization)
})

test("computeTranscriptionChoices() takes the first language when the app one is missing", (t) => {
  const choices = computeTranscriptionChoices(
    services,
    { serviceName: "b", language: "fr-FR" },
    "fr-FR",
  )
  t.is(choices.language, "de-DE")
})

test("computeTranscriptionChoices() has no service when none is offered", (t) => {
  const choices = computeTranscriptionChoices([], null, "fr-FR")
  t.is(choices.serviceName, null)
  t.is(choices.language, "*")
})

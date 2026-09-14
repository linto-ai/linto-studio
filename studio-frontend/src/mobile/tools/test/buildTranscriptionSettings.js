import test from "ava"
import { buildTranscriptionSettings } from "../buildTranscriptionSettings.js"

const whisper = {
  serviceName: "whisper-large",
  model_type: "whisper",
  language: "fr-FR,en-US",
  endpoints: [{ endpoint: "/stt-whisper/transcribe" }],
  sub_services: { diarization: [{ service_name: "pyannote" }] },
}

test("buildTranscriptionSettings() maps language and diarization", (t) => {
  const settings = buildTranscriptionSettings(whisper, {
    language: "en-US",
    diarization: true,
  })
  t.is(settings.serviceName, "whisper-large")
  t.is(settings.endpoint, "stt-whisper/transcribe")
  t.is(settings.lang, "en-US")
  t.true(settings.config.diarizationConfig.enableDiarization)
  t.is(settings.config.diarizationConfig.serviceName, "pyannote")
  t.false(settings.config.punctuationConfig.enablePunctuation)
  t.true(settings.diarization)
})

test("buildTranscriptionSettings() disables diarization when the service has none", (t) => {
  const settings = buildTranscriptionSettings(
    { ...whisper, sub_services: {} },
    { language: "fr-FR", diarization: true },
  )
  t.false(settings.config.diarizationConfig.enableDiarization)
  t.false(settings.diarization)
})

test("buildTranscriptionSettings() enables the first punctuation sub-service for other models", (t) => {
  const kaldi = {
    ...whisper,
    model_type: "kaldi",
    sub_services: { punctuation: [{ service_name: "punct-fr" }] },
  }
  const settings = buildTranscriptionSettings(kaldi, {
    language: "fr-FR",
    diarization: false,
  })
  t.true(settings.config.punctuationConfig.enablePunctuation)
  t.is(settings.config.punctuationConfig.serviceName, "punct-fr")
})

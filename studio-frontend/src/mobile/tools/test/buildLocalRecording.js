import test from "ava"
import { buildLocalRecording } from "../buildLocalRecording.ts"

const settings = {
  transcription: {
    serviceName: "whisper",
    endpoint: "stt/transcribe",
    lang: "fr-FR",
    transcriptionConfig: {},
    speakerIdentificationCollections: [],
  },
  sharing: { membersRight: 1, folderId: null },
}

function build(fields = {}) {
  return buildLocalRecording({
    id: "rec-1",
    organizationId: "org-1",
    name: "Meeting",
    keepAudio: false,
    locale: "fr-FR",
    mimeType: "audio/webm",
    storage: { kind: "chunks" },
    settings,
    createdAt: 42,
    ...fields,
  })
}

test("buildLocalRecording() starts with nothing recorded and nothing sent", (t) => {
  const recording = build()
  t.is(recording.status, "recording")
  t.is(recording.createdAt, 42)
  t.is(recording.locale, "fr-FR")
  t.false(recording.keepAudio)
  t.deepEqual(recording.audio, {
    storage: { kind: "chunks" },
    mimeType: "audio/webm",
    durationMs: 0,
    sizeBytes: 0,
    peakLevel: null,
    gaps: [],
    interruptedAt: null,
  })
  t.deepEqual(recording.conversation, {
    transcription: settings.transcription,
    sharing: settings.sharing,
    id: null,
    sentAt: null,
    sendProgress: 0,
    sendError: null,
  })
})

test("buildLocalRecording() leaves the settings to know later", (t) => {
  const { conversation } = build({ settings: null })
  t.is(conversation.transcription, null)
  t.is(conversation.sharing, null)
})

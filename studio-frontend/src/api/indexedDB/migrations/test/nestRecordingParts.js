import test from "ava"
import { nestRecordingParts } from "../nestRecordingParts.ts"

const transcription = {
  serviceName: "whisper",
  endpoint: "stt/transcribe",
  lang: "fr-FR",
  config: { language: "fr-FR" },
  speakerIdentificationCollections: ["c1"],
  diarization: true,
}

function flatRow(fields = {}) {
  return {
    id: "rec-1",
    organizationId: "org-1",
    createdAt: 10,
    name: "Meeting",
    keepAudio: false,
    status: "uploaded",
    mimeType: "audio/webm",
    audioFileUri: null,
    durationMs: 60_000,
    sizeBytes: 1200,
    peakLevel: 0.5,
    gaps: [{ atMs: 1000, durationMs: 500, reason: "background" }],
    interruptedAt: null,
    transcription,
    sharing: { membersRight: 3, folderId: "f1" },
    conversationId: "conv-1",
    uploadedAt: 20,
    progress: 100,
    error: null,
    ...fields,
  }
}

function migrate(fields) {
  return nestRecordingParts(flatRow(fields), "fr-FR")
}

test("nestRecordingParts() moves every field to its part", (t) => {
  t.deepEqual(migrate(), {
    id: "rec-1",
    organizationId: "org-1",
    createdAt: 10,
    locale: "fr-FR",
    name: "Meeting",
    keepAudio: false,
    status: "uploaded",
    audio: {
      storage: { kind: "chunks" },
      mimeType: "audio/webm",
      durationMs: 60_000,
      sizeBytes: 1200,
      peakLevel: 0.5,
      gaps: [{ atMs: 1000, durationMs: 500, reason: "background" }],
      interruptedAt: null,
    },
    conversation: {
      transcription: {
        serviceName: "whisper",
        endpoint: "stt/transcribe",
        lang: "fr-FR",
        transcriptionConfig: { language: "fr-FR" },
        speakerIdentificationCollections: ["c1"],
      },
      sharing: { membersRight: 3, folderId: "f1" },
      id: "conv-1",
      sentAt: 20,
      sendProgress: 100,
      sendError: null,
    },
  })
})

test("nestRecordingParts() keeps a native file where it is", (t) => {
  const row = migrate({ audioFileUri: "file:///a.aac" })
  t.deepEqual(row.audio.storage, { kind: "file", uri: "file:///a.aac" })
})

test("nestRecordingParts() keeps the sharing of a recording without transcription", (t) => {
  const row = migrate({ transcription: null, sharing: { membersRight: 3 } })
  t.is(row.conversation.transcription, null)
  t.deepEqual(row.conversation.sharing, { membersRight: 3, folderId: null })
})

test("nestRecordingParts() leaves a missing sharing to resolve", (t) => {
  const row = migrate({ sharing: null })
  t.is(row.conversation.sharing, null)
  t.is(row.conversation.transcription.serviceName, "whisper")
})

test("nestRecordingParts() turns an interruption date into the end of the recording", (t) => {
  t.is(migrate({ interruptedAt: 1_700_000_000 }).audio.interruptedAt, 60_000)
  t.is(migrate({ interruptedAt: 30_000 }).audio.interruptedAt, 30_000)
})

test("nestRecordingParts() queues a legacy recording kept for later", (t) => {
  t.is(migrate({ status: "ready" }).status, "queued")
})

test("nestRecordingParts() fills the fields older rows do not have", (t) => {
  const row = nestRecordingParts(
    {
      id: "rec-2",
      organizationId: "org-1",
      createdAt: 5,
      name: "Old",
      status: "queued",
    },
    "en-US",
  )
  t.is(row.locale, "en-US")
  t.true(row.keepAudio)
  t.deepEqual(row.audio, {
    storage: { kind: "chunks" },
    mimeType: "",
    durationMs: 0,
    sizeBytes: 0,
    peakLevel: null,
    gaps: [],
    interruptedAt: null,
  })
  t.deepEqual(row.conversation, {
    transcription: null,
    sharing: null,
    id: null,
    sentAt: null,
    sendProgress: 0,
    sendError: null,
  })
})

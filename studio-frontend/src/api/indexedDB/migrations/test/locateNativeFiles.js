import test from "ava"
import { locateNativeFiles } from "../locateNativeFiles.ts"

function nestedRow(storage) {
  return {
    id: "rec-1",
    organizationId: "org-1",
    createdAt: 10,
    locale: "fr-FR",
    name: "Meeting",
    keepAudio: true,
    status: "queued",
    audio: {
      storage,
      mimeType: "audio/aac",
      durationMs: 60_000,
      sizeBytes: 1200,
      peakLevel: 0.5,
      gaps: [],
      interruptedAt: null,
    },
    conversation: {
      transcription: null,
      sharing: null,
      id: null,
      sentAt: null,
      sendProgress: 0,
      sendError: null,
    },
  }
}

test("locateNativeFiles() keeps a kept recording relative to the app's files", (t) => {
  const row = locateNativeFiles(
    nestedRow({
      kind: "file",
      uri: "file:///data/user/0/ai.linto.studio/files/recordings/a.aac",
    }),
  )
  t.deepEqual(row.audio.storage, {
    kind: "file",
    file: { directory: "DATA", path: "recordings/a.aac" },
  })
})

test("locateNativeFiles() keeps a file the iOS recorder left in tmp", (t) => {
  const row = locateNativeFiles(
    nestedRow({
      kind: "file",
      uri: "file:///private/var/mobile/Containers/Data/Application/0F1E/tmp/CapacitorAudioRecorder/b.aac",
    }),
  )
  t.deepEqual(row.audio.storage, {
    kind: "file",
    file: { directory: "TEMPORARY", path: "CapacitorAudioRecorder/b.aac" },
  })
})

test("locateNativeFiles() leaves a file not found yet without file", (t) => {
  const row = locateNativeFiles(nestedRow({ kind: "file", uri: null }))
  t.deepEqual(row.audio.storage, { kind: "file", file: null })
})

test("locateNativeFiles() leaves a file outside the known folders without file", (t) => {
  const row = locateNativeFiles(
    nestedRow({ kind: "file", uri: "file:///x/elsewhere/c.aac" }),
  )
  t.deepEqual(row.audio.storage, { kind: "file", file: null })
})

test("locateNativeFiles() leaves web chunks and the rest of the row as they are", (t) => {
  const before = nestedRow({ kind: "chunks" })
  t.deepEqual(locateNativeFiles(before), before)
})

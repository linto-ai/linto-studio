import test from "ava"
import * as fakeIndexedDb from "fake-indexeddb"
import { openDB } from "idb"
import { buildLocalRecording } from "../../../mobile/tools/buildLocalRecording.ts"
import {
  createRecording,
  appendChunk,
  updateRecording,
  listRecordings,
  getRecording,
  getRecordingChunks,
  deleteRecording,
  resetQueueConnection,
} from "../queue.js"

// fake-indexeddb/auto would attach to the jsdom window set up for ava;
// idb reads the bare globals, so they are installed here explicitly.
const GLOBAL_CLASSES = [
  "IDBCursor",
  "IDBCursorWithValue",
  "IDBDatabase",
  "IDBFactory",
  "IDBIndex",
  "IDBKeyRange",
  "IDBObjectStore",
  "IDBOpenDBRequest",
  "IDBRequest",
  "IDBTransaction",
  "IDBVersionChangeEvent",
]

test.beforeEach(() => {
  GLOBAL_CLASSES.forEach((name) => {
    globalThis[name] = fakeIndexedDb[name]
  })
  globalThis.indexedDB = new fakeIndexedDb.IDBFactory()
  resetQueueConnection()
})

function sampleRecording(id = "rec-1") {
  return buildLocalRecording({
    id,
    organizationId: "org-1",
    name: "Meeting",
    keepAudio: true,
    locale: "fr-FR",
    mimeType: "audio/webm",
    storage: { kind: "chunks" },
    settings: null,
    createdAt: 1,
  })
}

test.serial(
  "createRecording() then listRecordings() round-trips metadata",
  async (t) => {
    await createRecording(sampleRecording())
    const all = await listRecordings()
    t.is(all.length, 1)
    t.is(all[0].name, "Meeting")
  },
)

test.serial(
  "updateRecording() merges a patch and returns the new row",
  async (t) => {
    await createRecording(sampleRecording())
    const updated = await updateRecording("rec-1", { status: "queued" })
    t.is(updated.status, "queued")
    t.is(updated.name, "Meeting")
    t.is((await getRecording("rec-1")).status, "queued")
  },
)

test.serial(
  "updateRecording() keeps every field of patches sent together",
  async (t) => {
    await createRecording(sampleRecording())
    await Promise.all([
      updateRecording("rec-1", { audio: { sizeBytes: 1200 } }),
      updateRecording("rec-1", {
        audio: { gaps: [{ atMs: 0, durationMs: 5, reason: "background" }] },
      }),
      updateRecording("rec-1", { status: "naming" }),
    ])
    const stored = await getRecording("rec-1")
    t.is(stored.audio.sizeBytes, 1200)
    t.is(stored.audio.gaps.length, 1)
    t.is(stored.status, "naming")
  },
)

test.serial(
  "updateRecording() keeps the other fields of a part it patches",
  async (t) => {
    await createRecording(sampleRecording())
    await updateRecording("rec-1", { conversation: { id: "conv-1" } })
    const stored = await getRecording("rec-1")
    t.is(stored.conversation.id, "conv-1")
    t.is(stored.conversation.sendProgress, 0)
    t.is(stored.audio.mimeType, "audio/webm")
  },
)

test.serial(
  "opening the database migrates version 1 rows into parts",
  async (t) => {
    const v1 = await openDB("linto-mobile", 1, {
      upgrade(db) {
        db.createObjectStore("recordings", { keyPath: "id" })
        const chunks = db.createObjectStore("chunks", {
          keyPath: ["recordingId", "index"],
        })
        chunks.createIndex("byRecording", "recordingId")
      },
    })
    await v1.put("recordings", {
      id: "old",
      organizationId: "org-1",
      createdAt: 1,
      name: "Old",
      status: "queued",
      sizeBytes: 300,
      audioFileUri: null,
      transcription: null,
      sharing: null,
    })
    await v1.put("chunks", {
      recordingId: "old",
      index: 0,
      blob: new Blob(["a"]),
    })
    v1.close()
    const [row] = await listRecordings()
    t.is(row.audio.sizeBytes, 300)
    t.deepEqual(row.audio.storage, { kind: "chunks" })
    t.is(row.conversation.transcription, null)
    t.is(typeof row.locale, "string")
    t.false("sizeBytes" in row)
    t.is((await getRecordingChunks("old")).length, 1)
  },
)

test.serial(
  "opening the database locates a version 1 native file in its folder",
  async (t) => {
    const v1 = await openDB("linto-mobile", 1, {
      upgrade(db) {
        db.createObjectStore("recordings", { keyPath: "id" })
        const chunks = db.createObjectStore("chunks", {
          keyPath: ["recordingId", "index"],
        })
        chunks.createIndex("byRecording", "recordingId")
      },
    })
    await v1.put("recordings", {
      id: "native",
      organizationId: "org-1",
      createdAt: 1,
      name: "Native",
      status: "queued",
      audioFileUri:
        "file:///data/user/0/ai.linto.studio/files/recordings/a.aac",
    })
    v1.close()
    const [row] = await listRecordings()
    t.deepEqual(row.audio.storage, {
      kind: "file",
      file: { directory: "DATA", path: "recordings/a.aac" },
    })
  },
)

test.serial("updateRecording() returns null for an unknown id", async (t) => {
  t.is(await updateRecording("nope", { status: "queued" }), null)
})

test.serial("getRecordingChunks() returns blobs in index order", async (t) => {
  await createRecording(sampleRecording())
  await appendChunk("rec-1", 2, new Blob(["c"]))
  await appendChunk("rec-1", 0, new Blob(["a"]))
  await appendChunk("rec-1", 1, new Blob(["b"]))
  await appendChunk("rec-2", 0, new Blob(["other"]))
  const chunks = await getRecordingChunks("rec-1")
  t.is(chunks.length, 3)
  t.is(await chunks[0].text(), "a")
  t.is(await chunks[2].text(), "c")
})

test.serial("deleteRecording() removes the row and its chunks", async (t) => {
  await createRecording(sampleRecording())
  await appendChunk("rec-1", 0, new Blob(["a"]))
  await createRecording(sampleRecording("rec-2"))
  await appendChunk("rec-2", 0, new Blob(["b"]))
  await deleteRecording("rec-1")
  t.is(await getRecording("rec-1"), undefined)
  t.is((await getRecordingChunks("rec-1")).length, 0)
  t.is((await getRecordingChunks("rec-2")).length, 1)
})

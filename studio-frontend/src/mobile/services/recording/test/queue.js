import test from "ava"
import * as fakeIndexedDb from "fake-indexeddb"
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
  return { id, name: "Meeting", status: "recording", createdAt: 1 }
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
    const updated = await updateRecording("rec-1", { status: "ready" })
    t.is(updated.status, "ready")
    t.is(updated.name, "Meeting")
    t.is((await getRecording("rec-1")).status, "ready")
  },
)

test.serial("updateRecording() returns null for an unknown id", async (t) => {
  t.is(await updateRecording("nope", { status: "ready" }), null)
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

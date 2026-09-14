import { openDB } from "idb"

const DATABASE_NAME = "linto-mobile"
const DATABASE_VERSION = 1

// Local store of recordings waiting to be sent. Audio is kept as 10 s
// chunks (one row each) so a crash mid-recording loses seconds, not the
// whole meeting. Metadata lives in `recordings`, audio in `chunks`.
let databasePromise = null

function database() {
  if (!databasePromise) {
    databasePromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade: createStores,
    })
  }
  return databasePromise
}

function createStores(db) {
  db.createObjectStore("recordings", { keyPath: "id" })
  const chunks = db.createObjectStore("chunks", {
    keyPath: ["recordingId", "index"],
  })
  chunks.createIndex("byRecording", "recordingId")
}

export async function createRecording(recording) {
  const db = await database()
  await db.put("recordings", recording)
  return recording
}

export async function appendChunk(recordingId, index, blob) {
  const db = await database()
  await db.put("chunks", { recordingId, index, blob })
}

export async function updateRecording(id, patch) {
  const db = await database()
  const current = await db.get("recordings", id)
  if (!current) {
    return null
  }
  const updated = { ...current, ...patch }
  await db.put("recordings", updated)
  return updated
}

export async function listRecordings() {
  const db = await database()
  return db.getAll("recordings")
}

export async function getRecording(id) {
  const db = await database()
  return db.get("recordings", id)
}

export async function getRecordingChunks(recordingId) {
  const db = await database()
  const rows = await db.getAllFromIndex("chunks", "byRecording", recordingId)
  return rows.sort((a, b) => a.index - b.index).map((row) => row.blob)
}

export async function deleteRecording(id) {
  const db = await database()
  const transaction = db.transaction(["recordings", "chunks"], "readwrite")
  await transaction.objectStore("recordings").delete(id)
  const chunkKeys = await transaction
    .objectStore("chunks")
    .index("byRecording")
    .getAllKeys(id)
  await Promise.all(
    chunkKeys.map((key) => transaction.objectStore("chunks").delete(key)),
  )
  await transaction.done
}

// Test hook: forget the cached connection so a fresh fake database is used.
export function resetQueueConnection() {
  databasePromise = null
}

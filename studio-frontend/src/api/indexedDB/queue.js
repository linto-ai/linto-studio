import { openDB } from "idb"
import { nestRecordingParts } from "./migrations/nestRecordingParts.ts"
import { mergeRecordingPatch } from "../../mobile/tools/mergeRecordingPatch.ts"
import { readLanguagePreference } from "../localStorage/languagePreference.js"

const DATABASE_NAME = "linto-mobile"

// Each migration brings the database from its position in the list to the
// next version: a phone opening the app runs the ones it has not run yet,
// in order, before anything reads the database.
const MIGRATIONS = [createStores, nestRecordings]
const DATABASE_VERSION = MIGRATIONS.length

// Local store of the phone's recordings: the ones waiting to be sent and
// the ones whose audio is kept after sending. Audio is stored as 10 s
// chunks (one row each) so a crash mid-recording loses seconds, not the
// whole meeting. Rows (LocalRecording, see mobile/types/localRecording.ts)
// live in `recordings`, audio in `chunks`.
let databasePromise = null

// A newer version of the app opened the database in another tab: this one
// runs outdated code and must not touch it any more (reloading gets the
// new code).
let replacedByNewerVersion = false
const OUTDATED_TAB =
  "the recordings database was upgraded by a newer version of the app: reload the page"

// A failed opening is not kept: the next call tries again.
function database() {
  switch (true) {
    case replacedByNewerVersion:
      return Promise.reject(new Error(OUTDATED_TAB))
    case !databasePromise:
      databasePromise = openDatabase().catch((error) => {
        databasePromise = null
        throw error
      })
      return databasePromise
    default:
      return databasePromise
  }
}

function openDatabase() {
  return openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade: runMigrations,
    blocking: stepAside,
    // An older version still runs in another tab (it does not step aside
    // before version 2): the upgrade waits for it to close.
    blocked() {
      console.error(
        "the recordings database waits for other tabs of the app to close",
      )
    },
  })
}

async function runMigrations(db, oldVersion, newVersion, transaction) {
  for (const migrate of MIGRATIONS.slice(oldVersion)) {
    await migrate(db, transaction)
  }
}

// Another tab opens a newer version: this connection closes so the upgrade
// can run.
async function stepAside() {
  replacedByNewerVersion = true
  const db = await databasePromise
  databasePromise = null
  db?.close()
}

// Version 1: recordings and their audio chunks.
function createStores(db) {
  db.createObjectStore("recordings", { keyPath: "id" })
  const chunks = db.createObjectStore("chunks", {
    keyPath: ["recordingId", "index"],
  })
  chunks.createIndex("byRecording", "recordingId")
}

// Version 2: rows in parts (audio, conversation), see nestRecordingParts.
async function nestRecordings(db, transaction) {
  const locale = readLanguagePreference()
  let cursor = await transaction.objectStore("recordings").openCursor()
  while (cursor) {
    await cursor.update(nestRecordingParts(cursor.value, locale))
    cursor = await cursor.continue()
  }
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

// Read and write in one transaction: patches sent close together (chunk
// progress, gaps, stop) are applied one after the other, none of them
// writes back a stale copy of the fields it does not change. The patch's
// `audio` and `conversation` are merged into the row's (mergeRecordingPatch).
// null when the row does not exist.
export async function updateRecording(id, patch) {
  const db = await database()
  const transaction = db.transaction("recordings", "readwrite")
  const current = await transaction.store.get(id)
  const updated = current ? mergeRecordingPatch(current, patch) : null
  if (updated) await transaction.store.put(updated)
  await transaction.done
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
  await deleteChunksIn(transaction, id)
  await transaction.done
}

export async function deleteRecordingChunks(id) {
  const db = await database()
  const transaction = db.transaction(["chunks"], "readwrite")
  await deleteChunksIn(transaction, id)
  await transaction.done
}

async function deleteChunksIn(transaction, recordingId) {
  const chunks = transaction.objectStore("chunks")
  const keys = await chunks.index("byRecording").getAllKeys(recordingId)
  await Promise.all(keys.map((key) => chunks.delete(key)))
}

// Test hook: forget the cached connection so a fresh fake database is used.
export function resetQueueConnection() {
  databasePromise = null
  replacedByNewerVersion = false
}

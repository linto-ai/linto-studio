import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { getExtensionForMimeType } from "@/tools/audio/audioMimeTypes.js"
import * as queue from "@/api/indexedDB/queue.js"

// Where the audio of a recording lives (recording.audio.storage): 10 s
// chunks in IndexedDB (web), or one file on the phone (native app). Used
// by the mobileRecordings store only. The native module is imported in the
// app only: the web build drops it. Nothing here throws.

// The audio as one File, to send or share it. null when nothing is stored
// (audio dropped, never captured, or a file this build cannot read).
export async function readRecordingFile(recording) {
  const { storage, mimeType } = recording.audio
  const fileName = `${recording.name}.${getExtensionForMimeType(mimeType)}`
  const type = mimeType || "application/octet-stream"
  switch (storage.kind) {
    case "file": {
      const files = await importNativeAudioFiles()
      return storage.uri && files
        ? files.readAudioFile(storage.uri, fileName, type)
        : null
    }
    default: {
      const chunks = await queue.getRecordingChunks(recording.id)
      return chunks.length > 0 ? new File(chunks, fileName, { type }) : null
    }
  }
}

// A URL a player can read the audio from, and how to free it. null when
// nothing is stored.
export async function openRecordingAudio(recording) {
  const { storage, mimeType } = recording.audio
  switch (storage.kind) {
    case "file": {
      const files = await importNativeAudioFiles()
      return storage.uri && files
        ? { url: files.audioFileUrl(storage.uri), release() {} }
        : null
    }
    default:
      return openChunks(recording.id, mimeType)
  }
}

// The chunks go with the row (queue.deleteRecording); a file is deleted
// here.
export async function deleteRecordingAudio(recording) {
  const storage = recording.audio?.storage
  if (storage?.kind === "file" && storage.uri) {
    const files = await importNativeAudioFiles()
    await files?.deleteAudioFile(storage.uri)
  }
}

async function openChunks(recordingId, mimeType) {
  const chunks = await queue.getRecordingChunks(recordingId)
  const url =
    chunks.length > 0
      ? URL.createObjectURL(new Blob(chunks, { type: mimeType || undefined }))
      : null
  return url ? { url, release: () => URL.revokeObjectURL(url) } : null
}

// The condition is a build constant: the web build drops the import.
export function importNativeAudioFiles() {
  return IS_NATIVE_APP
    ? import("@/api/device/nativeAudioFiles.js")
    : Promise.resolve(null)
}

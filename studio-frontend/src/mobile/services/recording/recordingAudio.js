import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { getExtensionForMimeType } from "@/tools/audio/audioMimeTypes.js"
import * as queue from "@/mobile/services/recording/queue.js"

// Where the audio of a recording lives: 10 s chunks in IndexedDB (web), or
// one file on the phone (native app, recording.audioFileUri). The native
// modules are imported in the app only: the web build drops them.

export function hasAudioFile(recording) {
  return IS_NATIVE_APP && Boolean(recording?.audioFileUri)
}

// The audio of a local recording as one File, to send or share it.
// null when nothing is stored (audio dropped, or never captured).
export async function buildRecordingFile(recording) {
  const extension = getExtensionForMimeType(recording.mimeType || "")
  const fileName = `${recording.name}.${extension}`
  const type = recording.mimeType || "application/octet-stream"
  switch (true) {
    case hasAudioFile(recording): {
      const files = await importNativeAudioFiles()
      return files.readAudioFile(recording.audioFileUri, fileName, type)
    }
    default: {
      const chunks = await queue.getRecordingChunks(recording.id)
      return chunks.length > 0 ? new File(chunks, fileName, { type }) : null
    }
  }
}

// A URL a player can read the recording from, and how to free it.
// null when nothing is stored.
export async function openRecordingAudio(recordingId, mimeType) {
  const recording = await queue.getRecording(recordingId)
  switch (true) {
    case hasAudioFile(recording): {
      const files = await importNativeAudioFiles()
      return { url: files.audioFileUrl(recording.audioFileUri), release() {} }
    }
    default:
      return openChunks(recordingId, mimeType)
  }
}

// The chunks go with the entry (queue.deleteRecording); a file is deleted
// here.
export async function deleteRecordingAudio(recording) {
  if (hasAudioFile(recording)) {
    const files = await importNativeAudioFiles()
    await files.deleteAudioFile(recording.audioFileUri)
  }
}

// See recoverNativeRecordings: nothing to recover on the web.
export async function recoverRecordingFiles(recordings, loadStartedAt) {
  const recovery = await importNativeRecovery()
  return recovery
    ? recovery.recoverNativeRecordings(recordings, loadStartedAt)
    : recordings
}

// See recoverNativeRecordings: called once at startup.
export async function stopLeftoverRecording() {
  const recovery = await importNativeRecovery()
  await recovery?.stopLeftoverRecording()
}

async function openChunks(recordingId, mimeType) {
  const chunks = await queue.getRecordingChunks(recordingId)
  const url =
    chunks.length > 0
      ? URL.createObjectURL(new Blob(chunks, { type: mimeType || undefined }))
      : null
  return url ? { url, release: () => URL.revokeObjectURL(url) } : null
}

// The condition is a build constant: the web build drops these imports.
function importNativeAudioFiles() {
  return IS_NATIVE_APP
    ? import("@/mobile/services/recording/nativeAudioFiles.js")
    : Promise.resolve(null)
}

function importNativeRecovery() {
  return IS_NATIVE_APP
    ? import("@/mobile/services/recording/recoverNativeRecordings.js")
    : Promise.resolve(null)
}

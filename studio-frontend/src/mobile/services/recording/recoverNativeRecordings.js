import { CapacitorAudioRecorder } from "@capgo/capacitor-audio-recorder"
import { ForegroundService } from "@capawesome-team/capacitor-android-foreground-service"
import * as queue from "@/mobile/services/recording/queue.js"
import {
  deleteAudioFile,
  listRecorderFiles,
  moveToRecordings,
  readAudioFileSize,
} from "@/mobile/services/recording/nativeAudioFiles.js"
import { listOrphanAudioFiles } from "@/mobile/tools/listOrphanAudioFiles.js"
import { fileNameOfUri } from "@/mobile/tools/fileNameOfUri.js"

// Stopping what a previous page left running, once per page.
let leftoverStop = null

// A page that just started runs no recording yet: one the plugin still
// holds belongs to a page that reloaded or crashed under it. It is stopped
// so its file is finished before being recovered, and the service goes
// with its notification. Runs once per page, at startup.
export function stopLeftoverRecording() {
  leftoverStop ??= stopPluginAndService()
  return leftoverStop
}

/**
 * The stored recordings with their files put back in order, at load:
 * a file still in the recorder's cache (the app was killed while
 * recording, or before the file was moved) is moved next to the others
 * and its size read again (the last report may be 10 s old). Files no
 * recording points to are deleted.
 * @param {object[]} recordings - as stored
 * @param {number} loadStartedAt - files modified since are left alone
 * @returns {Promise<object[]>}
 */
export async function recoverNativeRecordings(recordings, loadStartedAt) {
  await stopLeftoverRecording()
  const files = await listRecorderFiles()
  const orphans = listOrphanAudioFiles({
    files,
    referencedUris: recordings.map((recording) => recording.audioFileUri),
    modifiedBefore: loadStartedAt,
  })
  await Promise.all(orphans.map((file) => deleteAudioFile(file.uri)))
  const cachedNames = new Set(files.map((file) => fileNameOfUri(file.uri)))
  return Promise.all(
    recordings.map((recording) =>
      cachedNames.has(fileNameOfUri(recording.audioFileUri))
        ? recoverFile(recording)
        : recording,
    ),
  )
}

// A move that failed leaves the recording as stored: its file is still in
// the cache, the next load tries again.
async function recoverFile(recording) {
  const audioFileUri = await moveToRecordings(recording.audioFileUri)
  return audioFileUri ? saveRecoveredFile(recording, audioFileUri) : recording
}

async function saveRecoveredFile(recording, audioFileUri) {
  const sizeBytes = await readAudioFileSize(audioFileUri)
  const patch = { audioFileUri, ...(sizeBytes !== null && { sizeBytes }) }
  const updated = await queue.updateRecording(recording.id, patch)
  return updated ?? { ...recording, ...patch }
}

async function stopPluginAndService() {
  try {
    const { status } = await CapacitorAudioRecorder.getRecordingStatus()
    if (status !== "INACTIVE") await CapacitorAudioRecorder.stopRecording()
  } catch (error) {
    console.error("cannot stop the leftover recording", error)
  }
  await ForegroundService.stopForegroundService().catch((error) =>
    console.error("cannot stop the leftover recording service", error),
  )
}

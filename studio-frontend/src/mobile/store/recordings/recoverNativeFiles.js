import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import * as queue from "@/api/indexedDB/queue.js"
import { listOrphanAudioFiles } from "@/mobile/tools/listOrphanAudioFiles.js"
import { isSameNativeFile } from "@/mobile/tools/isSameNativeFile.ts"
import { importNativeAudioFiles } from "@/mobile/store/recordings/recordingAudio.js"

/**
 * The stored recordings with their files put back in order, at load
 * (native app; the web has nothing to recover). A recording the plugin
 * still holds belongs to a page that reloaded or crashed: it is stopped
 * first, so its file is finished. A file still in the recorder's folder
 * (the app was killed while recording, or before the file was moved) is
 * moved next to the others and its size read again (the last report may
 * be 10 s old). Files no recording points to are deleted. Used by the
 * mobileRecordings store only.
 * @param {import("@/mobile/types/localRecording.ts").LocalRecording[]} recordings
 * @param {number} loadStartedAt - files modified since are left alone
 * @returns {Promise<import("@/mobile/types/localRecording.ts").LocalRecording[]>}
 */
export async function recoverNativeFiles(recordings, loadStartedAt) {
  const native = await importNativeModules()
  return native ? recoverFiles(native, recordings, loadStartedAt) : recordings
}

async function recoverFiles({ files, leftover }, recordings, loadStartedAt) {
  await leftover.stopLeftoverRecording()
  const recorderFiles = await files.listRecorderFiles()
  const orphans = listOrphanAudioFiles({
    files: recorderFiles,
    referencedFiles: recordings.map(fileOf),
    modifiedBefore: loadStartedAt,
  })
  await Promise.all(orphans.map(({ file }) => files.deleteAudioFile(file)))
  return Promise.all(
    recordings.map((recording) =>
      isListed(recorderFiles, fileOf(recording))
        ? recoverFile(files, recording)
        : recording,
    ),
  )
}

// A move that failed leaves the recording as stored: its file is still in
// the recorder's folder, the next load tries again.
async function recoverFile(files, recording) {
  const file = await files.moveToRecordings(fileOf(recording))
  return file ? saveRecoveredFile(files, recording, file) : recording
}

async function saveRecoveredFile(files, recording, file) {
  const sizeBytes = await files.readAudioFileSize(file)
  const patch = {
    audio: {
      storage: { kind: "file", file },
      ...(sizeBytes !== null && { sizeBytes }),
    },
  }
  return (await queue.updateRecording(recording.id, patch)) ?? recording
}

function fileOf(recording) {
  const { storage } = recording.audio
  return storage.kind === "file" ? storage.file : null
}

function isListed(recorderFiles, file) {
  return recorderFiles.some((listed) => isSameNativeFile(listed.file, file))
}

// The condition is a build constant: the web build drops these imports.
async function importNativeModules() {
  const [files, leftover] = await Promise.all([
    importNativeAudioFiles(),
    IS_NATIVE_APP
      ? import("@/api/device/nativeRecorderLeftover.js")
      : Promise.resolve(null),
  ])
  return files && leftover ? { files, leftover } : null
}

import { Capacitor } from "@capacitor/core"
import { Filesystem } from "@capacitor/filesystem"
import { NATIVE_AUDIO_FOLDERS } from "@/mobile/const/nativeAudioFolders.js"
import { pickNewestFile } from "@/mobile/tools/pickNewestFile.js"
import { locateNativeAudioFile } from "@/mobile/tools/locateNativeAudioFile.ts"
import { isSameNativeFile } from "@/mobile/tools/isSameNativeFile.ts"

// Where the recorder plugin writes on this phone's platform.
const RECORDER_FOLDER = NATIVE_AUDIO_FOLDERS.recorder[Capacitor.getPlatform()]
const RECORDINGS_FOLDER = NATIVE_AUDIO_FOLDERS.recordings
// Without a Range, Capacitor iOS answers an audio file with a response
// that is not HTTP: fetch sees status 0, not ok. With one it answers 206
// with the whole file (Android too, but 206 and an empty body for a
// missing file: an empty answer is taken as no file).
const WHOLE_FILE_HEADERS = { Range: "bytes=0-" }

// The native app's audio files, one per recording, as NativeFile
// references (see mobile/types/localRecording.ts), never absolute URIs.
// Native app only (the web build never loads this module). Nothing here
// throws: a failure is logged and answered with an empty value.

// The files the recorder plugin left in its folder: the one being
// recorded, or ones a crash or a failed move left behind, each with its
// modification time: [{ file, mtime }].
export async function listRecorderFiles() {
  try {
    const { files } = await Filesystem.readdir({
      path: RECORDER_FOLDER.path,
      directory: RECORDER_FOLDER.directory,
    })
    return files
      .filter((entry) => entry.type === "file")
      .map((entry) => ({
        file: inRecorderFolder(entry.name),
        mtime: entry.mtime,
      }))
  } catch {
    // The folder does not exist before the first recording.
    return []
  }
}

// The file the recorder plugin is writing: it only tells where once the
// recording stops, too late if the app is killed meanwhile.
export async function findCurrentRecorderFile() {
  return pickNewestFile(await listRecorderFiles())?.file ?? null
}

// The file the plugin answers at the stop (an absolute URI). One found
// elsewhere than in RECORDER_FOLDER means an update of the plugin moved
// it: the size reports and the recovery after a crash no longer see it.
export function locateRecordedFile(uri) {
  const file = locateNativeAudioFile(uri)
  const expected = file && inRecorderFolder(nameOf(file))
  if (!isSameNativeFile(file, expected)) {
    console.error(
      "the recorder plugin wrote outside NATIVE_AUDIO_FOLDERS.recorder",
      uri,
    )
  }
  return file
}

export async function readAudioFileSize(file) {
  try {
    const { size } = await Filesystem.stat({
      path: file.path,
      directory: file.directory,
    })
    return size
  } catch (error) {
    console.error("cannot read the recording file size", error)
    return null
  }
}

// Moves a file next to the kept recordings. Answers where it now is, or
// null when it could not be moved (it stays readable where it was).
export async function moveToRecordings(file) {
  const moved = inRecordingsFolder(nameOf(file))
  try {
    await createRecordingsFolder()
    await Filesystem.rename({
      from: file.path,
      directory: file.directory,
      to: moved.path,
      toDirectory: moved.directory,
    })
    return moved
  } catch (error) {
    console.error("cannot move the recording file", error)
    return null
  }
}

export async function deleteAudioFile(file) {
  try {
    await Filesystem.deleteFile({ path: file.path, directory: file.directory })
  } catch (error) {
    console.error("cannot delete the recording file", error)
  }
}

// URL the WebView serves the file at: an <audio> plays it from there, and
// fetch reads it without going through base64. Built at each use: the
// absolute path changes on iOS with each install. null when unknown.
export async function audioFileUrl(file) {
  try {
    const { uri } = await Filesystem.getUri({
      path: file.path,
      directory: file.directory,
    })
    return Capacitor.convertFileSrc(uri)
  } catch (error) {
    console.error("cannot locate the recording file", error)
    return null
  }
}

// The whole file as a File, to send or share it. null when unreadable.
export async function readAudioFile(file, fileName, mimeType) {
  const url = await audioFileUrl(file)
  try {
    const response = url && (await fetch(url, { headers: WHOLE_FILE_HEADERS }))
    const blob = response?.ok ? await response.blob() : null
    return blob?.size ? new File([blob], fileName, { type: mimeType }) : null
  } catch (error) {
    console.error("cannot read the recording file", error)
    return null
  }
}

function nameOf(file) {
  return file.path.split("/").pop()
}

/** @returns {import("@/mobile/types/localRecording.ts").NativeFile} */
function inRecorderFolder(name) {
  return {
    directory: RECORDER_FOLDER.directory,
    path: `${RECORDER_FOLDER.path}/${name}`,
  }
}

/** @returns {import("@/mobile/types/localRecording.ts").NativeFile} */
function inRecordingsFolder(name) {
  return {
    directory: RECORDINGS_FOLDER.directory,
    path: `${RECORDINGS_FOLDER.path}/${name}`,
  }
}

// iOS refuses mkdir on a folder that exists, even recursive (and logs it):
// checked first. Two moves at once may both find it missing: the second
// mkdir fails, the folder is there all the same.
async function createRecordingsFolder() {
  const folder = {
    path: RECORDINGS_FOLDER.path,
    directory: RECORDINGS_FOLDER.directory,
  }
  const exists = await Filesystem.stat(folder).then(
    () => true,
    () => false,
  )
  if (!exists) {
    await Filesystem.mkdir({ ...folder, recursive: true }).catch(() => {})
  }
}

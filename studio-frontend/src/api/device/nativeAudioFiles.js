import { Capacitor } from "@capacitor/core"
import { Directory, Filesystem } from "@capacitor/filesystem"
import { pickNewestFile } from "@/mobile/tools/pickNewestFile.js"
import { fileNameOfUri } from "@/mobile/tools/fileNameOfUri.js"

// Where the audio recorder plugin writes, in the app's cache: its own
// choice, not an option.
const RECORDER_FOLDER = "capacitor-audio-recorder"
// Where finished recordings wait to be sent and stay when kept: Android
// may clear the cache when the phone runs out of space.
const RECORDINGS_FOLDER = "recordings"

// The native app's audio files, one per recording. Native app only (the
// web build never loads this module). Nothing here throws: a failure is
// logged and answered with an empty value.

// The files the recorder plugin left in its folder: the one being
// recorded, or ones a crash or a failed move left behind.
export async function listRecorderFiles() {
  try {
    const { files } = await Filesystem.readdir({
      path: RECORDER_FOLDER,
      directory: Directory.Cache,
    })
    return files.filter((file) => file.type === "file")
  } catch {
    // The folder does not exist before the first recording.
    return []
  }
}

// The file the recorder plugin is writing: it only tells where once the
// recording stops, too late if the app is killed meanwhile.
export async function findCurrentRecorderFile() {
  return pickNewestFile(await listRecorderFiles())?.uri ?? null
}

export async function readAudioFileSize(uri) {
  try {
    const { size } = await Filesystem.stat({ path: uri })
    return size
  } catch (error) {
    console.error("cannot read the recording file size", error)
    return null
  }
}

// Moves a file out of the recorder's cache folder. Answers its new URI, or
// null when it could not be moved (the file stays readable where it was,
// unless another move took it first).
export async function moveToRecordings(uri) {
  const name = fileNameOfUri(uri)
  try {
    await createRecordingsFolder()
    await Filesystem.rename({
      from: `${RECORDER_FOLDER}/${name}`,
      directory: Directory.Cache,
      to: `${RECORDINGS_FOLDER}/${name}`,
      toDirectory: Directory.Data,
    })
    const moved = await Filesystem.getUri({
      path: `${RECORDINGS_FOLDER}/${name}`,
      directory: Directory.Data,
    })
    return moved.uri
  } catch (error) {
    console.error("cannot move the recording file", error)
    return null
  }
}

export async function deleteAudioFile(uri) {
  try {
    await Filesystem.deleteFile({ path: uri })
  } catch (error) {
    console.error("cannot delete the recording file", error)
  }
}

// URL the WebView serves the file at: an <audio> plays it from there, and
// fetch reads it without going through base64.
export function audioFileUrl(uri) {
  return Capacitor.convertFileSrc(uri)
}

// The whole file as a File, to send or share it. null when unreadable.
export async function readAudioFile(uri, fileName, mimeType) {
  try {
    const response = await fetch(audioFileUrl(uri))
    return response.ok
      ? new File([await response.blob()], fileName, { type: mimeType })
      : null
  } catch (error) {
    console.error("cannot read the recording file", error)
    return null
  }
}

async function createRecordingsFolder() {
  try {
    await Filesystem.mkdir({
      path: RECORDINGS_FOLDER,
      directory: Directory.Data,
      recursive: true,
    })
  } catch {
    // Already there.
  }
}

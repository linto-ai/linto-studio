import { NATIVE_AUDIO_FOLDERS } from "../const/nativeAudioFolders.js"
import { fileNameOfUri } from "./fileNameOfUri.js"
import type { NativeFile } from "../types/localRecording.ts"

const KNOWN_FOLDERS: NativeFile[] = [
  NATIVE_AUDIO_FOLDERS.recordings,
  ...Object.values(NATIVE_AUDIO_FOLDERS.recorder),
] as NativeFile[]

/**
 * The audio file an absolute `file://` URI points to, relative to the
 * app folder holding it (see NATIVE_AUDIO_FOLDERS): what the recorder
 * plugin answers, or what rows stored before database version 3. Only
 * the folder's name and the file's name are read: the path before them
 * changes with each install on iOS.
 * @returns null when the file is not in one of the known folders
 */
export function locateNativeAudioFile(
  uri: string | null | undefined,
): NativeFile | null {
  const segments = (uri || "").split("/")
  const name = fileNameOfUri(uri)
  const folderName = segments.at(-2)
  const folder = KNOWN_FOLDERS.find(({ path }) => path === folderName)
  return folder && name
    ? { directory: folder.directory, path: `${folder.path}/${name}` }
    : null
}

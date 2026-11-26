import { locateNativeAudioFile } from "../../../mobile/tools/locateNativeAudioFile.ts"
import type { LocalRecording } from "../../../mobile/types/localRecording.ts"
import type { NestedRecording } from "./nestRecordingParts.ts"

/**
 * Database version 3: a native file is known relative to the app folder
 * holding it, no longer by its absolute URI, which changes on iOS with
 * each install. A URI outside the known folders leaves the recording
 * without file (its audio is then missing, as it would have been).
 */
export function locateNativeFiles(row: NestedRecording): LocalRecording {
  const { storage } = row.audio
  switch (storage.kind) {
    case "file":
      return {
        ...row,
        audio: {
          ...row.audio,
          storage: { kind: "file", file: locateNativeAudioFile(storage.uri) },
        },
      }
    default:
      return { ...row, audio: { ...row.audio, storage } }
  }
}

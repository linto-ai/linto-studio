import { RECORDING_STATUS } from "../const/recordingStatus.js"
import { mergeRecordingPatch } from "./mergeRecordingPatch.ts"
import type {
  LocalRecording,
  LocalRecordingPatch,
} from "../types/localRecording.ts"

interface NormalizedRecordings {
  // The rows to show, as they should now be.
  keep: LocalRecording[]
  // Ids of rows to delete with their audio.
  remove: string[]
  // What changed on the kept rows, to save in IndexedDB.
  patches: { id: string; patch: LocalRecordingPatch }[]
}

/**
 * Recordings read from the phone at startup, made consistent with the
 * automatic sending: a recording left on its stop sheet is queued (it is
 * sent as it stands); one still marked as running belongs to a previous
 * session, queued as interrupted when it has audio, dropped otherwise; an
 * upload cut short (app closed while sending) is queued again, unless it
 * is the one this session is sending right now.
 */
export function normalizeLoadedRecordings(
  recordings: LocalRecording[],
  uploadingId: string | null = null,
): NormalizedRecordings {
  const result: NormalizedRecordings = { keep: [], remove: [], patches: [] }
  for (const recording of recordings) {
    const patch = computeLoadPatch(recording, uploadingId)
    switch (true) {
      case patch === "remove":
        result.remove.push(recording.id)
        break
      case patch === null:
        result.keep.push(recording)
        break
      default:
        result.keep.push(mergeRecordingPatch(recording, patch))
        result.patches.push({ id: recording.id, patch })
    }
  }
  return result
}

function computeLoadPatch(
  recording: LocalRecording,
  uploadingId: string | null,
): LocalRecordingPatch | "remove" | null {
  switch (true) {
    case recording.status === RECORDING_STATUS.NAMING:
      return { status: RECORDING_STATUS.QUEUED }
    case recording.status === RECORDING_STATUS.UPLOADING &&
      recording.id !== uploadingId:
      return {
        status: RECORDING_STATUS.QUEUED,
        conversation: { sendProgress: 0 },
      }
    case recording.status === RECORDING_STATUS.RECORDING &&
      recording.audio.sizeBytes > 0:
      return {
        status: RECORDING_STATUS.QUEUED,
        audio: { interruptedAt: recording.audio.durationMs },
      }
    case recording.status === RECORDING_STATUS.RECORDING:
      return "remove"
    default:
      return null
  }
}

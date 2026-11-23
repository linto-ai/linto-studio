import type {
  LocalRecording,
  LocalRecordingPatch,
} from "../types/localRecording.ts"

/**
 * A recording's row with a patch applied: top-level fields replaced, the
 * `audio` and `conversation` parts merged into the row's own, so a patch
 * of one field of a part keeps the others. Does not mutate the row.
 */
export function mergeRecordingPatch(
  recording: LocalRecording,
  { audio, conversation, ...topLevel }: LocalRecordingPatch,
): LocalRecording {
  return {
    ...recording,
    ...topLevel,
    audio: { ...recording.audio, ...audio },
    conversation: { ...recording.conversation, ...conversation },
  }
}

import { mapApiTurns } from "@linto-ai/transcript-ui-webcomponent"
import { computeEpochMs } from "@/tools/date/computeEpochMs.js"

export function applyTrackContent(core, channel, track, content) {
  // A refetch carries the whole truth: a speaker already known is synced
  // too (renamed or undone while this tab was offline).
  for (const speaker of content.speakers ?? []) {
    const { speaker_id: id, speaker_name: name, defined } = speaker
    core.speakers.ensure(id, name, defined)
    core.speakers.update(id, { name, defined })
  }
  track.setTurns(mapApiTurns(content.text ?? []))
  core.transcriptionEditor?.setTranslationVersion(
    track.id,
    content.editorVersion ?? 0,
  )
  track.advanceLastModifiedAt(computeEpochMs(content.last_update))
  // The whole content arrives in one fetch: the panel shows its "beginning
  // of transcription" boundary.
  channel.hasMoreHistory.value = false
}

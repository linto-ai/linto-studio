import { mapApiTurns } from "@linto-ai/transcript-ui-webcomponent"
import { computeEpochMs } from "@/tools/date/computeEpochMs.js"

export function applyTrackContent(
  { core, speakerLabels },
  channel,
  track,
  content,
) {
  for (const speaker of content.speakers ?? []) {
    core.speakers.ensure(speaker.speaker_id, speakerLabels.addSpeaker(speaker))
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

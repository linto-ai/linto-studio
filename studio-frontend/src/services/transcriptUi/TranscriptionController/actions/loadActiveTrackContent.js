import { loadTrackContent } from "./loadTrackContent.js"

// Track contents are fetched lazily, once per track: a track that already
// has turns is kept as is.
export async function loadActiveTrackContent(transcriptionController) {
  const channel = transcriptionController.core.activeChannel.value
  if (!channel) return
  const track = channel.translations.get(channel.activeTranslation.value.id)
  if (!track || track.turns.value.length > 0) return
  await loadTrackContent(transcriptionController, channel, track)
}

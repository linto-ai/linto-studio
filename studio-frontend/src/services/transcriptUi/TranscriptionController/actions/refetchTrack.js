import { loadTrackContent } from "./loadTrackContent.js"

// Version gap or reconnection: the track is reloaded, loaded or not. A load
// already running may predate the change: the reload starts after it.
export async function refetchTrack(transcriptionController, trackId) {
  await transcriptionController.pendingTrackLoads.get(trackId)
  if (transcriptionController.destroyed) return
  for (const channel of transcriptionController.core.channels.values()) {
    const track = channel.translations.get(trackId)
    if (track) {
      await loadTrackContent(transcriptionController, channel, track)
      return
    }
  }
}

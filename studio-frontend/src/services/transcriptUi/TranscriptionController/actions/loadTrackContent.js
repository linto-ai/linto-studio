import { apiGetTrackContent } from "@/api/conversation.d/apiGetTrackContent.js"
import { applyTrackContent } from "./applyTrackContent.js"

// One fetch at a time per track: a second request for a track being loaded
// gets the pending load.
export function loadTrackContent(transcriptionController, channel, track) {
  const { pendingTrackLoads } = transcriptionController
  const pending = pendingTrackLoads.get(track.id)
  if (pending) return pending
  const load = fetchTrackContent(transcriptionController, channel, track)
  pendingTrackLoads.set(track.id, load)
  return load
}

async function fetchTrackContent(transcriptionController, channel, track) {
  startChannelLoad(transcriptionController, channel)
  const content = await apiGetTrackContent(track.id)
  transcriptionController.pendingTrackLoads.delete(track.id)
  endChannelLoad(transcriptionController, channel)
  // Destroyed during the fetch: the core is gone with the page.
  if (transcriptionController.destroyed || !content) return
  applyTrackContent(transcriptionController, channel, track, content)
}

// The loading indicator belongs to the channel: it stays on while any of
// its tracks loads.
function startChannelLoad({ pendingLoadsByChannel }, channel) {
  pendingLoadsByChannel.set(
    channel.id,
    (pendingLoadsByChannel.get(channel.id) ?? 0) + 1,
  )
  channel.isLoadingHistory.value = true
}

function endChannelLoad({ pendingLoadsByChannel }, channel) {
  const count = pendingLoadsByChannel.get(channel.id) - 1
  pendingLoadsByChannel.set(channel.id, count)
  channel.isLoadingHistory.value = count > 0
}

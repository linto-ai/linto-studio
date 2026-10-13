import { apiGetConversationLastUpdate } from "@/api/conversation"
import { computeEpochMs } from "@/tools/computeEpochMs.js"

// Seeds the "last modified" timestamp of a track from the server: the
// reference the SDK compares the reports generated from that track against.
// Later modifications arrive through the editor broadcasts (lastUpdate).
export async function loadTrackLastUpdate(track) {
  try {
    const res = await apiGetConversationLastUpdate(track.id)
    track.advanceLastModifiedAt(computeEpochMs(res?.last_update))
  } catch (error) {
    console.error("cannot fetch track last update", error)
  }
}

import { apiGetConversationLastUpdate } from "@/api/conversation"
import { computeEpochMs } from "@/tools/computeEpochMs.js"

// Seeds the "last modified" timestamp of a channel's source track from the
// server. Reports are generated from the channel conversation, i.e. its
// source track, so this is the reference the SDK compares them against.
// Later modifications arrive through the editor broadcasts (lastUpdate).
export async function loadSourceLastUpdate(channel) {
  const source = channel?.sourceTranslation
  if (!source) return
  try {
    const res = await apiGetConversationLastUpdate(source.id)
    source.advanceLastModifiedAt(computeEpochMs(res?.last_update))
  } catch (error) {
    console.error("cannot fetch source translation last update", error)
  }
}

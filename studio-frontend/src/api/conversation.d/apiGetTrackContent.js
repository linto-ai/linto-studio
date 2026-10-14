import { sendRequest } from "@/tools/sendRequest.js"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

// The content of one track, a conversation of its own: turns and speakers.
// The editor version and the last update come from the same backend read,
// so the baselines always match what is displayed. Resolves to null on
// failure.
export async function apiGetTrackContent(trackId) {
  const response = await sendRequest(
    `${BASE_API}/conversations/${trackId}`,
    { method: "get" },
    { key: ["text", "speakers", "editorVersion", "last_update"].toString() },
  )
  if (response?.status !== "success") {
    console.error("cannot load track content", trackId)
    return null
  }
  return response.data
}

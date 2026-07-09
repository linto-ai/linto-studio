// Microphone statuses that warrant a recovery banner (mirrors the states
// handled by MicrophoneStatusBanner).
export const MICROPHONE_BANNER_STATUSES = [
  "connection_lost",
  "mic_lost",
  "mic_interrupted",
]

// Decides which banner a live session view must display. A single slot with
// priority: a lost transcript feed wins over microphone trouble, because when
// the network is down both are symptoms of the same problem and stacking two
// banners saying "no connection" twice helps nobody.
// Returns "websocket_reconnecting" | "websocket_failed" | "microphone" | null.
export function resolveSessionBanner(websocketStatus, microphoneStatus) {
  if (websocketStatus === "reconnecting") return "websocket_reconnecting"
  if (websocketStatus === "failed") return "websocket_failed"
  if (MICROPHONE_BANNER_STATUSES.includes(microphoneStatus)) {
    return "microphone"
  }
  return null
}

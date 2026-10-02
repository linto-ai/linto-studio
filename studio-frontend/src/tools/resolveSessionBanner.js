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
// banners saying "no connection" twice helps nobody. Live credit comes last:
// it announces a cut to come, the other two describe a live already broken.
// liveCreditLevel is computeLiveCreditLevel's output.
// Returns "websocket_reconnecting" | "websocket_failed" | "microphone" |
// "live_credit_exhausted" | "live_credit_low" | null.
export function resolveSessionBanner(
  websocketStatus,
  microphoneStatus,
  liveCreditLevel = null,
) {
  if (websocketStatus === "reconnecting") return "websocket_reconnecting"
  if (websocketStatus === "failed") return "websocket_failed"
  if (MICROPHONE_BANNER_STATUSES.includes(microphoneStatus)) {
    return "microphone"
  }
  if (liveCreditLevel === "exhausted") return "live_credit_exhausted"
  if (liveCreditLevel === "low") return "live_credit_low"
  return null
}

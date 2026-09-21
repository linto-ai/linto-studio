import store from "@/mobile/store.js"
import { onBackOnline } from "@/mobile/services/network/onlineStatus.js"

const RETRY_INTERVAL_MS = 60_000

// Sends what is waiting in the queue: at startup, when the network comes
// back, when the app is shown again, and every minute while visible.
export function startUploadResumption() {
  retry()
  onBackOnline(retry)
  document.addEventListener("visibilitychange", retryWhenVisible)
  setInterval(retryWhenVisible, RETRY_INTERVAL_MS)
}

async function retry() {
  if (!navigator.onLine) return
  if (!store.state.mobileRecordings.loaded) {
    await store.dispatch("mobileRecordings/load")
  }
  await store.dispatch("mobileRecordings/retryPending")
}

function retryWhenVisible() {
  if (document.visibilityState === "visible") retry()
}

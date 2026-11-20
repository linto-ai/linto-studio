import store from "@/mobile/store.js"
import { isOnline, subscribeToNetwork } from "@/api/device/network.js"

const RETRY_INTERVAL_MS = 60_000

// Sends what is waiting in the queue: at startup, when the network comes
// back, when the app is shown again, and every minute while visible.
export function startUploadResumption() {
  retry()
  subscribeToNetwork(retryWhenOnline)
  document.addEventListener("visibilitychange", retryWhenVisible)
  setInterval(retryWhenVisible, RETRY_INTERVAL_MS)
}

async function retry() {
  if (!isOnline()) return
  if (!store.state.mobileRecordings.loaded) {
    await store.dispatch("mobileRecordings/load")
  }
  await store.dispatch("mobileRecordings/retryPending")
}

function retryWhenOnline(online) {
  if (online) retry()
}

function retryWhenVisible() {
  if (document.visibilityState === "visible") retry()
}

import { AUTH_CHANNEL_NAME } from "@/const/auth.js"
import { readStoredAuth } from "./readStoredAuth.js"
import { isSameAuth } from "./isSameAuth.js"

/**
 * Reloads the page when the saved session is no longer the one this tab
 * runs with: another tab logged out, logged in as someone else or started
 * an impersonation. The router then sends the page where it belongs (login,
 * or the new user's home). Checked when another tab says so
 * (notifyAuthChanged.js) and when this tab shows again, as a frozen tab can
 * miss the message.
 *
 * Call it once per page, from the entry points (main.js, mobile/main.js):
 * it listens for the whole life of the page.
 * @param {() => object | null} readCurrentAuth - the session of this tab
 */
export function watchAuthInOtherTabs(readCurrentAuth) {
  // WebKit before 15.4 (iOS 15.0-15.3) has no BroadcastChannel: the check
  // when the tab shows again is left
  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME)
    channel.addEventListener("message", reloadIfAuthChanged)
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") reloadIfAuthChanged()
  })

  function reloadIfAuthChanged() {
    if (!isSameAuth(readStoredAuth(), readCurrentAuth())) {
      window.location.reload()
    }
  }
}

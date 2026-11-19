import { AUTH_CHANNEL_NAME } from "@/const/auth.js"

/**
 * Tells the other tabs the saved session changed (login, logout,
 * impersonation): they compare it with theirs (watchAuthInOtherTabs.js).
 * The message carries nothing, the saved session is the reference. Only the
 * auth store module calls it, once the session is saved.
 */
export function notifyAuthChanged() {
  // WebKit before 15.4 (iOS 15.0-15.3): the other tabs catch up when shown
  if (typeof BroadcastChannel === "undefined") return
  const channel = new BroadcastChannel(AUTH_CHANNEL_NAME)
  channel.postMessage("changed")
  channel.close()
}

// Whether the browser has a network, and when that changes. Keeps no
// state: the caller decides where the value lives (the mobile store).
export function isOnline() {
  return navigator.onLine
}

// Calls callback(online) on each change. Returns the unsubscribe.
export function subscribeToNetwork(callback) {
  function onOnline() {
    callback(true)
  }
  function onOffline() {
    callback(false)
  }
  window.addEventListener("online", onOnline)
  window.addEventListener("offline", onOffline)
  return function unsubscribe() {
    window.removeEventListener("online", onOnline)
    window.removeEventListener("offline", onOffline)
  }
}

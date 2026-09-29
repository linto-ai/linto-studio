import Vue from "vue"

// Reactive mirror of navigator.onLine. `online` is what the UI shows; the
// upload queue also listens to `onBackOnline` to resume.
export const onlineStatus = Vue.observable({ online: navigator.onLine })

const listeners = new Set()

export function watchOnlineStatus() {
  window.addEventListener("online", () => setOnline(true))
  window.addEventListener("offline", () => setOnline(false))
}

export function onBackOnline(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function setOnline(online) {
  const wasOffline = !onlineStatus.online
  onlineStatus.online = online
  if (online && wasOffline) {
    listeners.forEach((listener) => listener())
  }
}

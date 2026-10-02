// Failures of the secondary actions (list, load, create, rename, delete):
// a notification. A failed reply is answered in the thread instead (see
// showErrorReply).
export function notifyError(chatIntegration, key) {
  if (chatIntegration.isDisposed) return
  chatIntegration.notify("error", chatIntegration.t(key))
}

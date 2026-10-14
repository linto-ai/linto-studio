// The drawer keeps nothing of the track it leaves. It stays open: it then
// shows the discussions of the next track.
export function resetChat(core) {
  core.chat.streamAbort()
  core.chat.setSessions([])
  core.chat.setActiveSession(null)
  core.chat.setMessages([])
  core.chat.setLoadingSession(false)
}

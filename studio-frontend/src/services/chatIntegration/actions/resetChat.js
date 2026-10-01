// chat is undefined when the editor was torn down first.
export function resetChat(chat) {
  chat?.streamAbort()
  chat?.setSessions([])
  chat?.setActiveSession(null)
  chat?.setMessages([])
  chat?.setLoadingSession(false)
}

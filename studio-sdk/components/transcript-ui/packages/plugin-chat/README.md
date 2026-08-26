# @linto/transcript-ui-plugin-chat

A chat panel for talking with an LLM assistant about the transcript — sessions, streaming responses, message history. No network calls: the UI emits intents (send, load session, …) and the host performs the actual requests, pushing results back in.

## Usage

```ts
import { createChatPlugin } from "@linto/transcript-ui-plugin-chat"

core.use(createChatPlugin())

core.on("chat:loadSessions", async () => {
  core.chat!.setSessions(await api.listSessions())
})

core.on("chat:loadSession", async ({ sessionId }) => {
  core.chat!.setActiveSession(sessionId)
  core.chat!.setLoadingSession(true)
  core.chat!.setMessages(await api.fetchMessages(sessionId))
  core.chat!.setLoadingSession(false)
})

core.on("chat:send", async ({ content }) => {
  const userMessage = { id: crypto.randomUUID(), role: "user" as const, content }
  core.chat!.addMessage(userMessage)

  core.chat!.streamStart()
  let fullReply = ""
  for await (const token of api.streamReply(content)) {
    fullReply += token
    core.chat!.streamAppend(token)
  }
  core.chat!.streamEnd(fullReply)
})
```

The header's "ask" button already opens the drawer on its own once this plugin is active — call `core.chat!.setDrawerOpen(true)` yourself only if you're triggering it from your own UI instead.

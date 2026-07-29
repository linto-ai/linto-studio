// Glue between the SDK core and the host app for the chat assistant:
// - installs the (state-only) chat plugin on the core
// - listens to the UI intents (chat:* events) emitted by the SDK drawer
// - performs the REST / SSE calls (api/chat.js) and pushes results back
//   through core.chat.*
//
// All work lives in actions/. This file only wires deps together. Mirrors
// services/llmServicesIntegration/index.js.

import { createChatPlugin } from "@linto/transcript-ui/webcomponent"

import { onLoadSessions } from "./actions/onLoadSessions"
import { onLoadSession } from "./actions/onLoadSession"
import { onCreateSession } from "./actions/onCreateSession"
import { onDeleteSession } from "./actions/onDeleteSession"
import { onRenameSession } from "./actions/onRenameSession"
import { onSend } from "./actions/onSend"

export function setupChat(core, { conversationId }) {
  core.use(createChatPlugin())

  const ctx = { core, scope: { kind: "conversation", conversationId } }

  const unsub = [
    core.on("chat:loadSessions", () => onLoadSessions(ctx)),
    core.on("chat:loadSession", ({ sessionId }) => onLoadSession(ctx, sessionId)),
    core.on("chat:createSession", () => onCreateSession(ctx)),
    core.on("chat:deleteSession", ({ sessionId }) =>
      onDeleteSession(ctx, sessionId),
    ),
    core.on("chat:renameSession", ({ sessionId, title }) =>
      onRenameSession(ctx, sessionId, title),
    ),
    core.on("chat:send", ({ content }) => onSend(ctx, content)),
  ]

  return () => unsub.forEach((fn) => fn?.())
}

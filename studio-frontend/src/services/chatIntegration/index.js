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
import { createThread } from "./actions/createThread"
import { onDeleteSession } from "./actions/onDeleteSession"
import { onRenameSession } from "./actions/onRenameSession"
import { onSend } from "./actions/onSend"
import { onCatchup } from "./actions/onCatchup"

// scope: { kind: "conversation", conversationId } or
//        { kind: "session", organizationId, sessionId }
// catchup (optional): { content, lang } — enables the drawer catchup action.
export function setupChat(core, { scope: initialScope, catchup }) {
  core.use(createChatPlugin({ catchup: !!catchup }))

  const scope = { ...initialScope }
  const ctx = { core, scope, catchup }

  const unsub = [
    core.on("chat:loadSessions", () => onLoadSessions(ctx)),
    core.on("chat:loadSession", ({ sessionId }) =>
      onLoadSession(ctx, sessionId),
    ),
    core.on("chat:createSession", () => createThread(ctx)),
    core.on("chat:deleteSession", ({ sessionId }) =>
      onDeleteSession(ctx, sessionId),
    ),
    core.on("chat:renameSession", ({ sessionId, title }) =>
      onRenameSession(ctx, sessionId, title),
    ),
    core.on("chat:send", ({ content }) => onSend(ctx, content)),
    core.on("chat:catchup", () => onCatchup(ctx)),
  ]

  // Threads are pinned to a channel at creation; follow the channel the
  // user is watching so new threads target it.
  if (scope.kind === "session") {
    scope.channelId = core.activeChannelId.value || null
    unsub.push(
      core.on("channel:change", ({ channelId }) => {
        scope.channelId = channelId
      }),
    )
  }

  function dispose() {
    unsub.forEach((fn) => fn?.())
  }

  // Reopen the latest existing thread, or start a briefing when none exists.
  async function openCatchup() {
    const chat = core.chat
    chat.setDrawerOpen(true)
    if (chat.activeSessionId.value) return

    const sessions = await onLoadSessions(ctx)
    if (sessions.length > 0) {
      await onLoadSession(ctx, sessions[0].id)
    } else {
      await onCatchup(ctx)
    }
  }

  return { dispose, openCatchup }
}

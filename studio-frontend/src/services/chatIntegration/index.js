// Host glue for the SDK chat drawer of one conversation: listens to the
// chat:* intents, does the REST/SSE calls (api/chat.js) and pushes results
// back through core.chat.*. The SDK still calls a discussion a "session".
//
// The chat plugin must already be installed on the core.

import { loadDiscussions } from "./actions/loadDiscussions"
import { loadDiscussionMessages } from "./actions/loadDiscussionMessages"
import { createDiscussion } from "./actions/createDiscussion"
import { deleteDiscussion } from "./actions/deleteDiscussion"
import { renameDiscussion } from "./actions/renameDiscussion"
import { sendMessage } from "./actions/sendMessage"
import { autoNameDiscussion } from "./actions/autoNameDiscussion"
import { streamAssistantReply } from "./actions/streamAssistantReply"

export class ChatIntegration {
  constructor(core, { conversationId }) {
    this.core = core
    this.conversationId = conversationId
    // Responses landing after dispose() must leave the drawer alone: it
    // shows another conversation by then
    this.isDisposed = false
    // In-flight guards, read and written by the actions
    this.turnInFlight = false
    this.discussionsInFlight = null

    this.loadDiscussions = loadDiscussions.bind(this)
    this.loadDiscussionMessages = loadDiscussionMessages.bind(this)
    this.createDiscussion = createDiscussion.bind(this)
    this.deleteDiscussion = deleteDiscussion.bind(this)
    this.renameDiscussion = renameDiscussion.bind(this)
    this.sendMessage = sendMessage.bind(this)
    this.autoNameDiscussion = autoNameDiscussion.bind(this)
    this.streamAssistantReply = streamAssistantReply.bind(this)

    this.unsubscribes = [
      core.on("chat:loadSessions", () => this.loadDiscussions()),
      core.on("chat:loadSession", ({ sessionId }) =>
        this.loadDiscussionMessages(sessionId),
      ),
      core.on("chat:createSession", () => this.createDiscussion()),
      core.on("chat:deleteSession", ({ sessionId }) =>
        this.deleteDiscussion(sessionId),
      ),
      core.on("chat:renameSession", ({ sessionId, title }) =>
        this.renameDiscussion(sessionId, title),
      ),
      core.on("chat:send", ({ content }) => this.sendMessage(content)),
    ]

    // A drawer left open across a channel change shows the new discussions.
    if (core.chat.drawerOpen.value) this.loadDiscussions()
  }

  dispose() {
    this.isDisposed = true
    this.unsubscribes.forEach((fn) => fn?.())
    this.unsubscribes = []
  }
}

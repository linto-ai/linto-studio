// Host glue for the SDK chat drawer of one conversation: listens to the
// chat:* intents, does the REST/SSE calls (api/chat.js) and pushes results
// back through core.chat.*. The SDK still calls a discussion a "session".
//
// The chat plugin must already be installed on the core. The methods below
// are the whole public API; each delegates to its action in actions/.

import { loadDiscussions } from "./actions/loadDiscussions"
import { loadDiscussionMessages } from "./actions/loadDiscussionMessages"
import { createDiscussion } from "./actions/createDiscussion"
import { deleteDiscussion } from "./actions/deleteDiscussion"
import { renameDiscussion } from "./actions/renameDiscussion"
import { sendMessage } from "./actions/sendMessage"
import { resetChat } from "./actions/resetChat"

export class ChatIntegration {
  constructor(core, { conversationId }) {
    this.core = core
    this.conversationId = conversationId
    // Responses landing after dispose() must leave the drawer alone: it
    // shows another conversation by then
    this.isDisposed = false
    // In-flight guards, read and written by the actions
    this.isCreatingDiscussion = false
    this.discussionsInFlight = null
    // The stream whose tokens reach the drawer; null once its discussion is
    // left (see showDiscussion)
    this.displayedStream = null

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

  loadDiscussions() {
    return loadDiscussions(this)
  }

  loadDiscussionMessages(discussionId) {
    return loadDiscussionMessages(this, discussionId)
  }

  createDiscussion(title) {
    return createDiscussion(this, title)
  }

  deleteDiscussion(discussionId) {
    return deleteDiscussion(this, discussionId)
  }

  renameDiscussion(discussionId, title) {
    return renameDiscussion(this, discussionId, title)
  }

  sendMessage(content) {
    return sendMessage(this, content)
  }

  // The drawer keeps nothing of the conversation it leaves.
  dispose() {
    this.isDisposed = true
    this.displayedStream = null
    this.unsubscribes.forEach((fn) => fn?.())
    this.unsubscribes = []
    resetChat(this.core.chat)
  }
}

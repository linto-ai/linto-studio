import { loadDiscussions } from "./actions/loadDiscussions.js"
import { loadDiscussionMessages } from "./actions/loadDiscussionMessages.js"
import { createDiscussion } from "./actions/createDiscussion.js"
import { deleteDiscussion } from "./actions/deleteDiscussion.js"
import { renameDiscussion } from "./actions/renameDiscussion.js"
import { sendMessage } from "./actions/sendMessage.js"

// The discussions about one track, a conversation of its own (the wire and
// the SDK call them chat "sessions"). Lives as long as the track is
// followed: once destroyed, a pending request drops its result and the
// streamed reply stops, instead of landing in the chat of the next track.
export class TrackChat {
  constructor(chatController, trackId) {
    const { core } = chatController
    this.chatController = chatController
    this.core = core
    this.trackId = trackId
    this.destroyed = false
    // A message being sent: the composer is only disabled once its reply
    // streams, not while its discussion is created.
    this.isSending = false
    // The reply being streamed, aborted when it no longer has a place to go
    this.replyStream = null
    this.offLoadSessions = core.on("chat:loadSessions", () =>
      this.loadDiscussions(),
    )
    this.offLoadSession = core.on("chat:loadSession", ({ sessionId }) =>
      this.loadDiscussionMessages(sessionId),
    )
    this.offCreateSession = core.on("chat:createSession", () =>
      this.createDiscussion(),
    )
    this.offDeleteSession = core.on("chat:deleteSession", ({ sessionId }) =>
      this.deleteDiscussion(sessionId),
    )
    this.offRenameSession = core.on(
      "chat:renameSession",
      ({ sessionId, title }) => this.renameDiscussion(sessionId, title),
    )
    this.offSend = core.on("chat:send", ({ content }) =>
      this.sendMessage(content),
    )
    // A drawer left open across a track change shows the new discussions.
    if (core.chat.drawerOpen.value) this.loadDiscussions()
  }

  loadDiscussions() {
    return loadDiscussions(this)
  }

  loadDiscussionMessages(discussionId) {
    return loadDiscussionMessages(this, discussionId)
  }

  createDiscussion() {
    return createDiscussion(this)
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

  destroy() {
    this.destroyed = true
    this.replyStream?.abort()
    this.replyStream = null
    this.offLoadSessions()
    this.offLoadSession()
    this.offCreateSession()
    this.offDeleteSession()
    this.offRenameSession()
    this.offSend()
  }
}

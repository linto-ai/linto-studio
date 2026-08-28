// Host glue for the SDK chat drawer: listens to the chat:* intents, does
// the REST/SSE calls (api/chat.js) and pushes results back through
// core.chat.*.

import { createChatPlugin } from "@linto/transcript-ui/webcomponent"

import { loadDiscussions } from "./actions/loadDiscussions"
import { loadDiscussionMessages } from "./actions/loadDiscussionMessages"
import { createDiscussion } from "./actions/createDiscussion"
import { deleteDiscussion } from "./actions/deleteDiscussion"
import { renameDiscussion } from "./actions/renameDiscussion"
import { sendMessage } from "./actions/sendMessage"
import { startDiscussion } from "./actions/startDiscussion"
import { autoNameDiscussion } from "./actions/autoNameDiscussion"
import { streamAssistantReply } from "./actions/streamAssistantReply"

// scope: {kind:"conversation",conversationId} | {kind:"session",organizationId,sessionId}
export class ChatIntegration {
  constructor(core, { scope }) {
    this.core = core
    // for api call could be {kind: session | conversation, id}
    this.scope = { ...scope }
    // In-flight guards, read and written by the actions
    this.turnInFlight = false
    this.discussionsInFlight = null

    this.loadDiscussions = loadDiscussions.bind(this)
    this.loadDiscussionMessages = loadDiscussionMessages.bind(this)
    this.createDiscussion = createDiscussion.bind(this)
    this.deleteDiscussion = deleteDiscussion.bind(this)
    this.renameDiscussion = renameDiscussion.bind(this)
    this.sendMessage = sendMessage.bind(this)
    this.startDiscussion = startDiscussion.bind(this)
    this.autoNameDiscussion = autoNameDiscussion.bind(this)
    this.streamAssistantReply = streamAssistantReply.bind(this)

    core.use(createChatPlugin())

    this.unsubscribes = [
      core.on("chat:loadDiscussions", () => this.loadDiscussions()),
      core.on("chat:loadDiscussionMessages", ({ discussionId }) =>
        this.loadDiscussionMessages(discussionId),
      ),
      core.on("chat:createDiscussion", () => this.createDiscussion()),
      core.on("chat:deleteDiscussion", ({ discussionId }) =>
        this.deleteDiscussion(discussionId),
      ),
      core.on("chat:renameDiscussion", ({ discussionId, title }) =>
        this.renameDiscussion(discussionId, title),
      ),
      core.on("chat:send", ({ content }) => this.sendMessage(content)),
    ]
  }

  dispose() {
    this.unsubscribes.forEach((fn) => fn?.())
    this.unsubscribes = []
  }

  // Open the drawer and start a fresh discussion seeded with a prerecorded
  // prompt. requestArgs (e.g. { mode, lang }) is forwarded opaque down to
  // the api layer, which owns the wire fields.
  async openWithPrompt(prompt, requestArgs) {
    this.core.chat.setDrawerOpen(true)
    await this.startDiscussion(prompt, requestArgs)
  }
}

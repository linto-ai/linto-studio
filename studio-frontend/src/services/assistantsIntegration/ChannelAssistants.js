import { createChatPlugin } from "@linto-ai/transcript-ui-webcomponent"

import { setupLLMServices } from "@/services/llmServicesIntegration"
import { ChatIntegration } from "@/services/chatIntegration"
import { resetChat } from "@/services/chatIntegration/helpers"

// The AI services, the chat and the exports of the editor act on the
// conversation of the active channel: the media, or one of its channels.
export class ChannelAssistants {
  constructor(core, llmServicesOptions) {
    this.core = core
    this.llmServicesOptions = llmServicesOptions
    this.chatEnabled = false
    this.disposeLLMServices = null
    this.chat = null
    this.setupConversation(llmServicesOptions.conversationId)
    this.offChannelChange = core.on("channel:change", ({ channelId }) =>
      this.setupConversation(channelId),
    )
  }

  setupConversation(conversationId) {
    this.disposeConversation()
    this.conversationId = conversationId
    this.disposeLLMServices = setupLLMServices(this.core, {
      ...this.llmServicesOptions,
      conversationId,
    }).dispose
    if (this.chatEnabled) this.setupConversationChat()
  }

  setupConversationChat() {
    this.chat = new ChatIntegration(this.core, {
      conversationId: this.conversationId,
    })
  }

  // Called once the host knows the backend offers the chat.
  enableChat() {
    this.core.use(createChatPlugin())
    this.chatEnabled = true
    this.setupConversationChat()
  }

  disposeConversation() {
    this.disposeLLMServices?.()
    this.disposeLLMServices = null
    if (this.chat) {
      this.chat.dispose()
      this.chat = null
      resetChat(this.core)
    }
  }

  destroy() {
    this.offChannelChange()
    this.disposeConversation()
  }
}

import { setupLLMServices } from "@/services/llmServicesIntegration"
import { setupChat } from "@/services/chatIntegration"

// The AI services, the chat and the exports of the editor act on the
// conversation of the active channel: the media, or one of its channels.
export class ChannelAssistants {
  constructor(core, llmServicesOptions) {
    this.core = core
    this.llmServicesOptions = llmServicesOptions
    this.chatEnabled = false
    this.disposeLLMServices = null
    this.disposeChat = null
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
    this.disposeChat = setupChat(this.core, {
      conversationId: this.conversationId,
    })
  }

  // Called once the host knows the backend offers the chat.
  enableChat() {
    this.chatEnabled = true
    this.setupConversationChat()
  }

  disposeConversation() {
    this.disposeLLMServices?.()
    this.disposeLLMServices = null
    this.disposeChat?.()
    this.disposeChat = null
  }

  destroy() {
    this.offChannelChange()
    this.disposeConversation()
  }
}

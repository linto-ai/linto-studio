import { createChatPlugin } from "@linto-ai/transcript-ui-webcomponent"

import { apiGetChatStatus } from "@/api/chat"
import { setupLLMServices } from "@/services/llmServicesIntegration"
import { ChatIntegration } from "@/services/chatIntegration"

// The AI services, the chat and the exports of the editor act on the
// conversation of the active channel: the media, or one of its channels.
export class ChannelAssistants {
  constructor(core, llmServicesOptions) {
    this.core = core
    this.llmServicesOptions = llmServicesOptions
    this.isDestroyed = false
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

  // Wires the chat only when the backend offers it, so the editor's "ask"
  // button stays hidden otherwise (core.chat absent).
  async enableChatIfAvailable() {
    const { enabled } = await apiGetChatStatus().catch(() => ({
      enabled: false,
    }))
    if (!enabled || this.isDestroyed) return
    this.core.use(createChatPlugin())
    this.chatEnabled = true
    this.setupConversationChat()
  }

  disposeConversation() {
    this.disposeLLMServices?.()
    this.disposeLLMServices = null
    this.chat?.dispose()
    this.chat = null
  }

  destroy() {
    this.isDestroyed = true
    this.offChannelChange()
    this.disposeConversation()
  }
}

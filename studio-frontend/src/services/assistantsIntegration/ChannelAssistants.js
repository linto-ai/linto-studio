import { createChatPlugin } from "@linto-ai/transcript-ui-webcomponent"

import { apiGetChatStatus } from "@/api/chat"
import { setupLLMServices } from "@/services/llmServicesIntegration"
import { ChatIntegration } from "@/services/chatIntegration"

// The AI services, the chat and the exports of the editor act on the
// conversation of the active channel: the media, or one of its channels.
// options: the host dependencies of setupLLMServices and ChatIntegration
export class ChannelAssistants {
  constructor(core, options) {
    this.core = core
    this.options = options
    this.isDestroyed = false
    this.chatEnabled = false
    this.disposeLLMServices = null
    this.chat = null
    this.setupConversation(options.conversationId)
    this.offChannelChange = core.on("channel:change", ({ channelId }) =>
      this.setupConversation(channelId),
    )
  }

  setupConversation(conversationId) {
    this.disposeConversation()
    this.conversationId = conversationId
    this.disposeLLMServices = setupLLMServices(this.core, {
      ...this.options,
      conversationId,
    }).dispose
    if (this.chatEnabled) this.setupConversationChat()
  }

  setupConversationChat() {
    const { t, notify, isOrganizationAdmin, openUpgradeModal } = this.options
    this.chat = new ChatIntegration(this.core, {
      conversationId: this.conversationId,
      t,
      notify,
      isOrganizationAdmin,
      openUpgradeModal,
    })
  }

  // Wires the chat only when the backend offers it, so the editor's "ask"
  // button stays hidden otherwise (core.chat absent).
  async enableChatIfAvailable() {
    const status = await apiGetChatStatus()
    if (!status?.enabled || this.isDestroyed) return
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

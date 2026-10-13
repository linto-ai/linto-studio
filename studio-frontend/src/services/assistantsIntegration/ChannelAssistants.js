import { setupLLMServices } from "@/services/llmServicesIntegration"
import { setupChat } from "@/services/chatIntegration"
import { computeAssistantsTrack } from "@/tools/llm/computeAssistantsTrack.js"

// The AI services, the chat and the exports of the editor act on the
// conversation of the displayed track: the media, one of its channels, or one
// of their translations (see computeAssistantsTrack).
export class ChannelAssistants {
  constructor(core, llmServicesOptions) {
    this.core = core
    this.llmServicesOptions = llmServicesOptions
    this.chatEnabled = false
    this.disposeLLMServices = null
    this.disposeChat = null
    this.setupConversation(llmServicesOptions.conversationId)
    this.offChannelChange = core.on("channel:change", () =>
      this.followActiveTrack(),
    )
    this.offTranslationChange = core.on("translation:change", () =>
      this.followActiveTrack(),
    )
  }

  // A channel change restores the translation that channel was on without a
  // translation:change: both events resolve the track from the active channel.
  followActiveTrack() {
    const channel = this.core.activeChannel.value
    if (!channel) return
    const { id } = computeAssistantsTrack(channel)
    if (id !== this.conversationId) this.setupConversation(id)
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
    this.offTranslationChange()
    this.disposeConversation()
  }
}

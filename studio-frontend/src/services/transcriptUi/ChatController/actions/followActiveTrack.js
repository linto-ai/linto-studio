import { ChatIntegration } from "@/services/chatIntegration"
import { computeAssistantsTrack } from "@/tools/llm/computeAssistantsTrack.js"

// A new followed track gets a fresh ChatIntegration; disposing the previous
// one empties the drawer, which stays open on the discussions of the next
// track.
export function followActiveTrack(chatController) {
  const channel = chatController.core.activeChannel.value
  if (!channel) return
  const trackId = computeAssistantsTrack(channel).id
  if (trackId === chatController.chatIntegration?.conversationId) return
  chatController.chatIntegration?.dispose()
  chatController.chatIntegration = new ChatIntegration(chatController.core, {
    conversationId: trackId,
    ...chatController.integrationOptions,
  })
}

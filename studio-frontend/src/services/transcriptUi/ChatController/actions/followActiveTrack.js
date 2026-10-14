import { computeAssistantsTrack } from "@/tools/llm/computeAssistantsTrack.js"
import { TrackChat } from "../TrackChat/index.js"
import { resetChat } from "./resetChat.js"

// A new followed track gets a fresh TrackChat, on a chat emptied of the
// previous track.
export function followActiveTrack(chatController) {
  const channel = chatController.core.activeChannel.value
  if (!channel) return
  const trackId = computeAssistantsTrack(channel).id
  if (trackId === chatController.trackChat?.trackId) return
  chatController.trackChat?.destroy()
  resetChat(chatController.core)
  chatController.trackChat = new TrackChat(chatController, trackId)
}

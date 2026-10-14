import { createChatPlugin } from "@linto-ai/transcript-ui-webcomponent"
import { apiGetChatStatus } from "@/api/chat"

// Without the plugin, the editor offers no chat: it is installed only when
// the backend has one.
export async function enableIfAvailable(chatController) {
  const status = await apiGetChatStatus()
  if (chatController.destroyed || !status?.enabled) return
  const { core } = chatController
  core.use(createChatPlugin())
  chatController.offActiveTrackChange = core.on("activeTrack:change", () =>
    chatController.followActiveTrack(),
  )
  chatController.followActiveTrack()
}

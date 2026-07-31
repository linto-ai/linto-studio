import { ref, computed } from "vue"
import type {
  Core,
  CorePlugin,
  ChatMessage,
  ChatDiscussion,
  ChatPluginApi,
} from "../../core/types"

export type { ChatMessage, ChatDiscussion, ChatPluginApi }

const STREAMING_MESSAGE_ID = "__streaming__"

/**
 * Chat plugin — state container only, no network.
 *
 * The UI emits intents (`chat:send`, `chat:loadDiscussions`, …) via `core.emit`,
 * the host listens, performs the HTTP/SSE calls, and pushes results back
 * through the setters below. Mirrors the `llmServices` plugin design.
 */
export function createChatPlugin(): CorePlugin {
  return {
    name: "chat",

    install(core: Core) {
      const drawerOpen = ref(false)
      const discussions = ref<ChatDiscussion[]>([])
      const activeDiscussionId = ref<string | null>(null)
      const messages = ref<ChatMessage[]>([])
      const isStreaming = ref(false)
      const streamingContent = ref("")
      const isLoadingDiscussion = ref(false)

      // Local counter for client-side message ids (host messages carry their own).
      let seq = 0
      const nextId = (): string => `local-${++seq}`

      const allMessages = computed<ChatMessage[]>(() => {
        if (!isStreaming.value) return messages.value
        return [
          ...messages.value,
          {
            id: STREAMING_MESSAGE_ID,
            role: "assistant",
            content: streamingContent.value,
            streaming: true,
          },
        ]
      })

      const api: ChatPluginApi = {
        drawerOpen,
        discussions,
        activeDiscussionId,
        messages,
        isStreaming,
        streamingContent,
        isLoadingDiscussion,
        allMessages,

        setDrawerOpen(open) {
          drawerOpen.value = open
        },
        setDiscussions(next) {
          discussions.value = next
        },
        setActiveDiscussion(discussionId) {
          activeDiscussionId.value = discussionId
        },
        setMessages(next) {
          messages.value = next
        },
        addMessage(message) {
          messages.value = [...messages.value, message]
        },
        updateDiscussionTitle(discussionId, title) {
          const discussion = discussions.value.find((d) => d.id === discussionId)
          if (discussion) discussion.title = title
        },
        setLoadingDiscussion(loading) {
          isLoadingDiscussion.value = loading
        },

        streamStart() {
          isStreaming.value = true
          streamingContent.value = ""
        },
        streamAppend(token) {
          streamingContent.value += token
        },
        streamEnd(content, meta) {
          messages.value = [
            ...messages.value,
            {
              id: nextId(),
              role: "assistant",
              content,
              tokenCount: meta?.tokenCount,
            },
          ]
          isStreaming.value = false
          streamingContent.value = ""
        },
        streamAbort() {
          isStreaming.value = false
          streamingContent.value = ""
        },
      }

      core.chat = api

      return () => {
        discussions.value = []
        messages.value = []
        activeDiscussionId.value = null
        isStreaming.value = false
        streamingContent.value = ""
        isLoadingDiscussion.value = false
        drawerOpen.value = false
        core.chat = undefined
      }
    },
  }
}

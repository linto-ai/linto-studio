import { ref, computed } from "vue"
import type {
  Core,
  CorePlugin,
  ChatMessage,
  ChatSession,
  ChatPluginApi,
} from "../../core/types"

export type { ChatMessage, ChatSession, ChatPluginApi }

const STREAMING_MESSAGE_ID = "__streaming__"

/**
 * Chat plugin — state container only, no network.
 *
 * The UI emits intents (`chat:send`, `chat:loadSession`, …) via `core.emit`,
 * the host listens, performs the HTTP/SSE calls, and pushes results back
 * through the setters below. Mirrors the `llmServices` plugin design.
 */
export function createChatPlugin(): CorePlugin {
  return {
    name: "chat",

    install(core: Core) {
      const drawerOpen = ref(false)
      const sessions = ref<ChatSession[]>([])
      const activeSessionId = ref<string | null>(null)
      const messages = ref<ChatMessage[]>([])
      const isStreaming = ref(false)
      const streamingContent = ref("")
      const isLoadingSession = ref(false)

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
        sessions,
        activeSessionId,
        messages,
        isStreaming,
        streamingContent,
        isLoadingSession,
        allMessages,

        setDrawerOpen(open) {
          drawerOpen.value = open
        },
        setSessions(next) {
          sessions.value = next
        },
        setActiveSession(sessionId) {
          activeSessionId.value = sessionId
        },
        setMessages(next) {
          messages.value = next
        },
        addMessage(message) {
          messages.value = [...messages.value, message]
        },
        updateSessionTitle(sessionId, title) {
          const session = sessions.value.find((s) => s.id === sessionId)
          if (session) session.title = title
        },
        setLoadingSession(loading) {
          isLoadingSession.value = loading
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
        sessions.value = []
        messages.value = []
        activeSessionId.value = null
        isStreaming.value = false
        streamingContent.value = ""
        isLoadingSession.value = false
        drawerOpen.value = false
        core.chat = undefined
      }
    },
  }
}

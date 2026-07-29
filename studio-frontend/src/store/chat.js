import {
  apiCreateChatSession,
  apiListChatSessions,
  apiGetChatSession,
  apiDeleteChatSession,
  apiUpdateChatSessionTitle,
  apiSendChatMessage,
  apiGetChatStatus,
} from "@/api/chat"
import { truncateTitle } from "@/tools/truncateTitle"

export default {
  namespaced: true,
  state: {
    enabled: false,
    catchupEnabled: false,
    sessions: [],
    activeSessionId: null,
    messages: [],
    isStreaming: false,
    streamingContent: "",
    drawerOpen: false,
    scope: null,
  },
  mutations: {
    SET_ENABLED(state, val) {
      state.enabled = val
    },
    SET_CATCHUP_ENABLED(state, val) {
      state.catchupEnabled = val
    },
    SET_SESSIONS(state, sessions) {
      state.sessions = sessions
    },
    SET_ACTIVE_SESSION(state, sessionId) {
      state.activeSessionId = sessionId
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message)
    },
    SET_STREAMING(state, val) {
      state.isStreaming = val
    },
    SET_STREAMING_CONTENT(state, val) {
      state.streamingContent = val
    },
    APPEND_STREAMING_CONTENT(state, val) {
      state.streamingContent += val
    },
    SET_DRAWER_OPEN(state, val) {
      state.drawerOpen = val
    },
    SET_SCOPE(state, scope) {
      state.scope = scope
    },
    UPDATE_SESSION_TITLE(state, { sessionId, title }) {
      const session = state.sessions.find((s) => s._id === sessionId)
      if (session) session.title = title
    },
  },
  actions: {
    async checkAvailability({ commit }) {
      try {
        const { enabled, catchupEnabled } = await apiGetChatStatus()
        commit("SET_ENABLED", !!enabled)
        commit("SET_CATCHUP_ENABLED", !!catchupEnabled)
      } catch (e) {
        commit("SET_ENABLED", false)
        commit("SET_CATCHUP_ENABLED", false)
      }
    },
    async loadSessions({ commit, state, dispatch }) {
      const sessions = await apiListChatSessions(state.scope)
      commit("SET_SESSIONS", sessions)
      if (!state.activeSessionId && sessions.length > 0) {
        await dispatch("loadSession", sessions[0]._id)
      }
    },
    async createSession({ commit, state, dispatch }) {
      const session = await apiCreateChatSession(state.scope)
      commit("SET_ACTIVE_SESSION", session._id)
      commit("SET_MESSAGES", [])
      // Sidebar refresh off the critical path: the first message can stream
      // without waiting for the list round trip
      dispatch("loadSessions").catch((e) =>
        console.error("Failed to load chat sessions:", e),
      )
      return session
    },
    async loadSession({ commit, state }, sessionId) {
      const session = await apiGetChatSession(state.scope, sessionId)
      commit("SET_ACTIVE_SESSION", sessionId)
      commit("SET_MESSAGES", session.messages || [])
    },
    async deleteSession({ commit, state, dispatch }, sessionId) {
      const result = await apiDeleteChatSession(state.scope, sessionId)
      if (!result) {
        console.error("Failed to delete chat session")
        return
      }
      const wasActive = state.activeSessionId === sessionId
      await dispatch("loadSessions")
      if (wasActive) {
        const firstSession = state.sessions[0]
        if (firstSession) {
          await dispatch("loadSession", firstSession._id)
        } else {
          commit("SET_ACTIVE_SESSION", null)
          commit("SET_MESSAGES", [])
        }
      }
    },
    async renameSession({ state, commit }, { sessionId, title }) {
      await apiUpdateChatSessionTitle(state.scope, sessionId, title)
      commit("UPDATE_SESSION_TITLE", { sessionId, title })
    },
    async sendMessage({ commit, state, dispatch }, { content }) {
      // Auto-name session from first user message
      const isFirstMessage = state.messages.length === 0
      const sessionId = state.activeSessionId

      // Add user message optimistically
      commit("ADD_MESSAGE", {
        role: "user",
        content,
        created_at: new Date().toISOString(),
      })
      commit("SET_STREAMING", true)
      commit("SET_STREAMING_CONTENT", "")

      // Rename session immediately if first message
      if (isFirstMessage && sessionId) {
        const title = truncateTitle(content)
        dispatch("renameSession", { sessionId, title })
      }

      await apiSendChatMessage(
        state.scope,
        state.activeSessionId,
        { content },
        {
          onToken(token) {
            commit("APPEND_STREAMING_CONTENT", token)
          },
          onDone(data) {
            commit("ADD_MESSAGE", {
              role: "assistant",
              content: state.streamingContent,
              tokenCount: data?.usage?.total_tokens,
              created_at: new Date().toISOString(),
            })
            commit("SET_STREAMING", false)
            commit("SET_STREAMING_CONTENT", "")
          },
          onError(error) {
            commit("SET_STREAMING", false)
            commit("SET_STREAMING_CONTENT", "")
            console.error("Chat error:", error)
          },
        },
      )
    },
    async openDrawer({ commit, dispatch }, scope) {
      commit("SET_SCOPE", scope)
      commit("SET_ACTIVE_SESSION", null)
      commit("SET_MESSAGES", [])
      commit("SET_DRAWER_OPEN", true)
      await dispatch("loadSessions")
    },
    newChat({ commit }) {
      commit("SET_ACTIVE_SESSION", null)
      commit("SET_MESSAGES", [])
    },
    closeDrawer({ commit }) {
      commit("SET_DRAWER_OPEN", false)
    },
  },
  getters: {
    allMessages: (state) => {
      if (state.isStreaming && state.streamingContent) {
        return [
          ...state.messages,
          {
            role: "assistant",
            content: state.streamingContent,
            _streaming: true,
          },
        ]
      }
      return state.messages
    },
  },
}

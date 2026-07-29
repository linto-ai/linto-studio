import { apiGetChatStatus } from "@/api/chat"

// Availability flags only; the chat UI lives in services/chatIntegration.
let statusPromise = null

export default {
  namespaced: true,
  state: {
    enabled: false,
    catchupEnabled: false,
  },
  mutations: {
    SET_AVAILABILITY(state, { enabled = false, catchupEnabled = false }) {
      state.enabled = !!enabled
      state.catchupEnabled = !!catchupEnabled
    },
  },
  actions: {
    // Deployment-static flags: fetched once, shared by every view.
    // A failed fetch resets the memo so the next mount retries.
    checkAvailability({ commit }) {
      if (!statusPromise) {
        statusPromise = apiGetChatStatus().then(
          (status) => commit("SET_AVAILABILITY", status || {}),
          (error) => {
            console.error("Chat status check failed:", error)
            statusPromise = null
          },
        )
      }
      return statusPromise
    },
  },
}

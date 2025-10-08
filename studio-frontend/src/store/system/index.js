import IsMobile from "../../components/atoms/IsMobile.vue"

const state = {
  /**
   * Notifications are used to display messages to the user.
   * @property {Array} notifications - A notification object
   * @property {string} message - The message to display
   * @property {string} type - The type of notification (default = "info", enum = "success", "error", "warning", "info")
   * @property {number} timeout - The timeout in milliseconds to display the notification (if 0, the notification is persistent)
   * @property {boolean} closable - Whether the notification is closable
   */
  notifications: [],

  /**
   * Whether the sidebar is open
   * @property {boolean} sidebarOpen
   * @default undefined - undefined means that the sidebar is not initialized yet (see beforeMount in v2-layout.vue)
   */
  sidebarOpen: undefined,
  isMobile: undefined,
  isLoading: false,
}

const mutations = {
  addNotification(state, notification) {
    // Add unique ID and default values
    const notificationWithDefaults = {
      id: Date.now() + Math.random(),
      type: "info",
      timeout: 5000,
      closable: true,
      ...notification,
    }
    state.notifications.push(notificationWithDefaults)
  },
  removeNotification(state, notification) {
    state.notifications = state.notifications.filter((n) => n !== notification)
  },
  removeNotificationById(state, id) {
    state.notifications = state.notifications.filter((n) => n.id !== id)
  },
  clearAllNotifications(state) {
    state.notifications = []
  },
  toggleSidebar(state) {
    state.sidebarOpen = !state.sidebarOpen
  },
  setIsMobile(state, isMobile) {
    state.isMobile = isMobile
  },
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading
  },
}

const actions = {
  addNotification({ commit }, notification) {
    commit("addNotification", notification)
  },
  removeNotification({ commit }, notification) {
    commit("removeNotification", notification)
  },
  removeNotificationById({ commit }, id) {
    commit("removeNotificationById", id)
  },
  clearAllNotifications({ commit }) {
    commit("clearAllNotifications")
  },
  // Helper actions for different notification types
  showSuccess({ commit }, message) {
    commit("addNotification", { message, type: "success" })
  },
  showError({ commit }, message) {
    commit("addNotification", {
      message,
      type: "error",
      timeout: 0,
      closable: true,
    })
  },
  showWarning({ commit }, message) {
    commit("addNotification", { message, type: "warning" })
  },
  showInfo({ commit }, message) {
    commit("addNotification", { message, type: "info" })
  },
  toggleSidebar({ commit }) {
    commit("toggleSidebar")
  },
  setIsMobile({ commit }, isMobile) {
    commit("setIsMobile", isMobile)
  },
  setIsLoading({ commit }, isLoading) {
    commit("setIsLoading", isLoading)
  },
}

const getters = {
  notifications: (state) => state.notifications,
  sidebarOpen: (state) => state.sidebarOpen,
  isMobile: (state) => state.isMobile,
  isDesktop: (state) => !state.isMobile,
  isLoading: (state) => state.isLoading,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

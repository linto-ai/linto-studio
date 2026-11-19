import IsMobile from "../../components/atoms/IsMobile.vue"
import {
  getOriginalAuth,
  saveOriginalAuth,
  clearOriginalAuth,
  isImpersonatingUser,
} from "@/tools/backoffice/userImpersonation.js"
import { clearImpersonatedOrgId } from "@/tools/backoffice/clearImpersonatedOrgId.js"
import { apiImpersonateUser, apiLogout } from "@/api/user.js"

const state = {
  // set once at bootstrap; start/stop impersonation reloads the app
  isImpersonatingUser: isImpersonatingUser(),

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
    if (isMobile) state.sidebarOpen = false
    else state.sidebarOpen = true
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
  async startUserImpersonation({ dispatch, rootGetters }, userId) {
    const res = await apiImpersonateUser(userId)
    if (res?.status !== "success" || !res.data?.auth_token) {
      throw new Error(res?.message || "Unable to impersonate user")
    }

    // org and user impersonation are mutually exclusive
    clearImpersonatedOrgId()

    saveOriginalAuth(rootGetters["auth/current"])

    // impersonation token is short lived and not refreshable
    await dispatch(
      "auth/save",
      {
        userId: res.data.user_id,
        authToken: res.data.auth_token,
        refreshToken: null,
      },
      { root: true },
    )

    // full reload re-bootstraps the app as the impersonated user
    window.location.href = "/"
  },
  async stopUserImpersonation({ dispatch }) {
    // revokes the impersonation token, still the current one here
    await apiLogout()
    const auth = getOriginalAuth()
    if (auth?.authToken) {
      dispatch("auth/save", auth, { root: true })
    }
    clearOriginalAuth()
    window.location.href = "/backoffice/users"
  },
}

const getters = {
  notifications: (state) => state.notifications,
  sidebarOpen: (state) => state.sidebarOpen,
  isMobile: (state) => state.isMobile,
  isDesktop: (state) => !state.isMobile,
  isLoading: (state) => state.isLoading,
  isImpersonatingUser: (state) => state.isImpersonatingUser,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

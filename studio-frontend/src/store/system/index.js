import IsMobile from "../../components/atoms/IsMobile.vue"
import {
  getImpersonatorSession,
  setImpersonatorSession,
  clearImpersonatorSession,
  isImpersonatingUser,
} from "@/tools/userImpersonation.js"
import { getCookie } from "@/tools/getCookie"
import { setCookie } from "@/tools/setCookie"
import { clearImpersonatedOrgId } from "@/tools/clearImpersonatedOrgId.js"
import { apiImpersonateUser } from "@/api/user.js"

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
  async startUserImpersonation(_, userId) {
    const res = await apiImpersonateUser(userId)
    if (res?.status !== "success" || !res.data?.auth_token) {
      throw new Error(res?.message || "Unable to impersonate user")
    }

    // org and user impersonation are mutually exclusive
    clearImpersonatedOrgId()

    setImpersonatorSession({
      userId: getCookie("userId"),
      authToken: getCookie("authToken"),
      refreshToken: getCookie("refreshToken"),
    })

    setCookie("userId", res.data.user_id, 7)
    setCookie("authToken", res.data.auth_token, 7)
    // impersonation token is short lived and not refreshable
    setCookie("refreshToken", null, null)
    setCookie("cm_orga_scope", null, null)

    // full reload re-bootstraps the app as the impersonated user
    window.location.href = "/"
  },
  stopUserImpersonation() {
    const session = getImpersonatorSession()
    if (session) {
      setCookie("userId", session.userId, 7)
      setCookie("authToken", session.authToken, 7)
      setCookie("refreshToken", session.refreshToken, 14)
      setCookie("cm_orga_scope", null, null)
    }
    clearImpersonatorSession()
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

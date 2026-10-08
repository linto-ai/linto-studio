import i18n from "@/i18n"

import {
  apiGetQuickSession,
  apiGetQuickSessionResult,
  apiStopBot,
  getBotForChannelId,
  apiDeleteQuickSession,
  apiPauseSession,
  apiResumeSession,
} from "@/api/session.js"
import { capitalizeFirstLetter } from "@/tools/capitalizeFirstLetter.js"
import router from "@/routers/app-router"

// The session object itself lives in the sessions store, kept up to date by
// the websocket feed: this module only knows which session is the quick one.
const state = {
  quickSessionId: null,
  loading: true,
  saving: false,
  quickSessionBot: null,
}

const getters = {
  // The quick session loaded in this tab, still there once terminated so
  // that its page can show the end.
  quickSession: (state, getters, rootState, rootGetters) => {
    if (!state.quickSessionId) return null
    return rootGetters["sessions/getSessionById"](state.quickSessionId) ?? null
  },
  // The quick session still recording: what the rest of the app reacts to
  // (banner, creation forms replaced by a placeholder).
  runningQuickSession: (state, getters) => {
    if (getters.quickSession?.status === "terminated") return null
    return getters.quickSession
  },
  loading: (state) => state.loading,
  saving: (state) => state.saving,
  quickSessionBot: (state) => state.quickSessionBot,
}

const mutations = {
  setQuickSessionId(state, value) {
    state.quickSessionId = value
  },
  clearQuickSession(state) {
    state.quickSessionId = null
    state.quickSessionBot = null
  },
  setLoading(state, value) {
    state.loading = value
  },
  setSaving(state, value) {
    state.saving = value
  },
  setQuickSessionBot(state, value) {
    state.quickSessionBot = value
  },
}

const actions = {
  async loadQuickSession({ commit, rootGetters }, notification) {
    commit("setLoading", true)
    try {
      const quickSession = await apiGetQuickSession()
      if (quickSession) {
        commit("sessions/updateOrCreateSession", quickSession, { root: true })
        commit("setQuickSessionId", quickSession.id)

        const channel = quickSession.channels[0]

        const botReq = await getBotForChannelId(
          rootGetters["organizations/getCurrentOrganizationScope"],
          channel.id,
        )

        // Always overwritten: a bot left by a previous (visio) quick session
        // would show this one as a visio.
        const sessionBot =
          botReq.status == "success" ? (botReq.data?.bots?.[0] ?? null) : null
        commit("setQuickSessionBot", sessionBot)
      } else {
        commit("clearQuickSession")
      }
    } catch (error) {
      console.error("Failed to load quick session:", error)
      commit("clearQuickSession")
    }
    commit("setLoading", false)
  },
  // The websocket only pushes changes: one missed during an outage (the
  // session ended or deleted meanwhile) is caught up here.
  async syncQuickSession({ state, commit }) {
    const quickSessionId = state.quickSessionId
    if (!quickSessionId) return
    const result = await apiGetQuickSessionResult()
    if (result.status === "error") return
    if (result.session?.id === quickSessionId) {
      commit("sessions/updateOrCreateSession", result.session, { root: true })
    } else {
      commit("sessions/markSessionTerminated", quickSessionId, { root: true })
    }
  },
  // Server-side pause: stops the live (and its credit count) whatever the
  // microphone does. Returns whether the server accepted it.
  async pauseQuickSession({ commit, getters, rootGetters }) {
    const req = await apiPauseSession(
      rootGetters["organizations/getCurrentOrganizationScope"],
      getters.quickSession.id,
    )
    if (req.status === "error") return false
    commit(
      "sessions/updateOrCreateSession",
      { id: getters.quickSession.id, status: "paused" },
      { root: true },
    )
    return true
  },
  async resumeQuickSession({ commit, getters, rootGetters }) {
    const req = await apiResumeSession(
      rootGetters["organizations/getCurrentOrganizationScope"],
      getters.quickSession.id,
    )
    if (req.status === "error") return false
    commit(
      "sessions/updateOrCreateSession",
      { id: getters.quickSession.id, status: "active" },
      { root: true },
    )
    return true
  },
  async saveQuickSession(
    { commit, getters, rootGetters, dispatch },
    conversationName,
  ) {
    commit("setSaving", true)

    // if bot stop bot
    if (getters.quickSessionBot) {
      await apiStopBot(
        rootGetters["organizations/getCurrentOrganizationScope"],
        getters.quickSessionBot.id,
      )
    }
    // then stop session
    await apiDeleteQuickSession(
      rootGetters["organizations/getCurrentOrganizationScope"],
      getters.quickSession.id,
      {
        name: conversationName,
        force: true,
      },
    )

    router.replace({
      name: "explore",
      params: {
        organizationId:
          rootGetters["organizations/getCurrentOrganizationScope"],
      },
      query: { t: Date.now(), status: "processing" },
    })
    commit("clearQuickSession")
    commit("setSaving", false)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

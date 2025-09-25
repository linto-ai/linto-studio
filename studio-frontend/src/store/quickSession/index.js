import { apiGetQuickSession } from "@/api/session.js"

const state = {
  quickSession: null,
  loading: true,
  saving: false,
  sessionBot: null,
}

const getters = {
  quickSession: (state) => state.quickSession,
  loading: (state) => state.loading,
  saving: (state) => state.saving,
  sessionBot: (state) => state.sessionBot,
}

const mutations = {
  setQuickSession(state, value) {
    state.quickSession = value
  },
  clearQuickSession(state) {
    state.quickSession = null
  },
  setLoading(state, value) {
    state.loading = value
  },
  setSaving(state, value) {
    state.saving = value
  },
  setSessionBot(state, value) {
    state.sessionBot = value
  },
}

const actions = {
  async loadQuickSession({ commit }, notification) {
    commit("setLoading", true)
    const quickSession = await apiGetQuickSession()
    if (quickSession) {
      commit("setQuickSession", quickSession)
    }
    commit("setLoading", false)
  },
  async saveQuickSession({ commit }) {
    commit("setSaving", true)
    // if bot stop bot

    // then stop session
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

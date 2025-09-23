import { apiGetQuickSession } from "@/api/session.js"

const state = {
  quickSession: null,
  loading: true,
}

const getters = {
  quickSession: (state) => state.quickSession,
  loading: (state) => state.loading,
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

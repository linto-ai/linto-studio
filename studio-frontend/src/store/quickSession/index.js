import {
  apiGetQuickSession,
  apiStopBot,
  getBotForChannelId,
} from "@/api/session.js"

const state = {
  quickSession: null,
  loading: true,
  saving: false,
  quickSessionBot: null,
}

const getters = {
  quickSession: (state) => state.quickSession,
  loading: (state) => state.loading,
  saving: (state) => state.saving,
  quickSessionBot: (state) => state.quickSessionBot,
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
  setQuickSessionBot(state, value) {
    state.quickSessionBot = value
  },
}

const actions = {
  async loadQuickSession({ commit, rootGetters }, notification) {
    commit("setLoading", true)
    const quickSession = await apiGetQuickSession()
    if (quickSession) {
      commit("setQuickSession", quickSession)

      if (this.session) {
        this.selectedChannel = this.quickSession.channels[0]

        const botReq = await getBotForChannelId(
          rootGetters["organizations/getCurrentOrganizationScope"],
          this.selectedChannel.id,
        )

        if (
          botReq.status == "success" &&
          botReq.data &&
          botReq.data?.bots?.length > 0
        ) {
          this.sessionBot = botReq.data?.bots[0]
          commit("setQuickSessionBot", sessionBot)
        }
      }
    }
    commit("setLoading", false)
  },
  async saveQuickSession({ commit, getters, rootGetters }) {
    commit("setSaving", true)
    // if bot stop bot
    if (getters.quickSessionBot) {
      await apiStopBot(
        rootGetters["organizations/getCurrentOrganizationScope"],
        getters.quickSessionBot.id,
      )
    }
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

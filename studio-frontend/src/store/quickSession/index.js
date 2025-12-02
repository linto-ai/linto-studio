import i18n from "@/i18n"

import {
  apiGetQuickSession,
  apiStopBot,
  getBotForChannelId,
  apiDeleteQuickSession,
} from "@/api/session.js"
import { capitalizeFirstLetter } from "@/tools/capitalizeFirstLetter.js"
import router from "@/routers/app-router"

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

      const channel = quickSession.channels[0]

      const botReq = await getBotForChannelId(
        rootGetters["organizations/getCurrentOrganizationScope"],
        channel.id,
      )

      if (
        botReq.status == "success" &&
        botReq.data &&
        botReq.data?.bots?.length > 0
      ) {
        const sessionBot = botReq.data?.bots[0]
        commit("setQuickSessionBot", sessionBot)
      }
    } else {
      commit("setQuickSession", null)
      commit("setQuickSessionBot", null)
    }
    commit("setLoading", false)
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
      query: { t: Date.now() },
    })
    commit("setQuickSession", null)
    commit("setQuickSessionBot", null)
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

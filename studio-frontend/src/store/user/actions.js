import { getCookie } from "@/tools/getCookie"
import { apiGetPersonalUserInfo } from "@/api/user"
import {
  apiRemoveConversationFromFavorites,
  apiAddConversationToFavorites,
} from "@/api/conversation"
import { state as defaultState } from "./state"

const actions = {
  resetState({ state }) {
    Object.assign(state, defaultState)
  },
  async fetchUser({ commit, dispatch }) {
    const token = getCookie("authToken")
    const getUserInfos = await apiGetPersonalUserInfo()

    if (getUserInfos.status === "success") {
      commit("setIsAuthenticated", true)
      commit("setUserInfos", {
        token,
        ...getUserInfos.data,
      })
      commit("setFavoritesConversationIds", getUserInfos.data.favorites ?? [])
    }

    return getUserInfos
  },
  async login({ commit }, payload) {},
  async logout({ commit }) {},
  async register({ commit }, payload) {},
  async updateUser({ commit }, payload) {},
  async toggleFavoriteConversation({ commit, getters, dispatch }, id) {
    const isFavorite = getters.isFavoriteConversation(id)
    if (isFavorite) {
      dispatch("removeFavoriteConversation", id)
    } else {
      dispatch("addFavoriteConversation", id)
    }
  },
  async addFavoriteConversation({ commit }, id) {
    const req = await apiAddConversationToFavorites(id)
    if (req.status === "success") commit("setFavoritesConversationIds", id)
  },
  async removeFavoriteConversation({ commit }, id) {
    const req = await apiRemoveConversationFromFavorites(id)
    if (req.status === "success") commit("removeFavoritesConversationId", id)
  },
}

export default actions

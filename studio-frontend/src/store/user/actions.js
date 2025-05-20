import { getCookie } from "@/tools/getCookie"
import { setCookie } from "@/tools/setCookie"
import { apiGetPersonalUserInfo } from "@/api/user"
import {
  apiRemoveConversationFromFavorites,
  apiAddConversationToFavorites,
} from "@/api/conversation"
const actions = {
  async fetchUser({ commit }) {
    const token = getCookie("authToken")
    const getUserInfos = await apiGetPersonalUserInfo()
    if (getUserInfos.status === "success") {
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

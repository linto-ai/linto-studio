import { getCookie } from "@/tools/getCookie"
import {
  apiGetPersonalUserInfo,
  apiUpdateUserInfo,
  apiUpdateUserImage,
} from "@/api/user"
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
      console.log("setuserinfo", getUserInfos.data)
      commit("setUserInfos", {
        token,
        ...getUserInfos.data,
      })
      commit("setIsAuthenticated", true)
      commit("setFavoritesConversationIds", getUserInfos.data.favorites ?? [])
    }

    return getUserInfos
  },
  async login({ commit }, payload) {},
  async logout({ commit }) {},
  async register({ commit }, payload) {},
  async updateUser({ commit }, payload) {
    const req = await apiUpdateUserInfo(payload, null)

    if (req.status === "success") {
      const newValue = {
        ...this.state.user.userInfos,
        ...payload,
      }
      commit("setUserInfos", newValue)
    }

    return req
  },
  async updateUserImage({ commit }, image) {
    const req = await apiUpdateUserImage(image, null)
    if (req.status === "success") {
      const localImageUrl = URL.createObjectURL(image)
      commit("setUserInfos", {
        ...this.state.user.userInfos,
        img: localImageUrl,
      })
    }
    return req
  },
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

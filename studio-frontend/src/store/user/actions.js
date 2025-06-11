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
      commit("system/addNotification", {
        message: "User profile updated successfully",
        type: "success",
      }, { root: true })
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
      commit("system/addNotification", {
        message: "User profile picture updated successfully",
        type: "success",
      }, { root: true })
    }
    return req
  },
  async toggleFavoriteConversation({ commit, getters, dispatch }, id) {
    const isFavorite = getters.isFavoriteConversation(id)

    try {
    if (isFavorite) {
      await dispatch("removeFavoriteConversation", id)
      commit("system/addNotification", {
        message: "Conversation removed from favorites successfully",
        type: "success",
      }, { root: true })
    } else {
      await dispatch("addFavoriteConversation", id)
      commit("system/addNotification", {
        message: "Conversation added to favorites successfully",
        type: "success",
      }, { root: true })
    }
    } catch (error) {
      console.error("Error toggling conversation favorite status", error)
      commit("system/addNotification", {
        message: "Error toggling conversation favorite status",
        type: "error",
      }, { root: true })
    }
  },
  async addFavoriteConversation({ commit }, id) {
    const req = await apiAddConversationToFavorites(id)
    if (req.status === "success") {
      commit("setFavoritesConversationIds", id)
      commit("system/addNotification", {
        message: "Conversation added to favorites successfully",
        type: "success",
      }, { root: true })
    }
  },
  async removeFavoriteConversation({ commit }, id) {
    const req = await apiRemoveConversationFromFavorites(id)
    if (req.status === "success") {
      commit("removeFavoritesConversationId", id)
      commit("system/addNotification", {
        message: "Conversation removed from favorites successfully",
        type: "success",
      }, { root: true })
    }
  },
}

export default actions

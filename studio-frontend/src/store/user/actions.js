import { getCookie } from "@/tools/getCookie"
import { logout } from "@/tools/logout"
import {
  apiGetPersonalUserInfo,
  apiUpdateUserInfo,
  apiUpdateUserImage,
  apiSetDefaultOrganization,
  apiUnsetDefaultOrganization,
} from "@/api/user"
import {
  apiRemoveConversationFromFavorites,
  apiAddConversationToFavorites,
} from "@/api/conversation"
import { state as defaultState } from "./state"
import i18n from "@/i18n"

const actions = {
  resetState({ state }) {
    Object.assign(state, defaultState)
  },
  async fetchUser({ commit, dispatch }) {
    const token = getCookie("authToken")
    const getUserInfos = await apiGetPersonalUserInfo()

    if (getUserInfos.status === "success") {
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
  async logout({ commit, dispatch }) {
    // the caller handles the reload (see AppSettingsModal)
    logout({ redirect: false })
    dispatch("resetState")
    commit(
      "system/addNotification",
      {
        message: i18n.t("user_notifications.logged_out"),
        type: "success",
      },
      { root: true },
    )
  },
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
      commit(
        "system/addNotification",
        {
          message: i18n.t("user_notifications.profile_picture_updated"),
          type: "success",
        },
        { root: true },
      )
    }
    return req
  },
  async toggleFavoriteOrganization({ commit, state }, organizationId) {
    try {
      const currentFavorite = state.userInfos?.defaultOrganization ?? null
      const isFavorite = currentFavorite === organizationId
      const req = isFavorite
        ? await apiUnsetDefaultOrganization()
        : await apiSetDefaultOrganization(organizationId)

      if (req.status === "success") {
        commit("setUserInfos", {
          ...state.userInfos,
          defaultOrganization: isFavorite ? null : organizationId,
        })
      } else {
        throw new Error()
      }
    } catch (error) {
      commit(
        "system/addNotification",
        {
          message: i18n.t("user_notifications.error_favorite_organization"),
          type: "error",
        },
        { root: true },
      )
    }
  },
  async toggleFavoriteConversation({ commit, getters, dispatch }, id) {
    const isFavorite = getters.isFavoriteConversation(id)

    try {
      if (isFavorite) {
        await dispatch("removeFavoriteConversation", id)
      } else {
        await dispatch("addFavoriteConversation", id)
      }
    } catch (error) {
      console.error("Error toggling conversation favorite status", error)
      commit(
        "system/addNotification",
        {
          message: i18n.t("user_notifications.error_favorite_conversation"),
          type: "error",
        },
        { root: true },
      )
    }
  },
  async addFavoriteConversation({ commit }, id) {
    const req = await apiAddConversationToFavorites(id)
    if (req.status === "success") {
      commit("setFavoritesConversationIds", id)
      commit(
        "system/addNotification",
        {
          message: i18n.t("user_notifications.conversation_added_to_favorites"),
          type: "success",
        },
        { root: true },
      )
    }
  },
  async removeFavoriteConversation({ commit }, id) {
    const req = await apiRemoveConversationFromFavorites(id)
    if (req.status === "success") {
      commit("removeFavoritesConversationId", id)
      commit(
        "system/addNotification",
        {
          message: i18n.t(
            "user_notifications.conversation_removed_from_favorites",
          ),
          type: "success",
        },
        { root: true },
      )
    }
  },
}

export default actions

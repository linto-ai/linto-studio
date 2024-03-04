import Vue from "vue"
import Vuex from "vuex"
import { getCookie } from "./tools/getCookie"
import { setCookie } from "./tools/setCookie"
import { apiGetPersonalUserInfo, apiGetUsersByConversationId } from "./api/user"
import {
  apiSearchConversationByText,
  apiGetFavoritesConversations,
  apiRemoveConversationFromFavorites,
  apiAddConversationToFavorites,
} from "./api/conversation"
import {
  apiGetOrganizationById,
  apiGetUserOrganizations,
} from "./api/organisation"
import { getUserRoleInOrganization } from "./tools/getUserRoleInOrganization"
import { indexOrganizationsRoles } from "./tools/indexOrganizationsRoles"

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  state: {
    userInfo: "",
    userRights: Object.freeze({
      UNDEFINED: 0,
      READ: 1,
      COMMENT: 2,
      WRITE: 4,
      DELETE: 8,
      SHARE: 16,
      hasRightAccess: (userRight, desiredRight) =>
        (userRight & desiredRight) == desiredRight,
    }),
    conversationsList: [],
    conversationsSharedWith: [],
    conversationsListLoading: false,
    conversationUsers: [],
    publicOrganizations: [],
    userOrganizations: [],
    rolesInOrganizations: {}, // {organizationId: {myrole: number, users: {userId: {role: number}}}, otherOrgaId: {...}}
    currentOrganization: {}, // current organization
    currentConversationName: null,
    favoritesConversationsId: [],
    loadingFavoriteConversations: null,
  },
  mutations: {
    SET_USER_INFOS: (state, data) => {
      state.userInfo = data
    },
    SET_CONVERSATIONS_LOADING: (state, data) => {
      state.conversationsListLoading = data
    },
    SET_CONVERSATIONS_LIST: (state, data) => {
      state.conversationsList = data
    },
    SET_CONVERSATIONS_SHARED_WITH: (state, data) => {
      state.conversationsSharedWith = data
    },
    SET_USER_ORGANIZATIONS: (state, data) => {
      state.userOrganizations = data
    },
    SET_CURRENT_ORGANIZATION: (state, data) => {
      state.currentOrganization = data
    },
    SET_CONVERSATION_USERS: (state, data) => {
      state.conversationUsers = data
    },
    SET_CURRENT_CONVERSATION_NAME: (state, data) => {
      state.currentConversationName = data
    },
    SET_FAVORITES_CONVERSATIONS: (state, data) => {
      state.favoritesConversationsId = data
    },
    SET_LOADING_FAVORITES_CONVERSATIONS: (state, data) => {
      state.loadingFavoriteConversations = data
    },
    SET_ROLES_IN_ORGANIZATIONS: (state, data) => {
      state.rolesInOrganizations = data
    },
  },
  actions: {
    getPersonalInfo: async ({ commit, state }) => {
      try {
        const token = getCookie("authToken")
        const getUserInfos = await apiGetPersonalUserInfo()
        if (getUserInfos?.error) {
          throw getUserInfos
        } else {
          commit("SET_USER_INFOS", {
            token,
            ...getUserInfos.data,
          })
          commit(
            "SET_FAVORITES_CONVERSATIONS",
            getUserInfos.data.favorites ?? []
          )
          return state.userInfo
        }
      } catch (error) {
        return false
      }
    },
    getUserOrganizations: async ({ commit, state }) => {
      try {
        let userOrganizations = await apiGetUserOrganizations()
        commit("SET_USER_ORGANIZATIONS", userOrganizations)

        let indexedOrganizations = indexOrganizationsRoles(
          userOrganizations,
          state.userInfo._id
        )
        commit("SET_ROLES_IN_ORGANIZATIONS", indexedOrganizations)
        return state.userOrganizations
      } catch (error) {
        console.error(error)
        return error.toString()
      }
    },
    getCurrentOrganizationById: async ({ commit, state }, organizationId) => {
      try {
        let organization = await apiGetOrganizationById(organizationId)
        commit("SET_CURRENT_ORGANIZATION", organization)
        return state.currentOrganization
      } catch (error) {
        console.error(error)
        return error.toString()
      }
    },
    getUsersByConversationId: async ({ commit, state }, payload) => {
      try {
        let users = await apiGetUsersByConversationId(payload?.conversationId)
        commit("SET_CONVERSATION_USERS", users)
        return state.conversationUsers
      } catch (error) {
        console.error(error)
        return false
      }
    },
    setCurrentConversationName: ({ commit }, name) => {
      commit("SET_CURRENT_CONVERSATION_NAME", name)
    },
    addFavoriteConversation: async ({ commit, state }, conversation) => {
      await apiAddConversationToFavorites(conversation._id)
      commit("SET_FAVORITES_CONVERSATIONS", [
        ...state.favoritesConversationsId,
        conversation._id,
      ])
    },
    removeFavoriteConversation: async ({ commit, state }, conversationId) => {
      await apiRemoveConversationFromFavorites(conversationId)
      commit(
        "SET_FAVORITES_CONVERSATIONS",
        state.favoritesConversationsId.filter((id) => id !== conversationId)
      )
    },
  },
  getters: {
    getOrganizationById: (state) => (id) => {
      return state.userOrganizations.find((orga) => orga._id === id)
    },
    getCurrentOrganizationScope: (state) => () => {
      let orgaCookie = getCookie("cm_orga_scope")
      if (
        orgaCookie !== null &&
        orgaCookie !== "" &&
        orgaCookie !== "undefined" &&
        state.userOrganizations.findIndex((org) => org._id === orgaCookie) >= 0
      ) {
        return orgaCookie
      } else if (state.userOrganizations.length > 0) {
        let target = state.userOrganizations[0]
        setCookie("cm_orga_scope", target._id, 7)
        return target._id
      } else {
        throw "No organization found"
      }
    },
    getUserRoleInOrganization: (state) => () => {
      let organization = state.currentOrganization
      const userId = getCookie("userId")
      return getUserRoleInOrganization(organization, userId)
    },
    getUserRightTxt: (state) => (right) => {
      if (state.userRights.hasRightAccess(right, state.userRights.DELETE))
        return "Full rights"
      else if (state.userRights.hasRightAccess(right, state.userRights.SHARE))
        return "Can share"
      else if (state.userRights.hasRightAccess(right, state.userRights.WRITE))
        return "Can write"
      else if (state.userRights.hasRightAccess(right, state.userRights.COMMENT))
        return "Can comment"
      else if (state.userRights.hasRightAccess(right, state.userRights.READ))
        return "Can read"
      else return "No access"
    },
    searchConversationByText: () => async (data, signal) => {
      try {
        const text = data.text
        const organizationId = data.organizationId
        const convByText = await apiSearchConversationByText({
          text,
          organizationId,
          searchType: ["title", "description", "text"],
        })
        return { conversations: convByText.conversations }
      } catch (error) {
        console.error(error)
      }
    },
    getUserInConvById: (state) => (id) => {
      return state.conversationUsers.find((usr) => usr._id === id)
    },
    isFavoriteConversation: (state) => (conversationId) => {
      return (
        state.favoritesConversationsId.findIndex(
          (id) => id == conversationId
        ) >= 0
      )
    },
  },
})

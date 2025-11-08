// store/modules/mediaModuleFactory.js

import {
  apiGetGenericConversationsList,
  apiGetGenericConversationsCount,
  apiDeleteMultipleConversation,
} from "@/api/conversation"
import i18n from "@/i18n"
import { bus } from "@/main.js"

export default function createMediaModule(scope, status = "done") {
  return {
    namespaced: true,

    state: () => ({
      medias: [],
      selectedMedias: [],
      autoselectMedias: false,
      searchQuery: "",
      selectedTagIds: [],
      pagination: { page: 0, hasMore: true },
      count: 0,
      countDone: 0,
      countProcessing: 0,
      countError: 0,
      filterStatus: status, // done, processing, error
    }),

    getters: {
      all: (s) => s.medias,
      selected: (s) => s.selectedMedias,
      autoselectMedias: (s) => s.autoselectMedias,
      search: (s) => s.searchQuery,
      hasMore: (s) => s.pagination.hasMore,
      selectedTagIds: (s) => s.selectedTagIds,
      count: (s) => s.count,
      countDone: (s) => s.countDone,
      countProcessing: (s) => s.countProcessing,
      countError: (s) => s.countError,
      getMediaById: (s) => (mediaId) => {
        return s.medias.find((m) => m._id === mediaId)
      },
      getSelfMediaRight(state, getters, rootState, rootGetters) {
        return (id) => {
          const conv = getters.getMediaById(id)
          if (!conv) {
            return 0
          }

          const owner = conv.owner
          const selfId = rootGetters["user/getUserId"]

          if (!selfId) {
            console.warn("GetMediaRight, userId is undefined")
            return 0
          }

          if (owner == selfId) {
            return 31
          }

          const customRights = conv?.organization?.customRights
          if (customRights) {
            const selfCustomRights = customRights.find(
              (r) => r.userId === selfId,
            )
            if (selfCustomRights) {
              return selfCustomRights.right
            }
          }

          const orgaRole =
            rootGetters["organizations/getUserRoleInOrganization"]
          if (orgaRole >= 4) {
            return 31
          }

          return conv?.organization?.membersRight || 0
        }
      },
      getFilterStatus: (s) => s.filterStatus,
    },

    mutations: {
      setAutoselectMedias(state, autoselectMedias) {
        state.autoselectMedias = autoselectMedias
      },
      setMedias(state, medias) {
        state.medias = medias
      },
      appendMedias(state, medias) {
        state.medias = [...state.medias, ...medias]
      },
      prependMedias(state, medias) {
        state.medias = [...medias, ...state.medias]
      },
      setSearchQuery(state, query) {
        state.searchQuery = query
      },
      setSelectedMedias(state, medias) {
        state.selectedMedias = medias
      },
      toggleSelectedMedia(state, media) {
        if (state.selectedMedias.find((m) => m._id === media._id)) {
          state.selectedMedias = state.selectedMedias.filter(
            (m) => m._id !== media._id,
          )
        } else {
          state.selectedMedias.push(media)
        }
      },
      removeSelectedMedia(state, media) {
        state.selectedMedias = state.selectedMedias.filter(
          (m) => m._id !== media._id,
        )
      },
      clearSelectedMedias(state) {
        state.selectedMedias = []
        state.autoselectMedias = false
      },
      setPagination(state, { page, hasMore }) {
        state.pagination = { page, hasMore }
      },
      updateMedia(state, { mediaId, media, patch = false }) {
        const idx = state.medias.findIndex((m) => m._id === mediaId)
        const newValue = patch ? { ...state.medias[idx], ...media } : media

        if (idx !== -1) {
          // Use Vue.set to ensure reactivity
          state.medias[idx] = newValue
        }

        const selectedIdx = state.selectedMedias.findIndex(
          (m) => m._id === mediaId,
        )
        if (selectedIdx !== -1) {
          state.selectedMedias[selectedIdx] = newValue
        }
      },
      deleteMedias(state, mediaIds) {
        state.medias = state.medias.filter((m) => !mediaIds.includes(m._id))
        bus.emit("medias/delete", mediaIds)
      },
      setSelectedTagIds(state, ids) {
        state.selectedTagIds = ids
      },
      toggleSelectedTagId(state, id) {
        if (state.selectedTagIds.includes(id)) {
          state.selectedTagIds = state.selectedTagIds.filter((t) => t !== id)
        } else {
          state.selectedTagIds.push(id)
        }
      },
      clearSelectedTagIds(state) {
        state.selectedTagIds = []
      },
      setCount(state, count) {
        state.count = count
      },
      setCountDone(state, count) {
        state.countDone = count
      },
      setCountProcessing(state, count) {
        state.countProcessing = count
      },
      setCountError(state, count) {
        state.countError = count
      },
      setFilterStatus(state, value) {
        console.warn("filterStatus is readOnly")
      },
    },

    actions: {
      async load(
        { commit, dispatch, getters },
        { page = 0, append = false } = {},
      ) {
        try {
          const data = await apiGetGenericConversationsList(scope, {
            page,
            text: getters.search,
            title: getters.search,
            tags: getters.selectedTagIds,
            status: getters.getFilterStatus,
          })

          if (append) commit("appendMedias", data.list)
          else {
            commit("clearSelectedMedias")
            commit("setMedias", data.list)
          }

          commit("setCount", data.count)

          commit("setPagination", { page, hasMore: data.hasMore })

          if (getters["autoselectMedias"]) {
            commit("setSelectedMedias", getters["all"])
          }
        } catch (error) {
          console.error(error)
          dispatch(
            "system/addNotification",
            {
              type: "error",
              message: "Error fetching medias",
            },
            { root: true },
          )
        }
      },
      async loadStatusCount({ commit, getters }) {
        const count = await apiGetGenericConversationsCount(scope, {
          text: getters.search,
          title: getters.search,
          tags: getters.selectedTagIds,
          status: getters.getFilterStatus,
        })

        commit("setCount", count)
      },
      increaseCount({ commit, getters }) {
        commit("setCount", getters.count + 1)
      },
      setCount({ commit, getters }, count) {
        commit("setCount", count)
      },
      decreaseCount({ commit, getters }) {
        commit("setCount", getters.count - 1)
      },
      async loadNextPage({ state, dispatch }) {
        const nextPage = state.pagination.page + 1
        await dispatch("load", { page: nextPage, append: true })
      },
      setSearchQuery({ commit }, query) {
        commit("setSearchQuery", query)
      },
      toggleMediaSelection({ commit }, media) {
        commit("toggleSelectedMedia", media)
      },
      updateMedia({ commit }, { mediaId, media, patch = false }) {
        commit("updateMedia", { mediaId, media, patch })
      },
      async deleteMedias(
        { commit, rootGetters, dispatch },
        { ids, callApi = true } = {},
      ) {
        // todo api
        let res
        if (callApi) {
          res = await apiDeleteMultipleConversation(
            rootGetters["organizations/getCurrentOrganizationScope"],
            ids,
          )
        }
        if (!callApi || (res && res.status === "success")) {
          commit("deleteMedias", ids)
          commit("clearSelectedMedias")
        } else {
          dispatch(
            "system/addNotification",
            {
              type: "error",
              message: "Error deleting medias",
            },
            { root: true },
          )
        }
      },
      async deleteSelected({ state, dispatch }) {
        const ids = state.selectedMedias.map((m) => m._id)
        if (ids.length) {
          await dispatch("deleteMedia", ids)
        }
      },
      setSelectedTagIds({ commit }, ids) {
        commit("setSelectedTagIds", ids)
      },
      toggleSelectedTagId({ commit }, id) {
        commit("toggleSelectedTagId", id)
      },
      clearSelectedTagIds({ commit }) {
        commit("clearSelectedTagIds")
      },
      clearSelectedMedias({ commit }) {
        commit("clearSelectedMedias")
      },
      selectAll({ commit, getters }) {
        commit("setAutoselectMedias", true)
        commit("setSelectedMedias", getters["all"])
      },
      setFilterStatus({ commit }, status) {
        commit("setFilterStatus", status)
      },
      prependMedias({ commit }, medias) {
        commit("prependMedias", medias)
      },
    },
  }
}

// store/modules/mediaModuleFactory.js

import { apiGetGenericConversationsList } from "../../api/conversation"
import i18n from "@/i18n"

export default function createMediaModule(scope) {
  return {
    namespaced: true,

    state: () => ({
      medias: [],
      selectedMedias: [],
      searchQuery: "",
      selectedTagIds: [],
      pagination: { page: 1, hasMore: true },
      count: 0,
    }),

    getters: {
      all: (s) => s.medias,
      selected: (s) => s.selectedMedias,
      search: (s) => s.searchQuery,
      hasMore: (s) => s.pagination.hasMore,
      selectedTagIds: (s) => s.selectedTagIds,
      count: (s) => s.count,
    },

    mutations: {
      SET_MEDIAS(state, medias) {
        state.medias = medias
      },
      APPEND_MEDIAS(state, medias) {
        state.medias = [...state.medias, ...medias]
      },
      SET_SEARCH_QUERY(state, query) {
        state.searchQuery = query
      },
      SET_SELECTED_MEDIAS(state, medias) {
        state.selectedMedias = medias
      },
      TOGGLE_SELECTED_MEDIA(state, media) {
        if (state.selectedMedias.find((m) => m.id === media.id)) {
          state.selectedMedias = state.selectedMedias.filter(
            (m) => m.id !== media.id,
          )
        } else {
          state.selectedMedias.push(media)
        }
      },
      SET_PAGINATION(state, { page, hasMore }) {
        state.pagination = { page, hasMore }
      },
      UPDATE_MEDIA(state, mediaPatch) {
        const id = mediaPatch.id
        state.medias = state.medias.map((m) =>
          m.id === id ? { ...m, ...mediaPatch } : m,
        )
        state.selectedMedias = state.selectedMedias.map((m) =>
          m.id === id ? { ...m, ...mediaPatch } : m,
        )
      },
      DELETE_MEDIA(state, ids) {
        const idSet = new Set(Array.isArray(ids) ? ids : [ids])
        const filter = (arr) => arr.filter((m) => !idSet.has(m.id))
        state.medias = filter(state.medias)
        state.selectedMedias = filter(state.selectedMedias)
      },
      SET_SELECTED_TAG_IDS(state, ids) {
        state.selectedTagIds = ids
      },
      TOGGLE_SELECTED_TAG_ID(state, id) {
        if (state.selectedTagIds.includes(id)) {
          state.selectedTagIds = state.selectedTagIds.filter((t) => t !== id)
        } else {
          state.selectedTagIds.push(id)
        }
      },
      CLEAR_SELECTED_TAG_IDS(state) {
        state.selectedTagIds = []
      },
      SET_COUNT(state, count) {
        state.count = count
      },
    },

    actions: {
      async load({ commit }, { page = 1, append = false, query = null } = {}) {
        try {
          const data = await apiGetGenericConversationsList(scope, {
            page,
          })

          if (append) commit("APPEND_MEDIAS", data.list)
          else commit("SET_MEDIAS", data.list)

          commit("SET_COUNT", data.count)

          commit("SET_PAGINATION", { page, hasMore: data.hasMore })
        } catch (error) {
          commit("system/addNotification", {
            type: "error",
            message: "Error fetching conversations",
          })
        }
      },
      setSearchQuery({ commit }, query) {
        commit("SET_SEARCH_QUERY", query)
      },
      toggleMediaSelection({ commit }, media) {
        commit("TOGGLE_SELECTED_MEDIA", media)
      },
      async updateMedia({ commit }, mediaPatch) {
        // todo api
        commit("UPDATE_MEDIA", updated)
        return updated
      },
      async deleteMedia({ commit }, ids) {
        // todo api
        commit("DELETE_MEDIA", ids)
      },
      async deleteSelected({ state, dispatch }) {
        const ids = state.selectedMedias.map((m) => m.id)
        if (ids.length) {
          await dispatch("deleteMedia", ids)
        }
      },
      setSelectedTagIds({ commit }, ids) {
        commit("SET_SELECTED_TAG_IDS", ids)
      },
      toggleSelectedTagId({ commit }, id) {
        commit("TOGGLE_SELECTED_TAG_ID", id)
      },
      clearSelectedTagIds({ commit }) {
        commit("CLEAR_SELECTED_TAG_IDS")
      },
    },
  }
}

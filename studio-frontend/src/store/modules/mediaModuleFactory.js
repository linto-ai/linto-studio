// store/modules/mediaModuleFactory.js

import { apiGetGenericConversationsList } from "../../api/conversation"
import i18n from "@/i18n"
import Vue from "vue"
import { bus } from "@/main.js"

export default function createMediaModule(scope) {
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
    }),

    getters: {
      all: (s) => s.medias,
      selected: (s) => s.selectedMedias,
      search: (s) => s.searchQuery,
      hasMore: (s) => s.pagination.hasMore,
      selectedTagIds: (s) => s.selectedTagIds,
      count: (s) => s.count,
      getMediaById: (s) => (mediaId) => {
        return s.medias.find((m) => m._id === mediaId)
      },
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
      updateMedia(state, { mediaId, media }) {
        const idx = state.medias.findIndex((m) => m._id === mediaId)
        if (idx !== -1) {
          // Use Vue.set to ensure reactivity
          Vue.set(state.medias, idx, media)
        }

        const selectedIdx = state.selectedMedias.findIndex(
          (m) => m._id === mediaId,
        )
        if (selectedIdx !== -1) {
          Vue.set(state.selectedMedias, selectedIdx, media)
        }
      },
      deleteMedias(state, mediaIds) {
        state.medias = state.medias.filter((m) => !mediaIds.includes(m._id))
        bus.$emit("medias/delete", mediaIds)
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
          })

          if (append) commit("appendMedias", data.list)
          else commit("setMedias", data.list)

          commit("setCount", data.count)

          commit("setPagination", { page, hasMore: data.hasMore })
        } catch (error) {
          console.error(error)
          dispatch(
            "system/addNotification",
            {
              type: "error",
              message: "Error fetching conversations",
            },
            { root: true },
          )
        }
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
      updateMedia({ commit }, { mediaId, media }) {
        commit("updateMedia", { mediaId, media })
      },
      async deleteMedias({ commit }, ids) {
        // todo api
        commit("deleteMedias", ids)
        commit("clearSelectedMedias")
      },
      async deleteSelected({ state, dispatch }) {
        const ids = state.selectedMedias.map((m) => m._id)
        if (ids.length) {
          await dispatch("deleteMedia", ids)
        }
      },
      addSelectedMedia({ commit, state }, media) {},

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
    },
  }
}

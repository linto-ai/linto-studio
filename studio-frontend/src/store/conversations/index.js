import Vue from "vue"
import {
  apiGetFavoritesConversations,
  apiGetConversationsByTags,
  apiGetConversationsByOrganization,
  apiGetConversationsSharedWith,
} from "@/api/conversation.js"

export default {
  namespaced: true,
  state: {
    conversations: [],
    loading: false,
    error: null,
    totalCount: 0,
    page: 0,
    pageSize: 12,
    hasMoreItems: true,
    search: "",
    filters: [],
    mode: "default",
    selectedTagIds: [],
    sortField: "last_update",
    context: {
      type: "organization",
      organizationScope: null,
      favorites: false,
      shared: false,
    }
  },
  mutations: {
    setConversations(state, conversations) {
      state.conversations = conversations
    },
    appendConversations(state, conversations) {
      const merged = [...state.conversations, ...conversations]
      const unique = []
      const seen = new Set()

      for (const conversation of merged) {
        if (!seen.has(conversation._id)) {
          seen.add(conversation._id)
          unique.push(conversation)
        }
      }

      state.conversations = unique
    },
    clearConversations(state) {
      state.conversations = []
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    },
    setTotalCount(state, count) {
      state.totalCount = count
    },
    setPage(state, page) {
      state.page = page
    },
    setPageSize(state, pageSize) {
      state.pageSize = pageSize
    },
    setHasMoreItems(state, hasMore) {
      state.hasMoreItems = hasMore
    },
    setSearch(state, search) {
      state.search = search
    },
    setFilters(state, filters) {
      state.filters = filters
    },
    setMode(state, mode) {
      state.mode = mode
    },
    setSelectedTagIds(state, tagIds) {
      state.selectedTagIds = tagIds
    },
    setSortField(state, sortField) {
      state.sortField = sortField
    },
    setContext(state, context) {
      state.context = { ...state.context, ...context }
    },
    resetPagination(state) {
      state.page = 0
      state.hasMoreItems = true
    },
    deleteConversations(state, conversationIds) {
      state.conversations = state.conversations.filter(
        (c) => !conversationIds.includes(c._id)
      )
      state.totalCount = Math.max(0, state.totalCount - conversationIds.length)
    },
    updateConversation(state, { conversationId, conversation, updates }) {
      const index = state.conversations.findIndex(c => c._id === conversationId)
      if (index !== -1) {
        if (conversation) {
          // Complete replacement
          Vue.set(state.conversations, index, conversation)
        } else if (updates) {
          // Partial update
          const updatedConversation = { ...state.conversations[index], ...updates }
          Vue.set(state.conversations, index, updatedConversation)
        }
      }
    }
  },
  actions: {
    async fetchConversations({ commit, state }, { page = 0, append = false } = {}) {
      commit("setLoading", true)
      commit("setError", null)

      try {
        const { context, selectedTagIds, filters, pageSize, sortField } = state
        
        const textFilter = filters.find(f => f.key === "textConversation")?.value
        const titleFilter = filters.find(f => f.key === "titleConversation")?.value

        let response

        if (context.favorites) {
          response = await apiGetFavoritesConversations(
            selectedTagIds,
            textFilter,
            titleFilter,
            page,
            { pageSize, sortField }
          )
        } else if (context.shared) {
          response = await apiGetConversationsSharedWith(
            selectedTagIds,
            textFilter,
            titleFilter,
            page,
            { pageSize, sortField }
          )
        } else {
          if (selectedTagIds.length === 0 && filters.length === 0) {
            response = await apiGetConversationsByOrganization(
              context.organizationScope,
              page,
              { pageSize, sortField }
            )
          } else {
            response = await apiGetConversationsByTags(
              context.organizationScope,
              selectedTagIds,
              textFilter,
              titleFilter,
              page,
              { pageSize, sortField }
            )
          }
        }

        const conversations = response?.list || []
        const totalCount = response?.count || 0

        if (append) {
          commit("appendConversations", conversations)
        } else {
          commit("setConversations", conversations)
        }

        commit("setTotalCount", totalCount)
        commit("setPage", page)
        commit("setHasMoreItems", totalCount - pageSize * (page + 1) > 0)
        
        return conversations
      } catch (error) {
        commit("setError", error)
        console.error("Error fetching conversations:", error)
        return []
      } finally {
        commit("setLoading", false)
      }
    },

    async loadMore({ dispatch, state }) {
      if (state.loading || !state.hasMoreItems) return
      
      const nextPage = state.page + 1
      return dispatch("fetchConversations", { page: nextPage, append: true })
    },

    async search({ commit, dispatch }, { search, filters = [] }) {
      commit("setSearch", search)
      commit("setFilters", filters)
      commit("setMode", search.length > 0 ? "search" : "default")
      commit("resetPagination")
      
      return dispatch("fetchConversations")
    },

    async applyFilters({ commit, dispatch }, { tagIds = [], sortField }) {
      commit("setSelectedTagIds", tagIds)
      if (sortField) {
        commit("setSortField", sortField)
      }
      commit("resetPagination")
      
      return dispatch("fetchConversations")
    },

    async setContext({ commit, dispatch }, context) {
      commit("setContext", context)
      commit("resetPagination")
      commit("clearConversations")
      
      return dispatch("fetchConversations")
    },

    async reset({ commit, dispatch }) {
      commit("clearConversations")
      commit("setSearch", "")
      commit("setFilters", [])
      commit("setMode", "default")
      commit("resetPagination")
      commit("setError", null)
      
      return dispatch("fetchConversations")
    },

    deleteConversations({ commit }, conversationIds) {
      commit("deleteConversations", conversationIds)
    },

    updateConversation({ commit }, payload) {
      commit("updateConversation", payload)
    }
  },
  getters: {
    getConversations: (state) => state.conversations,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalCount: (state) => state.totalCount,
    getPage: (state) => state.page,
    getPageSize: (state) => state.pageSize,
    getHasMoreItems: (state) => state.hasMoreItems,
    getSearch: (state) => state.search,
    getFilters: (state) => state.filters,
    getMode: (state) => state.mode,
    getSelectedTagIds: (state) => state.selectedTagIds,
    getSortField: (state) => state.sortField,
    getContext: (state) => state.context,
    getConversationById: (state) => (id) => {
      return state.conversations.find(c => c._id === id)
    },
    getFilteredConversations: (state) => (tagIds = []) => {
      if (tagIds.length === 0) return state.conversations
      
      return state.conversations.filter(conversation => {
        if (!conversation.tags || !Array.isArray(conversation.tags)) {
          return false
        }
        return tagIds.every(tagId => conversation.tags.includes(tagId))
      })
    }
  }
}

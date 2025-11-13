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
    pageSize: 12,
    hasMoreItems: true,
    
    // Centralized parameters state
    params: {
      search: "",
      selectedTagIds: [],
      page: 0,
      sortField: "last_update",
      filters: [],
      context: {
        type: "organization",
        organizationScope: null,
        favorites: false,
        shared: false,
      }
    }
  },
  mutations: {
    setConversations(state, conversations) {
      state.conversations = conversations;
    },
    appendConversations(state, conversations) {
      const existingIds = new Set(state.conversations.map(c => c._id));
      const newConversations = conversations.filter(c => !existingIds.has(c._id));
      state.conversations = [...state.conversations, ...newConversations];
    },
    clearConversations(state) {
      state.conversations = [];
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    setTotalCount(state, count) {
      state.totalCount = count;
    },
    setPage(state, page) {
      state.params.page = page;
    },
    setPageSize(state, pageSize) {
      state.pageSize = pageSize;
    },
    setHasMoreItems(state, hasMore) {
      state.hasMoreItems = hasMore;
    },
    
    // Centralized params mutations
    setParams(state, params) {
      state.params = { ...state.params, ...params };
    },
    
    setParamsFromUrl(state, urlParams) {
      const newParams = {};
      
      if (urlParams.search !== undefined) {
        newParams.search = urlParams.search || "";
        
        // Automatically create filters for search, just like MediaExplorerHeader does
        if (newParams.search && newParams.search.trim().length > 0) {
          newParams.filters = [
            {
              title: "Title filter",
              value: newParams.search.trim(),
              key: "titleConversation",
            },
            {
              title: "Text filter", 
              value: newParams.search.trim(),
              key: "textConversation",
            }
          ];
        } else {
          newParams.filters = [];
        }
      }
      
      if (urlParams.tags !== undefined) {
        newParams.selectedTagIds = urlParams.tags ? urlParams.tags.split(',').filter(id => id.trim()) : [];
      }
      
      if (urlParams.page !== undefined) {
        newParams.page = urlParams.page ? parseInt(urlParams.page) : 0;
      }
      
      state.params = { ...state.params, ...newParams };
    },
    
    resetPagination(state) {
      state.params.page = 0;
      state.hasMoreItems = true;
    },
    
    updateConversation(state, { conversationId, conversation, updates }) {
      const index = state.conversations.findIndex(c => c._id === conversationId);
      if (index !== -1) {
        if (conversation) {
          Vue.set(state.conversations, index, conversation);
        } else if (updates) {
          const existing = state.conversations[index];
          Vue.set(state.conversations, index, { ...existing, ...updates });
        }
      }
    }
  },
  actions: {
    async loadFromUrl({ commit, dispatch }, url) {
      const urlParams = new URLSearchParams(url.search);
      
      commit('setParamsFromUrl', {
        search: urlParams.get('search'),
        tags: urlParams.get('tags'),
        page: urlParams.get('page')
      });
      
      return dispatch('fetchWithCurrentParams');
    },
    
    async fetchWithCurrentParams({ commit, state }) {
      const { context, selectedTagIds, search, page, sortField, filters } = state.params;
      const textFilter = filters.find(f => f.key === "textConversation")?.value || null;
      const titleFilter = filters.find(f => f.key === "titleConversation")?.value || null;
      
      // Prevent concurrent fetches
      if (state.loading) return;
      
      commit("setLoading", true);
      commit("setError", null);
      
      try {
        let response;
        
        if (context.favorites) {
          response = await apiGetFavoritesConversations(
            selectedTagIds,
            textFilter,
            titleFilter,
            page,
            { pageSize: state.pageSize, sortField }
          );
        } else if (context.shared) {
          response = await apiGetConversationsSharedWith(
            selectedTagIds,
            textFilter,
            titleFilter,
            page,
            { pageSize: state.pageSize, sortField }
          );
        } else {
          if (selectedTagIds.length === 0 && filters.length === 0) {
            response = await apiGetConversationsByOrganization(
              context.organizationScope,
              page,
              { pageSize: state.pageSize, sortField }
            );
          } else {
            response = await apiGetConversationsByTags(
              context.organizationScope,
              selectedTagIds,
              textFilter,
              titleFilter,
              page,
              { pageSize: state.pageSize, sortField }
            );
          }
        }
        
        const conversations = response?.list || [];
        const totalCount = response?.count || 0;
        
        if (page > 0) {
          commit("appendConversations", conversations);
        } else {
          commit("setConversations", conversations);
        }
        
        commit("setTotalCount", totalCount);
        commit("setPage", page);
        commit("setHasMoreItems", totalCount - state.pageSize * (page + 1) > 0);
      } catch (error) {
        commit("setError", error.message || "Error fetching conversations");
      } finally {
        commit("setLoading", false);
      }
    },

    async loadMore({ dispatch, state }) {
      // Prevent multiple simultaneous loadMore calls
      if (state.loading) return;
      
      const nextPage = state.params.page + 1;
      await dispatch('setParams', { page: nextPage });
      return dispatch("fetchWithCurrentParams");
    },

    async search({ commit, dispatch }, { search, filters = [] }) {
      await dispatch('setParams', { search: search || "", filters: filters, page: 0 });
      return dispatch("fetchWithCurrentParams");
    },

    async applyFilters({ commit, dispatch }, { tagIds = [], sortField }) {
      const params = { selectedTagIds: tagIds, page: 0 };
      if (sortField) params.sortField = sortField;
      
      await dispatch('setParams', params);
      return dispatch("fetchWithCurrentParams");
    },

    async setContext({ commit, dispatch, state }, context) {
      const contextChanged = JSON.stringify(state.params.context) !== JSON.stringify(context);
      
      await dispatch('setParams', { 
        context: { ...state.params.context, ...context },
        page: 0 
      });
      
      if (contextChanged) {
        commit("clearConversations");
      }
    },

    async setParams({ commit }, params) {
      commit('setParams', params);
    },

    async reset({ commit, dispatch }) {
      commit("clearConversations");
      await dispatch('setParams', {
        search: "",
        selectedTagIds: [],
        filters: [],
        page: 0
      });
    },

    async loadPreviousPages({ commit, dispatch, state }, targetPage) {
      // Prevent concurrent fetches
      if (state.loading) return;
      
      commit("setLoading", true);
      commit("setError", null);
      
      try {
        const { context, selectedTagIds, search, sortField, filters } = state.params;
        const textFilter = filters.find(f => f.key === "textConversation")?.value || null;
        const titleFilter = filters.find(f => f.key === "titleConversation")?.value || null;
        
        // Calculate how many items we need to load (all pages from 0 to targetPage-1)
        const itemsToLoad = targetPage * state.pageSize;
        
        let response;
        
        if (context.favorites) {
          response = await apiGetFavoritesConversations(
            selectedTagIds,
            textFilter,
            titleFilter,
            0, // Start from page 0
            { pageSize: itemsToLoad, sortField } // Load all items at once
          );
        } else if (context.shared) {
          response = await apiGetConversationsSharedWith(
            selectedTagIds,
            textFilter,
            titleFilter,
            0,
            { pageSize: itemsToLoad, sortField }
          );
        } else {
          if (selectedTagIds.length === 0 && filters.length === 0) {
            response = await apiGetConversationsByOrganization(
              context.organizationScope,
              0,
              { pageSize: itemsToLoad, sortField }
            );
          } else {
            response = await apiGetConversationsByTags(
              context.organizationScope,
              selectedTagIds,
              textFilter,
              titleFilter,
              0,
              { pageSize: itemsToLoad, sortField }
            );
          }
        }
        
        const conversations = response?.list || [];
        const totalCount = response?.count || 0;
        
        commit("setConversations", conversations);
        commit("setTotalCount", totalCount);
        commit("setPage", 0); // Reset to page 0
        commit("setHasMoreItems", totalCount > itemsToLoad);
        
      } catch (error) {
        commit("setError", error.message || "Error loading previous pages");
        throw error;
      } finally {
        commit("setLoading", false);
      }
    },

    deleteConversations({ commit, state }, conversationIds) {
      const filtered = state.conversations.filter(c => !conversationIds.includes(c._id));
      commit('setConversations', filtered);
      commit('setTotalCount', filtered.length);
    },

    updateConversation({ commit }, payload) {
      commit('updateConversation', payload);
    }
  },
  getters: {
    getConversations: (state) => state.conversations,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getTotalCount: (state) => state.totalCount,
    getPage: (state) => state.params.page,
    getPageSize: (state) => state.pageSize,
    getHasMoreItems: (state) => state.hasMoreItems,
    getSearch: (state) => state.params.search,
    getFilters: (state) => {
      return state.params.filters || [];
    },
    getMode: (state) => state.params.search ? "search" : "default",
    getSelectedTagIds: (state) => state.params.selectedTagIds,
    getSortField: (state) => state.params.sortField,
    getContext: (state) => state.params.context,
    getParams: (state) => state.params,
    getConversationById: (state) => (id) => {
      return state.conversations.find(c => c._id === id);
    },
    getFilteredConversations: (state) => (tagIds = []) => {
      if (tagIds.length === 0) return state.conversations;
      
      return state.conversations.filter(conversation => {
        if (!conversation.tags || !Array.isArray(conversation.tags)) {
          return false;
        }
        return tagIds.every(tagId => conversation.tags.includes(tagId));
      });
    }
  }
}

import {
  apiGetTagsByCategory,
  apiGetSystemCategories,
  apiCreateOrganizationTag,
  apiDeleteTag,
  apiUpdateTag,
} from "@/api/tag"
import {
  apiAddTagToConversation,
  apiDeleteTagFromConversation,
} from "@/api/conversation"

export default {
  namespaced: true,
  state: {
    categories: [],
    exploreSelectedTags: [],
    tags: [],
    loading: false,
    error: null,
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories
    },
    setExploreSelectedTags(state, tags) {
      state.exploreSelectedTags = tags
    },
    clearTags(state) {
      state.tags = []
    },
    setTags(state, tags) {
      state.tags = tags
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    },
  },
  getters: {
    getTags: (state) => state.tags,
    getCategoryById: (state) => (id) => {
      return state.categories.find((category) => category._id === id)
    },
    getCategoryByName: (state) => (name) => {
      return state.categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      )
    },
    getTagById: (state) => (id) => {
      return state.tags.find((tag) => tag._id === id)
    },
    getExploreSelectedTags: (state) => state.exploreSelectedTags,
    isExploreSelectedTag: (state) => (tagId) => {
      return state.exploreSelectedTags.some((tag) => tag._id === tagId)
    },
  },
  actions: {
    async fetchTags({ commit, getters, state, rootGetters }) {
      commit("setLoading", true)
      try {
        const data = await apiGetSystemCategories(
          rootGetters["organizations/getCurrentOrganizationScope"],
        )

        commit("setCategories", data)

        const tagsCategory = data.find(
          (category) => category.name.toLowerCase() === "tags",
        )

        if (tagsCategory) {
          const tags = await apiGetTagsByCategory(
            rootGetters["organizations/getCurrentOrganizationScope"],
            tagsCategory._id,
          )
          commit("setTags", tags)
        }

        return { categories: data, tags: state.tags }
      } catch (error) {
        console.error("Error fetching tags:", error)
        commit("setError", error)
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    async createTag({ commit, getters, rootGetters, state }, tag) {
      commit("setLoading", true)
      try {
        const data = await apiCreateOrganizationTag(
          rootGetters["organizations/getCurrentOrganizationScope"],
          getters.getCategoryByName("tags")._id,
          tag.name,
          tag.description,
          tag.color,
          tag.emoji,
        )

        commit(
          "system/addNotification",
          {
            message: "Tag created successfully",
            type: "success",
          },
          { root: true },
        )

        commit("setTags", [...state.tags, data])
        return data
      } catch (error) {
        console.error("Error creating tag in store:", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: "Error creating tag",
            type: "error",
          },
          { root: true },
        )
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    async updateTag({ commit, getters, rootGetters, state }, tag) {
      commit("setLoading", true)
      try {
        await apiUpdateTag(
          rootGetters["organizations/getCurrentOrganizationScope"],
          tag._id,
          {
            name: tag.name,
            description: tag.description,
            color: tag.color,
            emoji: tag.emoji,
          },
        )
        commit("setTags", state.tags.map((t) => (t._id === tag._id ? tag : t)))
      } catch (error) {
        console.error("Error updating tag in store:", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: "Error updating tag",
            type: "error",
          },
          { root: true },
        )
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    async deleteTag({ commit, getters, rootGetters, state }, tag) {
      commit("setLoading", true)
      try {
        const data = await apiDeleteTag(
          rootGetters["organizations/getCurrentOrganizationScope"],
          tag._id,
        )
        commit(
          "setTags",
          state.tags.filter((t) => t._id !== tag._id),
        )
        commit(
          "system/addNotification",
          {
            message: "Tag deleted successfully",
            type: "success",
          },
          { root: true },
        )
        return data
      } catch (error) {
        console.error("Error deleting tag in store:", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: "Error deleting tag",
            type: "error",
          },
          { root: true },
        )
        // Re-throw the error so the component can handle it
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    async addTagToMedia(
      { commit, getters, rootGetters, state },
      { mediaId, tagId },
    ) {
      commit("setLoading", true)
      try {
        console.log("addTagToMedia", mediaId, tagId)
        const data = await apiAddTagToConversation(mediaId, tagId)
        const media = rootGetters["inbox/getMediaById"](mediaId)
        const newMedia = { ...media, tags: [...media.tags, tagId] }
        console.log("newMedia", newMedia)
        commit(
          "inbox/updateMedia",
          { mediaId, media: newMedia },
          { root: true },
        )
        commit(
          "system/addNotification",
          {
            message: "Tag added to media successfully",
            type: "success",
          },
          { root: true },
        )
      } catch (error) {
        console.log("error", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: "Error adding tag to media",
            type: "error",
          },
          { root: true },
        )
      } finally {
        commit("setLoading", false)
      }
    },
    async removeTagFromMedia(
      { commit, getters, rootGetters, state },
      { mediaId, tagId },
    ) {
      commit("setLoading", true)
      try {
        const data = await apiDeleteTagFromConversation(mediaId, tagId)
        const media = rootGetters["inbox/getMediaById"](mediaId)
        const newMedia = {
          ...media,
          tags: media.tags.filter((t) => t !== tagId),
        }
        commit(
          "inbox/updateMedia",
          { mediaId, media: newMedia },
          { root: true },
        )
        commit(
          "system/addNotification",
          {
            message: "Tag removed from media successfully",
            type: "success",
          },
          { root: true },
        )
      } catch (error) {
        console.log("error", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: "Error removing tag from media",
            type: "error",
          },
          { root: true },
        )
      } finally {
        commit("setLoading", false)
      }
    },
    setExploreSelectedTags({ commit }, tags) {
      commit("setExploreSelectedTags", tags.filter((t) => !!t))
    },
    addExploreSelectedTag({ commit, state }, tag) {
      commit("setExploreSelectedTags", [...state.exploreSelectedTags, tag])

      const url = new URL(window.location.href)
      url.searchParams.set("tags", [...state.exploreSelectedTags, tag].map((t) => t._id).join(","))
      window.history.pushState({}, "", url)
    },
    removeExploreSelectedTag({ commit, state }, tag) {
      commit(
        "setExploreSelectedTags",
        state.exploreSelectedTags.filter((t) => t._id !== tag._id),
      )

      const url = new URL(window.location.href)
      url.searchParams.set("tags", state.exploreSelectedTags.map((t) => t._id).join(","))
      window.history.pushState({}, "", url)
    },
    toggleTag({ dispatch, state }, tag) {
      console.log("[tags] toggleTag", tag)
      if (state.exploreSelectedTags.some((t) => t._id === tag._id)) {
        dispatch("removeExploreSelectedTag", tag)
      } else {
        dispatch("addExploreSelectedTag", tag)
      }
    },
  },
}

import {
  apiGetTagsByCategory,
  apiGetSystemCategories,
  apiCreateOrganizationTag,
  apiDeleteTag,
} from "@/api/tag"
import {
  apiAddTagToConversation,
  apiDeleteTagFromConversation,
} from "@/api/conversation"

export default {
  namespaced: true,
  state: {
    categories: [],
    tags: [],
    loading: false,
    error: null,
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories
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
          tag.color,
          tag.emoji,
        )

        commit("setTags", [...state.tags, data])
        return data
      } catch (error) {
        console.error("Error creating tag in store:", error)
        commit("setError", error)
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
        console.log("Tag deleted from API:", tag.name, data)
        commit(
          "setTags",
          state.tags.filter((t) => t._id !== tag._id),
        )
        return data
      } catch (error) {
        console.error("Error deleting tag in store:", error)
        commit("setError", error)
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
      } catch (error) {
        console.log("error", error)
        commit("setError", error)
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
      } catch (error) {
        console.log("error", error)
        commit("setError", error)
      } finally {
        commit("setLoading", false)
      }
    },
  },
}

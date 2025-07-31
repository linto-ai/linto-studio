import $set from "lodash.set"
import Vue from "vue"
import { apiDeleteMultipleConversation } from "@/api/conversation.js"
import i18n from "@/i18n"
import { bus } from "@/main.js"
export default {
  namespaced: true,
  state: {
    medias: [],
    selectedMedias: [],
    autoselectMedias: false,
    uploadQueue: [],
    uploadProgress: {},
  },
  mutations: {
    setAutoselectMedias(state, autoselectMedias) {
      state.autoselectMedias = autoselectMedias
    },
    setMedias(state, medias) {
      // Ensure we don't have duplicates when setting medias
      const unique = []
      const seen = new Set()

      for (const media of medias) {
        if (!seen.has(media._id)) {
          seen.add(media._id)
          unique.push(media)
        }
      }

      state.medias = unique
    },
    appendMedias(state, medias) {
      const merged = [...state.medias, ...medias]
      const unique = []
      const seen = new Set()

      for (const media of merged) {
        if (!seen.has(media._id)) {
          seen.add(media._id)
          unique.push(media)
        }
      }

      state.medias = unique
    },
    clearMedias(state) {
      state.medias = []
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
    setSelectedMedias(state, selectedMedias) {
      state.selectedMedias = selectedMedias
    },
    addSelectedMedia(state, media) {
      if (state.selectedMedias.some((m) => m._id === media._id)) {
        return
      }

      state.selectedMedias.push(media)
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
    addToUploadQueue(state, file) {
      state.uploadQueue.push(file)
    },
    removeFromUploadQueue(state, fileId) {
      state.uploadQueue = state.uploadQueue.filter((f) => f.id !== fileId)
    },
    clearUploadQueue(state) {
      state.uploadQueue = []
    },
    setUploadProgress(state, { fileId, progress }) {
      $set(state.uploadProgress, fileId, progress)
    },
    clearUploadProgress(state, fileId) {
      if (fileId) {
        delete state.uploadProgress[fileId]
      } else {
        state.uploadProgress = {}
      }
    },
    updateUploadFile(state, { fileId, updates }) {
      const file = state.uploadQueue.find((f) => f.id === fileId)
      if (file) {
        Object.assign(file, updates)
      }
    },
  },
  actions: {
    updateMedia({ commit }, { mediaId, media }) {
      commit("updateMedia", { mediaId, media })
    },
    clearUploadState({ commit }) {
      commit("clearUploadQueue")
      commit("clearUploadProgress")
    },
    async deleteMedias({ commit, rootGetters }, mediaIds) {
      const organizationScope =
        rootGetters["organizations/getCurrentOrganizationScope"]
      try {
        let req = await apiDeleteMultipleConversation(
          organizationScope,
          mediaIds,
        )
        if (req.status === "success") {
          commit("deleteMedias", mediaIds)
          commit(
            "system/addNotification",
            {
              message: i18n.tc(
                "conversation.delete_success_message",
                mediaIds.length,
              ),
              type: "success",
            },
            { root: true },
          )
        } else {
          throw new Error("Failed to delete media", req)
        }
      } catch (error) {
        console.error("Error deleting media:", error)
        commit(
          "system/addNotification",
          {
            message: i18n.tc(
              "conversation.delete_error_message",
              mediaIds.length,
            ),
            type: "error",
          },
          { root: true },
        )
      }
    },
    clearSelectedMedias({ commit }) {
      commit("clearSelectedMedias")
    },
  },
  getters: {
    getMediaById: (state) => (mediaId) => {
      return state.medias.find((m) => m._id === mediaId)
    },
    getUploadProgress: (state) => (fileId) => {
      return state.uploadProgress[fileId] || 0
    },
    isUploading: (state) => {
      return state.uploadQueue.length > 0
    },
    totalUploadProgress: (state) => {
      if (state.uploadQueue.length === 0) return 0

      const totalProgress = Object.values(state.uploadProgress).reduce(
        (sum, progress) => sum + progress,
        0,
      )
      return totalProgress / state.uploadQueue.length
    },
  },
}

export const fromConversations = (conversations) => {
  return conversations.map((conversation) => {
    return {
      _id: conversation._id,
      name: conversation.name,
      description: conversation.description,
      created: conversation.created,
      metadata: conversation.metadata ? structuredClone(conversation.metadata) : null,
      sharedBy: conversation.sharedBy ? structuredClone(conversation.sharedBy) : null,
      type: conversation.type ? structuredClone(conversation.type) : null,
      isSelected: false,
      tags: conversation.tags,
      owner: conversation.owner,
      organization: structuredClone(conversation.organization),
      customRights: conversation.customRights,
      sharedWithUsers: structuredClone(conversation.sharedWithUsers),
      jobs: {
        transcription: structuredClone(conversation.jobs.transcription),
      },
    }
  })
}

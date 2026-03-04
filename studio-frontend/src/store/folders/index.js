import {
  apiFetchFolders,
  apiCreateFolder,
  apiUpdateFolder,
  apiDeleteFolder,
  apiMoveConversationsToFolder,
  apiUncategorizeConversations,
} from "@/api/folder"
import i18n from "@/i18n"

export default {
  namespaced: true,
  state: {
    folders: [],
    selectedFolderId: null,
    activeFolderId: null,
    loading: false,
    error: null,
  },
  mutations: {
    setFolders(state, folders) {
      state.folders = folders
    },
    setSelectedFolderId(state, folderId) {
      state.selectedFolderId = folderId
    },
    setActiveFolderId(state, folderId) {
      state.activeFolderId = folderId
    },
    addFolder(state, folder) {
      state.folders = [...state.folders, folder]
    },
    updateFolder(state, folder) {
      state.folders = state.folders.map((f) =>
        f._id === folder._id
          ? { ...f, ...folder, conversationCount: folder.conversationCount ?? f.conversationCount }
          : f,
      )
    },
    removeFolder(state, folderId) {
      state.folders = state.folders.filter((f) => f._id !== folderId)
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    },
  },
  getters: {
    getFolders: (state) => state.folders,
    getFolderById: (state) => (id) => {
      return state.folders.find((f) => f._id === id)
    },
    getFolderTree: (state) => {
      const map = {}
      const roots = []

      state.folders.forEach((f) => {
        map[f._id] = { ...f, children: [] }
      })

      state.folders.forEach((f) => {
        if (f.parentId && map[f.parentId]) {
          map[f.parentId].children.push(map[f._id])
        } else {
          roots.push(map[f._id])
        }
      })

      const sortByName = (arr) => {
        arr.sort((a, b) => (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }))
        arr.forEach((item) => sortByName(item.children))
        return arr
      }

      const aggregateCounts = (arr) => {
        arr.forEach((item) => {
          const childrenTotal = aggregateCounts(item.children)
          item.conversationCount = (item.conversationCount || 0) + childrenTotal
        })
        return arr.reduce((sum, item) => sum + (item.conversationCount || 0), 0)
      }

      const sorted = sortByName(roots)
      aggregateCounts(sorted)
      return sorted
    },
    getSelectedFolderId: (state) => state.selectedFolderId,
    getActiveFolderId: (state) => state.activeFolderId,
    getRootFolders: (state) => {
      return state.folders
        .filter((f) => !f.parentId)
        .sort((a, b) => (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }))
    },
    getLoading: (state) => state.loading,
  },
  actions: {
    async fetchFolders({ commit, state, rootGetters }) {
      if (state.loading) return
      commit("setLoading", true)
      try {
        const data = await apiFetchFolders(
          rootGetters["organizations/getCurrentOrganizationScope"],
          { withConversationCount: true },
        )
        commit("setFolders", data)
        return data
      } catch (error) {
        console.error("Error fetching folders:", error)
        commit("setError", error)
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    async createFolder({ commit, rootGetters, state }, folder) {
      commit("setLoading", true)
      try {
        const data = await apiCreateFolder(
          rootGetters["organizations/getCurrentOrganizationScope"],
          folder,
        )
        commit("addFolder", { ...data, conversationCount: 0 })
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.create_success"),
            type: "success",
          },
          { root: true },
        )
        return data
      } catch (error) {
        console.error("Error creating folder:", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.create_error"),
            type: "error",
          },
          { root: true },
        )
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    async updateFolder({ commit, rootGetters }, { folderId, payload }) {
      commit("setLoading", true)
      try {
        const data = await apiUpdateFolder(
          rootGetters["organizations/getCurrentOrganizationScope"],
          folderId,
          payload,
        )
        commit("updateFolder", data)
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.update_success"),
            type: "success",
          },
          { root: true },
        )
        return data
      } catch (error) {
        console.error("Error updating folder:", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.update_error"),
            type: "error",
          },
          { root: true },
        )
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    async deleteFolder({ commit, rootGetters, state }, folderId) {
      commit("setLoading", true)
      try {
        await apiDeleteFolder(
          rootGetters["organizations/getCurrentOrganizationScope"],
          folderId,
        )
        commit("removeFolder", folderId)
        if (state.selectedFolderId === folderId) {
          commit("setSelectedFolderId", null)
        }
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.delete_success"),
            type: "success",
          },
          { root: true },
        )
      } catch (error) {
        console.error("Error deleting folder:", error)
        commit("setError", error)
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.delete_error"),
            type: "error",
          },
          { root: true },
        )
        throw error
      } finally {
        commit("setLoading", false)
      }
    },
    selectFolder({ commit }, folderId) {
      commit("setSelectedFolderId", folderId)
    },
    setActiveFolderId({ commit }, folderId) {
      commit("setActiveFolderId", folderId)
    },
    async updateFolderVisibility(
      { commit, dispatch, rootGetters },
      { folderId, visibility, members, force },
    ) {
      try {
        const payload = { visibility, members }
        if (force) payload.force = true
        await apiUpdateFolder(
          rootGetters["organizations/getCurrentOrganizationScope"],
          folderId,
          payload,
        )
        await dispatch("fetchFolders")
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.visibility_update_success"),
            type: "success",
          },
          { root: true },
        )
      } catch (error) {
        console.error("Error updating folder visibility:", error)
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.visibility_update_error"),
            type: "error",
          },
          { root: true },
        )
        throw error
      }
    },
    async uncategorizeConversations(
      { commit, rootGetters },
      { conversationIds },
    ) {
      try {
        await apiUncategorizeConversations(
          rootGetters["organizations/getCurrentOrganizationScope"],
          conversationIds,
        )
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.uncategorize_success"),
            type: "success",
          },
          { root: true },
        )
      } catch (error) {
        console.error("Error uncategorizing conversations:", error)
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.uncategorize_error"),
            type: "error",
          },
          { root: true },
        )
        throw error
      }
    },
    async moveConversationsToFolder(
      { commit, rootGetters },
      { folderId, conversationIds },
    ) {
      try {
        await apiMoveConversationsToFolder(
          rootGetters["organizations/getCurrentOrganizationScope"],
          folderId,
          conversationIds,
        )
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.move_success"),
            type: "success",
          },
          { root: true },
        )
      } catch (error) {
        console.error("Error moving conversations:", error)
        commit(
          "system/addNotification",
          {
            message: i18n.t("folders.move_error"),
            type: "error",
          },
          { root: true },
        )
        throw error
      }
    },
  },
}

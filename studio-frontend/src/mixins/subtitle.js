import { bus } from "@/main.js"
import { ScreenList } from "../models/screenList.js"
import { apiGetSubtitle, apiListSubtitleVersions } from "../api/subtitle.js"
import { genericConversationMixin } from "./genericConversation.js"

export const subtitleMixin = {
  mixins: [genericConversationMixin],
  data() {
    return {
      subtitleObj: null,
      screens: null,
      subtitleLoaded: false,
      selectedVersions: [],
    }
  },
  watch: {
    subtitleLoaded(newVal) {
      if (newVal) {
        let arr = this.subtitleObj?.screens
        if (arr) {
          this.screens = ScreenList.from(arr)
        }
      }
    },
  },
  created() {
    bus.$on("subtitle_versions_refresh", this.refreshVersions)
    bus.$on("subtitle_versions_deleted", this.onVersionsDeleted)
  },
  beforeDestroy() {
    bus.$off("subtitle_versions_refresh", this.refreshVersions)
    bus.$off("subtitle_versions_deleted", this.onVersionsDeleted)
  },
  methods: {
    // Loads the version list alongside the conversation (see genericConversationMixin)
    async initConversationHook() {
      await this.refreshVersions()
    },
    async refreshVersions() {
      const res = await apiListSubtitleVersions(this.conversationId)
      this.$set(
        this.conversation,
        "subtitleVersions",
        res?.status === "success" ? res.data : [],
      )
    },
    async loadSubtitle(subtitleId) {
      // Reset so the subtitleLoaded watcher rebuilds screens on every load
      this.subtitleLoaded = false
      const res = await apiGetSubtitle(this.conversationId, subtitleId)
      if (res?.status === "success") {
        this.subtitleObj = res.data
        this.subtitleLoaded = true
      } else {
        this.error = true
      }
    },
    onVersionsDeleted(versionIds) {
      this.deleteVersions(versionIds)
    },
    deleteFromArray(elem, array) {
      let index = array.findIndex((e) => e === elem)
      if (index !== -1) {
        array.splice(index, 1)
      }
    },
    deleteVersions(versionIds) {
      for (const versionId of versionIds) {
        let versionIndex = this.conversation.subtitleVersions.findIndex(
          (version) => version._id === versionId,
        )
        if (versionIndex !== -1) {
          this.conversation.subtitleVersions.splice(versionIndex, 1)
        }
        this.deleteFromArray(versionId, this.selectedVersions)
      }
    },
  },
}

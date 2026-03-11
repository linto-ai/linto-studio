import { mapGetters } from "vuex"
import { apiDuplicateConversation } from "@/api/conversation"

export const mediaScopeMixin = {
  computed: {
    storeScope() {
      return this.getStoreScope
    },
    ...mapGetters("organizations", [
      "getCurrentScope",
      "getCurrentOrganizationScope",
      "getCurrentFilterStatus",
      "getStoreScope",
    ]),
    isSelectAll() {
      const value = this.$store.state[this.storeScope]?.autoselectMedias ?? false
      return value
    },
    selectedTagsIds() {
      return this.$store.state[this.storeScope]?.selectedTagIds ?? []
    },
    searchValue() {
      return this.$store.getters[`${this.storeScope}/search`]
    },
    hasActiveSearch() {
      return !!this.searchValue || this.selectedTagsIds.length > 0
    },
  },
  methods: {
    clearSelectedMedias() {
      return this.$store.dispatch(`${this.storeScope}/clearSelectedMedias`)
    },
    selectAll() {
      return this.$store.dispatch(`${this.storeScope}/selectAll`)
    },
    toggleMediaSelection(media) {
      return this.$store.dispatch(
        `${this.storeScope}/toggleMediaSelection`,
        media,
      )
    },
    deleteMedias(ids) {
      return this.$store.dispatch(`${this.storeScope}/deleteMedias`, {
        ids: ids,
      })
    },
    toggleSelectedTag(tag) {
      return this.$store.dispatch(
        `${this.storeScope}/toggleSelectedTagId`,
        tag._id,
      )
    },
    clearSearch() {
      if (!this.hasActiveSearch) return
      this.$store.dispatch(`${this.storeScope}/setSearchQuery`, "")
      this.$store.dispatch(`${this.storeScope}/clearSelectedTagIds`)
    },
    mediaRight(mediaId) {
      const right =
        this.$store.getters[`${this.storeScope}/getSelfMediaRight`](mediaId)
      return right
    },
    async duplicateConversation(mediaId) {
      try {
        const result = await apiDuplicateConversation(mediaId)
        if (result.status === "success") {
          await this.$store.dispatch(`${this.storeScope}/load`, {
            folderId: this.effectiveFolderId ?? this.$route.params.folderId,
          })
          return true
        }
        return false
      } catch (error) {
        console.error("Error duplicating conversation:", error)
        return false
      }
    },
  },
}

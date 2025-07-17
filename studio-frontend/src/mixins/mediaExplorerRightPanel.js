import { mapGetters } from "vuex"

export const mediaExplorerRightPanelMixin = {
  computed: {
    ...mapGetters("tags", ["getTags", "getTagById"]),
  },

  methods: {
    formatDate(dateString, options = {}) {
      if (!dateString) return ""
      const date = new Date(dateString)
      const defaultOptions = {
        year: "numeric",
        month: "short", 
        day: "numeric",
      }
      return date.toLocaleDateString(this.$i18n.locale, { ...defaultOptions, ...options })
    },

    formatDuration(duration) {
      if (!duration) return ""
      const hours = Math.floor(duration / 3600)
      const minutes = Math.floor((duration % 3600) / 60)
      const seconds = Math.floor(duration % 60)

      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`
      } else {
        return `${minutes}m ${seconds}s`
      }
    },

    isFromSession(media) {
      return !!media?.type?.from_session_id
    },

    // Common tag handling methods
    async createAndAddTag(tag, mediaId) {
      const newTag = await this.$store.dispatch("tags/createTag", tag)
      
      if (mediaId) {
        await this.$store.dispatch("tags/addTagToMedia", {
          mediaId,
          tagId: newTag._id,
        })
      }
      
      return newTag
    },

    async addTagToMedia(tag, mediaId) {
      await this.$store.dispatch("tags/addTagToMedia", {
        mediaId,
        tagId: tag._id,
      })
    },

    async removeTagFromMedia(tag, mediaId) {
      await this.$store.dispatch("tags/removeTagFromMedia", {
        mediaId,
        tagId: tag._id,
      })
    },
  },
} 
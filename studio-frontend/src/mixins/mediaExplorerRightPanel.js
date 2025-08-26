import { mapGetters } from "vuex"
import {
  apiGetAudioFileFromConversation,
  apiUpdateConversation,
} from "@/api/conversation.js"

export const mediaExplorerRightPanelMixin = {
  props: {
    readOnlyTags: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters("tags", ["getTags", "getTagById"]),

    // Determine if tag management should be read-only
    isTagManagementReadOnly() {
      return this.readOnlyTags
    },
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
      return date.toLocaleDateString(this.$i18n.locale, {
        ...defaultOptions,
        ...options,
      })
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

    // Media property update method
    async updateMediaProperty(mediaId, propertyName, value) {
      try {
        const payload = { [propertyName]: value }
        const response = await apiUpdateConversation(mediaId, payload)

        if (response.status === "success") {
          // Update the media in the inbox store
          const currentMedia =
            this.$store.getters[`${this.storeScope}/getMediaById`](mediaId)
          if (currentMedia) {
            const updatedMedia = { ...currentMedia, [propertyName]: value }
            this.$store.dispatch(`${this.storeScope}/updateMedia`, {
              mediaId,
              media: updatedMedia,
            })
          }

          // Also update in conversations store if it exists
          const conversationMedia =
            this.$store.getters["conversations/getConversationById"](mediaId)
          if (conversationMedia) {
            this.$store.commit("conversations/updateConversation", {
              conversationId: mediaId,
              updates: { [propertyName]: value },
            })
          }

          return true
        } else {
          throw new Error(response.error || "Update failed")
        }
      } catch (error) {
        console.error("Error updating media property:", error)
        throw error
      }
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

    // Media download methods
    async downloadMediaFile(media) {
      if (!media || !media._id) return

      try {
        const fileName = media.name || media.title || `media_${media._id}`
        const fileExtension = this.getMediaFileExtension(media)

        const response = await apiGetAudioFileFromConversation(media._id, false)

        if (response?.status === "success") {
          const audioBlob = response.data
          const audioUrl = URL.createObjectURL(audioBlob)

          const link = document.createElement("a")
          link.href = audioUrl
          link.download = `${fileName}${fileExtension}`
          link.click()

          URL.revokeObjectURL(audioUrl)

          return true
        }
        return false
      } catch (error) {
        console.error("Error downloading media:", error)
        return false
      }
    },

    async downloadMultipleMediaFiles(medias) {
      if (!medias || medias.length === 0) return

      const results = []

      for (const media of medias) {
        try {
          const success = await this.downloadMediaFile(media)
          results.push({ media, success })

          // Add a small delay between downloads to avoid overwhelming the server
          if (medias.length > 1) {
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        } catch (error) {
          console.error(`Error downloading media ${media._id}:`, error)
          results.push({ media, success: false })
        }
      }

      return results
    },

    getMediaFileExtension(media) {
      // Try to get extension from metadata
      if (media.metadata?.audio?.filename) {
        const filename = media.metadata.audio.filename
        const lastDot = filename.lastIndexOf(".")
        if (lastDot > 0) {
          return filename.substring(lastDot)
        }
      }

      // Default to mp3 if no extension found
      return ".mp3"
    },
  },
}

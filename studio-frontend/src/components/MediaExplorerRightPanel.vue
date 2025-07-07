<template>
  <div
    class="media-explorer-right-panel"
    :style="{ width: panelWidth + 'px' }"
    v-if="selectedMedia">
    <!-- Resize handle -->
    <div
      class="resize-handle"
      @mousedown="startResize"
      @touchstart="startResize"></div>

    <!-- Panel content -->
    <div class="panel-content">
      <!-- Header -->
      <div class="panel-header">
        <h3 class="panel-title">{{ $t("media_explorer.panel.overview") }}</h3>
        <Button
          @click="$emit('close')"
          icon="x"
          size="sm"
          variant="outline"
          color="tertiary" />
      </div>
      <div class="panel-header-actions button-group">
        <Button
          v-for="action in actions"
          :key="action.id"
          :label="action.label"
          :icon="action.icon"
          size="sm"
          variant="outline"
          :color="action.color"
          @click="handleActionClick(action)" />
      </div>

      <!-- Media overview content -->
      <div class="panel-body">
        <div class="media-overview">
          <!-- Media title -->
          <div class="media-section">
            <h4 class="section-title">
              {{ $t("media_explorer.panel.title") }}
            </h4>
            <p class="section-content">
              {{
                selectedMedia.name ||
                selectedMedia.title ||
                $t("media_explorer.panel.default_title")
              }}
            </p>
          </div>

          <!-- Media description -->
          <div class="media-section">
            <h4 class="section-title">
              {{ $t("media_explorer.panel.description") }}
            </h4>
            <p class="section-content">
              {{
                selectedMedia.description ||
                $t("media_explorer.panel.default_description")
              }}
            </p>
          </div>

          <!-- Media duration -->
          <div
            class="media-section"
            v-if="selectedMedia.metadata?.audio?.duration">
            <h4 class="section-title">
              {{ $t("media_explorer.panel.duration") }}
            </h4>
            <p class="section-content">
              <TimeDuration
                :duration="selectedMedia.metadata?.audio?.duration" />
            </p>
          </div>

          <!-- Media creation date -->
          <div class="media-section" v-if="selectedMedia.created">
            <h4 class="section-title">
              {{ $t("media_explorer.panel.created") }}
            </h4>
            <p class="section-content">
              {{ formatDate(selectedMedia.created) }}
            </p>
          </div>

          <!-- Media duration -->
          <div class="media-section" v-if="selectedMedia.metadata.au">
            <h4 class="section-title">
              {{ $t("media_explorer.panel.duration") }}
            </h4>
            <p class="section-content">
              {{ formatDuration(selectedMedia.duration) }}
            </p>
          </div>

          <!-- Media tags -->
          <div class="media-section">
            <h4 class="section-title">{{ $t("media_explorer.panel.tags") }}</h4>
            <div class="tags-container">
              <InputSelector
                :tags="getTags" 
                :selected-tags="selectedMediaTags"
                @create="handleCreateTag"
                @remove="handleRemoveTag"
                @add="handleAddTag"
              />
            </div>
          </div>

          <!-- Media metadata -->
          <div v-if="false" class="media-section">
            <h4 class="section-title">
              {{ $t("media_explorer.panel.metadata") }}
            </h4>
            <div class="metadata-grid">
              <div
                v-for="(value, key) in selectedMedia.metadata"
                :key="key"
                class="metadata-item">
                <span class="metadata-key">{{ key }}:</span>
                <span class="metadata-value">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalDeleteConversations
      :visible="showDeleteModal"
      :medias="[selectedMedia]"
      @close="showDeleteModal = false" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Button from "@/components/atoms/Button.vue"
import Badge from "@/components/atoms/Badge.vue"
import ModalDeleteConversations from "./ModalDeleteConversations.vue"

export default {
  name: "MediaExplorerRightPanel",
  components: {
    Button,
    Badge,
    ModalDeleteConversations,
  },
  props: {
    selectedMedia: {
      type: [Object, null],
      default: null,
    },
    initialWidth: {
      type: Number,
      default: 400,
    },
    minWidth: {
      type: Number,
      default: 300,
    },
    maxWidth: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      panelWidth: this.initialWidth,
      isResizing: false,
      startX: 0,
      startWidth: 0,
      showDeleteModal: false,
      actions: [
        {
          id: "edit",
          label: this.$t("media_explorer.line.edit_transcription"),
          icon: "pencil",
        },
        {
          id: "subtitles",
          label: this.$t("media_explorer.line.edit_subtitles"),
          icon: "closed-captioning",
        },
        {
          id: "export",
          label: this.$t("media_explorer.line.export"),
          icon: "export",
        },
        {
          id: "delete",
          label: this.$t("media_explorer.line.delete"),
          icon: "trash",
          color: "tertiary",
        },
      ],
    }
  },
  computed: {
    ...mapGetters("tags", ["getTags", "getTagById"]),
    reactiveSelectedMedia() {
      if (!this.selectedMedia?._id) return null
      return this.$store.getters["inbox/getMediaById"](this.selectedMedia._id)
    },
    selectedMediaTags() {
      const media = this.reactiveSelectedMedia
      if (!media?.tags) return []
      const tags = media.tags
        .map((tagId) => this.getTagById(tagId))
        .filter((tag) => !!tag)

      return tags
    },
  },
  methods: {
    getTagColor(tagId) {
      const tag = this.getTags.find((t) => t._id === tagId)
      return tag ? tag.color : "gray"
    },
    /**
     * Start the resize of the panel
     * @param event - The event object
     */
    startResize(event) {
      this.isResizing = true
      this.startX = event.clientX || event.touches[0].clientX
      this.startWidth = this.panelWidth

      document.addEventListener("mousemove", this.handleResize)
      document.addEventListener("mouseup", this.stopResize)
      document.addEventListener("touchmove", this.handleResize)
      document.addEventListener("touchend", this.stopResize)

      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      event.preventDefault()
    },

    /**
     * Handle the creation of a tag
     * @param tag - The tag to create
     */
    async handleCreateTag(tag) {
      const newTag = await this.$store.dispatch("tags/createTag", tag)

      this.$store.dispatch("tags/addTagToMedia", {
        mediaId: this.selectedMedia._id,
        tagId: newTag._id,
      })
    },

    handleRemoveTag(tag) {
      this.$store.dispatch("tags/removeTagFromMedia", {
        mediaId: this.selectedMedia._id,
        tagId: tag._id,
      })
    },

    handleAddTag(tag) {
      this.$store.dispatch("tags/addTagToMedia", {
        mediaId: this.selectedMedia._id,
        tagId: tag._id,
      })
    },

    /**
     * Handle the resize of the panel
     * @param event - The event object
     */
    handleResize(event) {
      if (!this.isResizing) return

      const clientX = event.clientX || event.touches[0].clientX
      const deltaX = this.startX - clientX
      const newWidth = this.startWidth + deltaX
      this.panelWidth = Math.max(
        this.minWidth,
        Math.min(this.maxWidth, newWidth),
      )

      this.$emit("resize", this.panelWidth)

      event.preventDefault()
    },

    /**
     * Stop the resize of the panel
     */
    stopResize() {
      this.isResizing = false
      document.removeEventListener("mousemove", this.handleResize)
      document.removeEventListener("mouseup", this.stopResize)
      document.removeEventListener("touchmove", this.handleResize)
      document.removeEventListener("touchend", this.stopResize)

      document.body.style.cursor = ""
      document.body.style.userSelect = ""

      localStorage.setItem(
        "mediaExplorerPanelWidth",
        this.panelWidth.toString(),
      )

      this.$emit("resize", this.panelWidth)
    },

    /**
     * Format the duration of the media
     * @param duration - The duration of the media
     * @returns The formatted duration
     */
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

    formatDate(dateString) {
      if (!dateString) return ""
      const date = new Date(dateString)
      return date.toLocaleDateString(this.$i18n.locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    },

    getTagName(tagId) {
      const tag = this.getTags.find((t) => t._id === tagId)
      return tag ? tag.name : tagId
    },

    handleActionClick(action) {
      switch (action.id) {
        case "edit":
          this.handleEdit()
          break
        case "subtitles":
          this.handleSubtitles()
          break
        case "export":
          this.handleExport()
          break
        case "delete":
          this.handleDelete()
          break
      }
    },

    handleEdit() {
      this.$router.push({
        name: "conversations transcription",
        params: {
          conversationId: this.media._id,
          organizationId: this.organizationId,
        },
      })
    },

    handleSubtitles() {
      this.$router.push({
        name: "conversations subtitles",
        params: {
          conversationId: this.media._id,
          organizationId: this.organizationId,
        },
      })
    },

    handleExport() {
      this.$router.push({
        name: "conversations publish",
        params: {
          conversationId: this.media._id,
          organizationId: this.organizationId,
        },
      })
    },

    handleDelete() {
      this.showDeleteModal = true
    },
  },
  mounted() {
    const savedWidth = localStorage.getItem("mediaExplorerPanelWidth")
    if (savedWidth) {
      const width = parseInt(savedWidth)
      if (width >= this.minWidth && width <= this.maxWidth) {
        this.panelWidth = width
      }
    }

    // Emettre la largeur initiale au parent
    this.$emit("resize", this.panelWidth)
  },
  beforeDestroy() {
    if (this.isResizing) {
      this.stopResize()
    }
  },
}
</script>

<style scoped>
.media-explorer-right-panel {
  position: relative;
  background-color: var(--background-color, #fff);
  border-left: var(--border-block, 1px solid var(--neutral-30));
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 300px;
  max-width: 800px;
}

.resize-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background-color: transparent;
  border-left: 2px solid transparent;
  transition: border-color 0.2s ease;
  z-index: 10;
}

.resize-handle:hover {
  border-left-color: var(--primary-color, #007bff);
}

.resize-handle::before {
  content: "";
  position: absolute;
  left: -6px;
  top: 0;
  bottom: 0;
  width: 12px;
  background: transparent;
}

.panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 0px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border: var(--border-block, 1px solid var(--neutral-30));
  background-color: var(--primary-soft);
  margin: 0.5em;
  height: 50px;
  border-radius: 4px;
}

.panel-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0.5em;
}

.panel-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary, #000);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.media-overview {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.media-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-content {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary, #000);
  line-height: 1.4;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.metadata-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  background-color: var(--background-tertiary, #f0f0f0);
  border-radius: var(--border-radius-sm, 4px);
}

.metadata-key {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary, #666);
}

.metadata-value {
  font-size: 0.9rem;
  color: var(--text-primary, #000);
  word-break: break-word;
}

.media-explorer-right-panel {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media only screen and (max-width: 1100px) {
  .media-explorer-right-panel {
    display: none;
  }
}
</style>

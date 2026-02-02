<template>
  <div
    class="media-explorer-right-panel"
    :style="{ width: panelWidth + 'px' }"
    v-if="shouldShowPanel">
    <!-- Resize handle -->
    <div
      class="resize-handle"
      @mousedown="startResize"
      @touchstart="startResize"></div>

    <!-- Panel content -->
    <div class="panel-content flex col flex1">
      <!-- Header -->

      <header class="panel-header">
        <div class="panel-header-title flex align-center">
          <h3 class="panel-title">
            {{
              isMultiMode
                ? $t("media_explorer.panel.selected_count", {
                    count: selectedMedias.length,
                  })
                : $t("media_explorer.panel.overview")
            }}
          </h3>
          <Button icon="x" variant="transparent" @click="close" />
        </div>

        <div class="flex panel-header-actions" v-if="!isMultiMode">
          <!-- Actions for single media (edition etc...)-->
          <div class="button-group" ref="panelActions">
            <Button
              v-for="action in singleMediaActions"
              :key="action.id"
              :to="action.to"
              :label="action.label"
              :icon="action.icon"
              size="sm"
              variant="secondary"
              :disabled="action.disabled"
              :color="action.color || 'primary'"
              @click="handleActionClick(action)" />
          </div>
        </div>
      </header>

      <!-- Multi-selection mode -->
      <MediaExplorerRightPanelMulti v-if="isMultiMode" />

      <!-- Single media mode -->
      <MediaExplorerRightPanelItem
        v-else-if="selectedMediaForOverview"
        :selectedMedia="selectedMediaForOverview" />
    </div>
  </div>
</template>

<script>
import { mediaScopeMixin } from "@/mixins/mediaScope"
import { mediaProgressMixin } from "@/mixins/mediaProgress"

import Button from "@/components/atoms/Button.vue"
import MediaExplorerRightPanelItem from "@/components/MediaExplorerRightPanelItem.vue"
import MediaExplorerRightPanelMulti from "@/components/MediaExplorerRightPanelMulti.vue"
import { mediaExplorerRightPanelMixin } from "@/mixins/mediaExplorerRightPanel.js"

export default {
  name: "MediaExplorerRightPanel",
  mixins: [mediaExplorerRightPanelMixin, mediaScopeMixin, mediaProgressMixin],
  components: {
    Button,
    MediaExplorerRightPanelItem,
    MediaExplorerRightPanelMulti,
  },
  props: {
    initialWidth: {
      type: Number,
      default: 500,
    },
    minWidth: {
      type: Number,
      default: 500,
    },
    maxWidth: {
      type: Number,
      default: 700,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    readonlyTags: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      panelWidth: this.initialWidth,
      panelActionWidth: 0,
      isResizing: false,
      startX: 0,
      startWidth: 0,
      showDeleteModal: false,
      isDeleting: false,
    }
  },
  computed: {
    isMultiMode() {
      return this.selectedMedias.length > 1
    },

    shouldShowPanel() {
      return this.selectedMedias.length > 0
    },

    selectedMediaForOverview() {
      if (this.isMultiMode) return null

      if (this.selectedMedias.length > 0) return this.selectedMedias[0]
    },

    singleMediaActions() {
      if (!this.selectedMediaForOverview) return []

      const mediaId = this.selectedMediaForOverview._id
      const orgId = this.currentOrganizationScope
      const status = this.selectedMediaForOverview?.jobs?.transcription?.state
      return [
        {
          id: "edit",
          label: this.$t("media_explorer.line.edit_transcription"),
          icon: "pencil",
          to: {
            name: "conversations transcription",
            params: { conversationId: mediaId, organizationId: orgId },
          },
          disabled: status !== "done",
        },
        {
          id: "subtitles",
          label: this.$t("media_explorer.line.edit_subtitles"),
          icon: "closed-captioning",
          to: {
            name: "conversations subtitles",
            params: { conversationId: mediaId, organizationId: orgId },
          },
          disabled: status !== "done",
        },
        {
          id: "export",
          label: this.$t("media_explorer.line.export"),
          icon: "export",
          to: {
            name: "conversations publish",
            params: { conversationId: mediaId, organizationId: orgId },
          },
          disabled: status !== "done",
        },
        // {
        //   id: "delete",
        //   label: this.$t("media_explorer.line.delete"),
        //   icon: "trash",
        //   color: "tertiary",
        // },
      ]
    },
  },
  mounted() {
    const savedWidth = localStorage.getItem("mediaExplorerPanelWidth")

    if (this.$refs.panelActions) {
      this.panelActionWidth = Array.from(
        this.$refs.panelActions.childNodes,
      ).reduce((acc, el) => acc + el.clientWidth, 16)
    }

    if (savedWidth) {
      const width = parseInt(savedWidth)
      if (width >= this.minWidth && width <= this.maxWidth) {
        this.panelWidth = width
      }
    }

    if (this.panelWidth < this.panelActionWidth) {
      this.panelWidth = this.panelActionWidth
    }

    this.$emit("resize", this.panelWidth)
  },
  beforeDestroy() {
    if (this.isResizing) {
      this.stopResize()
    }
  },
  methods: {
    close(e) {
      this.clearSelectedMedias()
    },
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

    handleResize(event) {
      if (!this.isResizing) return

      const clientX = event.clientX || event.touches[0].clientX
      const deltaX = this.startX - clientX
      const newWidth = this.startWidth + deltaX

      this.panelWidth = Math.max(
        this.minWidth,
        Math.min(this.maxWidth, newWidth),
        this.panelActionWidth,
      )

      this.$emit("resize", this.panelWidth)
      event.preventDefault()
    },

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

    handleActionClick(action) {
      switch (action.id) {
        case "delete":
          this.handleDelete()
          break
      }
    },
    handleDelete() {
      // Validate that we have selected medias to delete
      if (!this.selectedMedias || this.selectedMedias.length === 0) {
        this.$store.commit("system/addNotification", {
          message: this.$t("media_explorer.no_medias_selected"),
          type: "warning",
        })
        return
      }

      // Check if all selected medias can be deleted
      const nonDeletableMedias = this.selectedMedias.filter(
        (media) => !this.canDeleteMedia(media),
      )
      if (nonDeletableMedias.length > 0) {
        this.$store.commit("system/addNotification", {
          message: this.$t("media_explorer.some_medias_cannot_be_deleted"),
          type: "error",
        })
        return
      }

      // Show confirmation modal
      this.showDeleteModal = true
    },

    canDeleteMedia(media) {
      // Check if media is in a state that allows deletion
      // For example, don't allow deletion if media is currently being processed
      if (!media) return false

      // Check if media has a job in progress
      if (
        media.job &&
        media.job.state &&
        media.job.state !== "done" &&
        media.job.state !== "error"
      ) {
        return false
      }

      // Check if media is shared and user doesn't have delete permission
      if (
        media.sharedBy &&
        media.sharedBy._id !== this.$store.getters["user/getCurrentUser"]._id
      ) {
        return false
      }

      return true
    },

    handleDeleteModalClose() {
      this.showDeleteModal = false
    },

    handleDeleteConfirm() {
      // Set loading state
      this.isDeleting = true

      // The ModalDeleteConversations component will handle the actual deletion
      // via the store action deleteMedias
      this.showDeleteModal = false

      // Clear selected medias after successful deletion
      this.clearSelectedMedias()

      // Emit event to parent to close panel
      this.$emit("close")

      // Reset loading state after a short delay to allow UI updates
      setTimeout(() => {
        this.isDeleting = false
      }, 1000)
    },

    handleDeleteCancel() {
      this.showDeleteModal = false
    },
  },
}
</script>

<style lang="scss">
.media-explorer-right-panel {
  position: relative;
  background-color: var(--background-color, #fff);
  border-left: var(--border-block, 1px solid var(--neutral-30));
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 400px;
  max-width: 800px;

  .button-group-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
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

// .panel-header {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 0 0.5rem;
//   border: var(--border-block, 1px solid var(--neutral-30));
//   background-color: var(--primary-soft);
//   margin: 0.5em;
//   height: 50px;
// }

.panel-header {
  border-bottom: var(--border-block);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: var(--primary-soft);
}

.panel-header h3 {
  padding: 0;
  //padding-left: 0.5rem;
}

.panel-header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 2px 0.5em;
  //overflow: auto !important;
}

.panel-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary, #000);
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

@media only screen and (max-width: 1500px) {
  .media-explorer-right-panel {
    animation: none;
  }
}

@media only screen and (max-width: 1100px) {
  .media-explorer-right-panel {
    display: none;
  }
}
</style>

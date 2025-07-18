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
    <div class="panel-content">
      <!-- Header -->
      <div class="panel-header">
        <Button
          @click="$emit('close')"
          icon="arrow-line-right"
          size="sm"
          color="neutral-40" />
        <h3 class="panel-title">
          {{
            isMultiMode
              ? $t("media_explorer.panel.selected_count", {
                  count: selectedMedias.length,
                })
              : $t("media_explorer.panel.overview")
          }}
        </h3>
      </div>

      <div class="flex panel-header-actions">
        <!-- Actions for single media (edition etc...)-->
        <div v-if="!isMultiMode" class="button-group" ref="panelActions">
          <Button
            v-for="action in singleMediaActions"
            :key="action.id"
            :to="action.to"
            :label="action.label"
            :icon="action.icon"
            size="sm"
            variant="outline"
            :color="action.color"
            @click="handleActionClick(action)" />
        </div>
        <div v-else></div>
        <!-- delete and share -->
        <div class="flex gap-small">
          <ConversationShareMultiple
            :selectedConversations="selectedMedias"
            :currentOrganizationScope="currentOrganizationScope" />
          <Button
            @click="handleDelete"
            :label="$t('media_explorer.delete')"
            icon="trash"
            variant="outline"
            size="sm"
            color="tertiary" />
        </div>
      </div>

      <!-- Multi-selection mode -->
      <MediaExplorerRightPanelMulti
        v-if="isMultiMode"
        :currentOrganizationScope="currentOrganizationScope" />

      <!-- Single media mode -->
      <MediaExplorerRightPanelItem
        v-else-if="selectedMediaForOverview"
        :selectedMedia="selectedMediaForOverview" />
    </div>

    <!-- Delete modal for single media -->
    <ModalDeleteConversations
      :visible="showDeleteModal"
      :medias="selectedMedias"
      @close="showDeleteModal = false" />
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import MediaExplorerRightPanelItem from "./MediaExplorerRightPanelItem.vue"
import MediaExplorerRightPanelMulti from "./MediaExplorerRightPanelMulti.vue"
import ModalDeleteConversations from "./ModalDeleteConversations.vue"
import { mediaExplorerRightPanelMixin } from "@/mixins/mediaExplorerRightPanel.js"
import ConversationShareMultiple from "./ConversationShareMultiple.vue"

export default {
  name: "MediaExplorerRightPanel",
  mixins: [mediaExplorerRightPanelMixin],
  components: {
    Button,
    MediaExplorerRightPanelItem,
    MediaExplorerRightPanelMulti,
    ModalDeleteConversations,
    ConversationShareMultiple,
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
      default: 700,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
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
    }
  },
  computed: {
    selectedMedias() {
      // Get the selected media IDs
      const selectedMediaIds = this.$store.state.inbox.selectedMedias.map(
        (media) => media._id,
      )

      // Return the updated versions from the main media store
      return selectedMediaIds
        .map((mediaId) => this.$store.getters["inbox/getMediaById"](mediaId))
        .filter((media) => !!media) // Remove any that might not exist anymore
    },

    isMultiMode() {
      return this.selectedMedias.length > 1
    },

    shouldShowPanel() {
      return this.isMultiMode || this.selectedMediaForOverview
    },

    selectedMediaForOverview() {
      if (this.isMultiMode) return null
      return this.selectedMedia
    },

    singleMediaActions() {
      if (!this.selectedMediaForOverview) return []

      const mediaId = this.selectedMediaForOverview._id
      const orgId = this.currentOrganizationScope

      return [
        {
          id: "edit",
          label: this.$t("media_explorer.line.edit_transcription"),
          icon: "pencil",
          to: {
            name: "conversations transcription",
            params: { conversationId: mediaId, organizationId: orgId },
          },
        },
        {
          id: "subtitles",
          label: this.$t("media_explorer.line.edit_subtitles"),
          icon: "closed-captioning",
          to: {
            name: "conversations subtitles",
            params: { conversationId: mediaId, organizationId: orgId },
          },
        },
        {
          id: "export",
          label: this.$t("media_explorer.line.export"),
          icon: "export",
          to: {
            name: "conversations publish",
            params: { conversationId: mediaId, organizationId: orgId },
          },
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
      this.showDeleteModal = true
    },
  },
}
</script>

<style scoped lang="scss">
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
  justify-content: center;
  padding: 0 0.5rem;
  border: var(--border-block, 1px solid var(--neutral-30));
  background-color: var(--primary-soft);
  margin: 0.5em;
  height: 50px;
}

.panel-header h3 {
  padding: 0;
  padding-left: 0.5rem;
}

.panel-header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0.5em;
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

@media only screen and (max-width: 1100px) {
  .media-explorer-right-panel {
    display: none;
  }
}
</style>

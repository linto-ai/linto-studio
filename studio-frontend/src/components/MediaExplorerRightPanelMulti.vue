<template>
  <div class="media-explorer-right-panel-multi flex col flex1">
    <!-- Selected medias preview -->
    <div class="selected-medias-preview">
      <div class="preview-header">
        <h4 class="section-title">
          {{ $t("media_explorer.panel.selected_medias") }}
        </h4>
        <Button
          @click="clearSelection"
          icon="minus-circle"
          size="sm"
          variant="tertiary" />
      </div>

      <div class="medias-list">
        <div
          v-for="media in selectedMedias"
          :key="media._id"
          class="media-preview-item">
          <Avatar
            :icon="isFromSession(media) ? 'microphone' : 'file-audio'"
            color="neutral-10"
            size="sm" />
          <div class="media-info">
            <span class="media-title">{{ media.title || media.name }}</span>
            <span class="media-date">{{ formatDate(media.created) }}</span>
            <div class="media-tags" v-if="getMediaTags(media).length > 0">
              <Tooltip
                v-for="tag in getMediaTags(media)"
                :key="tag._id"
                :text="tag.name"
                position="bottom">
                <div
                  class="tag-bullet"
                  :style="{ backgroundColor: tag.color || '#ccc' }"></div>
              </Tooltip>
            </div>
          </div>
          <Button
            @click="removeMediaFromSelection(media)"
            icon="minus-circle"
            size="sm"
            variant="tertiary" />
        </div>
      </div>
    </div>

    <!-- Bulk actions -->
    <div class="media-section bulk-actions">
      <h4 class="section-title">
        {{ $t("media_explorer.panel.bulk_actions") }}
      </h4>

      <div class="actions-container">
        <Button
          @click="handleBulkDownload"
          :loading="downloadLoading"
          :disabled="selectedMedias.length === 0"
          icon="download"
          variant="secondary"
          size="sm">
          {{
            downloadLoading
              ? $t("media_explorer.panel.downloading")
              : $t("media_explorer.panel.download_selected")
          }}
        </Button>
      </div>
    </div>

    <!-- Bulk tag management -->
    <div class="media-section bulk-tag-management">
      <h4 class="section-title">
        {{ $t("media_explorer.panel.manage_tags") }}
      </h4>

      <!-- Tag management mode -->
      <div class="actions-container">
        <InputSelector
          mode="tags"
          :tags="getTags"
          :selectedTagsIds="selectedTagsIds"
          @create="handleCreateAndAddTag"
          @add="handleAddTagToAll"
          @remove="handleRemoveTagFromAll"
          :readonly="readOnly"
          :placeholder="$t('media_explorer.panel.add_tag_to_all')" />
      </div>

      <!-- Read-only message when no common tags -->
      <div v-if="commonTags.length === 0" class="no-common-tags">
        <span class="no-tags-message">
          {{ $t("media_explorer.panel.no_common_tags") }}
        </span>
      </div>
    </div>

    <div
      class="media-section"
      v-if="!readOnly && getCurrentScope == 'organization'">
      <h4 class="section-title">
        {{ $t("media_explorer.panel.danger_zone") }}
      </h4>
      <div class="actions-container">
        <ConversationShareMultiple
          :selectedConversations="selectedMedias"
          :currentOrganizationScope="currentOrganizationScope" />
        <Button
          @click="handleDelete"
          :label="$t('media_explorer.delete')"
          icon="trash"
          variant="secondary"
          size="sm"
          intent="destructive" />
      </div>
    </div>

    <!-- Delete modal for multiple medias -->
    <ModalDeleteConversations
      :visible="showDeleteModal"
      :medias="selectedMedias"
      @close="handleDeleteModalClose"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { mediaScopeMixin } from "@/mixins/mediaScope"

import Avatar from "@/components/atoms/Avatar.vue"
import InputSelector from "@/components/atoms/InputSelector.vue"
import Tooltip from "@/components/atoms/Tooltip.vue"
import ModalDeleteConversations from "./ModalDeleteConversations.vue"
import ConversationShareMultiple from "./ConversationShareMultiple.vue"
import { mediaExplorerRightPanelMixin } from "@/mixins/mediaExplorerRightPanel.js"
import ChipTag from "./atoms/ChipTag.vue"

export default {
  name: "MediaExplorerRightPanelMulti",
  mixins: [mediaExplorerRightPanelMixin, mediaScopeMixin],
  components: {
    Avatar,
    InputSelector,
    Tooltip,
    ModalDeleteConversations,
    ConversationShareMultiple,
  },
  props: {
    selectedMedias: {
      type: Array,
      default: () => [],
    },
    selectedMediaIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      downloadLoading: false,
      bulkTitle: "",
      bulkDescription: "",
      showDeleteModal: false,
    }
  },
  computed: {
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    commonTags() {
      if (this.selectedMedias.length === 0) return []

      // Get tags that are present in ALL selected medias
      const allMediaTags = this.selectedMedias.map((media) => media.tags || [])

      if (allMediaTags.length === 0) return []

      // Find intersection of all tag arrays
      const commonTagIds = allMediaTags.reduce((common, mediaTags) => {
        return common.filter((tagId) => mediaTags.includes(tagId))
      }, allMediaTags[0])

      return commonTagIds
        .map((tagId) => this.getTagById(tagId))
        .filter((tag) => !!tag)
    },
  },
  methods: {
    clearSelection() {
      this.$emit("update:selectedMediaIds", [])
    },

    removeMediaFromSelection(media) {
      const newSelection = this.selectedMediaIds.filter((id) => id !== media._id)
      this.$emit("update:selectedMediaIds", newSelection)
    },

    handleBulkExport() {
      // TODO: Implement bulk export functionality
    },

    async handleCreateAndAddTag(tag) {
      if (this.isTagManagementReadOnly) return
      const newTag = await this.createAndAddTag(tag)
      await this.handleAddTagToAll(newTag)
    },

    async handleAddTagToAll(tag) {
      if (this.isTagManagementReadOnly) return
      // Filter medias that don't already have this tag
      const mediasToUpdate = this.selectedMedias.filter(
        (media) => !media.tags || !media.tags.includes(tag._id),
      )

      if (mediasToUpdate.length === 0) {
        // All selected medias already have this tag
        return
      }

      const promises = mediasToUpdate.map((media) =>
        this.addTagToMedia(tag, media._id),
      )
      await Promise.all(promises)
    },

    async handleRemoveTagFromAll(tag) {
      if (this.isTagManagementReadOnly) return
      // Filter medias that actually have this tag
      const mediasToUpdate = this.selectedMedias.filter(
        (media) => media.tags && media.tags.includes(tag._id),
      )

      if (mediasToUpdate.length === 0) {
        // No selected medias have this tag
        return
      }

      const promises = mediasToUpdate.map((media) =>
        this.removeTagFromMedia(tag, media._id),
      )
      await Promise.all(promises)
    },

    getMediaTags(media) {
      if (!media?.tags) return []
      return media.tags
        .map((tagId) => this.getTagById(tagId))
        .filter((tag) => !!tag)
    },

    async handleBulkTitleChange(newTitle) {
      if (!newTitle.trim() || this.selectedMedias.length === 0) return

      try {
        const promises = this.selectedMedias.map((media) =>
          this.updateMediaProperty(media._id, "title", newTitle),
        )
        await Promise.all(promises)

        this.$store.dispatch("system/addNotification", {
          type: "success",
          message: this.$t("media_explorer.panel.bulk_title_updated", {
            count: this.selectedMedias.length,
          }),
        })
        this.bulkTitle = ""
      } catch (error) {
        console.error("Bulk title update error:", error)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("media_explorer.panel.bulk_update_error"),
        })
      }
    },

    async handleBulkDescriptionChange(newDescription) {
      if (!newDescription.trim() || this.selectedMedias.length === 0) return

      try {
        const promises = this.selectedMedias.map((media) =>
          this.updateMediaProperty(media._id, "description", newDescription),
        )
        await Promise.all(promises)

        this.$store.dispatch("system/addNotification", {
          type: "success",
          message: this.$t("media_explorer.panel.bulk_description_updated", {
            count: this.selectedMedias.length,
          }),
        })
        this.bulkDescription = ""
      } catch (error) {
        console.error("Bulk description update error:", error)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("media_explorer.panel.bulk_update_error"),
        })
      }
    },

    async handleBulkDownload() {
      if (this.downloadLoading || this.selectedMedias.length === 0) return

      this.downloadLoading = true

      try {
        const results = await this.downloadMultipleMediaFiles(
          this.selectedMedias,
        )
        const successCount = results.filter((r) => r.success).length
        const totalCount = results.length

        if (successCount === totalCount) {
          // All downloads successful
          this.$store.dispatch("system/addNotification", {
            type: "success",
            message: this.$t("media_explorer.panel.download_multiple_success", {
              count: successCount,
            }),
          })
        } else if (successCount > 0) {
          // Partial success
          this.$store.dispatch("system/addNotification", {
            type: "warning",
            message: this.$t("media_explorer.panel.download_multiple_partial", {
              success: successCount,
              total: totalCount,
            }),
          })
        } else {
          // All failed
          this.$store.dispatch("system/addNotification", {
            type: "error",
            message: this.$t("media_explorer.panel.download_multiple_error"),
          })
        }
      } catch (error) {
        console.error("Bulk download error:", error)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("media_explorer.panel.download_multiple_error"),
        })
      } finally {
        this.downloadLoading = false
      }
    },

    handleDelete() {
      this.showDeleteModal = true
    },

    handleDeleteModalClose() {
      this.showDeleteModal = false
    },

    handleDeleteConfirm() {
      // The deletion is handled by the modal component
      this.showDeleteModal = false
      // Clear selection after deletion
      this.clearSelection()
    },

    handleDeleteCancel() {
      this.showDeleteModal = false
    },
  },
}
</script>

<style scoped>
.media-explorer-right-panel-multi {
  padding: 1rem;
  gap: 1.5rem;
  overflow-y: auto;
}

.media-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-primary, #222);
  line-height: 1.2;
  margin: 0;
}

.section-content {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary, #000);
  line-height: 1.4;
}

.actions-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.selection-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--primary-soft);
  border-radius: 8px;
  border: 1px solid var(--primary-color);
}

.summary-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.selected-medias-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.medias-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 1rem;
}

.media-preview-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--background-tertiary);
  border-radius: 6px;
  border: 1px solid var(--neutral-20);
}

.media-info {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  flex: 1;
  min-width: 0;
}

.media-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.media-tags {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.tag-bullet {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.tag-bullet:hover {
  transform: scale(1.2);
}

.bulk-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.actions-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.actions-grid {
  display: flex;
  gap: 0.5rem;
}

.action-item {
  display: flex;
  width: 100%;
}

.bulk-tag-management {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.common-tags {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.common-tags-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.no-common-tags {
  padding: 0.75rem;
  text-align: center;
}

.no-tags-message {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  font-style: italic;
}

.bulk-property-editing {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.property-editors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.property-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.bulk-property-input {
  width: 100%;
}
</style>

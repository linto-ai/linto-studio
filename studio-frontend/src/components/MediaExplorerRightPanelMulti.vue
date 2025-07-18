<template>
  <div class="media-explorer-right-panel-multi">
    <!-- Selected medias preview -->
    <div class="selected-medias-preview">
      <div class="preview-header">
        <h4 class="preview-title">
          {{ $t("media_explorer.panel.selected_medias") }}
        </h4>
        <Button @click="clearSelection" icon="x" size="sm" variant="outline" />
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
          </div>
          <Button
            @click="removeMediaFromSelection(media)"
            icon="x"
            size="xs"
            variant="outline" />
        </div>
      </div>
    </div>

    <!-- Bulk tag management -->
    <div class="bulk-tag-management">
      <h4 class="actions-title">
        {{ $t("media_explorer.panel.manage_tags") }}
      </h4>

      <div class="tag-actions">
        <InputSelector
          mode="tags"
          :tags="getTags"
          :selected-tags="[]"
          @create="handleCreateAndAddTag"
          @add="handleAddTagToAll"
          :placeholder="$t('media_explorer.panel.add_tag_to_all')" />
      </div>

      <!-- Common tags -->
      <div v-if="commonTags.length > 0" class="common-tags">
        <h5 class="common-tags-title">
          {{ $t("media_explorer.panel.common_tags") }}
        </h5>
        <div class="tags-container">
          <ChipTag
            v-for="tag in commonTags"
            :key="tag._id"
            :name="tag.name"
            :color="tag.color"
            removable
            @remove="handleRemoveTagFromAll(tag)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import Button from "@/components/atoms/Button.vue"
import Badge from "@/components/atoms/Badge.vue"
import Avatar from "@/components/atoms/Avatar.vue"
import InputSelector from "@/components/atoms/InputSelector.vue"
import ModalDeleteConversations from "./ModalDeleteConversations.vue"
import ConversationShareMultiple from "./ConversationShareMultiple.vue"
import { mediaExplorerRightPanelMixin } from "@/mixins/mediaExplorerRightPanel.js"
import ChipTag from "./atoms/ChipTag.vue"

export default {
  name: "MediaExplorerRightPanelMulti",
  mixins: [mediaExplorerRightPanelMixin],
  components: {
    Button,
    Badge,
    Avatar,
    InputSelector,
    ModalDeleteConversations,
    ConversationShareMultiple,
  },
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters("user", { userInfo: "getUserInfos" }),
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
      this.$store.dispatch("inbox/clearSelectedMedias")
    },

    removeMediaFromSelection(media) {
      this.$store.commit("inbox/removeSelectedMedia", media)
    },

    handleBulkExport() {
      // TODO: Implement bulk export functionality
      console.log("Bulk export not implemented yet")
    },

    async handleCreateAndAddTag(tag) {
      const newTag = await this.createAndAddTag(tag)
      await this.handleAddTagToAll(newTag)
    },

    async handleAddTagToAll(tag) {
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
  },
}
</script>

<style scoped>
.media-explorer-right-panel-multi {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
  gap: 1.5rem;
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
  gap: 0.25rem;
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

.bulk-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.actions-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-item {
  display: flex;
  width: 100%;
}

.action-button {
  width: 100%;
  justify-content: flex-start;
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
</style>

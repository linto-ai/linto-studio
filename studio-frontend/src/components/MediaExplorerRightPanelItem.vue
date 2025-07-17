<template>
  <div class="media-explorer-right-panel-item">
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
            {{ formatDate(selectedMedia.created, { month: 'long', hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>

        <!-- Media duration (alternative) -->
        <div class="media-section" v-if="selectedMedia.metadata?.au">
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
              mode="tags"
              :tags="getTags"
              :selected-tags="selectedMediaTags"
              @create="handleCreateTag"
              @remove="handleRemoveTag"
              @add="handleAddTag" />
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

    <ModalDeleteConversations
      :visible="showDeleteModal"
      :medias="[selectedMedia]"
      @close="showDeleteModal = false" />
  </div>
</template>

<script>
import TimeDuration from "@/components/atoms/TimeDuration.vue"
import InputSelector from "@/components/atoms/InputSelector.vue"
import ModalDeleteConversations from "./ModalDeleteConversations.vue"
import { mediaExplorerRightPanelMixin } from "@/mixins/mediaExplorerRightPanel.js"

export default {
  name: "MediaExplorerRightPanelItem",
  mixins: [mediaExplorerRightPanelMixin],
  components: {
    TimeDuration,
    InputSelector,
    ModalDeleteConversations,
  },
  props: {
    selectedMedia: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      showDeleteModal: false,
    }
  },
  computed: {
    reactiveSelectedMedia() {
      if (!this.selectedMedia?._id) return null
      return this.$store.getters["inbox/getMediaById"](this.selectedMedia._id)
    },
    selectedMediaTags() {
      const media = this.reactiveSelectedMedia
      if (!media?.tags) return []
      return media.tags
        .map((tagId) => this.getTagById(tagId))
        .filter((tag) => !!tag)
    },
  },
  methods: {
    async handleCreateTag(tag) {
      await this.createAndAddTag(tag, this.selectedMedia._id)
    },

    async handleRemoveTag(tag) {
      await this.removeTagFromMedia(tag, this.selectedMedia._id)
    },

    async handleAddTag(tag) {
      await this.addTagToMedia(tag, this.selectedMedia._id)
    },

    handleDelete() {
      this.showDeleteModal = true
    },
  },
}
</script>

<style scoped>
.media-explorer-right-panel-item {
  display: flex;
  flex-direction: column;
  height: 100%;
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
</style>

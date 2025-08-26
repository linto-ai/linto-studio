<template>
  <div class="media-explorer-right-panel-item">
    <!-- Media overview content -->
    <div class="panel-body">
      <div class="media-overview">
        <!-- Media title -->
        <div class="media-section">
          <FormInput
            inputFullWidth
            :field="titleField"
            v-model="titleField.value"
            with-confirmation
            @on-confirm="handleTitleUpdate" />
        </div>

        <!-- Media description -->
        <div class="media-section">
          <FormInput
            inputFullWidth
            :field="descriptionField"
            v-model="descriptionField.value"
            textarea
            with-confirmation
            @on-confirm="handleDescriptionUpdate" />
        </div>

        <!-- Media duration -->
        <div
          class="media-section"
          v-if="reactiveSelectedMedia?.metadata?.audio?.duration">
          <h4 class="section-title">
            {{ $t("media_explorer.panel.duration") }}
          </h4>
          <p class="section-content">
            <TimeDuration
              :duration="reactiveSelectedMedia.metadata?.audio?.duration" />
          </p>
        </div>

        <!-- Media creation date -->
        <div class="media-section" v-if="reactiveSelectedMedia?.created">
          <h4 class="section-title">
            {{ $t("media_explorer.panel.created") }}
          </h4>
          <p class="section-content">
            {{
              formatDate(reactiveSelectedMedia.created, {
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })
            }}
          </p>
        </div>

        <!-- Media duration (alternative) -->
        <div class="media-section" v-if="reactiveSelectedMedia?.metadata?.au">
          <h4 class="section-title">
            {{ $t("media_explorer.panel.duration") }}
          </h4>
          <p class="section-content">
            {{ formatDuration(reactiveSelectedMedia.duration) }}
          </p>
        </div>

        <!-- Media tags -->
        <div class="media-section">
          <h4 class="section-title">{{ $t("media_explorer.panel.tags") }}</h4>
          <div class="tags-container">
            <InputSelector
              v-if="!isTagManagementReadOnly"
              mode="tags"
              :tags="getTags"
              :selected-tags="selectedMediaTags"
              @create="handleCreateTag"
              @remove="handleRemoveTag"
              @add="handleAddTag" />
            <div v-else class="tags-readonly">
              <ChipTag
                v-for="tag in selectedMediaTags"
                :key="tag._id"
                :name="tag.name"
                :color="tag.color" />
              <span
                v-if="selectedMediaTags.length === 0"
                class="no-tags-message">
                {{ $t("media_explorer.panel.no_tags") }}
              </span>
            </div>
          </div>
        </div>

        <!-- Media metadata -->
        <div v-if="false" class="media-section">
          <h4 class="section-title">
            {{ $t("media_explorer.panel.metadata") }}
          </h4>
          <div class="metadata-grid">
            <div
              v-for="(value, key) in reactiveSelectedMedia?.metadata"
              :key="key"
              class="metadata-item">
              <span class="metadata-key">{{ key }}:</span>
              <span class="metadata-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- Actions section -->
        <div class="media-section">
          <h4 class="section-title">
            {{ $t("media_explorer.panel.actions") }}
          </h4>
          <div class="actions-container">
            <Button
              @click="handleDownload"
              :loading="downloadLoading"
              icon="download"
              variant="outline"
              size="sm"
              class="action-button">
              {{
                downloadLoading
                  ? $t("media_explorer.panel.downloading")
                  : $t("media_explorer.panel.download_media")
              }}
            </Button>
          </div>
        </div>

        <div class="media-section">
          <h4 class="section-title">
            {{ $t("media_explorer.panel.danger_zone") }}
          </h4>
          <div class="actions-container">
            <ConversationShareMultiple
              class="header-action-button"
              :selectedConversations="[reactiveSelectedMedia || selectedMedia]"
              :currentOrganizationScope="currentOrganizationScope" />
            <Button
              @click="handleDelete"
              :label="$t('media_explorer.delete')"
              icon="trash"
              variant="outline"
              size="sm"
              color="tertiary"
              class="header-action-button" />
          </div>
        </div>
      </div>
    </div>

    <ModalDeleteConversations
      :visible="showDeleteModal"
      :medias="[reactiveSelectedMedia || selectedMedia]"
      @close="showDeleteModal = false" />
  </div>
</template>

<script>
import { mediaScopeMixin } from "@/mixins/mediaScope"

import TimeDuration from "@/components/atoms/TimeDuration.vue"
import InputSelector from "@/components/atoms/InputSelector.vue"
import ChipTag from "@/components/atoms/ChipTag.vue"
import Button from "@/components/atoms/Button.vue"
import ModalDeleteConversations from "./ModalDeleteConversations.vue"
import { mediaExplorerRightPanelMixin } from "@/mixins/mediaExplorerRightPanel.js"
import FormInput from "@/components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import ConversationShareMultiple from "./ConversationShareMultiple.vue"
import { mapGetters } from "vuex"

export default {
  name: "MediaExplorerRightPanelItem",
  mixins: [mediaExplorerRightPanelMixin, mediaScopeMixin],
  components: {
    TimeDuration,
    InputSelector,
    ChipTag,
    Button,
    ModalDeleteConversations,
    FormInput,
    ConversationShareMultiple,
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
      downloadLoading: false,
      titleField: {
        ...EMPTY_FIELD,
        value: "",
        label: this.$t("media_explorer.panel.title"),
        placeholder: this.$t("media_explorer.panel.default_title"),
      },
      descriptionField: {
        ...EMPTY_FIELD,
        value: "",
        label: this.$t("media_explorer.panel.description"),
        placeholder: this.$t("media_explorer.panel.default_description"),
      },
    }
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    reactiveSelectedMedia() {
      return this.selectedMedia
    },
    selectedMediaTags() {
      const media = this.reactiveSelectedMedia
      if (!media?.tags) return []
      return media.tags
        .map((tagId) => this.getTagById(tagId))
        .filter((tag) => !!tag)
    },
  },
  watch: {
    reactiveSelectedMedia: {
      immediate: true,
      deep: true,
      handler(newMedia, oldMedia) {
        if (newMedia) {
          // Only update fields if the media actually changed or if it's the initial load
          if (
            !oldMedia ||
            newMedia._id !== oldMedia._id ||
            newMedia.name !== oldMedia.name ||
            newMedia.description !== oldMedia.description
          ) {
            this.titleField.value = newMedia.name || ""
            this.descriptionField.value = newMedia.description || ""
          }
        } else {
          this.titleField.value = ""
          this.descriptionField.value = ""
        }
      },
    },
  },
  mounted() {
    this.initFields()
  },
  methods: {
    initFields() {
      if (this.reactiveSelectedMedia) {
        this.titleField.value =
          this.reactiveSelectedMedia.title ||
          this.reactiveSelectedMedia.name ||
          ""
        this.descriptionField.value =
          this.reactiveSelectedMedia.description || ""
      }
    },

    async handleCreateTag(tag) {
      if (this.isTagManagementReadOnly) return
      await this.createAndAddTag(tag, this.selectedMedia._id)
    },

    async handleRemoveTag(tag) {
      if (this.isTagManagementReadOnly) return
      await this.removeTagFromMedia(tag, this.selectedMedia._id)
    },

    async handleAddTag(tag) {
      if (this.isTagManagementReadOnly) return
      await this.addTagToMedia(tag, this.selectedMedia._id)
    },

    handleDelete() {
      this.showDeleteModal = true
    },

    async handleTitleUpdate() {
      if (!this.selectedMedia?._id) return
      const trimmedTitle = this.titleField.value?.trim() || ""
      try {
        await this.updateMediaProperty(
          this.selectedMedia._id,
          "name",
          trimmedTitle,
        )

        // Force update of the title field from the store
        this.$nextTick(() => {
          const updatedMedia = this.reactiveSelectedMedia
          if (updatedMedia) {
            this.titleField.value = updatedMedia.name || ""
          }
        })

        this.$store.dispatch("system/addNotification", {
          type: "success",
          message: this.$t("media_explorer.panel.title_updated"),
        })
      } catch (error) {
        console.error("Title update error:", error)

        // Revert title field on error
        this.$nextTick(() => {
          const currentMedia = this.reactiveSelectedMedia
          if (currentMedia) {
            this.titleField.value = currentMedia.name || ""
          }
        })

        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("media_explorer.panel.update_error"),
        })
      }
    },

    async handleDescriptionUpdate() {
      if (!this.selectedMedia?._id) return
      const trimmedDescription = this.descriptionField.value?.trim() || ""
      try {
        await this.updateMediaProperty(
          this.selectedMedia._id,
          "description",
          trimmedDescription,
        )

        // Force update of the description field from the store
        this.$nextTick(() => {
          const updatedMedia = this.reactiveSelectedMedia
          if (updatedMedia) {
            this.descriptionField.value = updatedMedia.description || ""
          }
        })

        this.$store.dispatch("system/addNotification", {
          type: "success",
          message: this.$t("media_explorer.panel.description_updated"),
        })
      } catch (error) {
        console.error("Description update error:", error)

        // Revert description field on error
        this.$nextTick(() => {
          const currentMedia = this.reactiveSelectedMedia
          if (currentMedia) {
            this.descriptionField.value = currentMedia.description || ""
          }
        })

        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("media_explorer.panel.update_error"),
        })
      }
    },

    async handleDownload() {
      if (this.downloadLoading || !this.reactiveSelectedMedia) return

      this.downloadLoading = true

      try {
        const success = await this.downloadMediaFile(this.reactiveSelectedMedia)

        if (success) {
          // Show success notification
          this.$store.dispatch("system/addNotification", {
            type: "success",
            message: this.$t("media_explorer.panel.download_success"),
          })
        } else {
          // Show error notification
          this.$store.dispatch("system/addNotification", {
            type: "error",
            message: this.$t("media_explorer.panel.download_error"),
          })
        }
      } catch (error) {
        console.error("Download error:", error)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("media_explorer.panel.download_error"),
        })
      } finally {
        this.downloadLoading = false
      }
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

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tags-readonly {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.no-tags-message {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  font-style: italic;
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

.actions-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-button {
  justify-content: flex-start;
}

.section-content-input {
  margin: 0;
}
</style>

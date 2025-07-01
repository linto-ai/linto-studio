<template>
  <Box class="tag-box p-0" type="shadow" @click.stop>
    <div class="tag-box__content">
      <div class="tag-box__header">
        <div class="tag-box__header-title">
          <ph-icon name="tag-simple" weight="bold" />
          <span class="tag-box__header-title-text">
            Media tags
          </span>
        </div>
      </div>
      <div class="tax-box-search">
        <input
          v-model="search"
          type="text"
          class="tag-box__search-input"
          placeholder="Rechercher un tag..." />
        <ModalTagManagement>
          <template #trigger="{ open }">
            <button
              v-if="showManageButton"
              class="tag-box__button outline primary xs with-icon"
              @click="open">
              <ph-icon name="tags" weight="bold" />
              <span class="tag-box__button-text">Manage tags</span>
            </button>
          </template>
        </ModalTagManagement>
      </div>
      <hr />
      <div v-if="tagsObjects.length" class="tags-selection">
        <div
          v-for="tag in tagsObjects"
          :key="tag._id"
          class="tags-selection__tag"
          :class="{ 'tags-selection__tag--selected': selectedTagsIds.includes(tag._id) }"
          @click="onTagClick(tag)">
          <span class="tags-selection__tag-meta">
            <Avatar
              :name="tag.name"
              :emoji="tag.emoji"
              :color="tag.color"
              size="sm" />
            <span
              class="tag-box__selected-tag-name"
              :style="{ color: `var(--material-${tag.color}-900)` }">
              {{ tag.name }}
            </span>
          </span>
          <Button
            class="icon-only"
            :icon="selectedTagsIds.includes(tag._id) ? 'minus-circle' : 'plus-circle'"
            variant="outline"
            :color="selectedTagsIds.includes(tag._id) ? 'tertiary-hard' : 'neutral-hard'"
            size="xs"/>
        </div>
      </div>
    </div>
  </Box>
</template>

<script>
import { mapState } from "vuex"
import ChipTag from "@/components/atoms/ChipTag.vue"

export default {
  name: "MediaExplorerItemTagBox",
  components: {
    ChipTag,
  },
  props: {
    mediaId: {
      type: String,
    },
    selectedTags: {
      type: Array,
      required: false,
      default: () => [],
    },
    showManageButton: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: "",
      loadingTagId: null,
    }
  },
  computed: {
    ...mapState("tags", {
      categories: (state) => state.categories,
      tags: (state) => state.tags,
    }),
    media() {
      return this.mediaId
        ? this.$store.getters["inbox/getMediaById"](this.mediaId)
        : null
    },
    tagsObjects() {
      const tags = this.filteredTags.map((tag) => ({
        ...tag,
        color: this.getTagColor(tag),
        active: this.selectedTagsIds.includes(tag._id),
      }))

      // Active tags first
      return tags.sort((a, b) => b.active - a.active)
    },
    orderedTags() {
      return [...this.tags].sort((a, b) => a.name.localeCompare(b.name))
    },
    orderedMediaTags() {
      if (!this.media || !this.media.tags) return []
      return [...this.media.tags]
        .map((tagId) => this.tags.find((t) => t._id === tagId))
        .filter((tag) => tag !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name))
    },
    filteredTags() {
      if (!this.search) return this.orderedTags
      const searchLower = this.search.toLowerCase()
      return this.orderedTags.filter((tag) => {
        const nameMatch =
          tag.name && tag.name.toLowerCase().includes(searchLower)
        const emojiMatch =
          tag.emoji && tag.emoji.toLowerCase().includes(searchLower)
        return nameMatch || emojiMatch
      })
    },
    selectedTagsObjects() {
      return this.orderedMediaTags.filter(
        (tag) => tag && this.selectedTagsIds.includes(tag._id),
      )
    },
    unselectedTagsObjects() {
      return this.filteredTags.filter(
        (tag) => !this.selectedTagsIds.includes(tag._id),
      )
    },
    selectedTagsIds() {
      if (this.selectedTags.length) {
        return [...this.selectedTags]
      }
      return this.media?.tags || []
    },
  },
  methods: {
    getTagColor(tag) {
      return tag.color || "var(--neutral-20)"
    },
    async onTagClick(tag) {
      // Always emit the event for parent components that need it
      this.$emit("tag-click", tag)

      // If we have a mediaId, also handle the tag management automatically
      if (this.mediaId) {
        if (this.loadingTagId) return
        this.loadingTagId = tag._id
        try {
          if (this.selectedTagsIds.includes(tag._id)) {
            await this.$store.dispatch("tags/removeTagFromMedia", {
              mediaId: this.mediaId,
              tagId: tag._id,
            })
          } else {
            await this.$store.dispatch("tags/addTagToMedia", {
              mediaId: this.mediaId,
              tagId: tag._id,
            })
          }
        } finally {
          this.loadingTagId = null
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tag-box {
  max-width: 100%;

  hr {
    margin: 0.25em 0;
    margin-bottom: 0;
    background-color: var(--primary-soft);
    border: none;
    height: 1px;
  }

  &__footer {
    padding: 0.25em;
    text-align: right;
  }

  &__create-content {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }
}

.tag-box__content {
  .selected-tags {
    padding: 0.25em;
    flex-direction: column;
    display: flex;
    gap: 0.25em;
    align-items: flex-start;
    border-bottom: 1px solid var(--primary-color);
    background-color: var(--primary-soft);
    align-items: center;
    max-height: 200px;
    overflow-y: auto;

    .tag-box__selected-tags-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
  }
}

.tag-box__separator {
  width: 100%;
  height: 1px;
  background: var(--neutral-30);
  margin: 0.25em 0 0.25em 0;
}

.tags-selection {
  padding: 0.25em;
  flex-direction: column;
  display: flex;
  gap: 0.25em;
  align-items: flex-start;
  max-height: 240px;
  overflow-y: auto;

  &__tag {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.25em;
    text-transform: uppercase;
    padding: 0.25em;
    background-color: var(--background-primary);
    border: 1px solid var(--neutral-20);
    border-radius: 2px;
    cursor: pointer;

    &--selected {
      background-color: var(--primary-soft);
      border-color: var(--primary-color);
    }

    &-meta {
      display: flex;
      align-items: center;
      gap: 0.25em;
      font-size: 0.9em;
    }
  }
}

.tag-box__header {
  display: flex;
  align-items: center;
  padding: 0.25em;
  border-bottom: 1px solid var(--primary-color);
  background-color: var(--primary-color);
  color: var(--primary-soft);
  font-size: 0.9em;
  font-weight: 600;
}

.tag-box__footer {
  border-top: 1px solid var(--primary-color);
}

.chip-tag__spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid var(--primary-color);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.tax-box-search {
}
.tag-box__search-input {
  width: 100%;
  max-width: 100%;
  border: none;
  border-bottom: 1px solid var(--primary-color);
  border-radius: 0;
  box-sizing: border-box;
  font-size: 0.9em;
  height: auto;
  padding: 0.25em;
}
.tag-box__search-input:focus {
  border-color: var(--primary-color);
}
</style>

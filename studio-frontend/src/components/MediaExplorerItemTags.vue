<template>
  <div class="media-explorer-item-tags">
    <!-- Tags list -->
    <div v-if="mediatags.length > 0" class="media-explorer-item-tags__container">
      <div class="media-explorer-item-tags__list">
        <Tooltip
          v-for="tag in visibleTags"
          :key="`${mediaId}-tag-${tag._id}`"
          :text="tag.description || tag.name"
          position="bottom">
          <ChipTag
            :name="tag.name"
            :emoji="tag.emoji"
            :color="getTagColor(tag)"
            @click="handleTagClick(tag)"
            size="xs" />
        </Tooltip>
        
        <!-- +N bubble for hidden tags -->
        <Tooltip
          v-if="hiddenCount > 0"
          :text="hiddenTagsTooltip"
          position="bottom">
          <button 
            class="media-explorer-item-tags__more"
            @click.stop="toggleShowAll"
            :title="`${hiddenCount} ${$t('media_explorer.tags.more_tags')}`">
            +{{ hiddenCount }}
          </button>
        </Tooltip>
      </div>
    </div>
    
    <!-- Empty state or add button -->
    <div 
      v-else 
      class="media-explorer-item-tags__empty">
      <span class="media-explorer-item-tags__empty-text">
        {{ $t('media_explorer.tags.no_tags') }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Modal from "./molecules/Modal.vue"
import MediaExplorerItemTagBox from "./MediaExplorerItemTagBox.vue"

export default {
  name: "MediaExplorerItemTags",
  components: {
    Modal,
    MediaExplorerItemTagBox,
  },
  props: {
    maxVisible: {
      type: Number,
      default: 3,
    },
    mediaId: {
      type: String,
      required: true,
    },
    hovered: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingTagId: null,
      showAllTags: false,
    }
  },
  computed: {
    visibleTags() {
      // Only show up to maxVisible tags
      return this.showAllTags
        ? this.mediatags
        : this.mediatags.slice(0, this.maxVisible)
    },
    hiddenCount() {
      // Number of hidden tags
      return this.showAllTags
        ? 0
        : this.mediatags.length > this.maxVisible
          ? this.mediatags.length - this.maxVisible
          : 0
    },
    hiddenTags() {
      // Tags not shown
      return this.showAllTags
        ? this.mediatags
        : this.mediatags.slice(this.maxVisible)
    },
    hiddenTagsTooltip() {
      // Tooltip for the "+N" pill
      return this.hiddenTags.map((t) => t.name).join(", ")
    },
    ...mapState("tags", {
      tags: (state) => state.tags,
    }),
    medias() {
      return [...this.$store.state.inbox.medias]
    },
    media() {
      return this.$store.getters["inbox/getMediaById"](this.mediaId)
    },
    mediatags() {
      return this.media.tags
        .map((tagId) => this.tags.find((t) => t._id === tagId))
        .filter((t) => t !== undefined)
    },
    mediatagsIds() {
      return [...this.mediatags.map((tag) => tag._id)]
    },
  },
  methods: {
    getTagTooltip(tag) {
      return tag.name
    },
    getTagColor(tag) {
      return tag.color || "var(--neutral-20)"
    },
    handleTagClick(tag) {
      if (this.$store.getters["tags/isExploreSelectedTag"](tag._id)) {
        this.$store.dispatch("tags/removeExploreSelectedTag", tag)
      } else {
        this.$store.dispatch("tags/addExploreSelectedTag", tag)
      }
    },
    toggleShowAll(event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.showAllTags = !this.showAllTags
    },
    displayIfEmoji(tag) {
      return this.unifiedToEmoji(tag.emoji)
    },
    unifiedToEmoji(unified) {
      if (!unified) return ""
      return unified
        .split("-")
        .map((u) => String.fromCodePoint(parseInt(u, 16)))
        .join("")
    },
  },
}
</script>

<style lang="scss">
.media-explorer-item-tags {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0; // Allow shrinking

  &__container {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
  }

  &__list {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: nowrap;
    overflow: hidden;
    width: 100%;
    min-width: 0;

    > * {
      flex-shrink: 0;
    }
  }

  &__more {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 18px;
    padding: 0 0.25rem;
    border: 1px solid var(--neutral-30);
    background-color: var(--neutral-20);
    color: var(--text-secondary);
    border-radius: 9px;
    font-size: 0.7rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover {
      background-color: var(--neutral-30);
      border-color: var(--neutral-40);
      color: var(--text-primary);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;

    &-text {
      font-size: 0.75rem;
      color: var(--neutral-50);
      font-style: italic;
    }
  }
}

@media only screen and (max-width: 1100px) {
  .media-explorer-item-tags {
    &__list {
      gap: 0.15rem;
    }

    &__more {
      min-width: 20px;
      height: 16px;
      font-size: 0.65rem;
    }
  }
}

@media only screen and (max-width: 768px) {
  .media-explorer-item-tags {
    &__list {
      gap: 0.1rem;
    }

    &__more {
      min-width: 18px;
      height: 14px;
      font-size: 0.6rem;
      padding: 0 0.15rem;
    }
  }
}
</style>
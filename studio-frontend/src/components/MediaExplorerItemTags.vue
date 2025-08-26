<template>
  <div class="media-explorer-item-tags" :class="{ 'mobile-view': mobileView }">
    <!-- Tags list with limited visibility -->
    <Tooltip
      v-for="tag in visibleTags"
      :key="`${media._id}-tag-${tag._id}`"
      :text="tag.description || tag.name"
      class="media-explorer-item-tags__tag"
      position="bottom">
      <ChipTag
        :name="tag.name"
        :emoji="tag.emoji"
        :color="getTagColor(tag)"
        :mobile-view="mobileView"
        @click="handleTagClick(tag)"
        size="xs" />
    </Tooltip>

    <!-- Show "+N" indicator for hidden tags -->
    <Tooltip
      v-if="hiddenCount > 0"
      :text="hiddenTagsTooltip"
      class="media-explorer-item-tags__more"
      position="bottom">
      <div class="media-explorer-item-tags__more-indicator">
        +{{ hiddenCount }}
      </div>
    </Tooltip>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "MediaExplorerItemTags",
  components: {},
  props: {
    maxVisible: {
      type: Number,
      default: 2,
    },
    media: {
      type: Object,
      required: true,
    },
    hovered: {
      type: Boolean,
      default: false,
    },
    mobileView: {
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
    mediatags() {
      if (!this.media || !this.media.tags) {
        return []
      }
      return this.media.tags
        .map((tagId) => this.$store.getters["tags/getTagById"](tagId))
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
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;

  &.mobile-view {
    flex-wrap: nowrap;
    overflow: hidden;
    gap: 0.25rem;
  }
}

.media-explorer-item-tags__tag {
  display: inline-flex;
  flex-shrink: 0;
}

.media-explorer-item-tags__more {
  display: inline-flex;
  flex-shrink: 0;
}

.media-explorer-item-tags__more-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 0.625rem;
  font-weight: 600;
  background-color: var(--neutral-20);
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: help;

  &:hover {
    background-color: var(--neutral-30);
  }
}
</style>

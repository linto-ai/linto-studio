<template>
  <div class="media-explorer-item-tags">
    <!-- Tags list -->

    <Tooltip
      v-for="tag in mediatags"
      :key="`${mediaId}-tag-${tag._id}`"
      :text="tag.description || tag.name"
      class="media-explorer-item-tags__tag"
      position="bottom">
      <ChipTag
        :name="tag.name"
        :emoji="tag.emoji"
        :color="getTagColor(tag)"
        @click="handleTagClick(tag)"
        size="xs" />
    </Tooltip>

    <!-- Empty state or add button -->
    <!-- <div 
      v-else 
      class="media-explorer-item-tags__empty">
      <span class="media-explorer-item-tags__empty-text">
        {{ $t('media_explorer.tags.no_tags') }}
      </span>
    </div> -->
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
.media-explorer-item-tags__tag {
  display: inline-flex;
  margin-left: 0.25rem;
  margin-bottom: 0.25rem;
}
</style>

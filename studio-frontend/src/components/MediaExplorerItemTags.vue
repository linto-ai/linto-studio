<template>
  <span
    class="media-explorer-item-tags"
    :class="{ 'media-explorer-item-tags--empty': mediatags.length === 0 }"
    @click.stop>
    <span class="media-explorer-item-tags__actions">
      <Popover trigger="click" :track-mouse="false" position="bottom" overlay width="280px">
        <template #trigger>
          <Button
            class="neutral outline icon-only"
            icon="tag"
            variant="outline"
            size="sm"
            @mouseenter.prevent
            @mouseleave.prevent />
        </template>
        <template #content>
          <MediaExplorerItemTagBox 
            :media-id="mediaId" 
            :show-manage-button="false" />
        </template>
      </Popover>
    </span>
    <span v-if="mediatags.length === 0" class="media-explorer-item-tags__empty">
      add tags
    </span>
    <span v-if="mediatags.length > 0" class="media-explorer-item-tags__list">
      <Tooltip :key="`${mediaId}-tag-${tag._id}`" v-for="tag in mediatags" :text="tag.name">
        <ChipTag
          :name="loadingTagId === tag._id ? '' : tag.name"
          :emoji="tag.emoji"
          :color="getTagColor(tag)"
          :class="{ 'is-loading': loadingTagId === tag._id }">
          <span
            v-if="loadingTagId === tag._id"
            class="chip-tag__spinner"></span>
        </ChipTag>
      </Tooltip>
    </span>
  </span>
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
    async handleTagClick(tag) {
      if (this.loadingTagId) return
      this.loadingTagId = tag._id

      const isTagInMedia = this.mediatagsIds.includes(tag._id)

      try {
        if (isTagInMedia) {
          console.log("remove tag", tag._id)
          await this.$store.dispatch("tags/removeTagFromMedia", {
            mediaId: this.mediaId,
            tagId: tag._id,
          })
        } else {
          console.log("add tag", tag, tag._id)
          await this.$store.dispatch("tags/addTagToMedia", {
            mediaId: this.mediaId,
            tagId: tag._id,
          })
        }
      } finally {
        this.loadingTagId = null
      }
    },
    handleTagMore(event) {
      event.preventDefault()
      event.stopPropagation()
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
  gap: 0.5em;
  border: 1px solid var(--neutral-20);
  background: var(--neutral-10);
  border-radius: 4px;
  padding: 0.5em 0.25em;
  overflow: hidden;
  border: 1px solid transparent;

  &:hover {
    border-color: var(--neutral-40);
  }

  &__empty {
    font-size: 0.9em;
    color: var(--neutral-60);
    display: inline-block;
    padding-right: 0.25em;
  }

  &__list {
    display: flex;
    gap: 0.5em;
    align-items: center;
    flex-wrap: wrap;

    & > *,
    .popover-trigger {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__actions {
    box-sizing: border-box;
    display: flex;
    gap: 0.5em;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;
  }

  &--empty {
    height: 18px;
  }
}

.tag--add {
  position: relative;
}
</style>

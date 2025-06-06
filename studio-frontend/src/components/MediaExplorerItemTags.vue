<template>
  <span
    class="media-explorer-item-tags"
    :class="{ 'media-explorer-item-tags--empty': mediatags.length === 0 }"
    @click.stop>
    <span v-if="mediatags.length > 0" class="media-explorer-item-tags__list">
      <span
        class="tag"
        v-for="tag in mediatags"
        :key="tag._id"
        :style="{ backgroundColor: getTagColor(tag) }"
        :data-info="tag.name"
        @mouseenter.prevent
        @mouseleave.prevent
        @click.prevent="(event) => handleTagClick(event, tag)">
        <span class="tag__name">{{ displayIfEmoji(tag) }}</span>
        <span class="tag__delete">
          <ph-icon name="x" color="var(--neutral-80)" size="12" weight="bold" />
        </span>
      </span>
    </span>
    <span class="media-explorer-item-tags__actions">
      <!-- Popover for add tag button -->
      <Popover trigger="click" :track-mouse="false" position="bottom" overlay>
        <template #trigger>
          <button
            class="tag--add btn sm icon-only primary outline"
            @mouseenter.prevent
            @mouseleave.prevent>
            <ph-icon name="tag" />
          </button>
        </template>
        <template #content>
          <!-- Tag selector popover content -->
          <MediaExplorerItemTagBox
            :media-id="mediaId" />
        </template>
      </Popover>
      <span
        v-if="hiddenCount > 0"
        class="tag tag--more"
        :data-info="hiddenTagsTooltip"
        @mouseenter.prevent
        @mouseleave.prevent>
        >+{{ hiddenCount }}</span
      >
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
      default: 5,
    },
    mediaId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isModalOpen: true,
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
      return this.showAllTags ? this.mediatags : this.mediatags.slice(this.maxVisible)
    },
    hiddenTagsTooltip() {
      // Tooltip for the "+N" pill
      return this.hiddenTags.map((t) => t.name).join(", ")
    },
    ...mapState("tags", {
      tags: (state) => state.tags,
    }),
    medias() {
      return this.$store.state.inbox.medias
    },
    media() {
      return this.$store.getters["inbox/getMediaById"](this.mediaId)
    },
    mediatags() {
      if (!this.media || !this.media.tags) return []
      return this.media.tags
        .map(tagId => this.tags.find(t => t._id === tagId))
        .filter(Boolean)
    },
  },
  methods: {
    getTagColor(tag) {
      return tag.color || "var(--neutral-20)"
    },
    handleTagClick(event, tag) {
      event.preventDefault()
      event.stopPropagation()
      this.$store.dispatch("tags/removeTagFromMedia", {
        mediaId: this.mediaId,
        tagId: tag._id,
      })
    },
    handleTagAdd(event) {
      event.preventDefault()
      event.stopPropagation()
      console.log("add tag")
    },
    handleTagMore(event) {
      event.preventDefault()
      event.stopPropagation()
      this.showAllTags = !this.showAllTags
    },
    displayIfEmoji(tag) {
        return this.unifiedToEmoji(tag.emoji)
      const value = tag.emoji ? tag.emoji : tag.name
      const emojiRegex = /([\u203C-\u3299]|[\uD83C-\uDBFF\uDC00-\uDFFF]+)/g
      return emojiRegex.test(value) ? "?" : "1" //this.unifiedToEmoji(value) : ""
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

<style lang="scss" scoped>
.media-explorer-item-tags {
  display: flex;
  align-items: center;
  position: relative;
  height: 18px;
  padding-right: 34px;

  &__list {
    display: flex;
    gap: 0.5em;
    align-items: center;
    max-width: calc(24px * 3 + 0.5em);
    overflow: hidden;

    & > * {
      flex-shrink: 0;
    }
  }

  &__actions {
    position: absolute;
    box-sizing: border-box;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    gap: 0.5em;
    padding-right: 0.5em;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;
    width: 72px;
  }

  &--empty {
    height: 18px;
  }
}

.tag {
  display: inline-block;
  border-radius: 2px;
  width: 18px;
  height: 18px;
  color: var(--neutral-10);
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.15s;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  // Tooltip using data-info attribute
  &[data-info]:hover:after {
    content: attr(data-info);
    display: block;
    position: absolute;
    top: 150%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary-hard);
    color: #fff;
    font-size: 1.1em;
    font-weight: 700;
    padding: 0.5em 1em;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 10;
    min-width: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 190px;
  }

  &__name {
    font-size: 0.9em;
    font-weight: 600;
    display: flex;
  }

  &__delete {
    display: none;
  }

  &:hover {
    .tag__name {
      display: none;
    }
    .tag__delete {
      display: flex;
    }
  }

  &--more {
    cursor: default;
    background: var(--neutral-20);
    color: var(--neutral-70);
    font-size: 0.8em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    min-width: 18px;
    height: 18px;
    max-width: 24px;
    width: auto;
    padding: 0 4px;
    box-shadow: 0 0 0 1px var(--neutral-60);
    position: relative;
  }
}

.tag--add {
  position: relative;
}
</style>

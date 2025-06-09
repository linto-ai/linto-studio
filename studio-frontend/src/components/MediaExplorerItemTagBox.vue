<template>
  <Box
    class="tag-box p-0"
    type="shadow"
    border-size="0px"
    border-radius="0px"
    @click.stop>
    <div class="tag-box__content">
      <div
        v-if="selectedTagsObjects.length"
        class="flex row gap-small flex-wrap selected-tags">
        <span class="tag-box__selected-tags-icon">
          <ph-icon name="tag" weight="bold" color="var(--primary-soft)" />
        </span>
        <ChipTag
          v-for="tag in selectedTagsObjects"
          :key="tag._id"
          :name="loadingTagId === tag._id ? '' : tag.name"
          :emoji="tag.emoji"
          :color="getTagColor(tag)"
          :active="true"
          :class="{ 'is-loading': loadingTagId === tag._id }"
          @click="onTagClick(tag)">
          <span
            v-if="loadingTagId === tag._id"
            class="chip-tag__spinner"></span>
        </ChipTag>
      </div>
      <template
        v-if="selectedTagsObjects.length && unselectedTagsObjects.length">
        <div class="tag-box__separator"></div>
      </template>
      <div
        v-if="unselectedTagsObjects.length"
        class="flex row gap-small flex-wrap unselected-tags">
        <ChipTag
          v-for="tag in unselectedTagsObjects"
          :key="tag._id"
          :name="loadingTagId === tag._id ? '' : tag.name"
          :emoji="tag.emoji"
          :color="getTagColor(tag)"
          :active="false"
          :class="{ 'is-loading': loadingTagId === tag._id }"
          @click="onTagClick(tag)">
          <span
            v-if="loadingTagId === tag._id"
            class="chip-tag__spinner"></span>
        </ChipTag>
      </div>
    </div>
    <hr />
    <div class="tag-box__footer footer-flex">
      <input
        v-model="search"
        type="text"
        class="tag-box__search-input"
        placeholder="Rechercher un tag..." />
      <ModalTagManagement>
        <template #trigger="{ open }">
          <button
            class="tag-box__button outline primary xs with-icon"
            @click="open">
            <ph-icon name="tags" weight="bold" />
            <span class="tag-box__button-text">Manage tags</span>
          </button>
        </template>
      </ModalTagManagement>
    </div>
  </Box>
</template>

<script>
import { mapState } from "vuex"
import ModalTagManagement from "@/components/ModalTagManagement.vue"
import ChipTag from "@/components/atoms/ChipTag.vue"

export default {
  name: "MediaExplorerItemTagBox",
  components: {
    ModalTagManagement,
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
      return this.$store.getters["inbox/getMediaById"](this.mediaId)
    },
    orderedTags() {
      return [...this.tags].sort((a, b) => a.name.localeCompare(b.name))
    },
    orderedMediaTags() {
      return [...this.media.tags]
        .map((tagId) => this.tags.find((t) => t._id === tagId))
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
      return this.orderedMediaTags
        .filter((tag) => this.selectedTagsIds.includes(tag._id))
        .map((tag) => this.tags.find((t) => t._id === tag._id))
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
      return this.media.tags
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
  width: 320px;
  max-width: 100%;

  hr {
    margin: 0.25em 0;
    margin-bottom: 0;
    background-color: var(--primary-color);
    border: none;
    height: 2px;
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
    flex-direction: row;
    display: flex;
    gap: 0.25em;
    flex-wrap: wrap;
    align-items: flex-start;
    border: 1px solid var(--primary-color);
    background-color: var(--primary-color);
    align-items: center;

    .tag-box__selected-tags-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
  }

  .unselected-tags {
    padding: 0.25em;
    flex-direction: row;
    display: flex;
    gap: 0.25em;
    flex-wrap: wrap;
    align-items: flex-start;
    border: 1px solid var(--primary-soft);
    background-color: var(--primary-soft);
  }
}

.tag-box__separator {
  width: 100%;
  height: 1px;
  background: var(--neutral-30);
  margin: 0.25em 0 0.25em 0;
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

.footer-flex {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5em;
}
.tag-box__search-input {
  flex: 1 1 0;
  min-width: 0;
  font-size: 0.95em;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  border: 1px solid var(--neutral-30);
  background: var(--neutral-10);
  color: var(--neutral-100);
  outline: none;
  transition: border-color 0.2s;
}
.tag-box__search-input:focus {
  border-color: var(--primary-color);
}
</style>

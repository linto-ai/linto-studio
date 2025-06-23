<template>
  <div class="media-explorer-menu-labels">
    <nav>
      <ul>
        <li v-for="tag in orderedTags" :key="tag._id">
          <ChipTag
            :name="tag.name"
            :emoji="tag.emoji"
            :color="tag.color"
            :count="tag.mediaCount"
            :active="selectedTags.some((t) => t._id === tag._id)"
            size="xs"
            @click="handleTagClick(tag)" />
        </li>
      </ul>

      <div class="media-explorer-menu-labels__footer">
        <Button
          v-if="tags.length > 5"
          size="xs"
          color="primary-soft"
          @click.stop="showAllTags = !showAllTags">
          {{ showAllTags ? "Show less" : "Show all" }}
        </Button>

        <Button
          icon="tag-simple"
          size="xs"
          color="secondary"
          @click.stop="showModalTagManagement = true">
          Tags
        </Button>
      </div>
    </nav>
    <ModalTagManagement v-model="showModalTagManagement" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import MediaExplorerItemTagBox from "./MediaExplorerItemTagBox.vue"
import ModalTagManagement from "./ModalTagManagement.vue"

export default {
  name: "MediaExplorerMenuLabels",
  components: {
    MediaExplorerItemTagBox,
    ModalTagManagement,
  },
  data() {
    return {
      showModalTagManagement: false,
      showAllTags: false,
    }
  },
  computed: {
    ...mapGetters("tags", {
      tags: "getTags",
      selectedTags: "getExploreSelectedTags",
    }),
    selectedTagsAsIds() {
      return this.selectedTags.map((tag) => tag._id)
    },
    filteredTags() {
      return this.tags.filter((tag) => !this.selectedTags.includes(tag._id))
    },
    orderedTags() {
      const limit = this.showAllTags ? this.tags.length : 5
      return this.tags
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => b.mediaCount - a.mediaCount)
        .sort((a, b) => {
          return this.selectedTagsAsIds.includes(a._id) ? -1 : 1
        })
        .slice(0, limit)
    },
  },
  methods: {
    getTagColor(tag) {
      return tag.color
    },
    handleTagClick(tag) {
      this.$store.dispatch("tags/toggleTag", tag)
    },
  },
}
</script>

<style lang="scss">
.media-explorer-menu-labels {
  display: flex;

  nav {
    padding: 0.5em 0;

    ul {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-small);
      list-style: none;
      padding-inline-start: 45px;
      max-height: 240px;
      overflow-y: auto;
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      padding: 0;
      margin: 0;

      a {
        padding: 0.2em;
        gap: 0.1em;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;

        svg {
          width: 1em;
          height: 1em;
          margin-right: 0.2em;
        }
      }

      & > div {
        display: flex;

        .chip-tag__name {
          flex: 1;
          max-width: 100% !important;
        }
      }
    }
  }

  &__footer {
    margin-top: 0.5em !important;
    padding: 0.5em;
    padding-left: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-small);
  }
}
</style>

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
              @click="handleTagClick(tag)"
            />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import MediaExplorerItemTagBox from "./MediaExplorerItemTagBox.vue"

export default {
  name: "MediaExplorerMenuLabels",
  components: {
    MediaExplorerItemTagBox,
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
      return this.tags.sort((a, b) => a.name.localeCompare(b.name))
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
    padding: .5em 0;
    ul {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-small);
      list-style: none;
      padding-inline-start: 45px;
    }
    li {
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      padding: 0;
      margin: 0;

      & > div {
        display: flex;
        width: 100%;

        .chip-tag__name {
          flex: 1;
          max-width: 100% !important;
        }
      }
    }
  }
}
</style>

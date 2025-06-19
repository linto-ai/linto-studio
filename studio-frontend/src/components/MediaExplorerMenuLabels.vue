<template>
  <div class="media-explorer-menu-labels">
    <nav>
      <ul>
        <li v-for="tag in orderedTags" :key="tag._id">
          <a href="#">
            <ChipTag
              :name="tag.name"
              :emoji="tag.emoji"
              :color="tag.color"
              :count="tag.mediaCount"
            />
          </a>
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
      if (this.selectedTags.find((t) => t._id === tag._id)) {
        this.selectedTags = this.selectedTags.filter((t) => t._id !== tag._id)
      } else {
        this.selectedTags = [...this.selectedTags, tag]
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.media-explorer-menu-labels {
  display: flex;

  nav {
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

      a {
        display: block;
        width: 100%;
        height: 100%;
        padding: var(--spacing-small);
        border-radius: var(--border-radius-small);
        background-color: var(--background-primary);
        color: var(--text-primary);
      }
    }
  }
}
</style>

<template>
  <div class="media-explorer-menu-labels">
    <MediaExplorerItemTagBox
      :selected-tags="selectedTagsAsIds"
      @tag-click="handleTagClick" />
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
  data() {
    return {
      selectedTags: [],
    }
  },
  computed: {
    ...mapGetters("tags", {
      tags: "getTags",
    }),
    selectedTagsAsIds() {
      return this.selectedTags.map((tag) => tag._id)
    },
    filteredTags() {
      return this.tags.filter((tag) => !this.selectedTags.includes(tag._id))
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

      console.log("selectedTags", this.selectedTags)
    },
  },
}
</script>

<style lang="scss" scoped>
.media-explorer-menu-labels {
  display: flex;
  flex-direction: column;

  &__items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>

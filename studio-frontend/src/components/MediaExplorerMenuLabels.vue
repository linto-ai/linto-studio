<template>
  <div class="media-explorer-menu-labels">
    <hr />
    <div class="title">
      {{ $t("navigation.tabs.tags") }}
    </div>
    <nav>
      <div v-if="orderedTags.length === 0" class="no-tags">
        <p>
          {{ $t("manage_tags.no_tags") }} -
          <a @click="showModalTagManagement = true">{{
            $t("manage_tags.create_tag")
          }}</a>

          <MediaExplorerFormTag
            v-model="showModalTagManagement"
            @submit="handleTagSubmit"
            @cancel="handleTagCancel" />
        </p>
      </div>
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
    </nav>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import MediaExplorerItemTagBox from "./MediaExplorerItemTagBox.vue"
import MediaExplorerFormTag from "./MediaExplorerFormTag.vue"

export default {
  name: "MediaExplorerMenuLabels",
  components: {
    MediaExplorerItemTagBox,
    MediaExplorerFormTag,
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
      return this.tags
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => b.mediaCount - a.mediaCount)
        .sort((a, b) => {
          return this.selectedTagsAsIds.includes(a._id) ? -1 : 1
        })
    },
  },
  methods: {
    getTagColor(tag) {
      return tag.color
    },
    handleTagClick(tag) {
      this.$store.dispatch("tags/toggleTag", tag)
    },
    async handleTagSubmit(tag) {
      console.log("handleTagSubmit", tag)
      await this.$store.dispatch("tags/createTag", tag)
      this.fetchTags()
      this.showModalTagManagement = false
    },
    handleTagCancel() {
      this.showModalTagManagement = false
    },
    fetchTags() {
      this.$store.dispatch("tags/fetchTags")
    },
  },
}
</script>

<style lang="scss">
.media-explorer-menu-labels {
  display: flex;
  flex-direction: column;
  gap: 0em;

  hr {
    margin: 0;
    height: 2px;
    background-color: #ccc;
    border: none;
    margin: 0 0.5em;
    margin-top: 0.5em;
  }

  .title {
    font-weight: 600;
    color: var(--text-secondary);
    padding: 0.5em;
    padding-left: 0.5em;
  }

  nav {
    padding: 0;

    ul {
      display: flex;
      gap: 0.5em;
      list-style: none;
      max-height: 240px;
      overflow-y: auto;
      flex-wrap: wrap;
      padding: 0.5em;
    }

    li {
      display: inline-flex;
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

  .no-tags {
    padding: 0.5em;
    padding-left: 0.5em;
    color: var(--text-secondary);

    p {
      margin: 0;
    }
  }
}
</style>

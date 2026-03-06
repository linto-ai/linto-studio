<template>
  <div class="media-explorer-menu-labels" v-if="visibleTags.length > 0">
    <hr />
    <div class="title">
      {{ $t("navigation.tabs.tags") }}
    </div>
    <nav>
      <ul>
        <li v-for="tag in visibleTags" :key="tag._id">
          <ChipTag
            :name="tag.name"
            :emoji="tag.emoji"
            :color="tag.color"
            :count="isSidebarActive(tag._id) ? 0 : tag.mediaCount"
            :active="isSidebarActive(tag._id)"
            size="xs"
            @click="handleTagClick(tag)">
            <ph-icon
              v-if="isSidebarActive(tag._id)"
              name="check"
              size="14" />
          </ChipTag>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { mediaScopeMixin } from "@/mixins/mediaScope"

export default {
  mixins: [mediaScopeMixin],
  name: "MediaExplorerMenuLabels",
  watch: {
    "$route.name"(newRouteName, oldRouteName) {
      if (newRouteName !== oldRouteName) {
        this.fetchTags()
      }
    },
    "$route.params.folderId"() {
      this.fetchTags()
    },
    searchActive() {
      this.fetchTags()
    },
  },
  mounted() {
    this.fetchTags()
  },
  computed: {
    ...mapGetters("tags", {
      orgTags: "getTags",
      sharedTags: "getSharedTags",
      favoritesTags: "getFavoritesTags",
    }),
    tags() {
      const routeName = this.$route?.name || ""

      if (routeName === "explore-favorites") {
        return this.favoritesTags
      } else if (routeName === "explore-shared") {
        return this.sharedTags
      } else {
        return this.orgTags
      }
    },
    searchActive() {
      return !!this.searchValue
    },
    sidebarFilterTagIds() {
      return this.$store.state[this.storeScope]?.sidebarFilterTagIds ?? []
    },
    effectiveFolderId() {
      if (this.searchActive) return undefined // Show all org tags during text search
      const routeFolderId = this.$route.params.folderId
      if (routeFolderId) return routeFolderId
      const routeName = this.$route?.name || ""
      if (routeName === "explore" || routeName === "explore-folder") return null
      return undefined
    },
    visibleTags() {
      return [...this.tags]
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => b.mediaCount - a.mediaCount)
        .filter((tag) => {
          return tag.mediaCount > 0 && !this.selectedTagsIds.includes(tag._id)
        })
    },
  },
  methods: {
    handleTagClick(tag) {
      this.$store.dispatch(`${this.storeScope}/toggleSidebarFilterTagId`, tag._id)
    },
    isSidebarActive(tagId) {
      return this.sidebarFilterTagIds.includes(tagId)
    },
    fetchTags() {
      const currentRoute = this.$route?.name || ""

      if (
        currentRoute === "explore-favorites" ||
        (typeof currentRoute === "string" && currentRoute.includes("favorites"))
      ) {
        this.$store.dispatch("tags/fetchFavoritesTags")
      } else if (
        currentRoute === "explore-shared" ||
        (typeof currentRoute === "string" && currentRoute.includes("shared"))
      ) {
        this.$store.dispatch("tags/fetchSharedTags")
      } else {
        this.$store.dispatch("tags/fetchTags", { folderId: this.effectiveFolderId })
      }
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

}
</style>

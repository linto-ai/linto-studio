<template>
  <LayoutV2 customClass="explore-next">
    <MediaExplorer
      ref="mediaExplorer"
      :medias="conversations"
      :totalItemsCount="totalItemsCount"
      :loading="loadingConversations"
      :pageSize="pageSize"
      :error="error"
      :search-value="search"
      :enable-pagination="true"
      :selected-tag-ids="selectedTagIds"
      :readonly-tags="favorites || shared"
      @load-more="handleLoadMore"
      @search="handleSearch"
      @reset="handleReset"
      class="explore-next__media-explorer relative">
      <template v-slot:before>
        <div
          v-if="initialPage > 0 && showPreviousButton"
          class="explore-next__previous-items"
          @click="loadPreviousItems">
          <a href="#" class="btn xs outline primary">
            <span class="label">
              {{ $t("media_explorer.load_previous_items") }}
            </span>
          </a>
        </div>
      </template>
      <template v-slot:after>
        <div>
          <div
            class="explore-next__infinite-loading"
            ref="infiniteLoadingTrigger">
            <span v-if="hasMoreItems && !loadingConversations">
              {{ $t("media_explorer.loading_more") }}
            </span>
            <span
              v-else-if="
                !hasMoreItems && !loadingConversations && totalItemsCount > 0
              ">
              {{ $t("media_explorer.end_of_results") }}
            </span>
            <span v-else-if="loadingConversations">
              {{ $t("media_explorer.loading") }}
            </span>
          </div>
        </div>
      </template>
      <template v-slot:empty>
        <div class="explore-next__empty">
          <div class="explore-next__empty__icon">
            <ph-icon name="folder" size="lg"></ph-icon>
          </div>
          <div class="explore-next__empty__text mt-md">
            <h3>{{ $t("media_explorer.empty_title") }}</h3>
            <p class="text-sm">{{ $t("media_explorer.empty_description") }}</p>
          </div>
        </div>
      </template>
    </MediaExplorer>
  </LayoutV2>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex"
import { bus } from "@/main.js"
import LayoutV2 from "@/layouts/v2-layout.vue"
import SidebarFilters from "@/components/SidebarFilters.vue"
import MediaExplorer from "@/components/MediaExplorer.vue"
import { fromConversations } from "@/store/inbox"
import ActionConversationCreate from "@/components/molecules/ActionConversationCreate.vue"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { exploreNavigationMixin } from "@/mixins/exploreNavigation.js"

export default {
  name: "NextExplore",
  components: {
    LayoutV2,
    SidebarFilters,
    MediaExplorer,
    ActionConversationCreate,
  },
  mixins: [orgaRoleMixin, convRoleMixin, exploreNavigationMixin],
  props: {
    userInfo: { type: Object, required: true },
    currentOrganizationScope: { type: String, required: true },
    favorites: { type: Boolean, required: false, default: false },
    shared: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      initialPage: 0,
      showPreviousButton: false,
      scrollContainer: null,
      mode: "default",
      page: 0,
      isInitialLoad: true,
    }
  },
  computed: {
    ...mapGetters("conversations", [
      "getConversations",
      "getLoading",
      "getError", 
      "getTotalCount",
      "getHasMoreItems",
      "getSearch",
      "getFilters",
      "getPageSize"
    ]),
    ...mapGetters("tags", [
      "getExploreSelectedTags",
      "getTags",
      "getSharedTags", 
      "getFavoritesTags",
    ]),
    conversations() {
      return this.getConversations || []
    },
    loadingConversations() {
      return this.getLoading || false
    },
    error() {
      return this.getError
    },
    totalItemsCount() {
      return this.getTotalCount
    },
    hasMoreItems() {
      return this.getHasMoreItems || false
    },
    search() {
      return this.getSearch || ""
    },
    filters() {
      return this.getFilters || []
    },
    pageSize() {
      return this.getPageSize || 20
    },
    selectedTags() {
      return this.getExploreSelectedTags || []
    },
    selectedTagIds() {
      const tags = this.getExploreSelectedTags || []
      return tags.map((t) => t._id)
    },
    availableTags() {
      return this.favorites ? this.getFavoritesTags : 
             this.shared ? this.getSharedTags : this.getTags
    },
  },
  async mounted() {
    await this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  watch: {
    selectedTags: {
      handler() {
        this.handleTagsChange()
      },
      deep: true,
      immediate: false,
    },
    '$route.query': {
      handler(newQuery, oldQuery) {
        // React to URL changes if they happen outside of our component
        if (newQuery.search !== oldQuery.search || 
            newQuery.page !== oldQuery.page || 
            newQuery.tags !== oldQuery.tags) {
          this.initPageFromUrl()
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations("inbox", [
      "setMedias",
      "clearSelectedMedias",
      "appendMedias",
      "clearMedias",
    ]),
    ...mapActions("conversations", {
      fetchConversations: "fetchConversations",
      loadMore: "loadMore", 
      searchConversations: "search",
      applyFilters: "applyFilters",
      setContext: "setContext",
      reset: "reset",
      deleteConversations: "deleteConversations"
    }),
    destroy() {
      if (this._unsubscribeTagStore) {
        this._unsubscribeTagStore()
      }
      bus.$off("medias/delete", this.onMediasDeleted)
    },
    async init() {
      this.$refs.mediaExplorer.reset()
      
      await this.loadTagsForCurrentView()
      await this.$nextTick()
      
      await this.setContext({
        organizationScope: this.currentOrganizationScope,
        favorites: this.favorites,
        shared: this.shared
      })
      
      // Initialize from URL parameters
      await this.initPageFromUrl()
      
      this.appendMedias(fromConversations(this.conversations))
      bus.$on("medias/delete", this.onMediasDeleted)
    },
    onMediasDeleted(mediaIds) {
      this.deleteConversations(mediaIds)
    },
    async loadTagsForCurrentView() {
      try {
        if (this.favorites) {
          await this.$store.dispatch("tags/fetchFavoritesTags")
        } else if (this.shared) {
          await this.$store.dispatch("tags/fetchSharedTags")
        } else {
          await this.$store.dispatch("tags/fetchTags")
        }
      } catch (error) {
        console.error("Error loading tags for current view:", error)
      }
    },
    async handleSearch(search, filters) {
      this.updateSearchUrl(search)
      this.mode = search && search.trim().length > 0 ? "search" : "default"
      await this.searchConversations({ search, filters })
      this.appendMedias(fromConversations(this.conversations))
    },
    async handleLoadMore(page) {
      if (this.loadingConversations || !this.hasMoreItems) return
      
      this.updatePageUrl(page)
      const newConversations = await this.loadMore()
      this.appendMedias(fromConversations(newConversations || []))
    },
    async handleTagsChange() {
      await this.applyFilters({ tagIds: this.selectedTagIds })
      this.appendMedias(fromConversations(this.conversations))
    },
    async loadDataForMode(page, append) {
      if (this.mode === "search") {
        await this.searchConversations({ 
          search: this.search, 
          filters: this.filters
        })
      } else {
        if (page > 0) {
          await this.loadMore()
        } else {
          await this.fetchConversations()
        }
      }
    },
    async apiSearchConversations(page, filters, append) {
      await this.searchConversations({ 
        search: this.search, 
        filters
      })
    },
    resetSearch() {
      this.reset()
    },
    async initPageFromUrl() {
      const urlParams = new URLSearchParams(window.location.search)
      const pageParam = urlParams.get("page")
      const searchParam = urlParams.get("search")
      const tagsParam = urlParams.get("tags")

      // Handle tags parameter
      if (tagsParam && tagsParam.trim().length > 0) {
        const tagIds = tagsParam.split(",").filter((id) => id.trim())
        this.$store.dispatch(
          "tags/setExploreSelectedTags",
          tagIds
            .map((id) => {
              return this.availableTags.find((t) => t._id === id)
            })
            .filter((tag) => tag),
        )
      } else {
        // Clear selected tags if no tags parameter in URL
        this.$store.dispatch("tags/setExploreSelectedTags", [])
      }

      // Handle search parameter
      if (searchParam && searchParam.trim().length > 0) {
        this.mode = "search"
        const filters = [
          {
            title: "Title filter",
            value: searchParam.trim(),
            _id: this.generateUuid(),
            key: "titleConversation",
          },
        ]
        await this.searchConversations({ 
          search: searchParam.trim(), 
          filters 
        })
      } else {
        this.mode = "default"
        await this.fetchConversations()
      }

      if (pageParam && !isNaN(parseInt(pageParam))) {
        const targetPage = parseInt(pageParam)
        this.initialPage = targetPage
        this.page = targetPage

        if (targetPage > 0) {
          this.showPreviousButton = true
          // Load more items for pagination if needed
          for (let i = 1; i <= targetPage; i++) {
            await this.loadMore()
          }
        }
      }

      this.isInitialLoad = false
    },
    async handleReset() {
      this.mode = "default"
      this.page = 0
      
      // Clear URL parameters
      const url = new URL(window.location)
      url.searchParams.delete("search")
      url.searchParams.delete("page")
      window.history.replaceState({}, "", url)
      
      await this.reset()
      this.appendMedias(fromConversations(this.conversations))
    }
  },
}
</script>

<style lang="scss">
.explore-next {
  .main__content {
    padding: 0;
  }
}

.explore-next__infinite-loading {
  text-align: center;
  padding: 20px;
  margin-top: 10px;
}

.explore-next__previous-items {
  text-align: center;
  padding: 10px;
  cursor: pointer;
  color: #0066cc;
  font-weight: bold;
}
</style>

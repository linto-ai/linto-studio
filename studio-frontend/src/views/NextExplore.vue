<template>
  <LayoutV2 customClass="explore-next">
    <MediaExplorer ref="mediaExplorer" :medias="conversations" :totalItemsCount="totalItemsCount"
      :loading="loadingConversations" :pageSize="pageSize" :error="error" :search-value="search"
      :enable-pagination="true" :selected-tag-ids="selectedTagIds" :readonly-tags="favorites || shared"
      @load-more="handleLoadMore" @search="handleSearch" @reset="handleReset" @tags-changed="handleTagsChanged"
      class="explore-next__media-explorer relative">
      <template v-slot:before>
        <div v-if="initialPage > 0 && showPreviousButton" class="explore-next__previous-items"
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
          <div class="explore-next__infinite-loading" ref="infiniteLoadingTrigger">
            <span v-if="hasMoreItems && !loadingConversations">
              {{ $t("media_explorer.loading_more") }}
            </span>
            <span v-else-if="
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
      isInitializing: false,
      busMediasDeleteAttached: false,
      _conversationsCache: null,
      _tagsChangeDebounceTimer: null,
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
      "getPageSize",
      "getParams"
    ]),
    ...mapGetters("tags", [
      "getExploreSelectedTags",
      "getTags",
      "getSharedTags",
      "getFavoritesTags",
    ]),
    conversations() {
      const conversations = this.getConversations || [];

      // Memoization: only recalculate if conversations array reference changed
      if (this._conversationsCache && this._conversationsCache.source === conversations) {
        return this._conversationsCache.result;
      }

      const seen = new Set();
      const result = conversations.filter(c => {
        if (!c || !c._id) return false;
        if (seen.has(c._id)) return false;
        seen.add(c._id);
        return true;
      });

      // Cache the result
      this._conversationsCache = { source: conversations, result };
      return result;
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
      const searchValue = this.getSearch || "";
      return searchValue;
    },
    filters() {
      return this.getFilters || []
    },
    pageSize() {
      return this.getPageSize || 20
    },
    searchParams() {
      return this.getParams || {}
    },
    selectedTags() {
      const tags = this.getExploreSelectedTags || [];
      return tags;
    },
    selectedTagIds() {
      const tags = this.getExploreSelectedTags || [];
      const ids = tags.map((t) => t._id);
      return ids;
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
    if (this.busMediasDeleteAttached) {
      bus.$off("medias/delete", this.onMediasDeleted);
      this.busMediasDeleteAttached = false;
    }

    // Cleanup performance optimizations
    if (this._tagsChangeDebounceTimer) {
      clearTimeout(this._tagsChangeDebounceTimer);
      this._tagsChangeDebounceTimer = null;
    }
    this._conversationsCache = null;
  },
  watch: {
    '$route'(newRoute, oldRoute) {
      if (newRoute.fullPath !== oldRoute.fullPath) {
        this.loadFromRoute(newRoute);
      }
    },
    selectedTags: {
      handler() {
        // Debounce tags change to avoid excessive API calls
        if (this._tagsChangeDebounceTimer) {
          clearTimeout(this._tagsChangeDebounceTimer);
        }

        this._tagsChangeDebounceTimer = setTimeout(() => {
          this.handleTagsChange();
        }, 150); // 150ms debounce
      },
      deep: false, // Remove deep watching - selectedTags array reference changes when modified
      immediate: false,
    },
    conversations: {
      handler(newConversations, oldConversations) {
        // Only process if array reference actually changed (performance optimization)
        if (newConversations === oldConversations) return;

        if (newConversations && newConversations.length > 0) {
          this.setMedias(fromConversations(newConversations))
        } else {
          this.clearMedias()
        }
      },
      immediate: true,
      deep: false, // Remove deep watching - we only care about array reference changes
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
      fetchConversations: "fetchWithCurrentParams",
      loadMore: "loadMore",
      searchConversations: "search",
      applyFilters: "applyFilters",
      setContext: "setContext",
      setParams: "setParams",
      loadFromUrl: "loadFromUrl",
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
      await this.setContext({
        organizationScope: this.currentOrganizationScope,
        favorites: this.favorites,
        shared: this.shared
      })

      await this.loadTagsForCurrentView()
      await this.loadFromRoute(this.$route)

      // Reset MediaExplorer AFTER data is loaded to avoid conflicts
      this.$refs.mediaExplorer.reset()

      if (!this.busMediasDeleteAttached) {
        bus.$on("medias/delete", this.onMediasDeleted);
        this.busMediasDeleteAttached = true;
      }
    },
    async loadFromRoute(route) {
      const url = new URL(route.fullPath, window.location.origin);
      await this.loadFromUrl(url);
      this.syncTagsFromUrl(url);
    },
    syncTagsFromUrl(url) {
      const urlParams = new URLSearchParams(url.search);
      const tagsParam = urlParams.get("tags");

      if (tagsParam && tagsParam.trim().length > 0) {
        const tagIds = tagsParam.split(",").filter((id) => id.trim());
        const tags = tagIds.map(id => this.availableTags.find(t => t._id === id)).filter(tag => tag);
        this.$store.dispatch("tags/setExploreSelectedTags", tags);
      } else {
        this.$store.dispatch("tags/setExploreSelectedTags", []);
      }
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
      // Reset MediaExplorer pagination before starting new search
      this.$refs.mediaExplorer.reset()
      await this.searchConversations({ search, filters })
      this.updateUrl()
    },
    async handleLoadMore(page) {
      if (this.loadingConversations || !this.hasMoreItems) return

      const currentStorePage = this.searchParams.page || 0;
      const expectedNextPage = currentStorePage + 1;

      if (page !== expectedNextPage) return

      await this.loadMore()
    },
    async handleTagsChange() {
      this.$refs.mediaExplorer.reset()
      await this.applyFilters({ tagIds: this.selectedTagIds })
      this.updateUrl()
    },
    async handleTagsChanged() {
      this.$refs.mediaExplorer.reset()
      await this.applyFilters({ tagIds: this.selectedTagIds })
      this.updateUrl()
    },
    async handleReset() {
      this.$refs.mediaExplorer.reset()
      await this.reset()
      this.$store.dispatch("tags/setExploreSelectedTags", [])
      this.updateUrl()
    },
    updateUrl() {
      const url = new URL(window.location)
      const params = this.searchParams

      if (params.search) {
        url.searchParams.set('search', params.search)
      } else {
        url.searchParams.delete('search')
      }

      if (this.selectedTagIds.length > 0) {
        url.searchParams.set('tags', this.selectedTagIds.join(','))
      } else {
        url.searchParams.delete('tags')
      }

      if (params.page > 0) {
        url.searchParams.set('page', params.page)
      } else {
        url.searchParams.delete('page')
      }

      window.history.replaceState({}, '', url)
    },
    generateUuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
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

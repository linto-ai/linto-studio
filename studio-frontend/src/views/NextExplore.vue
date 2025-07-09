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
      @load-more="handleLoadMore"
      @search="handleSearch"
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
import { mapMutations, mapGetters } from "vuex"
import { bus } from "@/main.js"
import LayoutV2 from "@/layouts/v2-layout.vue"
import SidebarFilters from "@/components/SidebarFilters.vue"
import MediaExplorer from "@/components/MediaExplorer.vue"
import { fromConversations } from "@/store/inbox"
import ActionConversationCreate from "@/components/molecules/ActionConversationCreate.vue"
import {
  apiGetFavoritesConversations,
  apiGetConversationsByTags,
  apiGetConversationsByOrganization,
  apiGetConversationsSharedWith,
} from "@/api/conversation.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"

export default {
  name: "NextExplore",
  components: {
    LayoutV2,
    SidebarFilters,
    MediaExplorer,
    ActionConversationCreate,
  },
  mixins: [orgaRoleMixin, convRoleMixin],
  props: {
    userInfo: { type: Object, required: true },
    currentOrganizationScope: { type: String, required: true },
    favorites: { type: Boolean, required: false, default: false },
    shared: { type: Boolean, required: false, default: false },
  },
  data() {
    return {
      conversations: [],
      loadingConversations: false,
      page: 0,
      initialPage: 0,
      error: null,
      observer: null,
      hasMoreItems: true,
      showPreviousButton: false,
      isInitialLoad: true,
      totalItemsCount: 0,
      options: {
        favorites: false,
        shared: false,
      },
      mode: "default", // default, search
      search: "",
      filters: [],
      scrollContainer: null,
      pageSize: 12,
    }
  },
  computed: {
    ...mapGetters("tags", [
      "getExploreSelectedTags",
      "getTags",
      "getSharedTags",
      "getFavoritesTags",
    ]),
    selectedTags() {
      return this.getExploreSelectedTags
    },
    selectedTagIds() {
      return this.$store.state.tags.exploreSelectedTags.map((t) => t._id)
    },
    availableTags() {
      if (this.favorites) {
        return this.getFavoritesTags
      } else if (this.shared) {
        return this.getSharedTags
      } else {
        return this.getTags
      }
    },
  },
  async mounted() {
    await this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  // async beforeRouteUpdate(to, from, next) {
  //   console.log("beforeRouteUpdate", to, from)
  //   // Call next() to proceed with the navigation
  //   next()
  //   await this.$nextTick()
  //   this.destroy()
  //   await this.init()
  // },
  watch: {
    selectedTags: {
      handler() {
        this.resetSearch()
      },
      deep: true,
      immediate: false,
    },
  },
  methods: {
    ...mapMutations("inbox", [
      "setMedias",
      "clearSelectedMedias",
      "appendMedias",
      "clearMedias",
    ]),
    destroy() {
      if (this._unsubscribeTagStore) {
        this._unsubscribeTagStore()
      }
      bus.$off("medias/delete", this.onMediasDeleted)
    },
    async init() {
      this.options.favorites = this.favorites
      this.options.shared = this.shared
      this.page = 0
      this.$refs.mediaExplorer.reset()
      // Load appropriate tags based on view type BEFORE initializing from URL
      await this.loadTagsForCurrentView()

      // Give a small delay to ensure tags are fully loaded in the store
      await this.$nextTick()

      await this.initPageFromUrl()

      this.resetSearch()
      bus.$on("medias/delete", this.onMediasDeleted)
    },
    onMediasDeleted(mediaIds) {
      this.conversations = this.conversations.filter(
        (m) => !mediaIds.includes(m._id),
      )
    },
    async loadTagsForCurrentView() {
      try {
        if (this.favorites) {
          // Load favorites tags
          await this.$store.dispatch("tags/fetchFavoritesTags")
        } else if (this.shared) {
          // Load shared tags
          await this.$store.dispatch("tags/fetchSharedTags")
        } else {
          // Load regular organization tags
          await this.$store.dispatch("tags/fetchTags")
        }
      } catch (error) {
        console.error("Error loading tags for current view:", error)
      }
    },
    async initPageFromUrl() {
      const urlParams = new URLSearchParams(window.location.search)
      const pageParam = urlParams.get("page")
      const searchParam = urlParams.get("search")
      const tagsParam = urlParams.get("tags")

      // Handle tags parameter
      if (tagsParam && tagsParam.trim().length > 0) {
        const tagIds = tagsParam.split(",").filter((id) => id.trim())
        // Convert tag IDs to tag objects from the appropriate tags collection
        this.$store.dispatch(
          "tags/setExploreSelectedTags",
          tagIds
            .map((id) => {
              return this.availableTags.find((t) => t._id === id)
            })
            .filter((tag) => tag), // Remove undefined tags
        )
      }

      // Handle search parameter
      if (searchParam && searchParam.trim().length > 0) {
        this.search = searchParam.trim()
        this.mode = "search"
        this.filters = [
          {
            title: "Title filter",
            value: this.search,
            _id: this.generateUuid(),
            key: "titleConversation",
          },
        ]
      }

      if (pageParam && !isNaN(parseInt(pageParam))) {
        const targetPage = parseInt(pageParam)
        this.initialPage = targetPage
        this.page = targetPage

        if (targetPage > 0) {
          this.showPreviousButton = true
          // Load only the target page
          if (this.mode === "search") {
            await this.apiSearchConversations(targetPage, this.filters, false)
          } else {
            await this.fetchConversations(targetPage, false)
          }
        } else {
          if (this.mode === "search") {
            await this.apiSearchConversations(0, this.filters, false)
          } else {
            await this.fetchConversations(0, false)
          }
        }
      } else {
        // Default load
        if (this.mode === "search") {
          await this.apiSearchConversations(0, this.filters, false)
        } else {
          await this.fetchConversations(0, false)
        }
      }

      this.isInitialLoad = false
    },

    updatePageUrl(page) {
      const url = new URL(window.location)
      if (page > 0) {
        url.searchParams.set("page", page)
      } else {
        url.searchParams.delete("page")
      }

      // Keep tags in URL if present
      if (this.selectedTagIds.length > 0) {
        const tagIds = this.selectedTagIds.join(",")
        url.searchParams.set("tags", tagIds)
      } else {
        url.searchParams.delete("tags")
      }

      window.history.replaceState({}, "", url)
    },

    updateSearchUrl(search) {
      const url = new URL(window.location)
      if (search && search.trim().length > 0) {
        url.searchParams.set("search", search.trim())
      } else {
        url.searchParams.delete("search")
      }

      // Keep tags in URL if present
      if (this.selectedTagIds.length > 0) {
        const tagIds = this.selectedTagIds.join(",")
        url.searchParams.set("tags", tagIds)
      } else {
        url.searchParams.delete("tags")
      }

      // Reset page when searching
      url.searchParams.delete("page")
      window.history.replaceState({}, "", url)
    },

    generateUuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8
          return v.toString(16)
        },
      )
    },

    async apiSearchConversations(
      page = this.page,
      filters = [],
      append = false,
    ) {
      let res
      this.loadingConversations = true

      const textFilter = filters.find(
        (filter) => filter.key === "textConversation",
      )?.value
      const titleFilter = filters.find(
        (filter) => filter.key === "titleConversation",
      )?.value

      const tagIds = this.selectedTagIds
      try {
        // Always respect the context (favorites, shared, organization) regardless of tags/filters
        if (this.options.favorites) {
          res = await apiGetFavoritesConversations(
            tagIds,
            textFilter,
            titleFilter,
            page,
            {
              sortField: this.selectedOption,
              pageSize: this.pageSize,
            },
          )
        } else if (this.options.shared) {
          res = await apiGetConversationsSharedWith(
            tagIds,
            textFilter,
            titleFilter,
            page,
            {
              sortField: this.selectedOption,
              pageSize: this.pageSize,
            },
          )
        } else {
          // For organization context, use the appropriate API based on whether we have tags/filters
          if (tagIds.length === 0 && filters.length == 0) {
            res = await apiGetConversationsByOrganization(
              this.currentOrganizationScope,
              page,
              {
                pageSize: this.pageSize,
                sortField: this.selectedOption,
              },
            )
          } else {
            res = await apiGetConversationsByTags(
              this.currentOrganizationScope,
              tagIds,
              textFilter,
              titleFilter,
              page,
              {
                sortField: this.selectedOption,
                pageSize: this.pageSize,
              },
            )
          }
        }
        this.loadingConversations = false
        this.totalItemsCount = res?.count || 0
        const newConversations = res?.list || []
        if (append) {
          this.conversations = [...this.conversations, ...newConversations]
        } else {
          this.conversations = newConversations
        }
        this.appendMedias(fromConversations(newConversations))
        this.hasMoreItems = res?.count - this.pageSize * (page + 1) > 0
      } catch (error) {
        this.error = error
      } finally {
        this.loadingConversations = false
      }

      return res
    },

    async fetchConversations(page = 0, append = false) {
      try {
        // Delegate the full logic to apiSearchConversations.
        // Passing the append flag prevents the previous page from being overwritten
        // and avoids adding duplicates to the store.
        const data = await this.apiSearchConversations(page, [], append)

        // apiSearchConversations already updates `this.conversations`, `hasMoreItems`,
        // and the Vuex store, so we can simply return the list here.
        return data?.list || []
      } catch (error) {
        if (page === 0) {
          this.conversations = []
          this.clearSelectedMedias()
        }
        this.loadingConversations = false
        console.error("request error", error)
        this.error = error
        return []
      }
    },

    loadPreviousItems() {
      this.showPreviousButton = false
      this.initialPage = 0
      this.page = 0
      this.mode = "default"
      this.search = ""
      this.filters = []

      // Update URL - keep tags but remove page and search
      const url = new URL(window.location)
      url.searchParams.delete("page")
      url.searchParams.delete("search")

      // Keep tags in URL if present
      if (this.selectedTagIds.length > 0) {
        const tagIds = this.selectedTagIds.join(",")
        url.searchParams.set("tags", tagIds)
      }

      window.history.replaceState({}, "", url)

      this.resetSearch()
      this.clearSelectedMedias()
    },
    handleSearch(search, filters) {
      this.updateSearchUrl(search)

      if (search.length === 0) {
        this.mode = "default"
        this.search = ""
        this.filters = []
        this.fetchConversations(0, false)
        return
      }

      this.search = search
      this.filters = filters
      this.mode = "search"
      this.$nextTick(() => {
        this.resetSearch(filters, true)
      })
    },

    async handleLoadMore(page) {
      if (this.loadingConversations || !this.hasMoreItems) return
      if (this.page == page) return

      this.page = page

      if (this.mode == "search") {
        await this.apiSearchConversations(page, this.filters, true)
      } else {
        await this.fetchConversations(page, true)
      }
    },

    resetSearch(filters = [], append = false) {
      this.page = 0
      this.conversations = []
      this.showPreviousButton = false
      this.hasMoreItems = false
      this.isInitialLoad = false
      return this.apiSearchConversations(0, filters, append)
    },
    handleTagClick(tag) {
      this.$store.dispatch("tags/toggleTag", tag)
    },
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

<template>
  <LayoutV2 customClass="explore-next">
    <MediaExplorer
      :medias="conversations"
      :loading="loadingConversations"
      :error="error"
      :search-value="search"
      :enable-pagination="false"
      :selected-tag-ids="selectedTags.map((tag) => tag._id)"
      @search="handleSearch"
      class="explore-next__media-explorer relative">
      <template v-slot:before>
        <div
          v-if="initialPage > 0 && showPreviousButton"
          class="explore-next__previous-items"
          @click="loadPreviousItems">
          <a href="#" class="btn xs outline primary">
            <span class="label"
              >Load previous items ({{ initialPage * 12 }})</span
            >
          </a>
        </div>
      </template>
      <template v-slot:after>
        <div>
          <div
            class="explore-next__infinite-loading"
            ref="infiniteLoadingTrigger">
            <span v-if="hasMoreItems && !loadingConversations"
              >Loading more...</span
            >
            <span v-else-if="!hasMoreItems">End of results</span>
            <span v-else>Loading...</span>
          </div>
        </div>
      </template>
      <template v-slot:empty>
        <div class="explore-next__empty">
          <div class="explore-next__empty__icon">
            <ph-icon name="folder" size="lg"></ph-icon>
          </div>
          <div class="explore-next__empty__text mt-md">
            <h3>No conversations found</h3>
            <p class="text-sm">Create a new conversation to get started</p>
          </div>
        </div>
      </template>
    </MediaExplorer>
  </LayoutV2>
</template>

<script>
import { mapMutations } from "vuex"

import LayoutV2 from "@/layouts/v2-layout.vue"
import SidebarFilters from "@/components/SidebarFilters.vue"
import MediaExplorer from "@/components/MediaExplorer.vue"
import { debounceMixin } from "@/mixins/debounce"
import { conversationListOrgaMixin } from "@/mixins/conversationListOrga"
import { fromConversations } from "@/store/inbox"
import ActionConversationCreate from "@/components/molecules/ActionConversationCreate.vue"

import {
  apiGetFavoritesConversations,
  apiGetConversationsByTags,
  apiGetConversationsByOrganization,
  apiGetConversationsSharedWith,
} from "@/api/conversation.js"

export default {
  name: "NextExplore",
  components: {
    LayoutV2,
    SidebarFilters,
    MediaExplorer,
    ActionConversationCreate,
  },
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
      selectedTags: [],
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
    }
  },
  mixins: [debounceMixin, conversationListOrgaMixin],
  async mounted() {
    this.options.favorites = this.favorites
    this.options.shared = this.shared
    await this.initPageFromUrl()
    this.setupIntersectionObserver()
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  watch: {
    selectedTags() {
      this.resetSearch()
    },
    page(newPage) {
      this.updatePageUrl(newPage)
    },
  },
  methods: {
    ...mapMutations("inbox", [
      "setMedias",
      "clearSelectedMedias",
      "appendMedias",
      "clearMedias",
    ]),
    async initPageFromUrl() {
      const urlParams = new URLSearchParams(window.location.search)
      const pageParam = urlParams.get("page")
      const searchParam = urlParams.get("search")
      const tagsParam = urlParams.get("tags")

      // Handle tags parameter
      if (tagsParam && tagsParam.trim().length > 0) {
        const tagIds = tagsParam.split(",").filter((id) => id.trim())
        // Convert tag IDs to tag objects - assuming tags are available in store
        this.selectedTags = tagIds.map((id) => ({ _id: id }))
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
      if (this.selectedTags.length > 0) {
        const tagIds = this.selectedTags.map((tag) => tag._id).join(",")
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
      if (this.selectedTags.length > 0) {
        const tagIds = this.selectedTags.map((tag) => tag._id).join(",")
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

      try {
        if (
          (!this.selectedTags || this.selectedTags.length == 0) &&
          filters.length == 0
        ) {
          if (this.options.favorites) {
            res = await apiGetFavoritesConversations(
              this.selectedTags.map((tag) => tag._id),
              textFilter,
              titleFilter,
              page,
              {
                sortField: this.selectedOption,
              },
            )
          } else {
            if (this.options.shared) {
              res = await apiGetConversationsSharedWith(
                this.selectedTags.map((tag) => tag._id),
                textFilter,
                titleFilter,
                page,
                {
                  sortField: this.selectedOption,
                },
              )
            } else {
              res = await apiGetConversationsByOrganization(
                this.currentOrganizationScope,
                page,
                {
                  pageSize: 12,
                  sortField: this.selectedOption,
                },
              )
            }
          }
        } else {
          res = await apiGetConversationsByTags(
            this.currentOrganizationScope,
            this.selectedTags.map((tag) => tag._id),
            textFilter,
            titleFilter,
            page,
            {
              sortField: this.selectedOption,
            },
          )
        }
        this.loadingConversations = false
        this.totalItemsCount = res?.count || 0
        const newConversations = res?.list || []
        if (append) {
          this.conversations = [...this.conversations, ...newConversations]
          this.appendMedias(fromConversations(newConversations))
        } else {
          this.conversations = newConversations
        }
        this.appendMedias(fromConversations(newConversations))
        this.hasMoreItems = res?.count - 12 * (page + 1) > 0
      } catch (error) {
        this.error = error
      } finally {
        this.loadingConversations = false
      }

      return res
    },

    async fetchConversations(page = 0, append = false) {
      try {
        const data = await this.apiSearchConversations(page)
        const newConversations = data?.list || []

        if (append) {
          this.conversations = [...this.conversations, ...newConversations]
        } else {
          this.conversations = newConversations
        }

        this.appendMedias(fromConversations(newConversations))
        this.hasMoreItems = data?.count - 12 * (page + 1) > 0

        return newConversations
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
      if (this.selectedTags.length > 0) {
        const tagIds = this.selectedTags.map((tag) => tag._id).join(",")
        url.searchParams.set("tags", tagIds)
      }

      window.history.replaceState({}, "", url)

      this.resetSearch()
      this.clearSelectedMedias()
    },

    setupIntersectionObserver() {
      if (!this.$refs.infiniteLoadingTrigger || !window.IntersectionObserver)
        return

      if (this.observer) {
        this.observer.disconnect()
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            this.hasMoreItems &&
            !this.loadingConversations &&
            !this.isInitialLoad
          ) {
            this.handleLoadMore()
          }
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        },
      )

      this.observer.observe(this.$refs.infiniteLoadingTrigger)
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
      this.resetSearch(filters, true)
    },

    async handleLoadMore() {
      if (this.loadingConversations || !this.hasMoreItems) return

      this.page += 1
      if (this.mode == "search") {
        await this.apiSearchConversations(this.page, this.filters, true)
      } else {
        await this.fetchConversations(this.page, true)
      }
    },

    resetSearch(filters = [], append = false) {
      this.page = 0
      this.conversations = []
      this.showPreviousButton = false
      this.hasMoreItems = false
      this.isInitialLoad = false
      return this.apiSearchConversations(0, filters, append).then(() => {
        this.$nextTick(() => {
          this.setupIntersectionObserver()
        })
      })
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

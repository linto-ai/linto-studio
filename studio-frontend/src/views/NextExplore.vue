<template>
  <LayoutV2 customClass="explore-next">
    <template v-slot:sidebar>
      <div class="sidebar-divider"></div>
    </template>
    <MediaExplorer :medias="conversations" :loading="loadingConversations" :error="error">
      <template v-slot:before>
        <div v-if="initialPage > 0 && showPreviousButton" class="explore-next__previous-items"
          @click="loadPreviousItems">
          <a href="#" class="btn xs outline primary">
            <span class="label">Load previous items ({{ initialPage * 12 }})</span>
          </a>
        </div>
      </template>
      <template v-slot:after>
        <div class="explore-next__infinite-loading" ref="infiniteLoadingTrigger">
          <span v-if="hasMoreItems && !loadingConversations">Loading more...</span>
          <span v-else-if="!hasMoreItems">End of results</span>
          <span v-else>Loading...</span>
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

import {
  apiGetConversationsByTags,
  apiGetConversationsByOrganization,
} from "@/api/conversation.js"

export default {
  name: "NextExplore",
  components: {
    LayoutV2,
    SidebarFilters,
    MediaExplorer,
  },
  props: {
    userInfo: { type: Object, required: true },
    currentOrganizationScope: { type: String, required: true },
    favorites: { type: Boolean, required: false, default: false }
  },
  data() {
    console.log('f', this.favorites);
    return {
      conversations: [],
      loadingConversations: false,
      page: 0,
      initialPage: 0,
      customFilters: [],
      selectedTags: [],
      error: null,
      observer: null,
      hasMoreItems: true,
      showPreviousButton: false,
      isInitialLoad: true,
      totalItemsCount: 0,
      options: {
        favorites: false,
      }
    }
  },
  mixins: [debounceMixin, conversationListOrgaMixin],
  async mounted() {
    this.options.favorites = this.$route.query.favorites === 'true'
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
    'customFilters.textConversation.value'() {
      this.resetSearch()
    },
    'customFilters.titleConversation.value'() {
      this.resetSearch()
    },
    selectedOption() {
      this.resetSearch()
    },
    page(newPage) {
      this.updatePageUrl(newPage)
    }
  },
  methods: {
    ...mapMutations('inbox', ['setMedias', 'clearSelectedMedias']),
    async initPageFromUrl() {
      const urlParams = new URLSearchParams(window.location.search)
      const pageParam = urlParams.get('page')

      if (pageParam && !isNaN(parseInt(pageParam))) {
        const targetPage = parseInt(pageParam)
        this.initialPage = targetPage
        this.page = targetPage

        if (targetPage > 0) {
          this.showPreviousButton = true
          // Load only the target page
          await this.fetchConversations(targetPage, false)
        } else {
          await this.fetchConversations(0, false)
        }
      } else {
        // Default load
        await this.fetchConversations(0, false)
      }

      this.isInitialLoad = false
    },

    updatePageUrl(page) {
      const url = new URL(window.location)
      if (page > 0) {
        url.searchParams.set('page', page)
      } else {
        url.searchParams.delete('page')
      }
      window.history.replaceState({}, '', url)
    },

    async apiSearchConversations(page = this.page) {
      let res
      this.loadingConversations = true

      if (
        (!this.selectedTags || this.selectedTags.length == 0) &&
        !this.customFilters?.textConversation?.value &&
        !this.customFilters?.titleConversation?.value
      ) {
        res = await apiGetConversationsByOrganization(
          this.currentOrganizationScope,
          page,
          {
            pageSize: 12,
            sortField: this.selectedOption,
          },
        )
      } else {
        res = await apiGetConversationsByTags(
          this.currentOrganizationScope,
          this.selectedTags.map((tag) => tag._id),
          this.customFilters?.textConversation?.value,
          this.customFilters?.titleConversation?.value,
          page,
          {
            sortField: this.selectedOption,
          },
        )
      }
      this.loadingConversations = false
      this.totalItemsCount = res?.count || 0

      return res
    },

    async fetchConversations(page = 0, append = false) {
      try {
        const data = await this.apiSearchConversations(page);
        const newConversations = data?.list || []

        if (append) {
          this.conversations = [...this.conversations, ...newConversations]
        } else {
          this.conversations = newConversations
        }

        this.setMedias(fromConversations(newConversations))

        this.hasMoreItems = (data?.count - (12 * (page + 1))) > 0

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
      this.updatePageUrl(0)
      this.resetSearch()
      this.clearSelectedMedias()
    },

    setupIntersectionObserver() {
      if (!this.$refs.infiniteLoadingTrigger || !window.IntersectionObserver) return

      if (this.observer) {
        this.observer.disconnect()
      }

      this.observer = new IntersectionObserver((entries) => {
        console.log("entries", entries, this.hasMoreItems, this.loadingConversations, this.isInitialLoad)
        if (entries[0].isIntersecting && this.hasMoreItems && !this.loadingConversations && !this.isInitialLoad) {
          console.log("load more")
          this.handleLoadMore()
        }
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      })

      this.observer.observe(this.$refs.infiniteLoadingTrigger)
    },

    async handleLoadMore() {
      if (this.loadingConversations || !this.hasMoreItems) return

      this.page += 1
      await this.fetchConversations(this.page, true)
    },

    resetSearch() {
      this.page = 0
      this.conversations = []
      this.hasMoreItems = true
      this.isInitialLoad = false
      this.fetchConversations(this.page).then(() => {
        this.$nextTick(() => {
          this.setupIntersectionObserver()
        })
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
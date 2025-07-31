<template>
  <div class="media-explorer">
    <!-- Optional outer header slot -->
    <div v-if="$slots.header" class="media-explorer__header">
      <slot name="header" />
    </div>

    <!-- Main content area -->
    <div class="media-explorer__content">
      <!-- Media list header - sticky positioned -->
      <MediaExplorerHeader
        :selected-count="selectedMedias.length"
        :total-count="count"
        :loading="loading"
        :is-select-all="isSelectAll"
        :sticky-top-offset="stickyTopOffset"
        :all-medias="medias"
        :search-value="searchValue"
        @select-all="handleSelectAll"
        @search="handleSearch"
        @tags-changed="handleTagsChanged">
        <template #actions>
          <IsMobile>
          <div class="flex gap-small" v-if="selectedMedias.length > 0">
            <!-- <Button
              :label="$t('media_explorer.share')"
              icon="share-network"
              variant="outline" /> -->
            <ConversationShareMultiple
              :selectedConversations="selectedMedias"
              :currentOrganizationScope="currentOrganizationScope"
              :userInfo="userInfo" />
            <Button
              @click="showDeleteModal = true"
              :label="$t('media_explorer.delete')"
              size="sm"
              color="tertiary"
              icon="trash"
              variant="outline" />
          </div>
          </IsMobile>
          <slot name="header-actions" />
        </template>
      </MediaExplorerHeader>

      <!-- Media list body -->
      <div
        class="media-explorer__body"
        :class="{ 'has-right-panel': selectedMediaForOverview }"
        :style="{ '--right-panel-width': rightPanelWidth + 'px' }">
        <!-- Main content area -->
        <div class="media-explorer__body__content">
          <slot name="before" />
          <Loading v-if="loading && filteredMedias.length === 0" />
          <!-- Empty state -->
          <div
            v-else-if="filteredMedias.length === 0"
            class="media-explorer__body__empty">
            <slot name="empty">
              <div class="empty-state">
                <p v-if="activeSelectedTagIds.length > 0">
                  Aucun média trouvé avec les tags sélectionnés
                </p>
                <p v-else>Aucun média trouvé</p>
              </div>
            </slot>
          </div>

          <!-- Media items -->
          <IsMobile>
            <MediaExplorerItemMobile
              v-for="(media, index) in filteredMedias"
              :key="`media-explorer-item-${media._id}-${index}`"
              :media="media"
              :search-value="searchValue" />
            <template #desktop>
              <MediaExplorerItem
                v-for="(media, index) in filteredMedias"
                :key="`media-explorer-item-${media._id}-${index}`"
                :media="media"
                :search-value="searchValue"
                :ref="'mediaItem' + index"
                :is-selected-for-overview="
                  selectedMediaForOverview &&
                  selectedMediaForOverview._id === media._id
                "
                class="media-explorer__body__item"
                @select-for-overview="selectMediaForOverview" />
            </template>
          </IsMobile>
          <slot name="after" />
        </div>

        <!-- Right panel for desktop only -->
        <IsMobile>
          <template #desktop>
            <MediaExplorerRightPanel
              v-if="(selectedMediaForOverview || selectedMedias.length > 1) && currentOrganizationScope"
              :selected-media="reactiveSelectedMediaForOverview"
              :currentOrganizationScope="currentOrganizationScope"
              :readonly-tags="readonlyTags"
              @close="closeRightPanel"
              @resize="handleRightPanelResize" />
          </template>
        </IsMobile>

        <ModalDeleteConversations
          :visible="showDeleteModal"
          :medias="selectedMedias"
          @close="showDeleteModal = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import MediaExplorerHeader from "@/components/MediaExplorerHeader.vue"
import MediaExplorerItem from "@/components/MediaExplorerItem.vue"
import MediaExplorerItemMobile from "@/components-mobile/MediaExplorerItem.vue"
import MediaExplorerAppUpload from "@/components/MediaExplorerAppUpload.vue"
import MediaExplorerRightPanel from "@/components/MediaExplorerRightPanel.vue"
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"
import ModalDeleteConversations from "@/components/ModalDeleteConversations.vue"
import ConversationShareMultiple from "@/components/ConversationShareMultiple.vue"
import Loading from "@/components/atoms/Loading.vue"
import IsMobile from "@/components/atoms/IsMobile.vue"

export default {
  name: "MediaExplorer",
  components: {
    MediaExplorerHeader,
    MediaExplorerItem,
    MediaExplorerItemMobile,
    MediaExplorerAppUpload,
    MediaExplorerRightPanel,
    Modal,
    Button,
    ModalDeleteConversations,
    ConversationShareMultiple,
    Loading,
    IsMobile,
  },
  props: {
    medias: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    error: {
      type: [String, null],
      default: null,
    },
    // Height of the parent sticky header (e.g., app header bar)
    stickyTopOffset: {
      type: [Number, String],
      default: 0,
    },
    // Enable pagination features
    enablePagination: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    // Virtual scrolling threshold
    virtualScrollingThreshold: {
      type: Number,
      default: 100, // Enable virtual scrolling for 100+ items
    },
    // Number of items to render outside viewport
    virtualScrollingBuffer: {
      type: Number,
      default: 10,
    },
    // Upload-related props
    transcriptionServices: {
      type: Array,
      default: () => [],
    },
    loadingServices: {
      type: Boolean,
      default: false,
    },
    // Search value from URL
    searchValue: {
      type: String,
      default: "",
    },
    totalItemsCount: {
      type: [Number, null],
      default: null,
    },
    // Read-only mode for tags (favorites/shared views)
    readonlyTags: {
      type: Boolean,
      default: false,
    },
    // Selected tag IDs for filtering
    selectedTagIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    count() {
      return this.totalItemsCount || this.medias.length
    },
    selectedMedias() {
      return this.$store.state.inbox.selectedMedias
    },
    ...mapGetters("tags", ["getExploreSelectedTags"]),
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    totalPages() {
      return Math.ceil(this.count / this.pageSize)
    },
    activeSelectedTagIds() {
      return this.selectedTagIds || []
    },
    filteredMedias() {
      const medias = this.medias;
      const tagIds = this.activeSelectedTagIds;
      
      // Memoization: check if we can reuse cached result
      if (this._filteredMediasCache && 
          this._filteredMediasCache.medias === medias &&
          JSON.stringify(this._filteredMediasCache.tagIds) === JSON.stringify(tagIds)) {
        return this._filteredMediasCache.result;
      }
      
      let result;
      
      if (tagIds.length === 0) {
        result = medias;
      } else {
        result = medias.filter((media) => {
          if (!media.tags || !Array.isArray(media.tags)) {
            return false;
          }
          return tagIds.every((tagId) => media.tags.includes(tagId));
        });
      }
      
      // Cache the result
      this._filteredMediasCache = { medias, tagIds, result };
      return result;
    },
    reactiveSelectedMediaForOverview() {
      return this.medias.find(
        (media) => media._id === this.selectedMediaForOverview?._id,
      )
    },
    selectedCount() {
      const count = this.selectedMedias.length;
      return count;
    },
    totalCount() {
      const count = this.medias.length;
      return count;
    },
  },
  data() {
    return {
      page: 0,
      lastPage: 0,
      isSelectAll: false,
      observer: null,
      search: "",
      showDeleteModal: false,
      selectedMediaForOverview: null,
      rightPanelWidth: 400,
      _filteredMediasCache: null,
      _observerSetupPending: false,
      _loadMorePending: false, // Prevent multiple simultaneous load-more calls
    }
  },
  mounted() {
    // Remove initialization of filters from URL when parent manages tags
    if (this.enablePagination) {
      this.setupIntersectionObserver()
      this.initializePageFromURL()
    }
  },
  beforeDestroy() {
    this.cleanupObserver()
  },
  watch: {
    isSelectAll(value) {
      this.$store.commit("inbox/setAutoselectMedias", value)
    },
    medias: {
      handler(newMedias, oldMedias) {
        this.updateCounts();
        
        // Only recreate observer if array reference actually changed and pagination is enabled
        if (this.enablePagination && newMedias !== oldMedias) {
          // Debounce observer setup to avoid excessive recreation
          if (this._observerSetupPending) return;
          
          this._observerSetupPending = true;
          this.$nextTick(() => {
            this.cleanupObserver();
            this.setupIntersectionObserver();
            this.observeMediaItems();
            this._observerSetupPending = false;
          });
        }
      },
      immediate: true,
      deep: false, // Only watch for array reference changes, not deep changes
    },
    '$store.state.inbox.selectedMedias': {
      handler(newSelection, oldSelection) {
        if (oldSelection && oldSelection.length > 1 && newSelection.length === 0) {
          this.selectedMediaForOverview = null
          this.rightPanelWidth = 0
        }
        else if (oldSelection && oldSelection.length > 1 && newSelection.length === 1) {
          this.selectedMediaForOverview = newSelection[0]
        }
        else if (newSelection.length === 1 && !this.selectedMediaForOverview) {
          this.selectedMediaForOverview = newSelection[0]
        }
        else if (this.selectedMediaForOverview && !newSelection.find(m => m._id === this.selectedMediaForOverview._id)) {
          this.selectedMediaForOverview = null
        }
      },
      immediate: false,
      deep: false, // Only watch for array reference changes
    },
  },
  methods: {
    ...mapActions("inbox", ["clearSelectedMedias"]),
    reset() {
      this.clearSelectedMedias()
      this.lastPage = 0
      this.page = 0
      this._loadMorePending = false
      // Clear caches
      this._filteredMediasCache = null;
    },
    handleSelectAll() {
      this.isSelectAll = !this.isSelectAll
      this.$emit("select-all", this.isSelectAll)
    },
    setupIntersectionObserver() {
      if (!this.enablePagination || this.observer) return
      
      const options = {
        root: null,
        rootMargin: "100px", // Increase rootMargin for better UX
        threshold: 0.1, // Reduce threshold for earlier triggering
      }
      
      this.observer = new IntersectionObserver(this.handleIntersection, options)
      
      this.$nextTick(() => {
        this.observeMediaItems()
      })
    },

    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index")) + 1
          const currentPage = Math.floor(index / this.pageSize)
          if (
            index % this.pageSize === 0 &&
            currentPage <= this.totalPages - 1 &&
            currentPage > this.lastPage &&
            !this._loadMorePending // Prevent multiple calls
          ) {
            this.lastPage = currentPage
            this._loadMorePending = true
            this.$emit("load-more", currentPage)
            
            // Reset flag after a delay to allow the parent to process
            setTimeout(() => {
              this._loadMorePending = false
            }, 1000)
          }
        }
      })
    },

    observeMediaItems() {
      if (!this.observer || this.filteredMedias.length === 0) return
      
      // Only observe the last few items for pagination trigger
      const itemsToObserve = Math.min(3, this.filteredMedias.length);
      const startIndex = Math.max(0, this.filteredMedias.length - itemsToObserve);
      
      for (let i = startIndex; i < this.filteredMedias.length; i++) {
        const itemRef = this.$refs["mediaItem" + i];
        if (itemRef && itemRef[0]?.$el) {
          itemRef[0].$el.setAttribute("data-index", i);
          this.observer.observe(itemRef[0].$el);
        }
      }
    },

    initializePageFromURL() {
      const urlParams = new URLSearchParams(window.location.search)

      // Initialize page
      const pageParam = urlParams.get("page")
      if (pageParam) {
        const parsedPage = parseInt(pageParam)
        if (
          !isNaN(parsedPage) &&
          parsedPage > 0 &&
          parsedPage <= this.totalPages
        ) {
          this.page = parsedPage
        } else {
          this.updateURLPage(1)
        }
      }
    },

    updateFiltersInURL() {
      // Don't update URL if parent is managing pagination and filters
      if (!this.enablePagination) return

      const url = new URL(window.location)

      if (this.activeSelectedTagIds.length > 0) {
        url.searchParams.set("tags", this.activeSelectedTagIds.join(","))
      } else {
        url.searchParams.delete("tags")
      }

      window.history.replaceState({}, "", url)
    },

    updateURLPage(page) {
      const validPage = Math.max(1, Math.min(page, this.totalPages))
      if (validPage !== this.page && validPage <= this.totalPages) {
        this.page = validPage
        const url = new URL(window.location)
        url.searchParams.set("page", validPage.toString())

        // Keep filter params in URL
        if (this.activeSelectedTagIds.length > 0) {
          url.searchParams.set("tags", this.activeSelectedTagIds.join(","))
        }

        window.history.replaceState({}, "", url)
        this.$emit("page-change", validPage)
      }
    },

    handleSearch(search, filters) {
      this.$emit("search", search, filters)
    },

    handleTagsChanged() {
      this.$emit("tags-changed")
    },

    selectMediaForOverview(media) {
      this.selectedMediaForOverview = media
    },

    closeRightPanel() {
      this.selectedMediaForOverview = null
      this.rightPanelWidth = 0
      if (this.selectedMedias.length > 1) {
        this.clearSelectedMedias()
      }
    },

    handleRightPanelResize(width) {
      this.rightPanelWidth = width
    },

    updateCounts() {
      this.$nextTick(() => {
      });
    },

    cleanupObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },
  },
}
</script>

<style scoped lang="scss">
.media-explorer {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.media-explorer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: var(--border-block, 1px solid var(--neutral-30));
  background-color: var(--background-color, #fff);
}

.media-explorer__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}

.media-explorer__body {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.media-explorer__body__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 0.5rem;
  transition: padding-right 0.3s ease;
  position: relative;
}

.media-explorer__body.has-right-panel .media-explorer__body__content {
  //margin-right: var(--right-panel-width, 600px);
  //max-width: calc(100% - var(--right-panel-width, 400px));
  width: 100%;
  padding-right: calc(var(--right-panel-width, 400px) + 1rem);
}

.media-explorer__body .media-explorer-right-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: var(--background-color, #fff);
  border-left: var(--border-block, 1px solid var(--neutral-30));
  flex-shrink: 0;
  width: var(--right-panel-width, 400px);
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.media-explorer__body__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 25vh;
}

.media-explorer__body__item {
  margin: 0.25rem 0;
}

.empty-state {
  color: var(--text-muted, #666);
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

.bulk-actions-hint {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  font-style: italic;
  padding: 0.25rem 0.5rem;
  background-color: var(--primary-soft, #f8f9fa);
  border-radius: 4px;
  border: 1px solid var(--primary-color, #007bff);
}

@media only screen and (max-width: 1100px) {
  .media-explorer__body__item {
    overflow: auto;
  }

  .media-explorer__body {
    flex-direction: column;
  }

  .media-explorer__body__content {
    margin-right: 0 !important;
    padding-right: 0 !important;
  }

  .media-explorer__body .media-explorer-right-panel {
    position: relative;
    width: 100%;
    border-left: none;
    border-top: var(--border-block, 1px solid var(--neutral-30));
  }

  .media-explorer__body.has-right-panel .media-explorer__body__content {
    padding-right: 0;
  }
}
</style>

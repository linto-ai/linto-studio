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
                class="media-explorer__body__item" />
            </template>
          </IsMobile>
          <slot name="after" />
        </div>

        <!-- Right panel for desktop only -->
        <IsMobile>
          <template #desktop>
            <MediaExplorerRightPanel
              v-if="selectedMedias.length > 0 && currentOrganizationScope"
              :currentOrganizationScope="currentOrganizationScope"
              :readonly-tags="readonlyTags"
              @close="closeRightPanel"
              @resize="handleRightPanelResize" />
          </template>
        </IsMobile>

        <ModalDeleteConversations
          v-if="showDeleteModal"
          :visible="showDeleteModal"
          :medias="selectedMedias"
          @close="showDeleteModal = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

import { mediaScopeMixin } from "@/mixins/mediaScope"

import MediaExplorerHeader from "@/components/MediaExplorerHeader.vue"
import MediaExplorerItem from "@/components/MediaExplorerItem.vue"
import MediaExplorerItemMobile from "@/components-mobile/MediaExplorerItem.vue"
import MediaExplorerRightPanel from "@/components/MediaExplorerRightPanel.vue"
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"
import ModalDeleteConversations from "@/components/ModalDeleteConversations.vue"
import ConversationShareMultiple from "@/components/ConversationShareMultiple.vue"
import Loading from "@/components/atoms/Loading.vue"
import IsMobile from "@/components/atoms/IsMobile.vue"

export default {
  mixins: [mediaScopeMixin],
  name: "MediaExplorer",
  components: {
    MediaExplorerHeader,
    MediaExplorerItem,
    MediaExplorerItemMobile,
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
      return this.totalItemsCount || this.reactiveMedias.length
    },
    // Get reactive medias from store to ensure updates are reflected
    reactiveMedias() {
      return this.medias.map((media) => {
        const storeMedia = this.$store.getters[
          `${this.storeScope}/getMediaById`
        ](media._id)
        // Store now contains all necessary properties, merge with original as fallback
        if (storeMedia) {
          return {
            ...media,
            ...storeMedia,
          }
        }

        return media
      })
    },
    ...mapGetters("tags", ["getExploreSelectedTags"]),
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    activeSelectedTagIds() {
      return this.selectedTagIds || []
    },
    filteredMedias() {
      const medias = this.reactiveMedias
      const tagIds = this.activeSelectedTagIds

      // Memoization: check if we can reuse cached result
      if (
        this._filteredMediasCache &&
        this._filteredMediasCache.medias === medias &&
        JSON.stringify(this._filteredMediasCache.tagIds) ===
          JSON.stringify(tagIds)
      ) {
        return this._filteredMediasCache.result
      }

      let result

      if (tagIds.length === 0) {
        result = medias
      } else {
        result = medias.filter((media) => {
          if (!media.tags || !Array.isArray(media.tags)) {
            return false
          }
          return tagIds.every((tagId) => media.tags.includes(tagId))
        })
      }

      // Cache the result
      this._filteredMediasCache = { medias, tagIds, result }
      return result
    },
    selectedCount() {
      const count = this.selectedMedias.length
      return count
    },
    totalCount() {
      const count = this.reactiveMedias.length
      return count
    },
  },
  data() {
    return {
      observer: null,
      search: "",
      showDeleteModal: false,
      selectedMediaForOverview: null,
      rightPanelWidth: this.calculateDefaultRightPanelWidth(),
      _filteredMediasCache: null,
      _observerSetupPending: false,
      _loadMorePending: false, // Prevent multiple simultaneous load-more calls
    }
  },
  mounted() {
    // Remove initialization of filters from URL when parent manages tags
    if (this.enablePagination) {
      this.setupIntersectionObserver()
    }

    // Add window resize listener for responsive right panel
    this.handleWindowResize = this.debounce(() => {
      if (this.selectedMediaForOverview && this.rightPanelWidth > 0) {
        this.rightPanelWidth = this.calculateDefaultRightPanelWidth()
      }
    }, 250)

    window.addEventListener("resize", this.handleWindowResize)
  },
  beforeDestroy() {
    this.cleanupObserver()
    // Clean up window resize listener
    if (this.handleWindowResize) {
      window.removeEventListener("resize", this.handleWindowResize)
    }
  },
  watch: {
    medias: {
      handler(newMedias, oldMedias) {
        this.updateCounts()

        // Only recreate observer if array reference actually changed and pagination is enabled
        if (this.enablePagination && newMedias !== oldMedias) {
          // Debounce observer setup to avoid excessive recreation
          if (this._observerSetupPending) return

          this._observerSetupPending = true
          this.$nextTick(() => {
            this.cleanupObserver()
            this.setupIntersectionObserver()
            this.observeMediaItems()
            this._observerSetupPending = false

            // Reset the load-more pending flag when new medias arrive
            // This allows the observer to trigger again for the new last items
            setTimeout(() => {
              this._loadMorePending = false
            }, 500)
          })
        }
      },
      immediate: true,
      deep: false, // Only watch for array reference changes, not deep changes
    },
    selectedMedias: {
      handler(newSelection, oldSelection) {
        if (
          oldSelection &&
          oldSelection.length > 1 &&
          newSelection.length === 0
        ) {
          this.selectedMediaForOverview = null
          this.rightPanelWidth = 0
        } else if (
          oldSelection &&
          oldSelection.length > 1 &&
          newSelection.length === 1
        ) {
          this.selectedMediaForOverview = newSelection[0]
          // Auto-adjust width when switching from multiple to single selection
          if (this.rightPanelWidth === 0) {
            this.rightPanelWidth = this.calculateDefaultRightPanelWidth()
          }
        } else if (
          newSelection.length === 1 &&
          !this.selectedMediaForOverview
        ) {
          this.selectedMediaForOverview = newSelection[0]
          // Auto-adjust width when opening panel
          if (this.rightPanelWidth === 0) {
            this.rightPanelWidth = this.calculateDefaultRightPanelWidth()
          }
        } else if (
          this.selectedMediaForOverview &&
          !newSelection.find((m) => m._id === this.selectedMediaForOverview._id)
        ) {
          this.selectedMediaForOverview = null
        }
      },
      immediate: false,
      deep: false, // Only watch for array reference changes
    },
  },
  methods: {
    calculateDefaultRightPanelWidth() {
      // Calculate responsive right panel width based on screen size
      const screenWidth = window.innerWidth || 1920
      const maxWidth = screenWidth * 0.5 // 50% max viewport width
      const minWidth = 300 // Minimum 300px

      let calculatedWidth

      if (screenWidth <= 1200) {
        // For mobile/tablet, the panel will be full width anyway
        calculatedWidth = Math.min(maxWidth, screenWidth * 0.4) // 40% of screen width
      } else if (screenWidth <= 1600) {
        calculatedWidth = screenWidth * 0.32 // 32% of screen width
      } else if (screenWidth <= 2000) {
        calculatedWidth = screenWidth * 0.3 // 30% of screen width
      } else {
        calculatedWidth = screenWidth * 0.28 // 28% of screen width
      }

      // Ensure width is within min/max bounds
      return Math.max(minWidth, Math.min(maxWidth, calculatedWidth))
    },
    reset() {
      this.clearSelectedMedias()
      this._loadMorePending = false
      // Clear caches
      this._filteredMediasCache = null
    },
    handleSelectAll() {
      console.log("select all todo")
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
        if (entry.isIntersecting && !this._loadMorePending) {
          const index = parseInt(entry.target.getAttribute("data-index"))

          // Trigger load-more when we're near the end of the list
          // Use a simple threshold: when we see one of the last 3 items
          const isNearEnd = index >= this.filteredMedias.length - 3

          if (isNearEnd) {
            this._loadMorePending = true
            this.$emit("load-more") // Emit without page number - let parent handle page logic

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
      const itemsToObserve = Math.min(3, this.filteredMedias.length)
      const startIndex = Math.max(
        0,
        this.filteredMedias.length - itemsToObserve,
      )

      for (let i = startIndex; i < this.filteredMedias.length; i++) {
        const itemRef = this.$refs["mediaItem" + i]
        if (itemRef && itemRef[0]?.$el) {
          itemRef[0].$el.setAttribute("data-index", i)
          this.observer.observe(itemRef[0].$el)
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

    handleSearch(search, filters) {
      this.$emit("search", search, filters)
    },

    handleTagsChanged() {
      this.$emit("tags-changed")
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
      this.$nextTick(() => {})
    },

    cleanupObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },

    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
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
  position: relative;
  container-type: size;
  container-name: medias-list;
}

.media-explorer__body .media-explorer-right-panel {
  // position: absolute;
  // right: 0;
  // top: 0;
  // bottom: 0;
  // z-index: 1000;
  background-color: var(--background-color, #fff);
  border-left: var(--border-block, 1px solid var(--neutral-30));
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  width: var(--right-panel-width, 500px);
  min-width: 300px;
  /* Minimum width to prevent too narrow panels */
  max-width: 50vw;
  /* Maximum 50% of viewport width */
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
  // transition:
  //   width 0.3s ease,
  //   box-shadow 0.3s ease;
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

@media only screen and (max-width: 1500px) {
  .media-explorer__body {
    flex-direction: column;
  }

  .media-explorer__body__content {
    margin-right: 0 !important;
    padding-right: 0.5rem !important;
    overflow-x: visible;
  }

  .media-explorer__body .media-explorer-right-panel {
    position: relative;
    width: 100% !important;
    min-width: unset !important;
    max-width: unset !important;
    border-left: none;
    border-top: var(--border-block, 1px solid var(--neutral-30));
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    max-height: 50vh;
  }
}

/* Amélioration pour les très petits écrans */
@media only screen and (max-width: 768px) {
  .media-explorer__body .media-explorer-right-panel {
    max-height: 60vh;
  }

  .media-explorer__body__content {
    padding: 0.25rem !important;
  }
}
</style>

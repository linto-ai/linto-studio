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
        :total-count="filteredMedias.length"
        :loading="loading"
        :is-select-all="isSelectAll"
        :sticky-top-offset="stickyTopOffset"
        :all-medias="medias"
        :search-value="searchValue"
        @select-all="handleSelectAll"
        @search="handleSearch">
        <template #actions>
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
            <slot name="header-actions" />
          </div>
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
              :media="media" />
            <template #desktop>
              <MediaExplorerItem
                v-for="(media, index) in filteredMedias"
                :key="`media-explorer-item-${media._id}-${index}`"
                :media="media"
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
              v-if="selectedMediaForOverview"
              :selected-media="reactiveSelectedMediaForOverview"
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
import { mapGetters } from "vuex"

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
  },
  computed: {
    selectedMedias() {
      return this.$store.state.inbox.selectedMedias
    },
    ...mapGetters("tags", ["getExploreSelectedTags"]),
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    selectedTagIds() {
      return this.getExploreSelectedTags.map((t) => t._id)
    },
    totalPages() {
      return Math.ceil(this.filteredMedias.length / this.pageSize)
    },
    // Replace old selectedTagIds getter with prop-based value
    activeSelectedTagIds() {
      // Use the prop provided by parent as the single source of truth
      return this.selectedTagIds
    },
    filteredMedias() {
      // Filter medias based on selected tags
      if (this.activeSelectedTagIds.length === 0) {
        return this.medias
      }

      return this.medias.filter((media) => {
        // Check if media has tags property and at least one selected tag
        if (!media.tags || !Array.isArray(media.tags)) {
          return false
        }

        // Check if media has ALL selected tags (AND logic)
        return this.activeSelectedTagIds.every((tagId) =>
          media.tags.includes(tagId),
        )
      })
    },
    reactiveSelectedMediaForOverview() {
      return this.medias.find(
        (media) => media._id === this.selectedMediaForOverview?._id,
      )
    },
  },
  data() {
    return {
      page: 1,
      isSelectAll: false,
      observer: null,
      search: "",
      showDeleteModal: false,
      selectedMediaForOverview: null,
      rightPanelWidth: 400, // Default width for the right panel
      // Internal state no longer required for tag selection
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
      handler() {
        if (this.enablePagination) {
          this.$nextTick(() => {
            this.cleanupObserver()
            this.setupIntersectionObserver()
            this.observeMediaItems()
          })
        }
      },
      deep: true,
    },
  },
  methods: {
    // Selection handlers
    handleSelectAll() {
      this.isSelectAll = !this.isSelectAll
      this.$emit("select-all", this.isSelectAll)
    },
    // Pagination & Intersection Observer
    setupIntersectionObserver() {
      if (!this.enablePagination) return

      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }

      this.observer = new IntersectionObserver(this.handleIntersection, options)

      this.$nextTick(() => {
        this.observeMediaItems()
      })
    },

    handleIntersection(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index"))
          const currentPage = Math.floor(index / this.pageSize) + 1

          if (currentPage !== this.page && currentPage <= this.totalPages) {
            this.updateURLPage(currentPage)
          }
        }
      })
    },

    observeMediaItems() {
      if (!this.observer) return

      this.filteredMedias.forEach((_, index) => {
        const itemRef = this.$refs["mediaItem" + index]
        if (itemRef && itemRef[0]?.$el) {
          itemRef[0].$el.setAttribute("data-index", index)
          this.observer.observe(itemRef[0].$el)
        }
      })
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

    selectMediaForOverview(media) {
      this.selectedMediaForOverview = media
    },

    closeRightPanel() {
      this.selectedMediaForOverview = null
      this.rightPanelWidth = 0
    },

    handleRightPanelResize(width) {
      this.rightPanelWidth = width
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

<style scoped>
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
  transition: margin-right 0.3s ease;
}

.media-explorer__body.has-right-panel .media-explorer__body__content {
  margin-right: var(--right-panel-width, 600px);
}

.media-explorer__body .media-explorer-right-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: var(--background-color, #fff);
  border-left: var(--border-block, 1px solid var(--neutral-30));
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

@media only screen and (max-width: 1100px) {
  .media-explorer__body__item {
    overflow: auto;
  }

  .media-explorer__body {
    flex-direction: column;
  }

  .media-explorer__body__content {
    margin-right: 0 !important;
  }
}
</style>

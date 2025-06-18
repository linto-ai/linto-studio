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
        :selected-tag-ids="activeSelectedTagIds"
        :search-value="searchValue"
        @select-all="handleSelectAll"
        @filter-change="handleFilterChange"
        @search="handleSearch">
        <template #actions>
          <slot name="header-actions" />
        </template>
      </MediaExplorerHeader>

      <!-- Media list body -->
      <div class="media-explorer__body">
        <slot name="before" />

        <!-- Empty state -->
        <div
          v-if="filteredMedias.length === 0"
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
        <MediaExplorerItem
          v-for="(media, index) in filteredMedias"
          :key="`media-explorer-item-${media._id}-${index}`"
          :media="media"
          :ref="'mediaItem' + index"
          class="media-explorer__body__item" />

        <slot name="after" />
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main.js"
import MediaExplorerHeader from "./MediaExplorerHeader.vue"
import MediaExplorerItem from "./MediaExplorerItem.vue"
import MediaExplorerAppUpload from "./MediaExplorerAppUpload.vue"
import Modal from "./molecules/Modal.vue"
import Button from "./atoms/Button.vue"

export default {
  name: "MediaExplorer",
  components: {
    MediaExplorerHeader,
    MediaExplorerItem,
    MediaExplorerAppUpload,
    Modal,
    Button,
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
    currentOrganizationScope: {
      type: String,
      required: false,
    },
    // Search value from URL
    searchValue: {
      type: String,
      default: "",
    },
    // Selected tag IDs passed from parent (optional)
    selectedTagIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    selectedMedias() {
      return this.$store.state.inbox.selectedMedias
    },
    totalPages() {
      return Math.ceil(this.filteredMedias.length / this.pageSize)
    },
    // Use prop selectedTagIds if provided, otherwise use internal state
    activeSelectedTagIds() {
      return this.selectedTagIds.length > 0
        ? this.selectedTagIds
        : this.internalSelectedTagIds
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
  },
  data() {
    return {
      page: 1,
      isSelectAll: false,
      observer: null,
      search: "",
      internalSelectedTagIds: [], // Internal state when not managed by parent
    }
  },
  mounted() {
    if (this.enablePagination) {
      this.setupIntersectionObserver()
      this.initializePageFromURL()
      // Only initialize filters from URL if pagination is enabled (meaning we manage our own state)
      this.initializeFiltersFromURL()
    } else {
      // If pagination is disabled, the parent manages filters and passes them via props
      // We still initialize filters if no selected-tag-ids prop is provided for backward compatibility
      if (this.selectedTagIds.length === 0) {
        this.initializeFiltersFromURL()
      }
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

    initializeFiltersFromURL() {
      const urlParams = new URLSearchParams(window.location.search)

      // Initialize tag filters from URL
      const tagsParam = urlParams.get("tags")
      if (tagsParam) {
        const tagIds = tagsParam.split(",").filter((id) => id.trim())
        if (tagIds.length > 0) {
          // Only set internal state if parent is not managing the tags
          if (this.selectedTagIds.length === 0) {
            this.internalSelectedTagIds = tagIds
          }
          // Emit filter change event after component is mounted
          this.$nextTick(() => {
            this.$emit("filter-change", {
              selectedTagIds: tagIds,
              filteredCount: this.filteredMedias.length,
              totalCount: this.medias.length,
            })
          })
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
      console.log("updateURLPage", page)
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

    handleFilterChange(newTagIds) {
      // Only update internal state if parent is not managing the tags
      if (this.selectedTagIds.length === 0) {
        this.internalSelectedTagIds = [...newTagIds]
      }

      // Update URL with new filters only if we manage our own state
      if (this.enablePagination) {
        this.updateFiltersInURL()

        // Reset to first page when filters change
        this.updateURLPage(1)
      }

      // Clear current selection when filter changes
      this.$store.commit("inbox/clearSelectedMedias")
      this.isSelectAll = false

      // Emit filter change event for parent components
      this.$emit("filter-change", {
        selectedTagIds: newTagIds,
        filteredCount: this.filteredMedias.length,
        totalCount: this.medias.length,
      })

      // Re-setup intersection observer for new filtered list
      if (this.enablePagination) {
        this.$nextTick(() => {
          this.cleanupObserver()
          this.setupIntersectionObserver()
          this.observeMediaItems()
        })
      }
    },

    cleanupObserver() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    },

    handleSearch(search, filters) {
      this.$emit("search", search, filters)
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
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 0.25rem 0.5rem;
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
</style>

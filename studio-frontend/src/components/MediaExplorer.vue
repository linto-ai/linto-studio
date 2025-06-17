<template>
  <div
    class="media-explorer"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop">
    
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
        <div v-if="filteredMedias.length === 0" class="media-explorer__body__empty">
          <slot name="empty">
            <div class="empty-state">
              <p v-if="activeSelectedTagIds.length > 0">Aucun média trouvé avec les tags sélectionnés</p>
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

    <!-- Upload Modal -->
    <Modal
      v-model="showUploadModal"
      title="Téléversement de fichiers"
      subtitle="Téléversez vos médias audio ou vidéo pour les transcrire"
      size="xl"
      :with-actions="false"
      overlay>
      
      <template v-slot:content>
        <MediaExplorerAppUpload
          ref="uploadComponent"
          :transcriptionServices="transcriptionServices"
          :loadingServices="loadingServices"
          :disabled="uploadInProgress"
          :currentOrganizationScope="currentOrganizationScope"
          @upload-complete="handleUploadComplete"
          @error="handleUploadError" />

        <div class="modal-actions">
          <div class="error-message" v-if="uploadError">
            <ph-icon name="warning" color="error" />
            <span>{{ uploadError }}</span>
          </div>
          <div class="flex1" v-else></div>
          
          <div class="actions-buttons">
            <Button
              color="secondary"
              variant="outline"
              @click="closeUploadModal"
              :disabled="uploadInProgress">
              Fermer
            </Button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Upload overlay for drag feedback -->
    <div v-if="isDraggingOver && !showUploadModal" class="upload-overlay">
      <div class="upload-overlay-content">
        <ph-icon name="cloud-arrow-up" size="xl" color="primary" />
        <h3>Déposez vos fichiers ici</h3>
        <p>Les fichiers seront ajoutés pour transcription</p>
      </div>
    </div>
  </div>
</template>

<script>
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
      return this.selectedTagIds.length > 0 ? this.selectedTagIds : this.internalSelectedTagIds
    },
    filteredMedias() {
      // Filter medias based on selected tags
      if (this.activeSelectedTagIds.length === 0) {
        return this.medias
      }
      
      return this.medias.filter(media => {
        // Check if media has tags property and at least one selected tag
        if (!media.tags || !Array.isArray(media.tags)) {
          return false
        }
        
        // Check if media has ALL selected tags (AND logic)
        return this.activeSelectedTagIds.every(tagId => 
          media.tags.includes(tagId)
        )
      })
    },
  },
  data() {
    return {
      page: 1,
      isDraggingOver: false,
      showUploadModal: false,
      uploadInProgress: false,
      uploadError: '',
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
    // Drag & Drop handlers
    handleDragOver(event) {
      this.isDraggingOver = true
      event.currentTarget.classList.add("drag-over")
    },

    handleDragLeave(event) {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return
      }
      this.isDraggingOver = false
      event.currentTarget.classList.remove("drag-over")
    },

    handleDrop(event) {
      this.isDraggingOver = false
      event.currentTarget.classList.remove("drag-over")

      const files = Array.from(event.dataTransfer.files)
      const mediaFiles = this.filterMediaFiles(files)

      if (mediaFiles.length === 0) {
        this.handleUploadError("Seuls les fichiers audio et vidéo sont acceptés.")
        return
      }

      // Open upload modal with dropped files
      this.openUploadModalWithFiles(mediaFiles)
    },

    // File filtering
    filterMediaFiles(files) {
      return files.filter((file) => {
        return file.type.startsWith("audio/") || file.type.startsWith("video/")
      })
    },

    // Upload modal management
    openUploadModalWithFiles(files) {
      this.showUploadModal = true
      this.uploadError = ''
      
      // Wait for modal to be mounted then add files
      this.$nextTick(() => {
        // Find the MediaExplorerAppUpload component and add files to it
        const uploadComponent = this.$refs["uploadComponent"]
        
        if (uploadComponent) {
          // Process files directly in the upload component
          uploadComponent.processFiles(files)
        }
      })
    },

    closeUploadModal() {
      this.showUploadModal = false
      this.uploadError = ''
    },

    handleUploadComplete(data) {
      console.log('Upload completed:', data)
      
      // Emit upload complete event for parent components
      this.$emit('upload-complete', data)
      
      // Close modal
      this.closeUploadModal()
      
      // Show success message
      this.$emit('success', `${data.files.length} fichier(s) téléversé(s) avec succès`)
    },

    handleUploadError(error) {
      this.uploadError = error
      console.error('Upload error:', error)
      this.$emit('upload-error', error)
    },

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
        const tagIds = tagsParam.split(",").filter(id => id.trim())
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
              totalCount: this.medias.length
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
        totalCount: this.medias.length
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

.media-explorer.drag-over {
  outline: 2px dashed var(--success-color, #4caf50);
  outline-offset: -2px;
}

.media-explorer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: var(--border-block, 1px solid #e0e0e0);
  background-color: var(--surface-color, #fff);
}

.media-explorer__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
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

/* Upload overlay styles */
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.upload-overlay-content {
  background-color: var(--neutral-10);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.upload-overlay-content h3 {
  margin: 1rem 0 0.5rem 0;
  color: var(--neutral-100);
  font-size: 1.2rem;
}

.upload-overlay-content p {
  margin: 0;
  color: var(--neutral-70);
  font-size: 0.9rem;
}

/* Modal actions styles */
.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-30);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--error);
  font-size: 0.9rem;
}

.actions-buttons {
  display: flex;
  gap: 0.5rem;
}

.flex1 {
  flex: 1;
}
</style>

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
        :selected-count="selectedCount"
        :total-count="totalCount"
        :loading="loading"
        :all-medias="medias"
        @select-all="handleSelectAll">
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
          <Loading v-if="loading" />
          <!-- Empty state -->
          <div
            v-else-if="medias.length === 0"
            class="media-explorer__body__empty">
            <slot name="empty">
              <div class="empty-state">
                <p>Aucun média trouvé</p>
              </div>
            </slot>
          </div>

          <!-- Media items -->
          <IsMobile>
            <MediaExplorerItemMobile
              v-for="(media, index) in medias"
              :key="`media-explorer-item-${media._id}-${index}`"
              :media="media" />
            <template #desktop>
              <MediaExplorerItem
                v-for="(media, index) in medias"
                :key="`media-explorer-item-${media._id}-${index}`"
                :media="media"
                :ref="'mediaItem' + index"
                class="media-explorer__body__item" />
            </template>
          </IsMobile>
          <div v-if="loadingNextPage" class="loading-next-page">
            <p>Chargement de la page suivante</p>
          </div>
        </div>

        <!-- Right panel for desktop only -->
        <IsMobile>
          <template #desktop>
            <MediaExplorerRightPanel
              v-if="selectedMedias.length > 0 && currentOrganizationScope"
              :currentOrganizationScope="currentOrganizationScope"
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
    loadingNextPage: {
      type: Boolean,
      default: false,
    },
    error: {
      type: [String, null],
      default: null,
    },
  },
  computed: {
    ...mapGetters("tags", ["getExploreSelectedTags"]),
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    selectedCount() {
      const count = this.selectedMedias.length
      return count
    },
    totalCount() {
      const count = this.medias.length
      return count
    },
    hasMore() {
      return this.$store.state[this.storeScope].pagination.hasMore
    },
  },
  data() {
    return {
      observer: null,
      search: "",
      showDeleteModal: false,
      rightPanelWidth: 500,
      _observerSetupPending: false,
      _loadMorePending: false, // Prevent multiple simultaneous load-more calls
    }
  },
  mounted() {},
  beforeDestroy() {
    this.cleanupObserver()
  },
  watch: {
    loading: {
      immediate: true,
      handler(newValue, oldvalue) {
        if (newValue) {
          this.cleanupObserver()
        }

        if (oldvalue && !newValue) {
          if (this.hasMore) {
            this.setupIntersectionObserver()
          }
        }
      },
    },
    loadingNextPage: {
      immediate: true,
      handler(newValue, oldvalue) {
        if (newValue) {
          this.cleanupObserver()
        }

        if (oldvalue && !newValue) {
          if (this.hasMore) {
            this.setupIntersectionObserver()
          }
        }
      },
    },
  },
  methods: {
    reset() {
      this.clearSelectedMedias()
      this._loadMorePending = false
    },
    handleSelectAll() {
      if (this.isSelectAll) {
        this.clearSelectedMedias()
      } else {
        this.selectAll()
      }
    },
    setupIntersectionObserver() {
      if (this.observer) {
        this.cleanupObserver()
      }

      const options = {
        root: null, // maybe use "media-explorer__body__content"
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
          this.$emit("load-more") // Emit without page number - let parent handle page logic
        }
      })
    },

    observeMediaItems() {
      if (!this.observer || this.medias.length === 0) return
      const index = this.medias.length - 1
      const itemRef = this.$refs["mediaItem" + index]
      if (itemRef && itemRef[0]?.$el) {
        this.observer.observe(itemRef[0].$el)
      }
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
  min-width: 500px;
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

<template>
  <div class="media-explorer-menu flex col flex1">
    <div class="media-explorer-menu__sub">
      <ul class="media-explorer-menu__list">
        <FolderTreeNode
          :folder="inboxFolder"
          :virtual="true"
          icon="tray"
          :selectedFolderId="isInboxActive ? 'inbox' : null"
          @select="handleInboxClick"
          @drop-media="handleInboxDrop" />
        <!-- Session mode (SRT/RTMP streams, scheduling) is not part of the SaaS
             plans: in cloud mode the entry stays visible with a lock and leads to
             the live product page. Transparent in OSS builds. -->
        <HasEntitlement v-if="sessionEnable" capability="live.sessions">
          <FolderTreeNode
            :folder="sessionsFolder"
            :virtual="true"
            icon="broadcast"
            :selectedFolderId="isSessionsActive ? 'sessions' : null"
            @select="handleSessionsClick" />
          <template #locked>
            <FolderTreeNode
              :folder="sessionsFolder"
              :virtual="true"
              icon="lock"
              :selectedFolderId="null"
              @select="openLiveProduct" />
          </template>
        </HasEntitlement>
        <FolderTreeNode
          v-if="processingCount > 0"
          :folder="processingFolder"
          :virtual="true"
          icon="arrows-clockwise"
          :selectedFolderId="isProcessingActive ? 'processing' : null"
          @select="handleProcessingClick" />
      </ul>
      <FolderTree />
    </div>

    <!-- Personnel -->
    <div
      class="media-explorer-menu__item media-explorer-menu__item--section media-explorer-menu__item--label">
      <ph-icon name="user" size="20" />
      <span>{{ $t("navigation.sections.personal") }}</span>
    </div>
    <div class="media-explorer-menu__sub">
      <ul class="media-explorer-menu__list">
        <FolderTreeNode
          :folder="favoritesFolder"
          :virtual="true"
          icon="star"
          :selectedFolderId="isFavoritesActive ? 'favorites' : null"
          @select="handleFavoritesClick" />
        <FolderTreeNode
          :folder="sharedFolder"
          :virtual="true"
          icon="share-network"
          :selectedFolderId="isSharedActive ? 'shared' : null"
          @select="handleSharedClick" />
      </ul>
    </div>

    <MediaExplorerMenuLabels v-if="showTagLabels" />
  </div>
</template>

<script>
import { mediaScopeMixin } from "@/mixins/mediaScope"
import { getEnv } from "@/tools/getEnv"
import FolderTree from "@/components/FolderTree.vue"
import FolderTreeNode from "@/components/FolderTreeNode.vue"
import MediaExplorerMenuLabels from "@/components/MediaExplorerMenuLabels.vue"
import HasEntitlement from "@/components-cloud/HasEntitlement.vue"

export default {
  name: "MediaExplorerMenu",
  mixins: [mediaScopeMixin],
  components: {
    FolderTree,
    FolderTreeNode,
    MediaExplorerMenuLabels,
    HasEntitlement,
  },
  data() {
    return {
      leavingExplore: false,
    }
  },
  computed: {
    sessionEnable() {
      return getEnv("VUE_APP_ENABLE_SESSION") === "true"
    },
    currentUserId() {
      return this.$store.getters["user/getUserId"]
    },
    isMediaRoute() {
      return this.$route.name === "explore" || this.$route.name === "inbox"
    },
    selectedFolderId() {
      return this.$route.params.folderId
    },
    isSearchActive() {
      return this.hasActiveSearch
    },
    isInboxActive() {
      if (this.isSearchActive) return false
      return this.isMediaRoute && this.selectedFolderId === undefined
    },
    isSessionsActive() {
      return this.$route.name === "sessionsList"
    },
    isFavoritesActive() {
      return this.$route.name === "explore-favorites"
    },
    isSharedActive() {
      return this.$route.name === "explore-shared"
    },
    inboxFolder() {
      return { _id: "inbox", name: this.$t("navigation.sections.media") }
    },
    sessionsFolder() {
      return { _id: "sessions", name: this.$t("navigation.tabs.sessions") }
    },
    favoritesFolder() {
      return { _id: "favorites", name: this.$t("navigation.tabs.favorites") }
    },
    sharedFolder() {
      return { _id: "shared", name: this.$t("navigation.tabs.shared") }
    },
    processingCount() {
      return (
        this.$store.getters[
          `${this.getCurrentOrganizationScope}/processing/conversations/count`
        ] || 0
      )
    },
    isProcessingActive() {
      return this.$route.name === "explore-processing"
    },
    isExplorePage() {
      return this.$route.name?.startsWith("explore")
    },
    showTagLabels() {
      return (
        this.isExplorePage && !this.leavingExplore && !this.isProcessingActive
      )
    },
    processingFolder() {
      return {
        _id: "processing",
        name: this.$t("navigation.tabs.processing"),
        conversationCount: this.processingCount,
      }
    },
  },
  watch: {
    getCurrentOrganizationScope: {
      immediate: true,
      handler(orgId) {
        if (!orgId) return
        this.$store.dispatch(
          `${orgId}/processing/conversations/loadStatusCount`,
        )
      },
    },
  },
  methods: {
    handleInboxClick() {
      this.clearSearch()
      this.selectFolder(undefined)
    },
    handleSessionsClick() {
      this.leavingExplore = true
      this.clearSearch()
      this.$router
        .push({
          name: "sessionsList",
          params: { organizationId: this.getCurrentOrganizationScope },
        })
        .catch(() => {
          this.leavingExplore = false
        })
    },
    openLiveProduct() {
      window.open(getEnv("VUE_APP_SAAS_LIVE_PRODUCT_URL"), "_blank", "noopener")
    },
    handleFavoritesClick() {
      this.clearSearch()
      this.$router.push({
        name: "explore-favorites",
        params: { organizationId: this.getCurrentOrganizationScope },
      })
    },
    handleSharedClick() {
      this.clearSearch()
      this.$router.push({
        name: "explore-shared",
        params: { organizationId: this.getCurrentOrganizationScope },
      })
    },
    handleProcessingClick() {
      this.clearSearch()
      this.$router.push({
        name: "explore-processing",
        params: { organizationId: this.getCurrentOrganizationScope },
      })
    },
    selectFolder(folderId) {
      this.$router
        .push({
          name: "explore",
          params: {
            organizationId: this.getCurrentOrganizationScope,
            folderId,
          },
        })
        .catch(() => {})
    },
    async handleInboxDrop({ conversationIds }) {
      if (!conversationIds || conversationIds.length === 0) return
      try {
        await this.$store.dispatch("folders/uncategorizeConversations", {
          conversationIds,
        })
        this.selectFolder(undefined)
        await this.$store.dispatch("folders/fetchFolders")
      } catch (error) {
        console.error("Error uncategorizing conversations:", error)
      }
    },
  },
}
</script>

<style lang="scss">
.media-explorer-menu {
  overflow: auto;
  padding-top: 0.5rem;
  border-bottom: var(--border-block);
  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-left: 2px solid transparent;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    user-select: none;

    &:hover {
      background-color: var(--primary-soft);
    }

    &--section {
      font-weight: 600;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }

    &--label {
      cursor: default;

      &:hover {
        background-color: transparent;
      }
    }
  }

  &__sub {
    display: flex;
    flex-direction: column;
  }
}
</style>

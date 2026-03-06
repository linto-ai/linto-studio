<template>
  <div class="media-explorer-menu">
    <!-- Organisation -->
    <div
      class="media-explorer-menu__item media-explorer-menu__item--section"
      @click="openOrgSelector">
      <ph-icon name="user-switch" size="20" />
      <div class="media-explorer-menu__item__org-info">
        <span class="media-explorer-menu__item__org-name">{{ orgName }}</span>
        <span class="media-explorer-menu__item__org-role">{{
          currentRoleToString
        }}</span>
      </div>
      <button
        v-if="isAtLeastMaintainer"
        class="media-explorer-menu__item__action"
        :title="$t('folders.create')"
        @click.stop="$refs.folderTree.toggleCreate()">
        <ph-icon name="plus" size="14" />
      </button>
    </div>
    <div class="media-explorer-menu__sub">
      <ul class="media-explorer-menu__list">
        <FolderTreeNode
          :folder="inboxFolder"
          :virtual="true"
          icon="tray"
          :activeFolderId="isInboxActive ? 'inbox' : null"
          @select="handleInboxClick"
          @drop-media="handleInboxDrop" />
        <FolderTreeNode
          v-if="hasSessions"
          :folder="sessionsFolder"
          :virtual="true"
          icon="broadcast"
          :activeFolderId="isSessionsActive ? 'sessions' : null"
          @select="handleSessionsClick" />
      </ul>
      <FolderTree ref="folderTree" />
    </div>

    <ModalSwitchOrg
      v-model="modalOrgSelector"
      @close="modalOrgSelector = false" />

    <!-- Personnel -->
    <div class="media-explorer-menu__item media-explorer-menu__item--section">
      <ph-icon name="user" size="20" />
      <span>{{ $t("navigation.sections.personal") }}</span>
    </div>
    <div class="media-explorer-menu__sub">
      <ul class="media-explorer-menu__list">
        <FolderTreeNode
          :folder="favoritesFolder"
          :virtual="true"
          icon="star"
          :activeFolderId="isFavoritesActive ? 'favorites' : null"
          @select="handleFavoritesClick" />
        <FolderTreeNode
          :folder="sharedFolder"
          :virtual="true"
          icon="share-network"
          :activeFolderId="isSharedActive ? 'shared' : null"
          @select="handleSharedClick" />
      </ul>
    </div>
  </div>
</template>

<script>
import { apiHasSessions } from "@/api/session.js"
import { mediaScopeMixin } from "@/mixins/mediaScope"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { orgDisplayName } from "@/tools/orgDisplayName"
import FolderTree from "@/components/FolderTree.vue"
import FolderTreeNode from "@/components/FolderTreeNode.vue"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"

export default {
  name: "MediaExplorerMenu",
  mixins: [mediaScopeMixin, orgaRoleMixin],
  components: { FolderTree, FolderTreeNode, ModalSwitchOrg },
  data() {
    return {
      hasSessions: false,
      modalOrgSelector: false,
    }
  },
  computed: {
    currentOrganization() {
      return this.$store.getters["organizations/getCurrentOrganization"]
    },
    currentUserId() {
      return this.$store.getters["user/getUserId"]
    },
    orgName() {
      return orgDisplayName(this.currentOrganization, this.currentUserId)
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
  },
  watch: {
    getCurrentOrganizationScope: {
      immediate: true,
      async handler(orgId, oldOrgId) {
        if (orgId) {
          this.hasSessions = await apiHasSessions(orgId)
          if (oldOrgId && orgId !== oldOrgId) {
            // Only reset folder state — navigation is already handled by the org switch modal
            this.$store.dispatch("folders/setActiveFolderId", null)
          }
        } else {
          this.hasSessions = false
        }
      },
    },
  },
  methods: {
    openOrgSelector() {
      this.modalOrgSelector = true
    },
    handleInboxClick() {
      this.clearSearch()
      if (!this.isMediaRoute) {
        this.$router.push({
          name: "explore",
          params: { organizationId: this.getCurrentOrganizationScope },
        })
      }
      this.selectFolder(undefined)
    },
    handleSessionsClick() {
      this.clearSearch()
      this.$store.dispatch(`${this.storeScope}/setSelectedFolderId`, undefined)
      this.$router.push({
        name: "sessionsList",
        params: { organizationId: this.getCurrentOrganizationScope },
      })
    },
    handleFavoritesClick() {
      this.clearSearch()
      this.$store.dispatch(`${this.storeScope}/setSelectedFolderId`, undefined)
      this.$router.push({
        name: "explore-favorites",
        params: { organizationId: this.getCurrentOrganizationScope },
      })
    },
    handleSharedClick() {
      this.clearSearch()
      this.$store.dispatch(`${this.storeScope}/setSelectedFolderId`, undefined)
      this.$router.push({
        name: "explore-shared",
        params: { organizationId: this.getCurrentOrganizationScope },
      })
    },
    selectFolder(folderId) {
      this.$store.dispatch("folders/setActiveFolderId", null)
      this.$router.push({
        name: "explore",
        params: {
          organizationId: this.getCurrentOrganizationScope,
          folderId,
        },
      }).catch(() => {})
    },
    async handleInboxDrop({ conversationIds }) {
      if (!conversationIds || conversationIds.length === 0) return
      try {
        await this.$store.dispatch("folders/uncategorizeConversations", {
          conversationIds,
        })
        this.$store.dispatch("folders/setActiveFolderId", null)
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
  display: flex;
  flex-direction: column;

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

    &__org-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
      line-height: 1.2;
    }

    &__org-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-decoration: underline transparent;
      transition: text-decoration-color 0.2s;
    }

    &__org-role {
      //font-size: 0.7em;
      font-weight: 400;
      color: var(--text-secondary);
      //padding-left: 0.5em;
    }

    &--section:hover &__org-name {
      text-decoration-color: var(--primary-color);
      color: var(--primary-color);
    }

    &__action {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.2em;
      border-radius: 4px;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: auto;

      &:hover {
        background-color: var(--primary-soft);
        color: var(--primary-color);
      }
    }
  }

  &__sub {
    display: flex;
    flex-direction: column;
  }
}
</style>

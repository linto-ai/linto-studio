<template>
  <div class="media-explorer-menu">
    <!-- Organisation -->
    <div
      class="media-explorer-menu__item media-explorer-menu__item--section"
      @click="openOrgSelector">
      <ph-icon name="user-switch" size="16" />
      <div class="media-explorer-menu__item__org-info">
        <span class="media-explorer-menu__item__org-name">{{ orgName }}</span>
        <span class="media-explorer-menu__item__org-role">{{ currentRoleToString }}</span>
      </div>
      <button
        class="media-explorer-menu__item__action"
        :title="$t('folders.create')"
        @click.stop="$refs.folderTree.toggleCreate()">
        <ph-icon name="plus" size="14" />
      </button>
    </div>
    <div class="media-explorer-menu__sub">
      <!-- Média -->
      <div
        class="media-explorer-menu__item media-explorer-menu__item--nested"
        :class="{
          'media-explorer-menu__item--active': isInboxActive,
          'media-explorer-menu__item--drag-over': isInboxDragOver,
        }"
        @click="handleInboxClick"
        @dragover.prevent="isInboxDragOver = true"
        @dragleave="isInboxDragOver = false"
        @drop.prevent="handleInboxDrop">
        <ph-icon name="tray" :weight="isInboxActive ? 'fill' : 'regular'" size="16" />
        <span>{{ $t("navigation.sections.media") }}</span>
      </div>
      <!-- Transcription en direct -->
      <div
        v-if="hasSessions"
        class="media-explorer-menu__item media-explorer-menu__item--nested"
        :class="{ 'media-explorer-menu__item--active': isSessionsActive }"
        @click="handleSessionsClick">
        <ph-icon name="broadcast" :weight="isSessionsActive ? 'fill' : 'regular'" size="16" />
        <span>{{ $t("navigation.tabs.sessions") }}</span>
      </div>
      <!-- Arbre de dossiers -->
      <FolderTree ref="folderTree" />
    </div>

    <ModalSwitchOrg v-model="modalOrgSelector" @close="modalOrgSelector = false" />

    <!-- Personnel -->
    <div class="media-explorer-menu__item media-explorer-menu__item--section">
      <ph-icon name="user" size="16" />
      <span>{{ $t("navigation.sections.personal") }}</span>
    </div>
    <div class="media-explorer-menu__sub">
      <router-link
        :to="{
          name: 'explore-favorites',
          params: { organizationId: getCurrentOrganizationScope },
        }"
        class="media-explorer-menu__item media-explorer-menu__item--nested"
        @click.native="clearFolderSelection">
        <ph-icon name="star" :weight="isFavoritesActive ? 'fill' : 'regular'" size="16" />
        <span>{{ $t("navigation.tabs.favorites") }}</span>
      </router-link>
      <router-link
        :to="{
          name: 'explore-shared',
          params: { organizationId: getCurrentOrganizationScope },
        }"
        class="media-explorer-menu__item media-explorer-menu__item--nested"
        @click.native="clearFolderSelection">
        <ph-icon name="share-network" :weight="isSharedActive ? 'fill' : 'regular'" size="16" />
        <span>{{ $t("navigation.tabs.shared") }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { apiHasSessions } from "@/api/session.js"
import { mediaScopeMixin } from "@/mixins/mediaScope"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { orgDisplayName } from "@/tools/orgDisplayName"
import FolderTree from "@/components/FolderTree.vue"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"

export default {
  name: "MediaExplorerMenu",
  mixins: [mediaScopeMixin, orgaRoleMixin],
  components: { FolderTree, ModalSwitchOrg },
  data() {
    return {
      hasSessions: false,
      modalOrgSelector: false,
      isInboxDragOver: false,
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
    isInboxActive() {
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
  },
  watch: {
    getCurrentOrganizationScope: {
      immediate: true,
      async handler(orgId, oldOrgId) {
        if (orgId) {
          this.hasSessions = await apiHasSessions(orgId)
          if (oldOrgId && orgId !== oldOrgId) {
            this.selectFolder(undefined)
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
      if (!this.isMediaRoute) {
        this.$router.push({
          name: "explore",
          params: { organizationId: this.getCurrentOrganizationScope },
        })
      }
      this.selectFolder(undefined)
    },
    handleSessionsClick() {
      this.$store.dispatch(`${this.storeScope}/setSelectedFolderId`, undefined)
      this.$router.push({
        name: "sessionsList",
        params: { organizationId: this.getCurrentOrganizationScope },
      })
    },
    clearFolderSelection() {
      this.$store.dispatch(`${this.storeScope}/setSelectedFolderId`, undefined)
    },
    async handleInboxDrop(e) {
      this.isInboxDragOver = false
      const raw = e.dataTransfer.getData("conversationIds")
      const conversationIds = raw ? JSON.parse(raw) : null
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

    &--active,
    &.router-link-exact-active {
      background: var(--primary-soft);
      border-left-color: var(--primary-color);

      svg {
        color: var(--primary-color) !important;
      }
    }

    &--drag-over {
      background-color: var(--primary-color);
      border-left-color: var(--primary-color);
      color: var(--background-primary);
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
      font-size: 0.7em;
      font-weight: 400;
      color: var(--text-secondary);
      padding-left: 0.5em;
    }

    &--section:hover &__org-name {
      text-decoration-color: var(--primary-color);
      color: var(--primary-color);
    }

    &--nested {
      padding-left: 2.5rem;
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

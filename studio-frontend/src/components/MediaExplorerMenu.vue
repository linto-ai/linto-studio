<template>
  <div class="media-explorer-menu">
    <!-- Organisation -->
    <div
      class="media-explorer-menu__item media-explorer-menu__item--section"
      :class="{
        'media-explorer-menu__item--drag-over': isInboxDragOver,
      }"
      @click="handleOrgClick"
      @dblclick.prevent="orgExpanded = !orgExpanded"
      @dragover.prevent="isInboxDragOver = true"
      @dragleave="isInboxDragOver = false"
      @drop.prevent="onDropInbox">
      <ph-icon name="buildings" size="16" />
      <span>{{ $t("navigation.sections.organization") }}</span>
      <button
        class="media-explorer-menu__item__action"
        :title="$t('folders.create')"
        @click.stop="orgExpanded = true; $refs.folderTree.toggleCreate()">
        <ph-icon name="plus" size="14" />
      </button>
      <button
        class="media-explorer-menu__item__action"
        @click.stop="orgExpanded = !orgExpanded">
        <ph-icon :name="orgExpanded ? 'caret-up' : 'caret-down'" size="14" />
      </button>
    </div>
    <div v-show="orgExpanded" class="media-explorer-menu__sub">
      <!-- Média -->
      <div
        class="media-explorer-menu__item media-explorer-menu__item--nested"
        :class="{ 'media-explorer-menu__item--active': isInboxActive }"
        @click="handleInboxClick">
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

    <!-- Personnel -->
    <div
      class="media-explorer-menu__item media-explorer-menu__item--section"
      @click="personalExpanded = !personalExpanded">
      <ph-icon name="user" size="16" />
      <span>{{ $t("navigation.sections.personal") }}</span>
      <button
        class="media-explorer-menu__item__action"
        @click.stop="personalExpanded = !personalExpanded">
        <ph-icon :name="personalExpanded ? 'caret-up' : 'caret-down'" size="14" />
      </button>
    </div>
    <div v-show="personalExpanded" class="media-explorer-menu__sub">
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
import { folderDragDropMixin } from "@/mixins/folderDragDrop"
import FolderTree from "@/components/FolderTree.vue"

export default {
  name: "MediaExplorerMenu",
  mixins: [mediaScopeMixin, folderDragDropMixin],
  components: { FolderTree },
  data() {
    return {
      orgExpanded: false,
      personalExpanded: false,
      hasSessions: false,
      isInboxDragOver: false,
    }
  },
  computed: {
    activeFolderId() {
      return this.$store.getters["folders/getActiveFolderId"]
    },
    isMediaRoute() {
      return this.$route.name === "explore" || this.$route.name === "inbox"
    },
    isInboxActive() {
      return this.isMediaRoute && this.selectedFolderId === undefined
    },
    isOrgSectionActive() {
      return this.isMediaRoute || this.isSessionsActive
    },
    isSessionsActive() {
      return this.$route.name === "sessionsList"
    },
    isPersonalActive() {
      return this.isFavoritesActive || this.isSharedActive
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
      async handler(orgId) {
        if (orgId) {
          this.hasSessions = await apiHasSessions(orgId)
        } else {
          this.hasSessions = false
        }
      },
    },
    activeFolderId(id) {
      if (id) {
        this.orgExpanded = true
      }
    },
    isOrgSectionActive: {
      immediate: true,
      handler(val) {
        if (val) {
          this.orgExpanded = true
        }
      },
    },
    isPersonalActive: {
      immediate: true,
      handler(val) {
        if (val) {
          this.personalExpanded = true
        }
      },
    },
  },
  methods: {
    async handleOrgClick() {
      if (!this.isMediaRoute) {
        await this.$router.push({
          name: "explore",
          params: { organizationId: this.getCurrentOrganizationScope },
        })
      }
      this.selectFolder(undefined)
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
    async onDropInbox(e) {
      this.isInboxDragOver = false
      const { folderId } = this.parseDragData(e)
      if (folderId) {
        try {
          await this.$store.dispatch("folders/updateFolder", {
            folderId,
            payload: { parentId: null },
          })
          await this.$store.dispatch("folders/fetchFolders")
          await this.$store.dispatch(`${this.storeScope}/load`)
        } catch (error) {
          console.error("Error moving folder to root:", error)
        }
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

      & + & {
        margin-left: 0;
      }
    }
  }

  &__sub {
    display: flex;
    flex-direction: column;
  }
}
</style>

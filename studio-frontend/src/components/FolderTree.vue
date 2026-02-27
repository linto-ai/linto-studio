<template>
  <div class="folder-tree" v-if="isExploreRoute">
    <hr />
    <div class="folder-tree__header">
      <span class="title">{{ $t("folders.title") }}</span>
      <button
        class="folder-tree__add-btn"
        @click="showCreateInput = !showCreateInput"
        :title="$t('folders.create')">
        <ph-icon name="plus" size="16" />
      </button>
    </div>

    <div class="folder-tree__create" v-if="showCreateInput">
      <input
        ref="createInput"
        v-model="newFolderName"
        :placeholder="$t('folders.create_placeholder')"
        @keyup.enter="handleCreate"
        @keyup.esc="cancelCreate"
        class="folder-tree__input" />
    </div>

    <nav>
      <ul class="folder-tree__list">
        <li
          class="folder-tree__item"
          :class="{ 'folder-tree__item--active': selectedFolderId === undefined }"
          @click="selectFolder(undefined)">
          <ph-icon name="folders" size="16" />
          <span>{{ $t("folders.all") }}</span>
        </li>
        <li
          class="folder-tree__item"
          :class="{ 'folder-tree__item--active': selectedFolderId === null }"
          @click="selectFolder(null)">
          <ph-icon name="folder-dashed" size="16" />
          <span>{{ $t("folders.uncategorized") }}</span>
        </li>

        <FolderTreeNode
          v-for="folder in folderTree"
          :key="folder._id"
          :folder="folder"
          :selectedFolderId="selectedFolderId"
          :depth="0"
          @select="selectFolder"
          @rename="handleRename"
          @delete="handleDelete"
          @create-child="handleCreateChild" />
      </ul>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import FolderTreeNode from "./FolderTreeNode.vue"
import { mediaScopeMixin } from "@/mixins/mediaScope"

export default {
  name: "FolderTree",
  mixins: [mediaScopeMixin],
  components: { FolderTreeNode },
  data() {
    return {
      showCreateInput: false,
      newFolderName: "",
    }
  },
  watch: {
    showCreateInput(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.createInput?.focus()
        })
      }
    },
    "$route.name"() {
      if (this.isExploreRoute) {
        this.fetchFolders()
      }
    },
  },
  mounted() {
    if (this.isExploreRoute) {
      this.fetchFolders()
    }
  },
  computed: {
    ...mapGetters("folders", {
      folderTree: "getFolderTree",
      foldersLoading: "getLoading",
    }),
    selectedFolderId() {
      return this.$store.getters[`${this.storeScope}/selectedFolderId`]
    },
    isExploreRoute() {
      return this.$route.name === "explore" || this.$route.name === "inbox"
    },
  },
  methods: {
    ...mapActions("folders", ["fetchFolders"]),
    async selectFolder(folderId) {
      await this.$store.dispatch(`${this.storeScope}/clearSelectedMedias`)
      await this.$store.dispatch(`${this.storeScope}/setSelectedFolderId`, folderId)
      await this.$store.dispatch(`${this.storeScope}/load`)
    },
    async handleCreate() {
      const name = this.newFolderName.trim()
      if (!name) return
      await this.$store.dispatch("folders/createFolder", { name })
      this.newFolderName = ""
      this.showCreateInput = false
    },
    cancelCreate() {
      this.newFolderName = ""
      this.showCreateInput = false
    },
    async handleRename({ folderId, name }) {
      await this.$store.dispatch("folders/updateFolder", {
        folderId,
        payload: { name },
      })
    },
    async handleDelete(folderId) {
      await this.$store.dispatch("folders/deleteFolder", folderId)
      this.$store.dispatch(`${this.storeScope}/load`)
    },
    async handleCreateChild({ parentId, name }) {
      await this.$store.dispatch("folders/createFolder", {
        name,
        parentId,
      })
    },
  },
}
</script>

<style lang="scss">
.folder-tree {
  display: flex;
  flex-direction: column;

  hr {
    margin: 0;
    height: 2px;
    background-color: #ccc;
    border: none;
    margin: 0 0.5em;
    margin-top: 0.5em;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5em;

    .title {
      font-weight: 600;
      color: var(--text-secondary);
    }
  }

  &__add-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2em;
    border-radius: 4px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;

    &:hover {
      background-color: var(--primary-soft);
      color: var(--primary-color);
    }
  }

  &__create {
    padding: 0 0.5em 0.5em;
  }

  &__input {
    width: 100%;
    padding: 0.3em 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.85em;
    outline: none;
    box-sizing: border-box;

    &:focus {
      border-color: var(--primary-color);
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.35em 0.5em;
    cursor: pointer;
    font-size: 0.85em;
    color: var(--text-primary);
    border-left: 2px solid transparent;

    &:hover {
      background-color: var(--primary-soft);
    }

    &--active {
      background-color: var(--primary-soft);
      border-left-color: var(--primary-color);
      font-weight: 600;
    }
  }
}
</style>

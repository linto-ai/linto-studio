<template>
  <div class="folder-tree">
    <div class="folder-tree__create" v-if="showCreateInput">
      <FormInput
        :field="createField"
        v-model="newFolderName"
        :focus="showCreateInput"
        inputFullWidth
        withConfirmation
        @on-confirm="handleCreate"
        @on-cancel="cancelCreate"
        @keyup.esc.native="cancelCreate"
        @keyup.enter.native="handleCreate" />
    </div>

    <nav>
      <ul class="folder-tree__list">
        <FolderTreeNode
          v-for="folder in folderTree"
          :key="folder._id"
          :folder="folder"
          :selectedFolderId="selectedFolderId"
          :activeFolderId="activeFolderId"
          :depth="0"
          :userRole="currentUserRole"
          :userId="currentUserId"
          @select="selectFolder"
          @rename="handleRename"
          @delete="handleDelete"
          @create-child="handleCreateChild"
          @manage-access="handleManageAccess"
          @drop-media="handleDropMedia" />
      </ul>
    </nav>

    <FolderAccessModal
      v-if="accessFolder"
      :value="!!accessFolder"
      :folder="accessFolder"
      @input="accessFolder = null"
      @on-cancel="accessFolder = null" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import FolderTreeNode from "./FolderTreeNode.vue"
import FolderAccessModal from "./FolderAccessModal.vue"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  name: "FolderTree",
  components: { FolderTreeNode, FolderAccessModal, FormInput },
  data() {
    return {
      showCreateInput: false,
      newFolderName: "",
      createField: { placeholder: this.$t("folders.create_placeholder"), error: null },
      accessFolder: null,
    }
  },
  watch: {
    getCurrentOrganizationScope(newOrgId, oldOrgId) {
      if (newOrgId && newOrgId !== oldOrgId) {
        this.fetchFolders()
      }
    },
    showCreateInput(val) {
      if (!val) {
        this.createField.error = null
      }
    },
  },
  mounted() {
    this.fetchFolders()
  },
  computed: {
    ...mapGetters("folders", {
      folderTree: "getFolderTree",
      foldersLoading: "getLoading",
      activeFolderId: "getActiveFolderId",
    }),
    ...mapGetters("organizations", ["getCurrentOrganizationScope"]),
    selectedFolderId() {
      return this.$route.params.folderId
    },
    currentUserRole() {
      return this.$store.getters["organizations/getUserRoleInOrganization"] || 0
    },
    currentUserId() {
      return this.$store.getters["user/getUserId"] || ""
    },
  },
  methods: {
    ...mapActions("folders", ["fetchFolders"]),
    toggleCreate() {
      this.showCreateInput = !this.showCreateInput
    },
    selectFolder(folderId) {
      if (this.$route.params.folderId === folderId && this.$route.name === "explore") return
      this.$store.dispatch("folders/setActiveFolderId", null)
      this.$router.push({
        name: "explore",
        params: {
          organizationId: this.getCurrentOrganizationScope,
          folderId,
        },
      })
    },
    async handleCreate() {
      if (!this.showCreateInput) return
      const name = this.newFolderName.trim()
      if (!name) {
        this.createField.error = this.$t("folders.name_required")
        return
      }
      await this.$store.dispatch("folders/createFolder", { name })
      this.newFolderName = ""
      this.createField.error = null
      this.showCreateInput = false
    },
    cancelCreate() {
      this.newFolderName = ""
      this.createField.error = null
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
      if (this.$route.params.folderId === folderId) {
        this.$router.push({
          name: "explore",
          params: { organizationId: this.getCurrentOrganizationScope },
        })
      }
    },
    async handleCreateChild({ parentId, name }) {
      await this.$store.dispatch("folders/createFolder", {
        name,
        parentId,
      })
    },
    handleManageAccess(folder) {
      this.accessFolder = folder
    },
    async refreshAfterDrop() {
      await this.$store.dispatch("folders/fetchFolders")
    },
    async handleDropMedia({ folderId, conversationIds }) {
      try {
        await this.$store.dispatch("folders/moveConversationsToFolder", {
          folderId,
          conversationIds,
        })
        await this.refreshAfterDrop()
        this.$router.push({
          name: "explore",
          params: {
            organizationId: this.getCurrentOrganizationScope,
            folderId,
          },
        })
      } catch (error) {
        console.error("Error moving conversations to folder:", error)
      }
    },
  },
}
</script>

<style lang="scss">
.folder-tree {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  &__create {
    padding: 0.25rem 1rem 0.25rem 2.5rem;

    :deep(.form-field) { gap: 0; }
    :deep(.form-field__input) { padding: 0.3em 0.5em; font-size: 0.85em; }
    :deep(.form-field__error) { font-size: 0.7em; }
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

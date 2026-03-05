<template>
  <li class="folder-tree-node">
    <div
      class="folder-tree-node__row"
      :class="{
        'folder-tree-node__row--active': isActive,
        'folder-tree-node__row--drag-over': isDragOver,
      }"
      :style="{ paddingLeft: `calc(2.5rem - 14px - 0.5rem + ${Math.min(depth, 6) * 0.75}rem)` }"
      @click="$emit('select', folder._id)"
      @dblclick.prevent="toggleExpand"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop">
      <template v-if="virtual">
        <span class="folder-tree-node__chevron-spacer"></span>
        <ph-icon
          :name="icon"
          size="16"
          :weight="isActive ? 'fill' : iconWeight" />
      </template>
      <template v-else>
        <button
          v-if="folder.children && folder.children.length > 0"
          class="folder-tree-node__chevron"
          @click.stop="expanded = !expanded">
          <ph-icon
            :name="expanded ? 'caret-down' : 'caret-right'"
            size="14" />
        </button>
        <span v-else class="folder-tree-node__chevron-spacer"></span>

        <span v-if="folder.emoji" class="folder-tree-node__emoji">
          {{ decodeEmoji(folder.emoji) }}
        </span>
        <ph-icon
          v-else
          :name="expanded ? 'folder-open' : 'folder'"
          size="16"
          :style="folder.color ? { color: folder.color } : {}" />

        <ph-icon
          v-if="folder.visibility === 'private'"
          name="lock-simple"
          size="12"
          class="folder-tree-node__lock" />
      </template>

      <span v-if="!isRenaming" class="folder-tree-node__name">
        {{ folder.name }}
      </span>
      <input
        v-else
        ref="renameInput"
        v-model="renameName"
        class="folder-tree-node__input"
        @keyup.enter="confirmRename"
        @keyup.esc="cancelRename"
        @blur="confirmRename"
        @click.stop />
      <button
        v-if="isRenaming"
        class="folder-tree-node__confirm-btn"
        @click.stop="confirmRename">
        <ph-icon name="check" size="14" />
      </button>

      <span
        v-if="folder.conversationCount !== undefined && !isRenaming"
        class="folder-tree-node__count">
        {{ folder.conversationCount }}
      </span>

      <PopoverList
        v-if="contextMenuItems.length > 0"
        :items="contextMenuItems"
        :close-on-item-click="true"
        :overlay="false"
        class="folder-tree-node__menu"
        @click="handleMenuAction">
        <template #trigger="{ open }">
          <span class="folder-tree-node__menu-btn">
            <ph-icon name="dots-three" size="16" />
          </span>
        </template>
      </PopoverList>
    </div>

    <div
      v-if="!virtual && showChildInput"
      class="folder-tree-node__create-child"
      :style="{ paddingLeft: `calc(2.5rem - 14px - 0.5rem + ${Math.min(depth + 1, 6) * 0.75}rem)` }">
      <FormInput
        :field="childField"
        v-model="childName"
        :focus="showChildInput"
        inputFullWidth
        withConfirmation
        @on-confirm="confirmCreateChild"
        @on-cancel="cancelCreateChild"
        @keyup.esc.native="cancelCreateChild"
        @keyup.enter.native="confirmCreateChild" />
    </div>

    <ul
      v-if="!virtual && expanded && folder.children && folder.children.length > 0"
      class="folder-tree-node__children">
      <FolderTreeNode
        v-for="child in folder.children"
        :key="child._id"
        :folder="child"
        :selectedFolderId="selectedFolderId"
        :activeFolderId="activeFolderId"
        :depth="depth + 1"
        :userRole="userRole"
        :userId="userId"
        @select="$emit('select', $event)"
        @rename="$emit('rename', $event)"
        @delete="$emit('delete', $event)"
        @create-child="$emit('create-child', $event)"
        @manage-access="$emit('manage-access', $event)"
        @drop-media="$emit('drop-media', $event)" />
    </ul>
  </li>
</template>

<script>
import PopoverList from "@/components/atoms/PopoverList.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import { folderDragDropMixin } from "@/mixins/folderDragDrop"
import RIGHTS from "@/const/userRights"

export default {
  name: "FolderTreeNode",
  mixins: [folderDragDropMixin],
  components: { PopoverList, FormInput },
  props: {
    folder: { type: Object, required: true },
    selectedFolderId: { default: undefined },
    activeFolderId: { type: String, default: null },
    depth: { type: Number, default: 0 },
    userRole: { type: Number, default: 0 },
    userId: { type: String, default: "" },
    virtual: { type: Boolean, default: false },
    icon: { type: String, default: null },
    iconWeight: { type: String, default: "regular" },
  },
  data() {
    return {
      expanded: false,
      isRenaming: false,
      renameName: "",
      showChildInput: false,
      childName: "",
      childField: { placeholder: this.$t("folders.create_placeholder"), error: null },
    }
  },
  watch: {
    selectedFolderId: {
      immediate: true,
      handler(newId) {
        if (newId && this.containsDescendant(this.folder.children, newId)) {
          this.expanded = true
        }
      },
    },
    activeFolderId: {
      immediate: true,
      handler(newId) {
        if (newId === this.folder._id || (newId && this.containsDescendant(this.folder.children, newId))) {
          this.expanded = true
        }
      },
    },
  },
  computed: {
    canManageAccess() {
      if (this.userRole >= 5) return true
      if (this.folder.owner === this.userId) return true
      if (this.folder.members && this.folder.members.some((m) => m.userId === this.userId && RIGHTS.hasRightAccess(m.right, RIGHTS.SHARE))) return true
      return false
    },
    isActive() {
      return this.selectedFolderId === this.folder._id || this.activeFolderId === this.folder._id
    },
    contextMenuItems() {
      if (this.virtual || !this.canManageAccess) return []
      const items = [
        {
          id: "rename",
          name: this.$t("folders.rename"),
          icon: "pencil",
        },
      ]
      if (this.userRole >= 5) {
        items.push({
          id: "create-child",
          name: this.$t("folders.create_subfolder"),
          icon: "folder-plus",
        })
      }
      items.push({
        id: "manage-access",
        name: this.$t("folders.manage_access"),
        icon: "users-three",
      })
      if (!this.folder.conversationCount) {
        items.push({
          id: "delete",
          name: this.$t("folders.delete"),
          icon: "trash",
          color: "tertiary",
        })
      }
      return items
    },
  },
  methods: {
    decodeEmoji(unified) {
      if (!unified) return ""
      try {
        const codePoints = unified.split("-").map((u) => parseInt(u, 16))
        return String.fromCodePoint(...codePoints)
      } catch {
        return unified
      }
    },

    toggleExpand() {
      this.expanded = !this.expanded
    },

    handleMenuAction(action) {
      switch (action.id) {
        case "rename":
          this.startRename()
          break
        case "create-child":
          this.startCreateChild()
          break
        case "manage-access":
          this.$emit("manage-access", this.folder)
          break
        case "delete":
          this.handleDelete()
          break
      }
    },

    // --- Rename ---
    startRename() {
      this.isRenaming = true
      this.renameName = this.folder.name
      this.$nextTick(() => {
        this.$refs.renameInput?.focus()
      })
    },
    confirmRename() {
      if (!this.isRenaming) return
      const name = this.renameName.trim()
      if (name && name !== this.folder.name) {
        this.$emit("rename", { folderId: this.folder._id, name })
      }
      this.isRenaming = false
    },
    cancelRename() {
      this.isRenaming = false
    },

    // --- Create child ---
    startCreateChild() {
      this.expanded = true
      this.showChildInput = true
    },
    confirmCreateChild() {
      if (!this.showChildInput) return
      const name = this.childName.trim()
      if (!name) {
        this.childField.error = this.$t("folders.name_required")
        return
      }
      this.$emit("create-child", { parentId: this.folder._id, name })
      this.childName = ""
      this.childField.error = null
      this.showChildInput = false
    },
    cancelCreateChild() {
      this.childName = ""
      this.childField.error = null
      this.showChildInput = false
    },

    // --- Delete ---
    handleDelete() {
      this.$emit("delete", this.folder._id)
    },

    onDragOver() {
      if (!this.$listeners["drop-media"]) return
      this.isDragOver = true
    },
    onDrop(e) {
      this.isDragOver = false
      if (!this.$listeners["drop-media"]) return
      const { conversationIds } = this.parseDragData(e)
      if (conversationIds) {
        this.$emit("drop-media", { folderId: this.folder._id, conversationIds })
      }
    },

    containsDescendant(children, targetId) {
      if (!children) return false
      for (const child of children) {
        if (child._id === targetId) return true
        if (this.containsDescendant(child.children, targetId)) return true
      }
      return false
    },

  },
}
</script>

<style lang="scss">
.folder-tree-node {
  list-style: none;

  &__row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: var(--text-primary);
    border-left: 2px solid transparent;
    user-select: none;
    overflow: hidden;

    &:hover {
      background-color: var(--primary-soft);
    }

    &--active {
      background-color: var(--primary-soft);
      border-left-color: var(--primary-color);
      font-weight: 600;
    }

    &--drag-over {
      background-color: var(--primary-color);
      border-left-color: var(--primary-color);
      color: var(--background-primary);
    }
  }

  &__chevron {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    color: var(--text-secondary);
    flex-shrink: 0;
    width: 14px;
  }

  &__chevron-spacer {
    width: 14px;
    flex-shrink: 0;
  }

  &__lock {
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  &__emoji {
    font-size: 1em;
    flex-shrink: 0;
  }

  &__name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__count {
    font-size: 0.75em;
    color: var(--text-secondary);
    flex-shrink: 0;
    margin-left: auto;
    padding: 0 0.3em;
  }

  &__menu {
    flex-shrink: 0;
    margin-left: auto;
  }

  &__menu-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.1em;
    border-radius: 4px;
    color: var(--text-secondary);

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
      color: var(--text-primary);
    }
  }

  &__input {
    flex: 1;
    padding: 0.2em 0.4em;
    border: 1px solid var(--primary-color);
    border-radius: 3px;
    font-size: 0.85em;
    outline: none;
    min-width: 0;
  }

  &__confirm-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.1em;
    border-radius: 4px;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    flex-shrink: 0;

    &:hover {
      background-color: var(--primary-soft);
    }
  }

  &__create-child {
    padding: 0.25rem 1rem;

    :deep(.form-field) { gap: 0; }
    :deep(.form-field__input) { padding: 0.2em 0.4em; font-size: 0.85em; }
    :deep(.form-field__error) { font-size: 0.7em; }
  }

  &__children {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>

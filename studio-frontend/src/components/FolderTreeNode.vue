<template>
  <li class="folder-tree-node">
    <div
      class="folder-tree-node__row"
      :class="{ 'folder-tree-node__row--active': selectedFolderId === folder._id }"
      :style="{ paddingLeft: (depth * 1) + 0.5 + 'em' }"
      @click="$emit('select', folder._id)"
      @dblclick.prevent="toggleExpand">
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
      v-if="showChildInput"
      class="folder-tree-node__create-child"
      :style="{ paddingLeft: ((depth + 1) * 1) + 0.5 + 'em' }">
      <input
        ref="childInput"
        v-model="childName"
        :placeholder="$t('folders.create_placeholder')"
        class="folder-tree-node__input"
        @keyup.enter="confirmCreateChild"
        @keyup.esc="cancelCreateChild" />
      <button
        class="folder-tree-node__confirm-btn"
        @click.stop="confirmCreateChild">
        <ph-icon name="check" size="14" />
      </button>
    </div>

    <ul
      v-if="expanded && folder.children && folder.children.length > 0"
      class="folder-tree-node__children">
      <FolderTreeNode
        v-for="child in folder.children"
        :key="child._id"
        :folder="child"
        :selectedFolderId="selectedFolderId"
        :depth="depth + 1"
        @select="$emit('select', $event)"
        @rename="$emit('rename', $event)"
        @delete="$emit('delete', $event)"
        @create-child="$emit('create-child', $event)" />
    </ul>
  </li>
</template>

<script>
import PopoverList from "@/components/atoms/PopoverList.vue"

export default {
  name: "FolderTreeNode",
  components: { PopoverList },
  props: {
    folder: { type: Object, required: true },
    selectedFolderId: { default: undefined },
    depth: { type: Number, default: 0 },
  },
  data() {
    return {
      expanded: false,
      isRenaming: false,
      renameName: "",
      showChildInput: false,
      childName: "",
    }
  },
  computed: {
    contextMenuItems() {
      return [
        {
          id: "rename",
          name: this.$t("folders.rename"),
          icon: "pencil",
        },
        {
          id: "create-child",
          name: this.$t("folders.create_subfolder"),
          icon: "folder-plus",
        },
        {
          id: "delete",
          name: this.$t("folders.delete"),
          icon: "trash",
          color: "tertiary",
        },
      ]
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
      this.$nextTick(() => {
        this.$refs.childInput?.focus()
      })
    },
    confirmCreateChild() {
      const name = this.childName.trim()
      if (name) {
        this.$emit("create-child", { parentId: this.folder._id, name })
      }
      this.childName = ""
      this.showChildInput = false
    },
    cancelCreateChild() {
      this.childName = ""
      this.showChildInput = false
    },

    // --- Delete ---
    handleDelete() {
      this.$emit("delete", this.folder._id)
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
    gap: 0.3em;
    padding: 0.35em 0.5em;
    cursor: pointer;
    font-size: 0.85em;
    color: var(--text-primary);
    border-left: 2px solid transparent;
    user-select: none;

    &:hover {
      background-color: var(--primary-soft);
    }

    &--active {
      background-color: var(--primary-soft);
      border-left-color: var(--primary-color);
      font-weight: 600;
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
    display: flex;
    align-items: center;
    gap: 0.3em;
    padding: 0.3em 0.5em;
  }

  &__children {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
</style>

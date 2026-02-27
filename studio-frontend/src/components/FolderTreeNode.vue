<template>
  <li class="folder-tree-node">
    <div
      class="folder-tree-node__row"
      :class="{ 'folder-tree-node__row--active': selectedFolderId === folder._id }"
      :style="{ paddingLeft: (depth * 1) + 0.5 + 'em' }"
      @click="$emit('select', folder._id)"
      @contextmenu.prevent="openContextMenuFromRow($event)">
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

      <span
        v-if="folder.conversationCount !== undefined && !isRenaming"
        class="folder-tree-node__count">
        {{ folder.conversationCount }}
      </span>

      <button
        ref="menuBtn"
        class="folder-tree-node__menu-btn"
        @click.stop="toggleContextMenu">
        <ph-icon name="dots-three" size="16" />
      </button>
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
export default {
  name: "FolderTreeNode",
  props: {
    folder: { type: Object, required: true },
    selectedFolderId: { default: undefined },
    depth: { type: Number, default: 0 },
  },
  data() {
    return {
      expanded: false,
      showContextMenu: false,
      isRenaming: false,
      renameName: "",
      showChildInput: false,
      childName: "",
      menuStyle: {},
      _portalEl: null,
    }
  },
  beforeDestroy() {
    this.destroyPortal()
    document.removeEventListener("click", this._onOutsideClick)
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

    // --- Context menu (portal to body) ---
    toggleContextMenu() {
      if (this.showContextMenu) {
        this.closeContextMenu()
      } else {
        this.openContextMenu()
      }
    },
    openContextMenuFromRow(event) {
      if (this.showContextMenu) {
        this.closeContextMenu()
        return
      }
      this.menuStyle = {
        top: event.clientY + "px",
        left: event.clientX + "px",
      }
      this.showContextMenu = true
      this.$nextTick(() => this.mountPortal())
    },
    openContextMenu() {
      const btn = this.$refs.menuBtn
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      this.menuStyle = {
        top: rect.bottom + 4 + "px",
        left: rect.right + "px",
      }
      this.showContextMenu = true
      this.$nextTick(() => this.mountPortal())
    },
    closeContextMenu() {
      this.showContextMenu = false
      this.destroyPortal()
    },
    mountPortal() {
      this.destroyPortal()

      const el = document.createElement("div")
      el.className = "folder-context-portal"
      el.innerHTML = `
        <div class="folder-context-backdrop"></div>
        <div class="folder-context-popover" style="top:${this.menuStyle.top};left:${this.menuStyle.left}">
          <button data-action="rename">
            <span class="popover-icon">&#9998;</span>
            ${this.$t("folders.rename")}
          </button>
          <button data-action="create-child">
            <span class="popover-icon">&#128193;</span>
            ${this.$t("folders.create_subfolder")}
          </button>
          <button data-action="delete" class="danger">
            <span class="popover-icon">&#128465;</span>
            ${this.$t("folders.delete")}
          </button>
        </div>
      `

      el.querySelector(".folder-context-backdrop").addEventListener("click", () => {
        this.closeContextMenu()
      })

      el.querySelectorAll("button[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.getAttribute("data-action")
          this.closeContextMenu()
          if (action === "rename") this.startRename()
          else if (action === "create-child") this.startCreateChild()
          else if (action === "delete") this.handleDelete()
        })
      })

      document.body.appendChild(el)
      this._portalEl = el
    },
    destroyPortal() {
      if (this._portalEl) {
        this._portalEl.remove()
        this._portalEl = null
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

    &:hover {
      background-color: var(--primary-soft);

      .folder-tree-node__menu-btn {
        opacity: 1;
      }
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

  &__menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.1em;
    border-radius: 4px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    opacity: 0;
    flex-shrink: 0;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
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

  &__create-child {
    padding: 0.3em 0.5em;
  }

  &__children {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

/* Portal popover — rendered at body level */
.folder-context-portal {
  .folder-context-backdrop {
    position: fixed;
    inset: 0;
    z-index: 999;
  }

  .folder-context-popover {
    position: fixed;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    padding: 0.4em 0;
    min-width: 180px;
    transform: translateX(-100%);

    button {
      display: flex;
      align-items: center;
      gap: 0.5em;
      padding: 0.5em 1em;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.85em;
      color: var(--text-primary, #333);
      white-space: nowrap;
      transition: background-color 0.15s;

      &:hover {
        background-color: var(--primary-soft, #f0f0ff);
      }

      &.danger {
        color: var(--error-color, #d32f2f);

        &:hover {
          background-color: rgba(211, 47, 47, 0.08);
        }
      }

      .popover-icon {
        flex-shrink: 0;
        font-size: 0.9em;
        width: 16px;
        text-align: center;
      }
    }
  }
}
</style>

<template>
  <PopoverList
    ref="popoverList"
    :items="folderItems"
    :value="value"
    :full-width="fullWidth"
    :close-on-item-click="false"
    :close-on-click="false"
    content-class="folder-selector__popover"
    color="neutral"
    @click="onItemClick"
    @toggle="onToggle">
    <template #trigger="{ open, ariaProps }">
      <Button
        v-bind="ariaProps"
        class="popover-list__trigger"
        :iconRight="open ? 'caret-up' : 'caret-down'"
        :icon="selectedItem._icon"
        :block="fullWidth"
        :disabled="readonly"
        variant="tertiary"
        size="sm">
        <span class="folder-selector__trigger-label">
          <ph-icon
            v-if="selectedItem._private"
            name="lock-simple"
            size="12"
            class="folder-selector__item-lock" />
          <span class="folder-selector__item-name">{{
            selectedItem.name
          }}</span>
        </span>
      </Button>
    </template>
    <template #item="{ item }">
      <span
        class="folder-selector__item"
        :class="{
          'folder-selector__item--select': item._action === 'select-current',
        }"
        :style="{ paddingLeft: item._depth * 0.85 + 'rem' }">
        <ph-icon
          :name="item._icon"
          size="16"
          :style="item._color ? { color: item._color } : {}" />
        <ph-icon
          v-if="item._private"
          name="lock-simple"
          size="12"
          class="folder-selector__item-lock" />
        <span class="folder-selector__item-name">{{ item.name }}</span>
      </span>
    </template>
  </PopoverList>
</template>

<script>
import { mapGetters } from "vuex"
import PopoverList from "./atoms/PopoverList.vue"
import Button from "./atoms/Button.vue"

export default {
  name: "FolderSelector",
  components: { PopoverList, Button },
  props: {
    value: {
      type: String,
      default: null,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // Ids of the folders currently expanded in the tree.
      expandedIds: [],
      // Folder targeted by a click, validated through the top "choose" entry.
      targetId: null,
    }
  },
  computed: {
    ...mapGetters("folders", {
      folderTree: "getFolderTree",
    }),
    targetFolder() {
      return this.targetId
        ? this.flatFolders.find((folder) => folder._id === this.targetId)
        : null
    },
    folderItems() {
      const items = []
      if (this.targetFolder) {
        items.push({
          id: "__select__",
          value: this.targetFolder._id,
          name: this.$t("folders.select_this_folder", {
            name: this.targetFolder.name,
          }),
          _icon: "check",
          _action: "select-current",
          _depth: 0,
        })
      }
      items.push({
        id: null,
        value: null,
        name: this.$t("folders.uncategorized"),
        _icon: "tray",
        _depth: 0,
      })
      const walk = (nodes, depth) => {
        for (const node of nodes) {
          const hasChildren = node.children?.length > 0
          const expanded = hasChildren && this.expandedIds.includes(node._id)
          items.push({
            id: node._id,
            value: node._id,
            name: node.name,
            _icon: "folder",
            _private: node.visibility === "private",
            _color: node.color,
            _hasChildren: hasChildren,
            _node: node,
            _depth: depth,
            iconRight: hasChildren
              ? expanded
                ? "caret-down"
                : "caret-right"
              : undefined,
          })
          if (expanded) walk(node.children, depth + 1)
        }
      }
      walk(this.folderTree, 0)
      return items
    },
    flatFolders() {
      const flat = []
      const walk = (nodes) => {
        for (const node of nodes) {
          flat.push(node)
          if (node.children?.length) walk(node.children)
        }
      }
      walk(this.folderTree)
      return flat
    },
    selectedItem() {
      const node = this.value
        ? this.flatFolders.find((folder) => folder._id === this.value)
        : null
      if (!node) {
        return { name: this.$t("folders.uncategorized"), _icon: "tray" }
      }
      return {
        name: node.name,
        _icon: "folder",
        _color: node.color,
        _private: node.visibility === "private",
      }
    },
  },
  methods: {
    onItemClick(item) {
      if (item._action === "select-current") {
        this.commit(item.value)
        return
      }
      if (item._hasChildren) {
        // A parent click expands it and targets it for the top "choose" entry.
        this.targetId = item._node._id
        this.toggleExpand(item._node._id)
        return
      }
      this.commit(item.value)
    },
    commit(value) {
      // Explicit selection: clear the pending target so closing the popover
      // (via the resulting close) does not re-commit it.
      this.targetId = null
      this.handleInput(value)
      this.$refs.popoverList?.close()
    },
    toggleExpand(id) {
      this.expandedIds = this.expandedIds.includes(id)
        ? this.expandedIds.filter((expandedId) => expandedId !== id)
        : [...this.expandedIds, id]
    },
    onToggle(isOpen) {
      if (isOpen) {
        // Reopen with the ancestors of the current selection expanded, so it is visible.
        const ancestors = this.value ? this.pathToFolder(this.value) : null
        this.expandedIds = ancestors ? ancestors.map((node) => node._id) : []
        this.targetId = null
      } else if (this.targetId && this.targetId !== this.value) {
        // Closed by clicking outside after picking a folder: commit that folder.
        this.handleInput(this.targetId)
        this.targetId = null
      }
    },
    pathToFolder(id, nodes = this.folderTree, trail = []) {
      for (const node of nodes) {
        if (node._id === id) return trail
        if (node.children?.length) {
          const found = this.pathToFolder(id, node.children, [...trail, node])
          if (found) return found
        }
      }
      return null
    },
    handleInput(value) {
      this.$emit("input", value)
      this.$emit("change", value)
    },
  },
}
</script>

<style lang="scss" scoped>
.folder-selector__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.folder-selector__item--select {
  color: var(--primary-color);
  font-weight: 500;
}

.folder-selector__trigger-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
}

.folder-selector__item-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-selector__item-lock {
  flex-shrink: 0;
  color: var(--text-muted, #999);
}
</style>

<!-- Unscoped: the popover content is teleported outside this component. -->
<style lang="scss">
.folder-selector__popover:not(.popover-mobile-sheet) {
  /* Bound the width so long folder names truncate (ellipsis) instead of
     stretching the popover; width is otherwise auto, sized to the content. */
  max-width: 360px;
}

.folder-selector__popover:not(.popover-mobile-sheet) [role="listbox"] {
  max-height: 40vh;
  overflow-y: auto;
}

/* Keep the single "choose this folder" entry pinned while the tree scrolls,
   and separate it from the folder list below. */
.folder-selector__popover
  .popover-list__item:has(.folder-selector__item--select) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--background-app);
  border-bottom: 1px solid var(--neutral-20);
}

/* On hover/highlight the row turns blue; keep the "choose" text readable
   (the --select class otherwise forces blue text over the blue background). */
.folder-selector__popover
  .popover-list__item
  .btn:hover
  .folder-selector__item--select,
.folder-selector__popover
  .popover-list__item
  .btn--hovered
  .folder-selector__item--select {
  color: var(--primary-contrast);
}
</style>

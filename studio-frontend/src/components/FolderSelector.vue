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
      expandedIds: [],
      // Folder targeted by a click, validated through the top "choose" entry.
      targetId: null,
    }
  },
  computed: {
    ...mapGetters("folders", {
      folderTree: "getFolderTree",
      getFolderById: "getFolderById",
    }),
    targetFolder() {
      return this.targetId ? this.getFolderById(this.targetId) : null
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
          let iconRight
          if (hasChildren) iconRight = expanded ? "caret-down" : "caret-right"
          items.push({
            id: node._id,
            value: node._id,
            name: node.name,
            _icon: "folder",
            _private: node.visibility === "private",
            _color: node.color,
            _hasChildren: hasChildren,
            _depth: depth,
            iconRight,
          })
          if (expanded) walk(node.children, depth + 1)
        }
      }
      walk(this.folderTree, 0)
      return items
    },
    selectedItem() {
      const node = this.value ? this.getFolderById(this.value) : null
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
        // Expand + target it (selectable via the top "choose" entry).
        this.targetId = item.id
        this.toggleExpand(item.id)
        return
      }
      this.commit(item.value)
    },
    commit(value) {
      // Clear target first so the close below doesn't re-commit it.
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
        // Expand ancestors so the current selection is visible.
        const ancestors = this.value ? this.pathToFolder(this.value) : null
        this.expandedIds = ancestors ? ancestors.map((node) => node._id) : []
        this.targetId = null
      } else if (this.targetId && this.targetId !== this.value) {
        // Closed via outside-click after picking: commit that folder.
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
  /* Bound width so long names truncate instead of stretching the popover. */
  max-width: 360px;
}

.folder-selector__popover:not(.popover-mobile-sheet) [role="listbox"] {
  max-height: 40vh;
  overflow-y: auto;
}

/* Pin the "choose" entry while the tree scrolls. */
.folder-selector__popover
  .popover-list__item:has(.folder-selector__item--select) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--background-app);
  border-bottom: 1px solid var(--neutral-20);
}

/* Keep the "choose" text readable on the blue hover background. */
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

<template>
  <PopoverList
    :items="folderItems"
    :value="value"
    :full-width="fullWidth"
    color="neutral"
    @input="handleInput">
    <template #trigger="{ open, ariaProps }">
      <Button
        v-bind="ariaProps"
        class="popover-list__trigger"
        :iconRight="open ? 'caret-up' : 'caret-down'"
        :icon="selectedItem._icon"
        :label="selectedItem.name"
        :block="fullWidth"
        :disabled="readonly"
        variant="tertiary"
        size="sm" />
    </template>
    <template #item="{ item }">
      <span
        class="folder-selector__item"
        :style="{ paddingLeft: item._depth * 0.75 + 'rem' }">
        <ph-icon
          :name="item._icon"
          size="16"
          :style="item._color ? { color: item._color } : {}" />
        <span class="folder-selector__item-name">{{ item.name }}</span>
        <ph-icon
          v-if="item._private"
          name="lock-simple"
          size="12"
          class="folder-selector__item-lock" />
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
  computed: {
    ...mapGetters("folders", {
      folderTree: "getFolderTree",
    }),
    folderItems() {
      const items = [
        {
          id: null,
          value: null,
          name: this.$t("folders.uncategorized"),
          _icon: "tray",
          _depth: 0,
        },
      ]
      const flatten = (nodes, depth) => {
        for (const node of nodes) {
          items.push({
            id: node._id,
            value: node._id,
            name: node.name,
            _icon: "folder",
            _depth: depth,
            _private: node.visibility === "private",
            _color: node.color,
          })
          if (node.children?.length) flatten(node.children, depth + 1)
        }
      }
      flatten(this.folderTree, 1)
      return items
    },
    selectedItem() {
      return (
        this.folderItems.find((item) => item.id === this.value) ??
        this.folderItems[0]
      )
    },
  },
  methods: {
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

.folder-selector__item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-selector__item-lock {
  flex-shrink: 0;
  color: var(--text-muted, #999);
}
</style>

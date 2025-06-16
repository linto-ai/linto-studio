<template>
  <Popover :close-on-click-outside="closeOnClickOutside" :close-on-escape="closeOnEscape" :overlay="overlay">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open">
        <Button v-bind="$attrs" :icon="open ? 'caret-up' : 'caret-down'" />
      </slot>
    </template>
    <template #content>
      <div class="popover-list__content">
        <div v-for="item in items" :key="item.id" class="popover-list__item">
          <Button
            :icon="itemIcon(item)"
            :icon-position="item.iconPosition || 'left'"
            :icon-weight="item.iconWeight"
            :color="itemColor(item)"
            :icon-right="item.iconRight"
            @click="handleClickItem(item)"
            :variant="selection ? 'solid' : 'outline'"
            :size="size"
            >
            {{ item.name || item.text }}
          </Button>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script>
export default {
  name: "PopoverList",
  props: {
    /**
     * @type {Array<ListItem>}
     * @description List of items to display in the popover
     * @property {string} id - The id of the item
     * @property {string} name - The name of the item
     * @property {string} icon? - The icon of the item (optional)
     * @property {string} iconPosition? - The position of the icon (optional, default: "left")
     * @property {string} iconWeight? - The weight of the icon (optional, default: "regular")
     * @property {string} color? - The color of the item (optional, default: "primary")
     * @property {string} iconRight? - The right icon of the item (optional)
     */
    items: {
      type: Array,
      required: true,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    closeOnEscape: {
      type: Boolean,
      default: true,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "sm",
    },
    /**
     * Enables the selection mode where the list behaves like a select component.
     */
    selection: {
      type: Boolean,
      default: false,
    },
    /**
     * Enables the multi-selection mode where the list behaves like a select component.
     */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**
     * v-model binding of selected items.
     * Can be an array of item ids (string) or an array of full item objects.
     */
    modelValue: {
      // Array for multi-select, otherwise single id/object or null
      type: [Array, String, Object, Number, null],
      default: () => [],
    },
    /**
     * When true, the component will emit the full item object instead of its id in the v-model.
     */
    returnObjects: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click", "update:modelValue", "change"],
  methods: {
    isSame(value, item) {
      if (typeof value === "object" && value !== null) {
        return value.id === item.id
      }
      return value === item.id
    },
    isSelected(item) {
      if (this.multiple) {
        const current = Array.isArray(this.modelValue) ? this.modelValue : []
        return current.some((v) => this.isSame(v, item))
      }
      // single select
      return this.isSame(this.modelValue, item)
    },
    toggleSelection(item) {
      if (this.multiple) {
        const current = Array.isArray(this.modelValue) ? [...this.modelValue] : []
        const selected = this.isSelected(item)
        let updated
        if (selected) {
          updated = current.filter((v) => !this.isSame(v, item))
        } else {
          updated = [...current, this.returnObjects ? item : item.id]
        }
        this.$emit("update:modelValue", updated)
        this.$emit("change", updated)
      } else {
        // single selection: either select or deselect (null)
        const selected = this.isSelected(item)
        const updated = selected ? null : (this.returnObjects ? item : item.id)
        this.$emit("update:modelValue", updated)
        this.$emit("change", updated)
      }
    },
    handleClickItem(item) {
      if (this.selection) {
        this.toggleSelection(item)
      } else {
        this.$emit("click", item)
      }
    },
    /**
     * Returns the computed color for an item based on selection mode.
     */
    itemColor(item) {
      if (!this.selection) return item.color
      return this.isSelected(item) ? "primary" : "primary-soft"
    },
    /**
     * Returns the icon for an item based on selection mode.
     */
    itemIcon(item) {
      if (this.selection) {
        return this.isSelected(item) ? "check-circle" : undefined
      }
      return item.icon
    },
  },
}
</script>

<style lang="scss">
.popover-list__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
}

.popover-list__item {
  width: 100%;
  box-sizing: border-box;
  display: flex;

  .btn {
    width: 100%;
    justify-content: flex-start;
    border-radius: 0;
    text-align: left;
  }
}
</style>
<template>
  <Popover
    :close-on-click-outside="closeOnClickOutside"
    :close-on-escape="closeOnEscape"
    :overlay="overlay"
    :content-class="isMobile ? 'popover-list__mobile' : ''"
    v-bind="$attrs"
    ref="popover">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open">
        <Button
          :iconRight="open ? 'caret-up' : 'caret-down'"
          v-bind="$attrs"
          :label="labelButton" />
      </slot>
    </template>
    <template #content>
      <div class="popover-list__content">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="popover-list__item">
          <Button
            :icon="itemIcon(item)"
            :icon-position="item.iconPosition || 'left'"
            :icon-weight="item.iconWeight"
            :avatar="item.avatar"
            :avatar-text="item.avatarText"
            :icon-right="item.iconRight"
            :hovered="highlightedIndex == index"
            @click="handleClickItem(item)"
            :size="size"
            v-bind="itemPropsWithoutTo(item)">
            <div class="flex col">
              <span class="popover-list__item__name text-cut">{{
                item.name || item.text
              }}</span>
              <span
                class="popover-list__item__description"
                v-if="item.description">
                {{ item.description }}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script>
import Popover from "./Popover.vue"

export default {
  name: "PopoverList",
  components: {
    Popover,
  },
  props: {
    /**
     * @type {Array<ListItem>}
     * @description List of items to display in the popover
     * @property {string} id - The id of the item
     * @property {string} value - The value of the item (value or id is required)
     * @property {string} name - The name of the item
     * @property {string} description? - The description of the item (optional)
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
    color: {
      type: String,
      default: "neutral",
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
     * Can be an object, a string, an array of item ids (string) or an array of full item objects.
     */
    value: {
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
    /**
     * When true, the popover will automatically close after an item click
     * (ignored in `selection` mode when `multiple` is enabled).
     */
    closeOnItemClick: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["click", "update:value", "input"],
  methods: {
    isSame(value, item) {
      if (typeof value === "object" && value !== null) {
        return value.id === item.id
      }
      return value === item.id || value === item.value
    },
    isSelected(item) {
      if (this.multiple) {
        const current = Array.isArray(this.value) ? this.value : []
        return current.some((v) => this.isSame(v, item))
      }
      // single select
      return this.isSame(this.value, item)
    },
    toggleSelection(item) {
      if (this.multiple) {
        const current = Array.isArray(this.value) ? [...this.value] : []
        const selected = this.isSelected(item)
        let updated
        if (selected) {
          updated = current.filter((v) => !this.isSame(v, item))
        } else {
          updated = [...current, this.returnObjects ? item : item.id]
        }
        this.$emit("update:value", updated)
        this.$emit("input", updated)
      } else {
        // single selection: either select or deselect (null)
        const selected = this.isSelected(item)
        const updated = selected ? null : this.returnObjects ? item : item.id
        this.$emit("update:value", updated)
        this.$emit("input", updated)
      }
    },
    handleClickItem(item) {
      if (this.selection) {
        this.toggleSelection(item)
        // Close when single-select and required
        if (!this.multiple && this.closeOnItemClick) {
          this.$nextTick(() => {
            this.$refs.popover && this.$refs.popover.close()
          })
        }
      } else {
        // Handle navigation items with 'to' property
        if (item.to && this.closeOnItemClick) {
          // Close popover first, then navigate
          this.$refs.popover && this.$refs.popover.close()
          this.$nextTick(() => {
            this.$router.push(item.to)
          })
        } else {
          this.$emit("click", item)
          this.$emit("input", item.value ?? item.id)
          if (this.closeOnItemClick) {
            this.$nextTick(() => {
              this.$refs.popover && this.$refs.popover.close()
            })
          }
        }
      }
    },
    /**
     * Returns the computed color for an item based on selection mode.
     */
    itemColor(item) {
      if (!this.selection) return item.color || this.color
      return this.isSelected(item) ? this.color : this.color + "-soft"
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
    /**
     * Returns item props without the 'to' property to prevent automatic navigation.
     */
    itemPropsWithoutTo(item) {
      const { to, ...itemWithoutTo } = item
      return itemWithoutTo
    },
    onKeyDown(e) {
      console.log("hey")
      switch (e.key) {
        case "ArrowDown":
          this.highlightNext()
          break
        case "ArrowUp":
          this.highlightPrevious()
          break
        case "Enter":
          this.handleClickItem(this.items[this.highlightedIndex])
          break
        default:
          break
      }
    },
    highlightNext() {
      if (this.highlightedIndex == this.items.length - 1) {
        this.highlightedIndex = 0
      } else {
        this.highlightedIndex += 1
      }
    },
    highlightPrevious() {
      if (this.highlightedIndex == 0) {
        this.highlightedIndex = this.items.length - 1
      } else {
        this.highlightedIndex -= 1
      }
    },
  },
  data() {
    return {
      highlightedIndex: 0,
    }
  },
  computed: {
    /**
     * Detect if we are on a narrow viewport (mobile-like) to switch the
     * popover to a bottom-sheet presentation.
     */
    isMobile() {
      if (typeof window === "undefined") return false
      return window.matchMedia("(max-width: 768px)").matches
    },
    labelButton() {
      const item = this.items.find((item) => this.isSame(this.value, item))
      return item.text || item.name
    },
  },
  mounted() {
    // Ensure reactivity on viewport resize
    this.resizeListener = () => {
      // force Vue to recalculate isMobile computed dependency
      this.$forceUpdate()
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.resizeListener, { passive: true })
      //window.addEventListener("keydown", this.onKeyDown)
    }
  },
  beforeDestroy() {
    if (this.resizeListener && typeof window !== "undefined") {
      window.removeEventListener("resize", this.resizeListener)
    }
  },
}
</script>

<style lang="scss">
.popover-wrapper {
  border: var(--border-block);
  border-radius: 4px;
  display: flex;
}
.popover-list__content {
  display: flex;
  flex-direction: column;
  gap: 0px;
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
    transform: none;
    box-shadow: none;
    border: none !important;
    //color: var(--text-primary);

    &.tertiary {
      color: var(--tertiary-color);
    }

    &:hover {
      background-color: var(--primary-color);
      color: var(--primary-contrast);

      .popover-list__item__description {
        color: var(--primary-contrast);
      }
    }

    .icon {
      background-color: transparent;
    }
  }

  &__title {
  }

  &__description {
    color: var(--text-secondary);
    font-size: 0.9em;
  }
}

.popover-list__mobile {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  top: auto !important;
  border: 1px solid var(--neutral-20);
  border-radius: 4px 4px 0 0;
  width: 100vw !important;
  max-width: 100vw !important;
  max-height: 80vh !important;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.25);

  .popover-list__content {
    padding: 0.5rem;
    gap: 0.25rem;
  }
}
</style>

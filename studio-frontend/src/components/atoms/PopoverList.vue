<template>
  <Popover
    :close-on-click-outside="closeOnClickOutside"
    :closeOnClick="closeOnClick"
    :close-on-escape="closeOnEscape"
    :overlay="overlay"
    :full-width="fullWidth"
    :content-class="isMobile ? 'popover-list__mobile' : ''"
    v-bind="$attrs"
    ref="popover"
    @input="onPopoverToggle"
    @keydown="onKeyDown">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open">
        <Button
          :iconRight="open ? 'caret-up' : 'caret-down'"
          v-bind="$attrs"
          :block="fullWidth"
          :avatar="selectedItem?.avatar"
          :icon="selectedItem?.icon"
          :icon-weight="selectedItem?.iconWeight"
          :label="labelButton"
          class="popover-list__trigger"
          aria-haspopup="listbox"
          :aria-expanded="open" />
      </slot>
    </template>
    <template #content>
      <div
        class="popover-list__content"
        v-if="asyncSearch || (items && items.length)">
        <!-- Header: select all + search -->
        <div
          v-if="searchable || asyncSearch || (selection && multiple)"
          class="popover-list__header"
          @click.stop>
          <input
            v-if="selection && multiple"
            type="checkbox"
            :checked="allFilteredSelected"
            :indeterminate.prop="someFilteredSelected && !allFilteredSelected"
            @change="toggleSelectAll"
            class="popover-list__checkbox-input"
            :aria-label="$t('popover_list.select_all')" />
          <input
            v-if="searchable || asyncSearch"
            type="text"
            v-model="searchQuery"
            autofocus
            :placeholder="effectiveSearchPlaceholder"
            class="popover-list__search-input"
            :aria-label="$t('popover_list.search')"
            @keydown.stop="onSearchKeyDown" />
        </div>

        <div
          role="listbox"
          :id="listboxId"
          :aria-label="ariaLabel"
          :aria-multiselectable="multiple || null"
          :aria-activedescendant="activeDescendantId">
          <!-- Loading state -->
          <div v-if="loading" class="popover-list__loading">
            <Loading block :background="false" />
          </div>

          <!-- Async mode: no search yet, show selected items + hint -->
          <template
            v-else-if="asyncSearch && searchQuery.length < minSearchLength">
            <template v-if="selectedItems.length > 0 && selection">
              <div
                v-for="(item, index) in selectedItems"
                :key="'selected-' + (item.id ?? item.value ?? index)"
                class="popover-list__item popover-list__item--selection"
                role="option"
                :aria-selected="true"
                @click.stop>
                <input
                  type="checkbox"
                  :checked="true"
                  @change="toggleSelection(item)"
                  class="popover-list__checkbox-input" />
                <label class="popover-list__checkbox-label">
                  <slot name="item" :item="item">
                    <span class="popover-list__item__name">{{
                      item.name || item.text
                    }}</span>
                  </slot>
                </label>
              </div>
            </template>
            <div class="popover-list__empty">
              {{
                $t("popover_list.min_characters", { count: minSearchLength })
              }}
            </div>
          </template>

          <!-- Empty search results -->
          <div
            v-else-if="filteredItems.length === 0"
            class="popover-list__empty">
            {{ $t("popover_list.no_results") }}
          </div>

          <!-- Selection mode: checkbox items -->
          <template v-else-if="selection">
            <div
              v-for="(item, index) in filteredItems"
              :key="item.id ?? item.value ?? index"
              :id="getItemId(index)"
              class="popover-list__item popover-list__item--selection"
              :class="{
                'popover-list__item--highlighted': highlightedIndex === index,
              }"
              role="option"
              :aria-selected="isSelected(item)"
              @click.stop>
              <input
                type="checkbox"
                :id="getCheckboxId(index)"
                :checked="isSelected(item)"
                @change="toggleSelection(item)"
                class="popover-list__checkbox-input" />
              <label
                :for="getCheckboxId(index)"
                class="popover-list__checkbox-label">
                <slot name="item" :item="item">
                  <span class="popover-list__item__name">{{
                    item.name || item.text
                  }}</span>
                  <span
                    v-if="item.description"
                    class="popover-list__item__description">
                    {{ item.description }}
                  </span>
                </slot>
              </label>
            </div>
          </template>

          <!-- Normal mode: button items -->
          <template v-else>
            <div
              v-for="(item, index) in filteredItems"
              :key="item.id ?? item.value ?? index"
              :id="getItemId(index)"
              class="popover-list__item"
              role="option"
              :aria-selected="isSelected(item)">
              <Button
                :icon="itemIcon(item)"
                :icon-position="item.iconPosition || 'left'"
                :icon-weight="item.iconWeight"
                :avatar="item.avatar"
                :avatar-text="item.avatarText"
                :icon-right="item.iconRight"
                :hovered="highlightedIndex === index"
                @click="handleClickItem(item)"
                :size="size"
                :color="itemColor(item)">
                <slot name="item" :item="item">
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
                </slot>
              </Button>
            </div>
          </template>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script>
import { mapGetters } from "vuex"
import Popover from "./Popover.vue"
import Loading from "./Loading.vue"
import { debounceMixin } from "@/mixins/debounce"

export default {
  name: "PopoverList",
  mixins: [debounceMixin],
  components: {
    Popover,
    Loading,
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
    /**
     * If true, clicking on the trigger will close the menu
     */
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    /**
     * Accessible label for the listbox (screen readers)
     */
    ariaLabel: {
      type: String,
      default: null,
    },
    /**
     * Enable search/filter input
     */
    searchable: {
      type: Boolean,
      default: false,
    },
    /**
     * Placeholder text for search input
     */
    searchPlaceholder: {
      type: String,
      default: null,
    },
    /**
     * Async search function. Takes query string, returns Promise<items[]>.
     * When provided, items prop is ignored and search is done via this function.
     */
    asyncSearch: {
      type: Function,
      default: null,
    },
    /**
     * Minimum characters before triggering async search
     */
    minSearchLength: {
      type: Number,
      default: 2,
    },
    /**
     * Selected items to display at top (useful in async mode to show current selection)
     */
    selectedItems: {
      type: Array,
      default: () => [],
    },
    /**
     * If true, the popover will take the full width of the trigger element.
     */
    fullWidth: {
      type: Boolean,
      default: false,
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
    /**
     * Emits both update:value and input events for v-model compatibility.
     */
    emitValue(value) {
      this.$emit("update:value", value)
      this.$emit("input", value)
    },
    toggleSelection(item) {
      if (this.multiple) {
        const current = Array.isArray(this.value) ? [...this.value] : []
        const selected = this.isSelected(item)
        let updated
        if (selected) {
          updated = current.filter((v) => !this.isSame(v, item))
        } else {
          updated = [
            ...current,
            this.returnObjects ? item : (item.id ?? item.value),
          ]
        }
        this.emitValue(updated)
      } else {
        // single selection: either select or deselect (null)
        const selected = this.isSelected(item)
        const updated = selected
          ? null
          : this.returnObjects
            ? item
            : (item.id ?? item.value)
        this.emitValue(updated)
      }
    },
    toggleSelectAll() {
      if (!this.multiple) return
      const current = Array.isArray(this.value) ? [...this.value] : []
      let updated

      if (this.allFilteredSelected) {
        // Deselect all filtered items (keep items not in filteredItems)
        updated = current.filter(
          (v) => !this.filteredItems.some((item) => this.isSame(v, item)),
        )
      } else {
        // Select all filtered items (add missing ones)
        const toAdd = this.filteredItems
          .filter((item) => !this.isSelected(item))
          .map((item) => (this.returnObjects ? item : (item.id ?? item.value)))
        updated = [...current, ...toAdd]
      }

      this.emitValue(updated)
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
          this.emitValue(item.value ?? item.id)
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
     * In selection mode, we use Checkbox component instead of icon.
     */
    itemIcon(item) {
      if (this.selection) {
        return undefined
      }
      return item.icon
    },
    getItemId(index) {
      return `${this.listboxId}-option-${index}`
    },
    getCheckboxId(index) {
      return `${this.listboxId}-checkbox-${index}`
    },
    /**
     * Handles keyboard navigation for the listbox.
     * @param {KeyboardEvent} e
     * @param {Object} options
     * @param {boolean} options.enableHomeEnd - Whether Home/End keys are supported
     * @returns {boolean} - Whether the event was handled
     */
    handleKeyboardNavigation(e, { enableHomeEnd = false } = {}) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          this.highlightNext()
          return true
        case "ArrowUp":
          e.preventDefault()
          this.highlightPrevious()
          return true
        case "Enter":
          e.preventDefault()
          if (this.filteredItems[this.highlightedIndex]) {
            this.handleClickItem(this.filteredItems[this.highlightedIndex])
          }
          return true
        case "Escape":
          e.preventDefault()
          this.$refs.popover?.close()
          return true
        case "Home":
          if (enableHomeEnd) {
            e.preventDefault()
            this.highlightedIndex = 0
            return true
          }
          return false
        case "End":
          if (enableHomeEnd) {
            e.preventDefault()
            this.highlightedIndex = Math.max(0, this.filteredItems.length - 1)
            return true
          }
          return false
        default:
          return false
      }
    },
    onKeyDown(e) {
      this.handleKeyboardNavigation(e, { enableHomeEnd: true })
    },
    onPopoverToggle(isOpen) {
      if (isOpen) {
        // Reset search query and async items
        this.searchQuery = ""
        this.asyncItems = []
        // Reset highlighted index to selected item or first item
        const selectedIndex = this.filteredItems.findIndex((item) =>
          this.isSame(this.value, item),
        )
        this.highlightedIndex = selectedIndex >= 0 ? selectedIndex : 0
      }
    },
    onSearchKeyDown(e) {
      this.handleKeyboardNavigation(e)
    },
    highlightNext() {
      if (this.filteredItems.length === 0) return
      if (this.highlightedIndex >= this.filteredItems.length - 1) {
        this.highlightedIndex = 0
      } else {
        this.highlightedIndex += 1
      }
    },
    highlightPrevious() {
      if (this.filteredItems.length === 0) return
      if (this.highlightedIndex <= 0) {
        this.highlightedIndex = this.filteredItems.length - 1
      } else {
        this.highlightedIndex -= 1
      }
    },
    async performAsyncSearch(query) {
      if (this.isDestroyed) return
      this.loading = true
      try {
        const results = await this.debouncedSearch(this.asyncSearch, query)
        // Only update if query hasn't changed and component is still alive
        if (!this.isDestroyed && this.searchQuery === query) {
          this.asyncItems = results ?? []
        }
      } catch (error) {
        if (!this.isDestroyed) {
          console.error("Async search error:", error)
          this.asyncItems = []
        }
      } finally {
        if (!this.isDestroyed) {
          this.loading = false
        }
      }
    },
    /**
     * Scrolls the highlighted item into view within the listbox.
     */
    scrollHighlightedIntoView() {
      this.$nextTick(() => {
        const itemId = this.getItemId(this.highlightedIndex)
        const element = document.getElementById(itemId)
        if (element) {
          element.scrollIntoView({ block: "nearest", behavior: "smooth" })
        }
      })
    },
  },
  data() {
    return {
      highlightedIndex: 0,
      uid: Math.random().toString(36).substring(2, 9),
      searchQuery: "",
      loading: false,
      asyncItems: [],
      isDestroyed: false,
    }
  },
  computed: {
    ...mapGetters("system", ["isMobile"]),
    effectiveSearchPlaceholder() {
      return (
        this.searchPlaceholder ?? this.$t("popover_list.search_placeholder")
      )
    },
    /**
     * Returns all available items for lookup (items + selectedItems for async mode).
     */
    allAvailableItems() {
      if (this.asyncSearch) {
        // In async mode, combine selectedItems with asyncItems (avoid duplicates)
        const combined = [...this.selectedItems]
        for (const item of this.asyncItems) {
          if (!combined.some((i) => this.isSame(i.id ?? i.value, item))) {
            combined.push(item)
          }
        }
        return combined
      }
      return this.items
    },
    labelButton() {
      const item = this.allAvailableItems.find((item) =>
        this.isSame(this.value, item),
      )
      return item ? item.text || item.name : ""
    },
    selectedItem() {
      return this.allAvailableItems.find((item) =>
        this.isSame(this.value, item),
      )
    },
    listboxId() {
      return `popover-list-${this.uid}`
    },
    activeDescendantId() {
      if (this.filteredItems && this.filteredItems.length > 0) {
        return this.getItemId(this.highlightedIndex)
      }
      return null
    },
    filteredItems() {
      // Async search mode: use asyncItems directly
      if (this.asyncSearch) {
        return this.asyncItems
      }
      // Static mode with no search or empty query
      if (!this.searchable || !this.searchQuery.trim()) {
        return this.items
      }
      // Static mode with local filtering
      const query = this.searchQuery.toLowerCase().trim()
      return this.items.filter((item) => {
        const name = (item.name || item.text || "").toLowerCase()
        const description = (item.description || "").toLowerCase()
        return name.includes(query) || description.includes(query)
      })
    },
    allFilteredSelected() {
      if (this.filteredItems.length === 0) return false
      return this.filteredItems.every((item) => this.isSelected(item))
    },
    someFilteredSelected() {
      return this.filteredItems.some((item) => this.isSelected(item))
    },
  },
  watch: {
    searchQuery: {
      handler(query) {
        // Reset highlight to first item when search changes
        this.highlightedIndex = 0

        // Trigger async search if provided
        if (this.asyncSearch) {
          if (query.length >= this.minSearchLength) {
            this.performAsyncSearch(query)
          } else {
            this.asyncItems = []
          }
        }
      },
    },
    highlightedIndex() {
      this.scrollHighlightedIntoView()
    },
  },
  beforeDestroy() {
    this.isDestroyed = true
  },
}
</script>

<style lang="scss">
.popover-wrapper {
  border-radius: 4px;
  display: flex;
}
.popover-list__content {
  display: flex;
  flex-direction: column;
  gap: 0;
  outline: none;

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
}

.popover-list__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--neutral-20);
  position: sticky;
  top: 0;
  background: var(--background-app);
  z-index: 1;
}

.popover-list__search-input {
  flex: 1;
  min-width: 0;
}

.popover-list__empty {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.popover-list__loading {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
}

.popover-list__item {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  scroll-margin-top: calc(
    1rem + 40.5px
  ); // Compense le header sticky lors du scroll clavier

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

    &:hover,
    &.btn--hovered {
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

  &__description {
    color: var(--text-secondary);
    font-size: 0.9em;
  }
}

// Selection mode item styling
.popover-list__item--selection {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover,
  &.popover-list__item--highlighted {
    background-color: var(--primary-soft);
  }
}

.popover-list__checkbox-input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--primary-color);
  cursor: pointer;
  flex-shrink: 0;
}

.popover-list__checkbox-label {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  padding-bottom: 0;
  margin-bottom: 0;
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
    //padding: 0.5rem;
    gap: 0.25rem;
  }

  .popover-list__search-input {
    width: 100%;
    max-width: none;
  }
}

// Default trigger button styling (inherits input styles from forms.scss)
.popover-list__trigger {
  display: flex;
  justify-content: space-between;
  --btn-font-size: 1em;

  .label {
    text-align: left;
  }
}
</style>

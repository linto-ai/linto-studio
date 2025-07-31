<template>
  <div class="input-selector" :class="{ 'input-selector--active': isOpen }">
    <!-- Main input container -->
    <div
      class="input-selector__input-container"
      :class="{
        'input-selector__input-container--focused': isOpen || isFocused,
        'input-selector__input-container--disabled': disabled,
        'input-selector__input-container--empty': selectedTags.length === 0,
        'input-selector__input-container--inline': shouldDisplayInline,
      }"
      @click="handleContainerClick">
      <!-- Selected tags -->
      <div
        v-if="selectedTags.length > 0 && !hideSelectedTags"
        class="input-selector__tags"
        ref="tagsContainer">
        <Tooltip
          v-for="tag in selectedTags"
          :key="tag._id || tag.id"
          :text="tag.name">
          <ChipTag
            :key="tag._id || tag.id"
            :name="tag.name"
            :emoji="tag.emoji"
            :color="tag.color"
            removable
            @remove="removeTag(tag)" />
        </Tooltip>

        <!-- Overflow indicator for inline mode -->
        <div
          v-if="shouldDisplayInline && selectedTags.length > 2"
          class="input-selector__overflow-indicator">
          <ph-icon name="dots-three" size="14" />
        </div>
      </div>

      <!-- Input field -->
      <div class="input-selector__input-wrapper">
        <input
          type="text"
          ref="input"
          v-model="searchQuery"
          :placeholder="effectivePlaceholder"
          :disabled="disabled"
          :readonly="readonly"
          class="input-selector__input"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="handleInput"
          @keydown="handleKeydown" />

        <!-- Actions -->
        <div class="input-selector__actions">
          <!-- Dropdown arrow -->
          <div
            class="input-selector__arrow"
            :class="{ 'input-selector__arrow--active': isOpen }">
            <ph-icon name="caret-down" size="16" />
          </div>
        </div>
      </div>
    </div>

    <!-- Dropdown content -->
    <transition name="input-selector-dropdown">
      <div v-if="isOpen" class="input-selector__dropdown">
        <!-- Search mode: Always show search message first -->
        <div
          v-if="mode === 'search' && searchQuery"
          class="input-selector__search-message"
          :class="{
            'input-selector__search-message--highlighted':
              highlightedIndex === -1,
          }"
          @click="handleSearchSubmit"
          @mouseenter="highlightedIndex = -1">
          <ph-icon name="magnifying-glass" size="16" />
          <span>{{
            $t("input_selector.search_message", { keyword: searchQuery })
          }}</span>
        </div>

        <!-- Back to results message (only in search mode when search was cleared) -->
        <div
          v-if="mode === 'search' && !searchQuery && hadActiveSearch"
          class="input-selector__search-message"
          :class="{
            'input-selector__search-message--highlighted':
              highlightedIndex === -1,
          }"
          @click="handleBackToResults"
          @mouseenter="highlightedIndex = -1">
          <ph-icon name="arrow-left" size="16" />
          <span>{{
            $t("input_selector.search_back_to_results_message")
          }}</span>
        </div>

        <!-- Filtered tags -->
        <div v-if="filteredTags.length > 0" class="input-selector__options">
          <div
            v-for="(tag, index) in filteredTags"
            :key="tag._id || tag.id"
            class="input-selector__option"
            :class="{
              'input-selector__option--selected': isTagSelected(tag),
              'input-selector__option--highlighted': index === highlightedIndex,
            }"
            @click="handleTagClick(tag)"
            @mouseenter="highlightedIndex = index">
            <div class="input-selector__option-content">
              <span
                class="input-selector__option-emoji"
                :style="{ backgroundColor: getTagColor(tag) }">
                {{ getTagEmoji(tag) }}
              </span>
              <span class="input-selector__option-name">{{ tag.name }}</span>
            </div>

            <ph-icon
              v-if="isTagSelected(tag)"
              name="check"
              size="16"
              class="input-selector__option-check" />
          </div>
        </div>

        <!-- No results (only in tags mode) -->
        <div
          v-else-if="
            mode === 'tags' && searchQuery && filteredTags.length === 0
          "
          class="input-selector__no-results">
          {{ $t("input_selector.no_tags_found") }}
        </div>

        <!-- Create new tag (only in tags mode) -->
        <div
          v-if="mode === 'tags' && allowCreate && searchQuery && !exactMatch"
          class="input-selector__create"
          @click="handleCreateTag">
          <ph-icon name="plus" size="16" />
          <span
            >{{ $t("input_selector.create_tag") }}
            <strong>"{{ searchQuery }}"</strong></span
          >
        </div>

        <!-- Footer info -->
        <div v-if="selectedTags.length > 0" class="input-selector__footer">
          {{ selectedTags.length }} {{ $t("input_selector.selected_count") }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "InputSelector",
  components: {},
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    rows: {
      type: Number,
      default: 3,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "search",
      validator: (value) => ["search", "tags"].includes(value),
    },

    // Tags props
    tags: {
      type: Array,
      required: true,
      default: () => [],
    },
    selectedTags: {
      type: Array,
      default: () => [],
    },
    allowCreate: {
      type: Boolean,
      default: true,
    },
    hideSelectedTags: {
      type: Boolean,
      default: false,
    },

    // Behavior props
    closeOnSelect: {
      type: Boolean,
      default: false,
    },
    maxSelections: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isOpen: false,
      isFocused: false,
      searchQuery: "",
      internalValue: this.value,
      highlightedIndex: -1,
      hadActiveSearch: false, // Track if we had an active search before
    }
  },
  computed: {
    shouldDisplayInline() {
      return (
        this.mode === "search" &&
        this.selectedTags.length <= 5 &&
        this.selectedTags.length > 0
      )
    },

    effectivePlaceholder() {
      if (this.mode === "search") {
        return this.$t("input_selector.search_placeholder")
      }
      if (this.selectedTags.length > 0 && !this.hideSelectedTags) {
        return this.$t("input_selector.search_tags")
      }
      return this.placeholder || this.$t("input_selector.search_tags")
    },

    filteredTags() {
      const query = this.searchQuery.toLowerCase()
      const uniq = new Set()

      return this.availableTags
        .filter((tag) => {
          if (uniq.has(tag._id)) {
            return false
          }
          uniq.add(tag._id)
          if (!query.trim()) {
            return true
          }

          const nameMatch = tag.name?.toLowerCase().includes(query)
          const emojiMatch = tag.emoji?.toLowerCase().includes(query)
          return nameMatch || emojiMatch
        })
        .sort((a, b) => {
          if (this.isTagSelected(a)) {
            return -1
          }
          if (this.isTagSelected(b)) {
            return 1
          }
          return 0
        })
        .slice(0, 50)
    },

    availableTags() {
      // Show all tags, selected ones will be marked
      return this.tags || []
    },

    exactMatch() {
      if (!this.searchQuery.trim()) return false
      return this.availableTags.some(
        (tag) => tag.name.toLowerCase() === this.searchQuery.toLowerCase(),
      )
    },
  },
  watch: {
    value(newVal) {
      this.internalValue = newVal;
      // Synchronize searchQuery with external value for display
      if (newVal !== this.searchQuery) {
        this.searchQuery = newVal || "";
      }
    },

    internalValue(newVal) {
      this.$emit("input", newVal)
    },

    searchQuery(newVal, oldVal) {
      // Track if we had an active search that was cleared
      if (oldVal && oldVal.trim() && (!newVal || !newVal.trim())) {
        this.hadActiveSearch = true;
      } else if (newVal && newVal.trim()) {
        this.hadActiveSearch = false;
      }
    },

    isOpen(isOpen) {
      if (!isOpen) {
        this.highlightedIndex = -1
        // Don't clear searchQuery to preserve user input
      } else {
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus()
          }
        })
      }
    },

    // Auto-select the last remaining tag in search mode
    filteredTags: {
      handler(newTags, oldTags) {
        if (
          this.mode === "search" &&
          this.searchQuery &&
          newTags.length === 1 &&
          oldTags &&
          oldTags.length > 1 &&
          !this.isTagSelected(newTags[0])
        ) {
          // Automatically highlight the last remaining tag
          this.highlightedIndex = 0
        }
      },
      immediate: false,
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    
    // Initialize searchQuery with initial value
    if (this.value && this.value !== this.searchQuery) {
      this.searchQuery = this.value;
    }
  },

  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside)
  },

  methods: {
    handleContainerClick() {
      if (!this.disabled && !this.readonly) {
        this.open()
        this.$refs.input.focus()
      }
    },

    handleFocus() {
      this.isFocused = true
      this.$emit("focus")
      this.open()
    },

    handleBlur() {
      this.isFocused = false
      this.$emit("blur")
    },

    handleInput(event) {
      if (!this.isOpen && !this.disabled && !this.readonly) {
        this.open()
      }
      // Reset highlight when user types
      this.highlightedIndex = -1
    },

    handleKeydown(event) {
      switch (event.key) {
        case "Escape":
          event.preventDefault()
          this.close()
          break

        case "Enter":
          event.preventDefault()
          this.handleEnterKey()
          break

        case "ArrowDown":
          event.preventDefault()
          this.open()
          if (this.filteredTags.length > 0) {
            this.highlightNext()
          }
          break

        case "ArrowUp":
          event.preventDefault()
          if (this.isOpen && this.filteredTags.length > 0) {
            this.highlightPrev()
          }
          break

        case "Tab":
          this.close()
          break
      }
    },

    handleEnterKey() {
      // Priority 1: If we have a highlighted tag, select it
      if (
        this.highlightedIndex >= 0 &&
        this.filteredTags[this.highlightedIndex]
      ) {
        this.handleTagClick(this.filteredTags[this.highlightedIndex])
        return
      }

      // Priority 2: If we're in search mode
      if (this.mode === "search") {
        // If search message is highlighted (-1) and we have a search query, perform search
        if (this.highlightedIndex === -1 && this.searchQuery) {
          this.handleSearchSubmit()
          return
        }
        // If back to results message is highlighted (-1) and no search query but had active search, go back to results
        if (this.highlightedIndex === -1 && !this.searchQuery && this.hadActiveSearch) {
          this.handleBackToResults()
          return
        }
        // Default: perform search submit (for backward compatibility)
        this.handleSearchSubmit()
        return
      }
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.close()
      }
    },

    highlightNext() {
      if (this.mode === "search") {
        const maxIndex = this.filteredTags.length - 1
        if (this.highlightedIndex === -1) {
          // From search message to first tag (if any)
          this.highlightedIndex = this.filteredTags.length > 0 ? 0 : -1
        } else if (this.highlightedIndex >= maxIndex) {
          // From last tag back to search message
          this.highlightedIndex = -1
        } else {
          this.highlightedIndex += 1
        }
      } else {
        const maxIndex = this.filteredTags.length - 1
        this.highlightedIndex =
          this.highlightedIndex >= maxIndex ? 0 : this.highlightedIndex + 1
      }
    },

    highlightPrev() {
      if (this.mode === "search") {
        const maxIndex = this.filteredTags.length - 1
        if (this.highlightedIndex === -1) {
          // From search message to last tag (if any)
          this.highlightedIndex = this.filteredTags.length > 0 ? maxIndex : -1
        } else if (this.highlightedIndex <= 0) {
          // From first tag back to search message
          this.highlightedIndex = -1
        } else {
          this.highlightedIndex -= 1
        }
      } else {
        const maxIndex = this.filteredTags.length - 1
        this.highlightedIndex =
          this.highlightedIndex <= 0 ? maxIndex : this.highlightedIndex - 1
      }
    },

    open() {
      if (!this.disabled && !this.readonly) {
        this.isOpen = true
      }
    },

    close() {
      this.isOpen = false
    },

    isTagSelected(tag) {
      return this.selectedTags.some(
        (selectedTag) =>
          (selectedTag._id || selectedTag.id) === (tag._id || tag.id),
      )
    },

    toggleTag(tag) {
      if (this.isTagSelected(tag)) {
        this.removeTag(tag)
      } else {
        this.addTag(tag)
      }
    },

    addTag(tag) {
      // Check max selections limit
      if (
        this.maxSelections &&
        this.selectedTags.length >= this.maxSelections
      ) {
        return
      }

      if (!this.isTagSelected(tag)) {
        this.$emit("add", tag)

        if (this.closeOnSelect) {
          this.close()
        } else {
          // Clear search but keep dropdown open
          this.searchQuery = ""
        }
      }
    },

    removeTag(tag) {
      this.$emit("remove", tag)
    },

    handleCreateTag() {
      if (!this.searchQuery.trim()) return

      const newTag = {
        name: this.searchQuery.trim(),
        emoji: "",
        color: "teal",
      }

      this.$emit("create", newTag)
      this.searchQuery = ""

      if (this.closeOnSelect) {
        this.close()
      }
    },

    getTagColor(tag) {
      return `var(--material-${tag.color}-500)`
    },

    getTagEmoji(tag) {
      return this.unifiedToEmoji(tag.emoji) || ""
    },

    unifiedToEmoji(unified) {
      if (!unified) return ""

      try {
        return unified
          .split("-")
          .map((u) => String.fromCodePoint(parseInt(u, 16)))
          .join("")
      } catch (e) {
        return unified
      }
    },

    handleSearchSubmit() {
      const trimmedQuery = this.searchQuery.trim()

      if (this.mode === "search") {
        this.$emit("search", trimmedQuery) // Allow empty searches
        this.close() // Close dropdown after search
      }
    },

    handleBackToResults() {
      if (this.mode === "search") {
        this.hadActiveSearch = false; // Reset the flag
        this.$emit("search", "") // Emit empty search to return to all results
        this.close() // Close dropdown after action
      }
    },

    handleTagClick(tag) {
      if (this.mode === "tags") {
        this.toggleTag(tag)
      } else if (this.mode === "search") {
        // In search mode, add the tag to selection
        this.addTag(tag)
        // Clear search input since we've selected a tag
        this.searchQuery = ""
        if (this.closeOnSelect) {
          this.close()
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.input-selector {
  position: relative;
  width: 100%;
  font-family: inherit;

  &--active {
    z-index: 50;
  }

  &__input-container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    min-height: 2rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    cursor: text;
    transition: all 0.2s ease;
    flex-direction: column;
    overflow: hidden;

    &:hover {
      border-color: #9ca3af;
    }

    &--focused {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }

    &--disabled {
      background: #f9fafb;
      cursor: not-allowed;

      .input-selector__input {
        cursor: not-allowed;
      }
    }

    &--empty {
      .input-selector__tags {
        display: none;
      }

      .input-selector__input {
        margin-top: 0;
      }
    }

    &--inline {
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;

      .input-selector__tags {
        margin-right: 0.5rem;
        margin-bottom: 0;
        width: auto !important;
        flex: 0 0 auto;
        max-width: 60%;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        flex-wrap: nowrap;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .input-selector__input-wrapper {
        width: auto;
        flex: 1;
        min-width: 0;
      }

      .input-selector__input {
        margin-top: 0;
      }
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-right: 0.5rem;
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    max-height: 120px;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  &__overflow-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.5rem;
    background: #f3f4f6;
    border-radius: 0.375rem;
    color: #6b7280;
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  &__input-wrapper {
    flex: 1;
    width: 100%;
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__input {
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin-top: 0.5rem;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.875rem;
    line-height: 1.5;
    height: auto;

    &::placeholder {
      color: #9ca3af;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
  }

  &__clear {
    display: flex;
    align-items: center;
    padding: 0.25rem;
    border: none;
    background: transparent;
    border-radius: 0.25rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }

  &__arrow {
    color: #6b7280;
    transition: transform 0.2s ease;

    &--active {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 2000;
    margin-top: 0.25rem;
    max-height: 15rem;
    overflow-y: auto;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &__search {
    position: relative;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  &__search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }
  }

  &__search-icon {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }

  &__options {
    padding: 0.25rem 0;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover,
    &--highlighted {
      background: var(--neutral-40);
    }

    &--selected {
      background: #eff6ff;
      color: var(--primary-color);
    }

    &-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &-emoji {
      font-size: 1rem;
      border-radius: 0.25rem;
      padding: 0.25rem;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-name {
      font-size: 0.875rem;
      font-weight: 500;
    }

    &-check {
      color: var(--primary-color);
    }
  }

  &__no-results {
    padding: 1rem 0.75rem;
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
  }

  &__create {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--primary-color);
    transition: background-color 0.2s ease;

    &:hover {
      background: #f3f4f6;
    }

    strong {
      font-weight: 600;
    }
  }

  &__footer {
    padding: 0.5rem 0.75rem;
    border-top: 1px solid #e5e7eb;
    background: #f9fafb;
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
  }

  &__search-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #f9fafb;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--primary-color);
    transition: background-color 0.2s ease;

    &:hover,
    &--highlighted {
      background: var(--neutral-40);
    }

    span {
      font-weight: 500;
    }
  }
}

// Transition animations
.input-selector-dropdown-enter-active,
.input-selector-dropdown-leave-active {
  transition: all 0.2s ease;
}

.input-selector-dropdown-enter,
.input-selector-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

// Responsive
@media (max-width: 768px) {
  .input-selector {
    &__dropdown {
      max-height: 12rem;
    }

    &__tags {
      max-height: 80px;
    }

    &__input-container {
      &--inline {
        flex-direction: column !important;
        flex-wrap: nowrap !important;
        align-items: flex-start !important;
        padding: 0 !important;

        .input-selector__tags {
          max-width: 100% !important;
          width: auto !important;
          flex: 0 0 auto !important;
          flex-wrap: nowrap !important;
          margin-bottom: 0 !important;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0.2em !important;

          :deep(.chip-tag) {
            flex-shrink: 0;
            max-width: 120px;

            .chip-tag__name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .input-selector__input-wrapper {
          flex: 1 !important;
          width: 100% !important;
          min-width: 0;
          margin-top: 0.1rem !important;
          padding: 0.5rem !important;
          box-sizing: border-box !important;
        }

        .input-selector__input {
          margin-top: 0 !important;
        }
      }
    }

    &__option-name {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// Accessibility
@media (prefers-reduced-motion: reduce) {
  .input-selector__arrow,
  .input-selector-dropdown-enter-active,
  .input-selector-dropdown-leave-active {
    transition: none;
  }
}
</style>

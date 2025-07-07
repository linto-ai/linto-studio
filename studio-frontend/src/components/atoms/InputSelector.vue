<template>
  <div class="input-selector" :class="{ 'input-selector--active': isOpen }">
    <!-- Main input container -->
    <div
      class="input-selector__input-container"
      :class="{
        'input-selector__input-container--focused': isOpen || isFocused,
        'input-selector__input-container--disabled': disabled,
      }"
      @click="handleContainerClick">
      <!-- Selected tags -->
      <div
        v-if="selectedTags.length > 0 && !hideSelectedTags"
        class="input-selector__tags">
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
            @click="toggleTag(tag)"
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

        <!-- No results -->
        <div
          v-else-if="searchQuery && filteredTags.length === 0"
          class="input-selector__no-results">
          {{ $t("input_selector.no_tags_found") }}
        </div>

        <!-- Create new tag -->
        <div
          v-if="allowCreate && searchQuery && !exactMatch"
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
    }
  },
  computed: {
    effectivePlaceholder() {
      if (this.selectedTags.length > 0 && !this.hideSelectedTags) {
        return this.$t("input_selector.search_tags")
      }
      return this.placeholder || this.$t("input_selector.search_tags")
    },

    filteredTags() {
      const query = this.searchQuery.toLowerCase()
      return this.availableTags
        .filter((tag) => {
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
      this.internalValue = newVal
    },

    internalValue(newVal) {
      this.$emit("input", newVal)
    },

    isOpen(isOpen) {
      if (!isOpen) {
        this.highlightedIndex = -1
        this.searchQuery = ""
      } else {
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus()
          }
        })
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside)
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

    handleInput() {
      if (!this.isOpen) {
        this.open()
      }
    },

    handleKeydown(event) {
      switch (event.key) {
        case "Escape":
          this.close()
          break

        case "ArrowDown":
          event.preventDefault()
          this.open()
          this.$nextTick(() => {
            if (this.$refs.searchInput) {
              this.$refs.searchInput.focus()
            }
          })
          break

        case "Tab":
          this.close()
          break
      }
    },

    handleSearchKeydown(event) {
      switch (event.key) {
        case "Escape":
          this.close()
          this.$refs.input.focus()
          break

        case "Enter":
          event.preventDefault()
          if (
            this.highlightedIndex >= 0 &&
            this.filteredTags[this.highlightedIndex]
          ) {
            this.toggleTag(this.filteredTags[this.highlightedIndex])
          } else if (this.allowCreate && this.searchQuery && !this.exactMatch) {
            this.handleCreateTag()
          }
          break

        case "ArrowDown":
          event.preventDefault()
          this.highlightNext()
          break

        case "ArrowUp":
          event.preventDefault()
          this.highlightPrev()
          break

        case "Tab":
          this.close()
          this.$refs.input.focus()
          break
      }
    },

    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.close()
      }
    },

    highlightNext() {
      const maxIndex = this.filteredTags.length - 1
      this.highlightedIndex =
        this.highlightedIndex >= maxIndex ? 0 : this.highlightedIndex + 1
    },

    highlightPrev() {
      const maxIndex = this.filteredTags.length - 1
      this.highlightedIndex =
        this.highlightedIndex <= 0 ? maxIndex : this.highlightedIndex - 1
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
    min-height: 2.5rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    cursor: text;
    transition: all 0.2s ease;
    flex-direction: column;

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
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-right: 0.5rem;
    flex: 1;
    box-sizing: border-box;
    width: 100%;
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
    z-index: 1000;
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
      background: #f3f4f6;
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

    &__tag-name {
      max-width: 5rem;
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

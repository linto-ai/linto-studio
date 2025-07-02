<template>
  <div class="media-explorer-header" :style="{ top: formattedStickyTop }">
    <div class="media-explorer-header__content">
      <div class="flex flex-1 row align-center gap-medium">
        <div class="media-explorer-header__selection">
          <div
            class="select-all-control"
            :class="{ active: isSelectAll && selectedCount > 0 }">
            <input
              type="checkbox"
              :checked="isSelectAll"
              :disabled="loading || totalCount === 0"
              @change="handleSelectAll" />

            <span v-if="selectedCount > 0" class="selection-count">
              {{ selectedCount }} / {{ totalCount }}
            </span>

            <span v-else-if="totalCount > 0" class="total-count">
              {{ totalCount }}
            </span>

            <span v-else class="no-media"> No media </span>
          </div>
        </div>

        <!-- Actions slot -->
        <div class="media-explorer-header__actions" v-if="$slots.actions">
          <slot name="actions" />
        </div>

        <!-- Tags filter selector -->
        <div class="media-explorer-header__filters" v-if="selectedCount === 0">
          <input
            v-model="search"
            type="text"
            id="search"
            placeholder="Search"
            class="input-item__input fullwidth"
            @keyup.enter="handleSearch" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from "uuid"

export default {
  name: "MediaExplorerHeader",
  components: {},
  props: {
    selectedCount: {
      type: Number,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isSelectAll: {
      type: Boolean,
      default: false,
    },
    stickyTopOffset: {
      type: [Number, String],
      default: 0,
    },
    // All medias for tag filtering (including filtered ones)
    allMedias: {
      type: Array,
      default: () => [],
    },
    // Initial search value from URL
    searchValue: {
      type: String,
      default: "",
    },
  },
  computed: {
    formattedStickyTop() {
      if (typeof this.stickyTopOffset === "number") {
        return `${this.stickyTopOffset}px`
      }
      return this.stickyTopOffset
    },
  },
  data() {
    return {
      search: "",
    }
  },
  mounted() {
    // Initialize search value from prop (URL)
    if (this.searchValue) {
      this.search = this.searchValue
    }
  },
  watch: {
    searchValue: {
      handler(newValue) {
        this.search = newValue || ""
      },
      immediate: true,
    },
  },
  methods: {
    handleSelectAll() {
      this.$emit("select-all")
    },

    handleSearch() {
      const formattedSearch = this.search.trim()

      if (formattedSearch.length === 0) {
        this.$emit("search", formattedSearch, [])
      } else {
        /**
         * Will perform a search on title and text
         */
        this.$emit("search", formattedSearch, [
          {
            title: "Title filter",
            value: this.search,
            _id: uuid(),
            key: "titleConversation",
          },
          {
            title: "Text filter",
            value: this.search,
            _id: uuid(),
            key: "textConversation",
          },
        ])
      }
    },
  },
}
</script>

<style scoped>
.media-explorer-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--primary-soft, #f8f9fa);
  border-bottom: var(--border-block, 1px solid #e0e0e0);
  transition: box-shadow 0.2s ease-in-out;
}

.media-explorer-header:not(:first-child) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.media-explorer-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  min-height: 54px;
  max-height: 54px;
  box-sizing: border-box;
  gap: 1rem;
  flex: 1;
}

.media-explorer-header__selection {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.media-explorer-header__filters {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.media-explorer-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.select-all-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  padding-left: 2rem;
  background-color: var(--neutral-20, #f5f5f5);
  border: 1px solid var(--neutral-40, #d0d0d0);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  min-height: 32px;
  box-sizing: border-box;
}

.select-all-control:hover {
  background-color: var(--neutral-30, #e8e8e8);
}

.select-all-control.active {
  background-color: var(--primary-color, #007bff);
  border-color: var(--primary-color, #007bff);
  color: white;
}

.select-all-control input[type="checkbox"] {
  position: absolute;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
}

.select-all-control input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.selection-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: inherit;
}

.total-count {
  font-size: 0.875rem;
  color: var(--text-muted, #666);
}

.no-media {
  font-size: 0.875rem;
  color: var(--text-muted, #999);
  font-style: italic;
}

.input-item {
  padding: 0;
  padding-left: 0.25rem;
  border: 1px solid var(--neutral-40, #d0d0d0);
  background-color: var(--neutral-10, #f5f5f5);
}

/* Responsive design */
@media (max-width: 768px) {
  .media-explorer-header__content {
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .media-explorer-header__selection,
  .media-explorer-header__filters,
  .media-explorer-header__actions {
    justify-content: center;
  }

  .media-explorer-header__filters {
    order: -1; /* Put filters before selection on mobile */
  }
}

@media (max-width: 480px) {
  .media-explorer-header__content {
    gap: 0.75rem;
  }

  .media-explorer-header__selection {
    order: 1;
  }

  .media-explorer-header__actions {
    order: 2;
  }
}
</style>

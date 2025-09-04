<template>
  <div class="media-explorer-header">
    <div class="media-explorer-header__content">
      <div class="flex flex-1 row align-center gap-medium">
        <div class="media-explorer-header__selection">
          <label
            for="select-all-checkbox"
            class="select-all-control"
            :class="{ active: isSelectAll && selectedCount > 0 }">
            <input
              id="select-all-checkbox"
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
          </label>
        </div>

        <!-- Actions slot -->
        <div class="media-explorer-header__actions" v-if="$slots.actions">
          <slot name="actions" />
        </div>

        <!-- Tags filter selector -->
        <div class="media-explorer-header__filters">
          <InputSelector
            v-model="search"
            :selectedTagsIds="selectedTagsIds"
            :tags="getTags"
            :allow-create="false"
            id="search"
            mode="search"
            :placeholder="$t('input_selector.search_placeholder')"
            class="input-item__input fullwidth"
            @add="handleAddTag"
            @remove="handleRemoveTag"
            @search="handleSearch" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from "uuid"
import { mediaScopeMixin } from "@/mixins/mediaScope"

export default {
  mixins: [mediaScopeMixin],
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
    // All medias for tag filtering (including filtered ones)
    allMedias: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    getTags() {
      const tags = this.$store.getters["tags/getTags"]
      return tags
    },
    // Use computed property instead of data to ensure reactivity
    search: {
      get() {
        if (this._localSearch !== undefined && this._localSearch !== null) {
          return this._localSearch
        }

        return this.searchValue || ""
      },
      set(value) {
        this._localSearch = value
      },
    },
  },
  data() {
    return {
      _localSearch: null, // Start with null to prioritize external values initially
    }
  },
  mounted() {},
  watch: {
    // Watch store search value properly using computed property
    storeSearchValue: {
      handler(storeValue) {
        // Only sync if we don't have local input and store value is different
        if (this._localSearch === null && storeValue) {
          this._localSearch = storeValue
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleSelectAll() {
      this.$emit("select-all")
    },

    handleSearch(searchQuery = null) {
      // Use parameter if provided, otherwise use internal search value
      const formattedSearch =
        searchQuery !== null ? searchQuery.trim() : this.search.trim()

      this.$store.dispatch(`${this.storeScope}/setSearchQuery`, formattedSearch)
    },

    handleAddTag(tag) {
      this.toggleSelectedTag(tag)
    },

    handleRemoveTag(tag) {
      this.toggleSelectedTag(tag)
    },
  },
}
</script>

<style scoped>
.media-explorer-header {
  position: sticky;
  top: 0;
  z-index: 5;
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
  margin: 0;
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
@media (max-width: 1100px) {
  .media-explorer-header__content {
    padding: 0.5rem;
  }

  .media-explorer-header__content > .flex.flex-1.row.align-center.gap-medium {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .media-explorer-header__selection {
    flex: 0 0 auto;
    order: 1;
  }

  .media-explorer-header__actions {
    flex: 0 0 auto;
    order: 2;
    margin-left: auto;
  }

  .media-explorer-header__filters {
    flex: 1 1 100%;
    order: 3;
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 480px) {
  .media-explorer-header__content {
    gap: 0.75rem;
  }
}
</style>

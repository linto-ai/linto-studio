<template>
  <div class="media-explorer-tags-selector">
    <Popover 
      trigger="click" 
      :track-mouse="false" 
      position="bottom" 
      overlay
      :class="{ 'has-filters': selectedTagIds.length > 0 }"
      width="280px">
      <template #trigger>
        <Button
          variant="outline"
          :color="selectedTagIds.length > 0 ? 'primary-hard' : 'primary'"
          icon="funnel"
          icon-position="left"
          size="sm"
          title="Filtrer par tags">
          <template v-if="selectedTagIds.length === 0">Filtrer</template>
          <template v-else class="filter-count">x{{ selectedTagIds.length }}</template>
        </Button>
      </template>
      
      <template #content>
        <div class="tags-filter-popover">
          <div class="popover-header">
            <h4>Filtrer par tags</h4>
            <button 
              v-if="hasSelectedFilters"
              class="clear-all-link"
              @click="clearAllFilters">
              Tout effacer
            </button>
          </div>
          
          <div class="tags-list">
            <div v-if="availableTags.length === 0" class="no-tags">
              Aucun tag disponible
            </div>
            
            <div 
              v-for="tag in availableTags"
              :key="'tag-selected-' + tag._id"
              class="tag-option"
              :class="{ active: isTagSelected(tag._id) }"
              @click="toggleTagFilter(tag._id)">
              <div class="tag-visual">
                <span
                  v-if="tag.emoji"
                  class="tag-emoji"
                  :style="{ backgroundColor: getTagColor(tag) }">
                  {{ displayTagEmoji(tag) }}
                </span>
                <span class="tag-name">{{ tag.name }}</span>
              </div>
              
              <div class="tag-count" :data-count="getMediaCountForTag(tag._id)">
                {{ getMediaCountForTag(tag._id) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </Popover>

    <div class="selected-filters" v-if="selectedTagIds.length > 0">
      <Tooltip
        v-for="tag in selectedTagIds"
        :key="'filter-tag-' + tag._id"
        :text="getTagTooltip(tag)"
        position="bottom"
        :border-color="getTagColor(tag)">
        <span
          class="filter-tag"
          :style="{ backgroundColor: getTagColor(tag) }"
          @click="removeTagFilter(tag._id)">
          <span v-if="tag.emoji" class="filter-tag__name">{{ displayTagEmoji(tag) }}</span>
          <span class="filter-tag__name">{{ tag.name }}</span>
          <span class="filter-tag__delete">
            <ph-icon
              name="x"
              color="var(--neutral-80)"
              size="10"
              weight="bold" />
          </span>
        </span>
      </Tooltip>
      
      <button 
        class="clear-filters-btn"
        @click="clearAllFilters"
        title="Effacer tous les filtres">
        <ph-icon name="x-circle" size="16" weight="bold" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  name: "MediaExplorerTagsSelector",
  props: {
    // Array of media objects to analyze for tag counts
    medias: {
      type: Array,
      default: () => [],
    },
    // Maximum number of tags to show inline
    maxVisibleTags: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    ...mapState("tags", {
      allTags: (state) => state.tags,
      selectedTagIds: (state) => state.exploreSelectedTags,
    }),
    
    // Show all available tags, not just those with media
    availableTags() {
      return this.allTags.sort((a, b) => {
        // Sort by media count (descending) then by name
        const countA = this.getMediaCountForTag(a._id)
        const countB = this.getMediaCountForTag(b._id)
        if (countA !== countB) {
          return countB - countA
        }
        return a.name.localeCompare(b.name)
      })
    },
    
    // Computed property to check if there are selected filters
    hasSelectedFilters() {
      return this.selectedTagIds && this.selectedTagIds.length > 0
    },
  },
  methods: {
    ...mapActions("tags", [
      "addExploreSelectedTag",
      "removeExploreSelectedTag",
      "setExploreSelectedTags",
    ]),
    getTagById(tagId) {
      return this.allTags.find(tag => tag._id === tagId)
    },
    
    getTagTooltip(tag) {
      if (!tag) return ""
      const count = this.getMediaCountForTag(tag._id)
      return `${tag.name} (${count} média${count > 1 ? 's' : ''})`
    },
    
    getTagColor(tag) {
      return tag?.color || "var(--neutral-40)"
    },
    
    displayTagEmoji(tag) {
      if (!tag) return ""
      return this.unifiedToEmoji(tag.emoji) || tag.name.charAt(0).toUpperCase()
    },
    
    unifiedToEmoji(unified) {
      if (!unified) return ""
      return unified
        .split("-")
        .map((u) => String.fromCodePoint(parseInt(u, 16)))
        .join("")
    },
    
    getMediaCountForTag(tagId) {
      return this.medias.filter(media => 
        media.tags && media.tags.includes(tagId)
      ).length
    },
    
    isTagSelected(tagId) {
      return this.selectedTagIds.some(tag => tag._id === tagId)
    },
    
    toggleTagFilter(tagId) {
      console.log("[TagsSelector] toggleTagFilter", { tagId, selectedTagIds: this.selectedTagIds.map(t=>t._id) })
      if (this.isTagSelected(tagId)) {
        const tagObj = this.getTagById(tagId) || { _id: tagId }
        console.log("[TagsSelector] remove tag", tagObj)
        this.removeExploreSelectedTag(tagObj)
      } else {
        const tagObj = this.getTagById(tagId) || { _id: tagId }
        console.log("[TagsSelector] add tag", tagObj)
        this.addExploreSelectedTag(tagObj)
      }
    },
    
    removeTagFilter(tagId) {
      console.log("[TagsSelector] removeTagFilter", tagId)
      const tagObj = this.getTagById(tagId) || { _id: tagId }
      this.removeExploreSelectedTag(tagObj)
    },
    
    clearAllFilters() {
      console.log("[TagsSelector] clearAllFilters")
      this.setExploreSelectedTags([])
    },
  },
}
</script>

<style scoped>
.media-explorer-tags-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Selected filters display */
.selected-filters {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 200px;
  overflow-x: auto;
  padding: 0.125rem 0;
}

.filter-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  flex-shrink: 0;
}

.filter-tag:hover {
  transform: scale(1.1);
}

.filter-tag__name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--neutral-10);
  transition: opacity 0.15s ease-in-out;
}

.filter-tag__delete {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-tag:hover .filter-tag__name {
  opacity: 0;
}

.filter-tag:hover .filter-tag__delete {
  opacity: 1;
  pointer-events: all;
}

/* Clear all button */
.clear-filters-btn {
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--danger-color, #dc3545);
  border-radius: 2px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-filters-btn:hover {
  background-color: var(--danger-soft, #f8d7da);
}

/* Add filter button */
.add-filter-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: none;
}

.add-filter-btn.btn-primary {
  background-color: var(--primary-color, #007bff);
  border-color: var(--primary-color, #007bff);
  color: white;
}

.add-filter-btn.btn-primary:hover {
  background-color: var(--primary-dark, #0056b3);
  border-color: var(--primary-dark, #0056b3);
}

.add-filter-btn.btn-secondary {
  background-color: var(--neutral-20, #f8f9fa);
  border-color: var(--neutral-40, #d0d0d0);
  color: var(--text-color, #333);
}

.add-filter-btn.btn-secondary:hover {
  background-color: var(--neutral-30, #e9ecef);
}

.filter-count {
  background-color: var(--primary-color, #007bff);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-secondary .filter-count {
  background-color: var(--primary-color, #007bff);
}

/* Popover content */
.tags-filter-popover {
  width: 280px;
  max-height: 300px;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  background-color: var(--surface-soft, #f8f9fa);
}

.popover-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color, #333);
}

.clear-all-link {
  background: none;
  border: none;
  color: var(--danger-color, #dc3545);
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: underline;
}

.clear-all-link:hover {
  color: var(--danger-dark, #c82333);
}

.tags-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.no-tags {
  padding: 1rem;
  text-align: center;
  color: var(--text-muted, #666);
  font-size: 0.875rem;
  font-style: italic;
}

.tag-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tag-option:hover {
  background-color: var(--surface-soft, #f8f9fa);
}

.tag-option.active {
  background-color: var(--primary-soft, #e3f2fd);
  color: var(--primary-color, #007bff);
}

.tag-visual {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.tag-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--neutral-10);
  flex-shrink: 0;
}

.tag-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted, #666);
  background-color: var(--neutral-20, #f5f5f5);
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  min-width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.tag-option.active .tag-count {
  background-color: var(--primary-color, #007bff);
  color: white;
}

/* Special styling for tags with no media */
.tag-count[data-count="0"] {
  background-color: var(--neutral-30, #e9ecef);
  color: var(--text-muted, #999);
  font-style: italic;
}

.tag-option.active .tag-count[data-count="0"] {
  background-color: var(--primary-color, #007bff);
  color: white;
  opacity: 0.7;
}

/* Responsive design */
@media (max-width: 768px) {
  .selected-filters {
    max-width: 120px;
  }
  
  .tags-filter-popover {
    width: 260px;
  }
}
</style>
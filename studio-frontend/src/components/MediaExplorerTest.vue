<template>
  <div class="media-explorer-test">
    <h2>Test du MediaExplorer avec filtrage par tags</h2>
    
    <!-- Media Explorer with filtering -->
    <MediaExplorer
      :medias="testMedias"
      :loading="loading"
      :sticky-top-offset="0"
      :enable-pagination="false"
      @filter-change="handleFilterChange">
      
      <template #header-actions>
        <button class="btn-secondary" @click="addRandomMedia">
          Ajouter média test
        </button>
      </template>
      
      <template #empty>
        <div class="test-empty-state">
          <h3>Aucun média correspondant aux filtres</h3>
          <p>Essayez de changer les filtres ou d'ajouter de nouveaux médias</p>
        </div>
      </template>
    </MediaExplorer>
    
    <!-- Debug info -->
    <div class="debug-info">
      <h3>Informations de debug</h3>
      <p><strong>Médias totaux :</strong> {{ testMedias.length }}</p>
      <p><strong>Médias filtrés :</strong> {{ currentFilterInfo.filteredCount }}</p>
      <p><strong>Tags sélectionnés :</strong> {{ currentFilterInfo.selectedTagIds.join(', ') || 'Aucun' }}</p>
      
      <details>
        <summary>Médias de test ({{ testMedias.length }})</summary>
        <pre>{{ JSON.stringify(testMedias, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script>
import MediaExplorer from './MediaExplorer.vue'

export default {
  name: "MediaExplorerTest",
  components: {
    MediaExplorer,
  },
  data() {
    return {
      loading: false,
      currentFilterInfo: {
        selectedTagIds: [],
        filteredCount: 0,
        totalCount: 0,
      },
      testMedias: [
        {
          _id: 'media1',
          name: 'Video Test 1',
          type: 'video',
          tags: ['tag1', 'tag2']  // Audio, Musique
        },
        {
          _id: 'media2',
          name: 'Audio Test 1',
          type: 'audio',
          tags: ['tag1', 'tag3']  // Audio, Podcast
        },
        {
          _id: 'media3',
          name: 'Video Test 2',
          type: 'video',
          tags: ['tag2']  // Musique
        },
        {
          _id: 'media4',
          name: 'Audio Test 2',
          type: 'audio',
          tags: ['tag1', 'tag2', 'tag3']  // Audio, Musique, Podcast
        },
        {
          _id: 'media5',
          name: 'Video sans tags',
          type: 'video',
          tags: []  // Pas de tags
        }
      ]
    }
  },
  created() {
    // Simulate tags in store (normally this would come from Vuex)
    this.initializeTestTags()
  },
  methods: {
    handleFilterChange(filterInfo) {
      this.currentFilterInfo = filterInfo
      console.log('Filter changed:', filterInfo)
    },
    
    addRandomMedia() {
      const randomId = 'media' + Date.now()
      const types = ['audio', 'video']
      const allTags = ['tag1', 'tag2', 'tag3', 'tag4'] // Include tag4 which has no media initially
      
      const newMedia = {
        _id: randomId,
        name: `Test ${types[Math.floor(Math.random() * types.length)]} ${this.testMedias.length + 1}`,
        type: types[Math.floor(Math.random() * types.length)],
        tags: allTags.filter(() => Math.random() > 0.5) // Random tags
      }
      
      this.testMedias.push(newMedia)
    },
    
    initializeTestTags() {
      // Simulate having tags in the store
      // In a real app, these would be loaded via Vuex actions
      const testTags = [
        { _id: 'tag1', name: 'Audio', emoji: '1f3a7', color: '#007bff' },
        { _id: 'tag2', name: 'Musique', emoji: '1f3b5', color: '#28a745' },
        { _id: 'tag3', name: 'Podcast', emoji: '1f399', color: '#ffc107' },
        { _id: 'tag4', name: 'Sans média', emoji: '1f4c1', color: '#6c757d' }, // This tag has no media initially
      ]
      
      // Store tags in Vuex if available, otherwise just log them
      if (this.$store && this.$store.state.tags) {
        this.$store.commit('tags/setTags', testTags)
      } else {
        console.warn('Vuex tags store not available. Test tags:', testTags)
      }
    },
  },
}
</script>

<style scoped>
.media-explorer-test {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.media-explorer-test h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color, #333);
}

.test-empty-state {
  padding: 2rem;
  text-align: center;
}

.test-empty-state h3 {
  color: var(--text-color, #333);
  margin-bottom: 0.5rem;
}

.test-empty-state p {
  color: var(--text-muted, #666);
  margin: 0;
}

.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--surface-soft, #f8f9fa);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color, #e0e0e0);
}

.debug-info h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color, #333);
}

.debug-info p {
  margin: 0.5rem 0;
  font-family: monospace;
  font-size: 0.875rem;
}

.debug-info details {
  margin-top: 1rem;
}

.debug-info summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--primary-color, #007bff);
}

.debug-info pre {
  background: white;
  padding: 1rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border-color, #e0e0e0);
  overflow-x: auto;
  font-size: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: var(--neutral-20, #f8f9fa);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 0.375rem;
  color: var(--text-color, #333);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: var(--neutral-30, #e9ecef);
}
</style> 
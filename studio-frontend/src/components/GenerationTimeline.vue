<template>
  <div class="generation-timeline flex col flex1">
    <h3 class="sidebar-section-title">{{ $t("publish.generations.title") }}</h3>

    <!-- Loading indicator (shown alongside list, not instead of) -->
    <div v-if="loading" class="generation-loading">
      <span class="icon loading small"></span>
      <span>{{ $t("publish.generations.generating") }}</span>
    </div>

    <div
      v-if="!loading && (!generations || generations.length === 0)"
      class="no-generations">
      {{ $t("publish.generations.no_generations") }}
    </div>

    <div v-if="generations && generations.length > 0" class="generations-list flex1 overflow-vertical-auto">
      <div
        v-for="generation in sortedGenerations"
        :key="generation.generationId"
        class="generation-item"
        :class="{
          selected: generation.generationId === currentGenerationId,
          latest: generation.isCurrent,
        }"
        @click="selectGeneration(generation)">
        <div class="generation-header">
          <!-- Filled dot = selected, empty = not selected -->
          <span
            class="generation-indicator"
            :class="{
              filled: generation.generationId === currentGenerationId,
            }">
          </span>
          <span class="generation-label">
            {{ formatDate(generation.createdAt) }}
          </span>
          <!-- "Latest" badge for most recent generation -->
          <span v-if="generation.isCurrent" class="latest-badge">
            {{ $t("publish.generations.latest") }}
          </span>
        </div>

        <!-- Nested versions when this generation is selected -->
        <div
          v-if="
            generation.generationId === currentGenerationId &&
            versions &&
            versions.length > 0
          "
          class="generation-versions">
          <div
            v-for="version in sortedVersions"
            :key="version.version_number"
            class="version-item"
            :class="{ active: version.version_number === currentVersionNumber }"
            @click.stop="selectVersion(generation, version)">
            <span class="version-indicator"></span>
            {{
              $t("publish.editor.version_label", {
                version: version.version_number,
              })
            }}
            <span v-if="isLatestVersion(version)" class="version-latest-tag">
              ({{ $t("publish.generations.latest") }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateShort } from "@/tools/formatDate.js"

export default {
  name: "GenerationTimeline",
  props: {
    generations: {
      type: Array,
      default: () => [],
    },
    currentGenerationId: {
      type: String,
      default: null,
    },
    versions: {
      type: Array,
      default: () => [],
    },
    currentVersionNumber: {
      type: Number,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sortedGenerations() {
      if (!this.generations) return []
      // Sort by createdAt descending (newest first)
      return [...this.generations].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    },
    sortedVersions() {
      if (!this.versions) return []
      // Sort by version_number descending (newest first)
      return [...this.versions].sort((a, b) => {
        return b.version_number - a.version_number
      })
    },
    latestVersionNumber() {
      if (!this.versions || this.versions.length === 0) return null
      return Math.max(...this.versions.map((v) => v.version_number))
    },
  },
  methods: {
    formatDate(dateString) {
      return formatDateShort(dateString)
    },
    selectGeneration(generation) {
      this.$emit("select-generation", generation.generationId)
    },
    selectVersion(generation, version) {
      this.$emit("select-version", {
        generationId: generation.generationId,
        versionNumber: version.version_number,
      })
    },
    isLatestVersion(version) {
      return version.version_number === this.latestVersionNumber
    },
  },
}
</script>

<style scoped>
.generation-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-section-title {
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary, #333);
}

.no-generations {
  font-size: 0.85em;
  color: var(--color-text-secondary, #666);
  font-style: italic;
}

.generation-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85em;
  color: var(--color-text-secondary, #666);
}

.generations-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.generation-item {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generation-item:hover {
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
}

.generation-item.selected {
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.15);
}

.generation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generation-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--color-primary, #3b82f6);
  flex-shrink: 0;
  transition: background-color 0.15s;
}

.generation-indicator.filled {
  background-color: var(--color-primary, #3b82f6);
}

.generation-label {
  font-size: 0.9em;
  color: var(--color-text-primary, #333);
}

.generation-item.selected .generation-label {
  font-weight: 600;
}

.latest-badge {
  font-size: 0.7em;
  font-weight: 500;
  padding: 0.125rem 0.375rem;
  background-color: var(--color-success, #22c55e);
  color: white;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.generation-versions {
  margin-left: 1.25rem;
  margin-top: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--color-border, #e5e7eb);
}

.version-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.85em;
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 0.15s;
}

.version-item:hover {
  background-color: rgba(var(--color-primary-rgb, 59, 130, 246), 0.08);
}

.version-item.active {
  font-weight: 600;
  color: var(--color-primary, #3b82f6);
}

.version-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-border, #e5e7eb);
  flex-shrink: 0;
}

.version-item.active .version-indicator {
  background-color: var(--color-primary, #3b82f6);
}

.version-latest-tag {
  font-size: 0.85em;
  color: var(--color-text-secondary, #666);
  font-weight: normal;
}
</style>

<script setup lang="ts">
import { Separator } from 'reka-ui'
import { useI18n } from '../i18n'
import type { Speaker } from '../types/editor'

defineProps<{
  speakers: Speaker[]
}>()

const { t } = useI18n()
</script>

<template>
  <aside class="speaker-sidebar">
    <h2 class="sidebar-title">{{ t('sidebar.speakers') }}</h2>
    <Separator class="separator" />
    <ul class="speaker-list">
      <li
        v-for="speaker in speakers"
        :key="speaker.id"
        class="speaker-item"
      >
        <span class="speaker-indicator" :style="{ backgroundColor: speaker.color }" aria-hidden="true" />
        <span class="speaker-name">{{ speaker.name }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.speaker-sidebar {
  padding: var(--spacing-lg);
  border-left: 1px solid var(--color-border);
  background-color: var(--color-surface);
  overflow-y: auto;
}

.sidebar-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.separator {
  height: 1px;
  background-color: var(--color-border-light);
  margin: var(--spacing-sm) 0;
}

.speaker-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.speaker-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: background-color 150ms;
}

.speaker-item:hover {
  background-color: var(--color-surface-hover);
}

.speaker-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.speaker-name {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}
</style>

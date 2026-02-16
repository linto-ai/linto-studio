<script setup lang="ts">
import { computed } from 'vue'
import SpeakerIndicator from './atoms/SpeakerIndicator.vue'
import SidebarSelect from './atoms/SidebarSelect.vue'
import ChannelSelector from './ChannelSelector.vue'
import { useI18n } from '../i18n'
import { buildLanguageItems } from '../utils/intl'
import type { Speaker, Channel } from '../types/editor'

const props = defineProps<{
  speakers: Speaker[]
  channels: Channel[]
  selectedChannelId: string
  availableLanguages: string[]
  selectedLanguage: string
}>()

defineEmits<{
  'update:selectedChannelId': [id: string]
  'update:selectedLanguage': [lang: string]
}>()

const { t, locale } = useI18n()

const languageItems = computed(() =>
  buildLanguageItems(props.availableLanguages, locale.value, t('sidebar.originalLanguage'))
)
</script>

<template>
  <aside class="speaker-sidebar">
    <section v-if="channels.length > 1" class="sidebar-section sidebar-section--selector">
      <h2 class="sidebar-title">{{ t('sidebar.channel') }}</h2>
      <ChannelSelector
        :channels="channels"
        :selected-channel-id="selectedChannelId"
        @update:selected-channel-id="$emit('update:selectedChannelId', $event)"
      />
    </section>
    <section v-if="availableLanguages.length > 1" class="sidebar-section sidebar-section--selector">
      <h2 class="sidebar-title">{{ t('sidebar.language') }}</h2>
      <SidebarSelect
        :items="languageItems"
        :selected-value="selectedLanguage"
        :ariaLabel="t('sidebar.languageLabel')"
        @update:selected-value="$emit('update:selectedLanguage', $event)"
      />
    </section>
    <section class="sidebar-section">
      <h2 class="sidebar-title">{{ t('sidebar.speakers') }}</h2>
      <ul class="speaker-list">
      <li
        v-for="speaker in speakers"
        :key="speaker.id"
        class="speaker-item"
      >
        <SpeakerIndicator :color="speaker.color" />
        <span class="speaker-name">{{ speaker.name }}</span>
      </li>
    </ul>
    </section>
  </aside>
</template>

<style scoped>
.speaker-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-left: 1px solid var(--color-border);
  background-color: var(--color-surface);
  overflow-y: auto;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sidebar-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.speaker-name {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

@media (max-width: 767px) {
  .speaker-sidebar {
    border-left: none;
  }

  .sidebar-section--selector {
    display: none;
  }
}
</style>

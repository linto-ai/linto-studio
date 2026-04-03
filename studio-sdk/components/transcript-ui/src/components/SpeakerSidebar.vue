<script setup lang="ts">
import { computed } from 'vue'
import SpeakerIndicator from './atoms/SpeakerIndicator.vue'
import SwitchToggle from './atoms/SwitchToggle.vue'
import SidebarSelect from './atoms/SidebarSelect.vue'
import ChannelSelector from './ChannelSelector.vue'
import { useI18n } from '../i18n'
import { useCore } from '../core'
import * as utils from "../utils"
import type { Speaker } from '../types/editor'

const props = defineProps<{
  speakers: Speaker[]
  channels: { id: string; name: string }[]
  selectedChannelId: string
  translations: { id: string; languages: string[]; isSource: boolean }[]
  selectedTranslationId: string
}>()

defineEmits<{
  'update:selectedChannelId': [id: string]
  'update:selectedTranslationId': [id: string]
}>()

const core = useCore()
const { t, locale } = useI18n()

const translationItems = computed(() =>
  utils.buildTranslationItems(props.translations, locale.value, t('sidebar.originalLanguage'), t('language.wildcard'))
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
    <section v-if="translations.length > 1" class="sidebar-section sidebar-section--selector">
      <h2 class="sidebar-title">{{ t('sidebar.translation') }}</h2>
      <SidebarSelect
        :items="translationItems"
        :selected-value="selectedTranslationId"
        :ariaLabel="t('sidebar.translationLabel')"
        @update:selected-value="$emit('update:selectedTranslationId', $event)"
      />
    </section>
    <section v-if="core.subtitle" class="sidebar-section">
      <h2 class="sidebar-title">{{ t('sidebar.subtitle') }}</h2>
      <div class="subtitle-toggle">
        <span class="subtitle-toggle-label">{{ t('subtitle.show') }}</span>
        <SwitchToggle v-model="core.subtitle.isVisible.value" />
      </div>
      <label class="subtitle-slider">
        <span class="subtitle-slider-label">
          {{ t('subtitle.fontSize') }}
          <span class="subtitle-slider-value">{{ core.subtitle.fontSize.value }}px</span>
        </span>
        <input
          type="range"
          :min="20"
          :max="80"
          :step="2"
          :value="core.subtitle.fontSize.value"
          :disabled="!core.subtitle.isVisible.value"
          @input="core.subtitle!.fontSize.value = Number(($event.target as HTMLInputElement).value)"
        />
      </label>
    </section>
    <section v-if="speakers.length" class="sidebar-section">
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
  transition: background-color var(--transition-duration);
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

.subtitle-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}

.subtitle-toggle-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.subtitle-slider {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
}

.subtitle-slider-label {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.subtitle-slider-value {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.subtitle-slider input[type="range"] {
  width: 100%;
  accent-color: var(--color-primary);
}

.subtitle-slider input[type="range"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

<script setup lang="ts">
import { computed } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import SpeakerIndicator from './atoms/SpeakerIndicator.vue'
import SidebarSelect from './atoms/SidebarSelect.vue'
import ChannelSelector from './ChannelSelector.vue'
import { useI18n } from '../i18n'
import { useEditorCore } from '../core'
import { buildTranslationItems } from '../utils/intl'
import type { Speaker, Channel, Translation } from '../types/editor'

const props = defineProps<{
  speakers: Speaker[]
  channels: Channel[]
  selectedChannelId: string
  translations: Translation[]
  selectedTranslationId: string
}>()

defineEmits<{
  'update:selectedChannelId': [id: string]
  'update:selectedTranslationId': [id: string]
}>()

const editor = useEditorCore()
const { t, locale } = useI18n()

const translationItems = computed(() =>
  buildTranslationItems(props.translations, locale.value, t('sidebar.originalLanguage'), t('language.wildcard'))
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
    <section v-if="editor.subtitle" class="sidebar-section">
      <h2 class="sidebar-title">{{ t('sidebar.subtitle') }}</h2>
      <label class="subtitle-toggle">
        <span class="subtitle-toggle-label">{{ t('subtitle.show') }}</span>
        <SwitchRoot
          v-model:checked="editor.subtitle.isVisible.value"
          class="switch-root"
        >
          <SwitchThumb class="switch-thumb" />
        </SwitchRoot>
      </label>
      <label class="subtitle-slider">
        <span class="subtitle-slider-label">
          {{ t('subtitle.fontSize') }}
          <span class="subtitle-slider-value">{{ editor.subtitle.fontSize.value }}px</span>
        </span>
        <input
          type="range"
          :min="20"
          :max="80"
          :step="2"
          :value="editor.subtitle.fontSize.value"
          :disabled="!editor.subtitle.isVisible.value"
          @input="editor.subtitle!.fontSize.value = Number(($event.target as HTMLInputElement).value)"
        />
      </label>
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

.subtitle-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.subtitle-toggle-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.switch-root {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background-color: var(--color-border);
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 150ms;
}

.switch-root[data-state="checked"] {
  background-color: var(--color-primary);
}

.switch-thumb {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  transition: transform 150ms;
  transform: translateX(2px);
}

.switch-thumb[data-state="checked"] {
  transform: translateX(18px);
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

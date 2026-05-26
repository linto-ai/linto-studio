<script setup lang="ts">
import { computed, ref } from 'vue'
import SpeakerIndicator from './atoms/SpeakerIndicator.vue'
import SwitchToggle from './atoms/SwitchToggle.vue'
import EditableText from './atoms/EditableText.vue'
import EditorIcon from './atoms/EditorIcon.vue'
import SpeakerMenu from './molecules/SpeakerMenu.vue'
import MergeDialog from './molecules/MergeDialog.vue'
import ChannelSelector from './ChannelSelector.vue'
import TranslationSelector from './TranslationSelector.vue'
import { useI18n } from '../i18n'
import { useCore } from '../core'
import { renameSpeaker } from '../plugins/transcriptionEditor/utils/speakerActions'
import type { Speaker } from '../types/editor'
import type { LLMServiceGenerationStatus } from '../core'

defineProps<{
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
const { t } = useI18n()

const canEditSpeakers = computed(() => core.capabilities.value.speakers === 'edit')

const mergeOpen = ref(false)
const mergeFromId = ref<string | null>(null)

function onRename(speakerId: string, newName: string): void {
  renameSpeaker(core, speakerId, newName)
}

function onOpenMerge(speakerId: string): void {
  mergeFromId.value = speakerId
  mergeOpen.value = true
}

// ── History (LLM service generations + versions) ──────────────────────

const activeService = computed(() => core.llmServices?.active.value ?? null)

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'short',
  timeStyle: 'short',
})

const generations = computed(() => {
  const list = activeService.value?.generations.value ?? []
  return [...list].sort((a, b) => b.createdAt - a.createdAt)
})

const versions = computed(() => {
  const list = activeService.value?.versions.value ?? []
  return [...list].sort((a, b) => b.versionNumber - a.versionNumber)
})

const currentGenerationId = computed(
  () => activeService.value?.currentGenerationId.value ?? null,
)
const activeVersionNumber = computed(
  () => activeService.value?.activeVersionNumber.value ?? null,
)
const serviceBusy = computed(() => activeService.value?.busy.value ?? false)

function statusIconName(status: LLMServiceGenerationStatus): string {
  if (status === 'completed') return 'check'
  if (status === 'error') return 'x'
  return 'spinner'
}

function statusLabel(status: LLMServiceGenerationStatus): string {
  if (status === 'completed') return t('sidebar.statusCompleted')
  if (status === 'error') return t('sidebar.statusError')
  if (status === 'processing') return t('sidebar.statusProcessing')
  return t('sidebar.statusQueued')
}

function onSelectGeneration(generationId: string): void {
  if (serviceBusy.value) return
  if (generationId === currentGenerationId.value) return
  const service = activeService.value
  if (!service) return
  core.emit('llmService:selectGeneration', { id: service.id, generationId })
}

function onSelectVersion(versionNumber: number): void {
  if (serviceBusy.value) return
  if (versionNumber === activeVersionNumber.value) return
  const service = activeService.value
  if (!service) return
  core.emit('llmService:selectVersion', { id: service.id, versionNumber })
}
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
      <TranslationSelector
        :translations="translations"
        :selected-translation-id="selectedTranslationId"
        @update:selected-translation-id="$emit('update:selectedTranslationId', $event)"
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
      <div
        v-if="core.subtitle.watermark && !core.subtitle.watermark.readonly"
        class="subtitle-toggle"
      >
        <span class="subtitle-toggle-label">{{ t('subtitle.showWatermark') }}</span>
        <SwitchToggle
          v-model="core.subtitle.watermark.display.value"
          :disabled="!core.subtitle.isVisible.value"
        />
      </div>
      <div
        v-if="
          core.subtitle.watermark &&
          !core.subtitle.watermark.readonly &&
          core.subtitle.watermark.display.value
        "
        class="subtitle-toggle"
      >
        <span class="subtitle-toggle-label">{{ t('subtitle.pinWatermark') }}</span>
        <SwitchToggle
          v-model="core.subtitle.watermark.pinned.value"
          :disabled="!core.subtitle.isVisible.value"
        />
      </div>
    </section>
    <section
      v-if="activeService && generations.length"
      class="sidebar-section"
      :class="{ 'sidebar-section--busy': serviceBusy }">
      <h2 class="sidebar-title">{{ t('sidebar.history') }}</h2>
      <ul class="history-list">
        <li
          v-for="gen in generations"
          :key="gen.generationId"
          class="history-generation"
          :class="{
            'history-generation--current':
              gen.generationId === currentGenerationId,
          }">
          <button
            type="button"
            class="history-generation__header"
            :disabled="serviceBusy"
            :aria-current="
              gen.generationId === currentGenerationId ? 'true' : undefined
            "
            @click="onSelectGeneration(gen.generationId)">
            <EditorIcon
              :name="statusIconName(gen.status)"
              :spin="gen.status === 'processing' || gen.status === 'queued'"
              :size="14"
              :class="[
                'history-generation__status',
                `history-generation__status--${gen.status}`,
              ]" />
            <span class="history-generation__label">
              <time :datetime="new Date(gen.createdAt).toISOString()">
                {{ dateFormat.format(gen.createdAt) }}
              </time>
            </span>
            <span class="history-generation__hint">{{
              statusLabel(gen.status)
            }}</span>
          </button>
          <ul
            v-if="gen.generationId === currentGenerationId && versions.length"
            class="history-version-list">
            <li v-for="v in versions" :key="v.versionNumber">
              <button
                type="button"
                class="history-version"
                :class="{
                  'history-version--active':
                    v.versionNumber === activeVersionNumber,
                }"
                :disabled="serviceBusy"
                :aria-current="
                  v.versionNumber === activeVersionNumber ? 'true' : undefined
                "
                @click="onSelectVersion(v.versionNumber)">
                <span class="history-version__num">v{{ v.versionNumber }}</span>
                <time
                  class="history-version__date"
                  :datetime="new Date(v.createdAt).toISOString()">
                  {{ dateFormat.format(v.createdAt) }}
                </time>
              </button>
            </li>
          </ul>
        </li>
      </ul>
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
        <EditableText
          class="speaker-name"
          :model-value="speaker.name"
          :disabled="!canEditSpeakers"
          :aria-label="t('sidebar.renameSpeaker')"
          @commit="onRename(speaker.id, $event)" />
        <SpeakerMenu
          v-if="canEditSpeakers && speakers.length > 1"
          :speaker-name="speaker.name"
          @merge="onOpenMerge(speaker.id)" />
      </li>
    </ul>
    </section>
    <MergeDialog
      v-if="canEditSpeakers"
      v-model:open="mergeOpen"
      :from-speaker-id="mergeFromId" />
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

/* ── History (LLM generations + versions) ──────────────────────────── */

.sidebar-section--busy {
  opacity: 0.6;
  pointer-events: none;
}

.history-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin: 0;
  padding: 0;
}

.history-generation {
  display: flex;
  flex-direction: column;
}

.history-generation__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  text-align: left;
  transition: background-color var(--transition-duration);
}

.history-generation__header:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.history-generation__header:disabled {
  cursor: not-allowed;
}

.history-generation--current .history-generation__header {
  background-color: var(--color-surface-hover);
  border-color: var(--color-border);
}

.history-generation__status--completed {
  color: var(--color-success, #2e7d32);
}

.history-generation__status--error {
  color: var(--color-danger, #d33);
}

.history-generation__status--processing,
.history-generation__status--queued {
  color: var(--color-primary);
}

.history-generation__label {
  flex: 1;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.history-generation__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.history-version-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: var(--spacing-xs) 0 0 var(--spacing-md);
  padding: 0;
  border-left: 1px solid var(--color-border);
}

.history-version {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  margin-left: var(--spacing-xs);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: left;
  transition: background-color var(--transition-duration);
}

.history-version:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.history-version:disabled {
  cursor: not-allowed;
}

.history-version--active {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  font-weight: 600;
}

.history-version__num {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.history-version__date {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
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

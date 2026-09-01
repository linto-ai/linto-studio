<script setup lang="ts">
import { Button, EditorIcon } from "@linto-ai/transcript-ui-ui"
import { computed } from "vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import * as utils from "../utils"

const props = defineProps<{
  title: string
  date: string | number | null
  duration: number
  speakerCount: number
  isMobile: boolean
  canAsk?: boolean
  canUndo?: boolean
  canRedo?: boolean
}>()

defineEmits<{
  toggleSidebar: []
  openChat: []
  undo: []
  redo: []
}>()

const { t, locale } = useI18n()

const formattedTitle = computed(() => props.title.replace(/-/g, " "))
const formattedDate = computed(() =>
  props.date != null ? utils.formatLongDate(props.date, locale.value) : "",
)
const formattedDuration = computed(() =>
  utils.formatDurationMinutes(props.duration, locale.value),
)
const formattedSpeakerCount = computed(() =>
  t("header.speakerCount", { count: props.speakerCount }),
)

const metaParts = computed(() =>
  [
    formattedDate.value,
    formattedDuration.value,
    formattedSpeakerCount.value,
  ].filter(Boolean),
)
</script>

<template>
  <header class="editor-header">
    <div class="header-main">
      <h1 class="document-title">{{ formattedTitle }}</h1>
      <div v-if="metaParts.length" class="document-meta">
        <span
          v-for="(part, i) in metaParts"
          :key="i"
          class="document-meta__part">
          {{ part }}
        </span>
      </div>
    </div>
    <div class="header-right">
      <Button
        v-if="isMobile"
        variant="transparent"
        :aria-label="t('header.openSidebar')"
        @click="$emit('toggleSidebar')">
        <template #icon><EditorIcon name="users" :size="16" /></template>
      </Button>
      <Button
        variant="secondary"
        :aria-label="t('header.undo')"
        :disabled="!props.canUndo"
        @click="$emit('undo')">
        <template #icon><EditorIcon name="undo" :size="16" /></template>
      </Button>
      <Button
        variant="secondary"
        :aria-label="t('header.redo')"
        :disabled="!props.canRedo"
        @click="$emit('redo')">
        <template #icon><EditorIcon name="redo" :size="16" /></template>
      </Button>
      <Button
        variant="primary"
        :aria-label="t('header.ask')"
        :disabled="!props.canAsk"
        @click="$emit('openChat')">
        <template #icon><EditorIcon name="sparkles" :size="16" /></template>
        <span v-if="!isMobile">{{ t("header.ask") }}</span>
      </Button>
    </div>
  </header>
</template>

<style scoped>
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  min-height: var(--header-height);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
  flex-shrink: 0;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.document-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.document-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.document-meta__part {
  text-box: cap alphabetic;
}

.document-meta__part + .document-meta__part::before {
  content: "·";
  margin-right: var(--spacing-xs);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .editor-header {
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .document-title {
    font-size: var(--font-size-base);
  }
}
</style>

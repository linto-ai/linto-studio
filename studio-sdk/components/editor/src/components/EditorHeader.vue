<script setup lang="ts">
import { computed } from 'vue'
import EditorBadge from './atoms/EditorBadge.vue'
import EditorButton from './atoms/EditorButton.vue'
import { useI18n } from '../i18n'
import * as utils from "../utils"
const props = defineProps<{
  title: string
  duration: number
  language: string
  isMobile: boolean
}>()

defineEmits<{
  toggleSidebar: []
}>()

const { t, locale } = useI18n()

const languageName = computed(() => utils.getLanguageDisplayName(props.language, locale.value, t('language.wildcard')))

const formattedDuration = computed(() => utils.formatTime(props.duration))

const formattedTitle = computed(() => {
  return props.title.replace(/-/g, ' ')
})
</script>

<template>
  <header class="editor-header">
    <div class="header-left">
      <h1 class="document-title">{{ formattedTitle }}</h1>
      <div class="badges">
        <EditorBadge>{{ languageName }}</EditorBadge>
        <EditorBadge>
          <time :datetime="`PT${duration}S`">{{ formattedDuration }}</time>
        </EditorBadge>
      </div>
    </div>
    <div class="header-right">
      <EditorButton
        v-if="isMobile"
        variant="transparent"
        icon="users"
        :aria-label="t('header.openSidebar')"
        @click="$emit('toggleSidebar')" />
      <EditorButton
        v-if="isMobile"
        variant="tertiary"
        icon="download"
        disabled
        :aria-label="t('header.export')" />
      <EditorButton v-else variant="tertiary" icon="download" disabled>
        {{ t('header.export') }}
      </EditorButton>
      <EditorButton
        variant="transparent"
        icon="settings"
        disabled
        :aria-label="t('header.settings')" />
    </div>
  </header>
</template>

<style scoped>
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  height: var(--header-height);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
}

.document-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badges {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

@media (max-width: 767px) {
  .editor-header {
    padding: 0 var(--spacing-md);
    height: 48px;
  }

  .badges {
    display: none;
  }

  .document-title {
    font-size: var(--font-size-base);
  }
}
</style>

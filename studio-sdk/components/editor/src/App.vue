<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EditorLayout from './components/EditorLayout.vue'
import { mapApiDocument } from './adapters/apiAdapter'
import { provideI18n, type Locale } from './i18n'
import type { ApiDocument } from './types/api'
import type { EditorDocument } from './types/editor'

const locale = ref<Locale>('fr')
const { t } = provideI18n(locale)

const document = ref<EditorDocument | null>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch('/test.json')
    const raw: ApiDocument = await response.json()
    document.value = mapApiDocument(raw)
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('editor.loadError')
  }
})
</script>

<template>
  <div v-if="error" class="error-state">
    <p>{{ error }}</p>
  </div>
  <div v-else-if="!document" class="loading-state">
    <p>{{ t('editor.loading') }}</p>
  </div>
  <EditorLayout v-else :document="document" audio-src="/chat-gpt-dans-le-texte.mp3" />
</template>

<style scoped>
.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
}

.error-state {
  color: #e53935;
}
</style>

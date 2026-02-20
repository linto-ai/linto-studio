<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EditorLayout from './components/EditorLayout.vue'
import { mapApiDocument } from './adapters/apiAdapter'
import { provideI18n, type Locale } from './i18n'
import { createEditorCore, provideEditorCore } from './core'
import { createLivePlugin } from './plugins/live'
import type { ApiDocument } from './types/api'

const locale = ref<Locale>('fr')
const { t } = provideI18n(locale)

const editor = createEditorCore()
provideEditorCore(editor)

const livePlugin = createLivePlugin()
editor.use(livePlugin)

const error = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [r1, r2] = await Promise.all([fetch('/test.json'), fetch('/test2.json')])
    const [raw1, raw2]: [ApiDocument, ApiDocument] = await Promise.all([r1.json(), r2.json()])
    const doc1 = mapApiDocument(raw1)
    editor.setChannels([
      {
        id: 'ch-1',
        label: 'Canal 1',
        document: doc1,
        audioSrc: '/chat-gpt-dans-le-texte.mp3',
        translations: [
          { language: 'en', turns: doc1.turns },
          { language: 'de', turns: doc1.turns },
        ],
      },
      { id: 'ch-2', label: 'Canal 2', document: mapApiDocument(raw2), audioSrc: '/Comment peut-on atteindre ses fins.mp3' },
    ])
    loading.value = false
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('editor.loadError')
    loading.value = false
  }
})

onUnmounted(() => {
  editor.destroy()
})
</script>

<template>
  <div v-if="error" class="error-state">
    <p>{{ error }}</p>
  </div>
  <div v-else-if="loading" class="loading-state">
    <p>{{ t('editor.loading') }}</p>
  </div>
  <EditorLayout v-else />
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

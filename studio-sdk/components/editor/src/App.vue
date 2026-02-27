<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EditorLayout from './components/EditorLayout.vue'
import { mapApiDocument } from './adapters/apiAdapter'
import { provideI18n, type Locale } from './i18n'
import { createEditorCore, provideEditorCore } from './core'
import { createLivePlugin } from './plugins/live'
import type { ApiDocument } from './types/api'
import type { Channel, Speaker } from './types/editor'

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
    const doc2 = mapApiDocument(raw2)

    // Merge speakers from both documents
    const speakers = new Map<string, Speaker>(doc1.speakers)
    for (const [id, speaker] of doc2.speakers) {
      if (!speakers.has(id)) speakers.set(id, speaker)
    }

    const sourceTr1 = doc1.channels[0]!.translations[0]!

    const ch1: Channel = {
      id: 'ch-1',
      name: 'Canal 1',
      duration: doc1.channels[0]!.duration,
      translations: [
        { ...sourceTr1, audio: { src: '/chat-gpt-dans-le-texte.mp3' } },
        { id: 'tr-en', languages: ['en'], isSource: false, turns: sourceTr1.turns },
        { id: 'tr-de', languages: ['de'], isSource: false, turns: sourceTr1.turns },
      ],
    }

    const sourceTr2 = doc2.channels[0]!.translations[0]!

    const ch2: Channel = {
      id: 'ch-2',
      name: 'Canal 2',
      duration: doc2.channels[0]!.duration,
      translations: [
        { ...sourceTr2, audio: { src: '/Comment peut-on atteindre ses fins.mp3' } },
      ],
    }

    editor.setDocument({
      title: doc1.title,
      speakers,
      channels: [ch1, ch2],
    })
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

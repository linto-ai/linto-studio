<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EditorLayout from './components/EditorLayout.vue'
import { mapApiDocument } from './adapters/apiAdapter'
import { provideI18n, type Locale } from './i18n'
import type { ApiDocument } from './types/api'
import type { Channel } from './types/editor'

const locale = ref<Locale>('fr')
const { t } = provideI18n(locale)

const channels = ref<Channel[]>([])
const selectedChannelId = ref('')
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const [r1, r2] = await Promise.all([fetch('/test.json'), fetch('/test2.json')])
    const [raw1, raw2]: [ApiDocument, ApiDocument] = await Promise.all([r1.json(), r2.json()])
    const doc1 = mapApiDocument(raw1)
    channels.value = [
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
    ]
    selectedChannelId.value = 'ch-1'
  } catch (e) {
    error.value = e instanceof Error ? e.message : t('editor.loadError')
  }
})
</script>

<template>
  <div v-if="error" class="error-state">
    <p>{{ error }}</p>
  </div>
  <div v-else-if="channels.length === 0" class="loading-state">
    <p>{{ t('editor.loading') }}</p>
  </div>
  <EditorLayout
    v-else
    :channels="channels"
    v-model:selected-channel-id="selectedChannelId"
  />
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

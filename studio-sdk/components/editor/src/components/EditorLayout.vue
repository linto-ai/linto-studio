<script setup lang="ts">
import { computed, ref, readonly, useTemplateRef, watch } from 'vue'
import EditorHeader from './EditorHeader.vue'
import TranscriptionPanel from './TranscriptionPanel.vue'
import SpeakerSidebar from './SpeakerSidebar.vue'
import AudioPlayer from './AudioPlayer.vue'
import { provideAudioContext } from '../composables/useAudioContext'
import type { Channel } from '../types/editor'

const props = defineProps<{
  channels: Channel[]
  selectedChannelId: string
}>()

defineEmits<{
  'update:selectedChannelId': [id: string]
}>()

const activeChannel = computed(() =>
  props.channels.find(c => c.id === props.selectedChannelId) ?? props.channels[0]!
)
const activeDocument = computed(() => activeChannel.value.document)
const activeAudioSrc = computed(() => activeChannel.value.audioSrc)
const speakerList = computed(() => Array.from(activeDocument.value.speakers.values()))

const audioPlayerRef = useTemplateRef<InstanceType<typeof AudioPlayer>>('audioPlayer')
const currentTime = ref(0)
const isPlaying = ref(false)

const selectedLanguage = ref<string | null>(null)

function onTimeUpdate(time: number) {
  currentTime.value = time
}

watch(() => props.selectedChannelId, () => {
  audioPlayerRef.value?.pause()
  currentTime.value = 0
  isPlaying.value = false
  selectedLanguage.value = null
})

const activeLanguageCode = computed(() =>
  selectedLanguage.value ?? activeDocument.value.metadata.language
)

const activeTurns = computed(() => {
  if (!selectedLanguage.value) return activeDocument.value.turns
  const tr = activeChannel.value.translations?.find(t => t.language === selectedLanguage.value)
  return tr?.turns ?? activeDocument.value.turns
})

const availableLanguages = computed(() => {
  const original = activeDocument.value.metadata.language
  const extras = activeChannel.value.translations?.map(t => t.language) ?? []
  return [original, ...extras]
})

function onLanguageChange(lang: string) {
  const isOriginal = lang === activeDocument.value.metadata.language
  selectedLanguage.value = isOriginal ? null : lang
}

provideAudioContext({
  currentTime: readonly(currentTime),
  isPlaying: readonly(isPlaying),
  seekTo: (time: number) => audioPlayerRef.value?.seekTo(time),
})
</script>

<template>
  <div class="editor-layout">
    <EditorHeader :metadata="activeDocument.metadata" />
    <main class="editor-body">
      <TranscriptionPanel
        :turns="activeTurns"
        :speakers="activeDocument.speakers"
      />
      <SpeakerSidebar
        :speakers="speakerList"
        :channels="channels"
        :selected-channel-id="selectedChannelId"
        :available-languages="availableLanguages"
        :selected-language="activeLanguageCode"
        @update:selected-channel-id="$emit('update:selectedChannelId', $event)"
        @update:selected-language="onLanguageChange"
      />
    </main>
    <AudioPlayer
      v-if="activeAudioSrc"
      ref="audioPlayer"
      :audio-src="activeAudioSrc"
      :turns="activeTurns"
      :speakers="activeDocument.speakers"
      @timeupdate="onTimeUpdate"
      @play-state-change="(v: boolean) => isPlaying = v"
    />
  </div>
</template>

<style scoped>
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-background);
}

.editor-body {
  display: grid;
  grid-template-columns: 1fr var(--sidebar-width);
  flex: 1;
  min-height: 0;
}
</style>

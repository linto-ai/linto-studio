<script setup lang="ts">
import { computed } from 'vue'
import EditorHeader from './EditorHeader.vue'
import TranscriptionPanel from './TranscriptionPanel.vue'
import SpeakerSidebar from './SpeakerSidebar.vue'
import AudioPlayer from './AudioPlayer.vue'
import type { EditorDocument } from '../types/editor'

const props = defineProps<{
  document: EditorDocument
  audioSrc?: string
}>()

const speakerList = computed(() => Array.from(props.document.speakers.values()))
</script>

<template>
  <div class="editor-layout">
    <EditorHeader :metadata="document.metadata" />
    <main class="editor-body">
      <TranscriptionPanel
        :turns="document.turns"
        :speakers="document.speakers"
      />
      <SpeakerSidebar :speakers="speakerList" />
    </main>
    <AudioPlayer
      v-if="audioSrc"
      :audio-src="audioSrc"
      :turns="document.turns"
      :speakers="document.speakers"
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

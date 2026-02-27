<script setup lang="ts">
import { computed, ref, readonly, useTemplateRef, watch } from "vue"
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "reka-ui"
import { X } from "lucide-vue-next"
import EditorHeader from "./EditorHeader.vue"
import TranscriptionPanel from "./TranscriptionPanel.vue"
import SpeakerSidebar from "./SpeakerSidebar.vue"
import AudioPlayer from "./AudioPlayer.vue"
import ChannelSelector from "./ChannelSelector.vue"
import SidebarSelect from "./atoms/SidebarSelect.vue"
import { provideAudioContext } from "../composables/useAudioContext"
import { useIsMobile } from "../composables/useIsMobile"
import { useEditorCore } from "../core"
import { useI18n } from "../i18n"
import { buildLanguageItems } from "../utils/intl"

const editor = useEditorCore()
const { t, locale } = useI18n()
const { isMobile } = useIsMobile()
const isSidebarOpen = ref(false)

const activeChannel = editor.activeChannel
const activeTranslation = editor.activeTranslation
const activeTurns = editor.activeTurns
const availableLanguages = editor.availableLanguages
const activeLanguageCode = editor.activeLanguageCode
const speakers = editor.speakers

const channels = computed(() => editor.document.value.channels)
const activeAudioSrc = computed(() => activeTranslation.value.audio?.src)
const speakerList = computed(() => Array.from(speakers.value.values()))

const audioPlayerRef =
  useTemplateRef<InstanceType<typeof AudioPlayer>>("audioPlayer")
const currentTime = ref(0)
const isPlaying = ref(false)

function onTimeUpdate(time: number) {
  currentTime.value = time
}

watch(
  () => editor.activeChannelId.value,
  () => {
    audioPlayerRef.value?.pause()
    currentTime.value = 0
    isPlaying.value = false
    isSidebarOpen.value = false
  },
)

const languageItems = computed(() =>
  buildLanguageItems(
    availableLanguages.value,
    locale.value,
    t("sidebar.originalLanguage"),
    t("language.wildcard"),
  ),
)

function onChannelChange(channelId: string) {
  editor.setActiveChannel(channelId)
}

function onLanguageChange(lang: string) {
  editor.setActiveLanguage(lang)
}

provideAudioContext({
  currentTime: readonly(currentTime),
  isPlaying: readonly(isPlaying),
  seekTo: (time: number) => audioPlayerRef.value?.seekTo(time),
})
</script>

<template>
  <div class="editor-layout">
    <EditorHeader
      :title="editor.document.value.title"
      :duration="activeChannel.duration"
      :language="activeLanguageCode"
      :is-mobile="isMobile"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <main class="editor-body">
      <TranscriptionPanel :turns="activeTurns" :speakers="speakers" />
      <SpeakerSidebar
        v-if="!isMobile"
        :speakers="speakerList"
        :channels="channels"
        :selected-channel-id="editor.activeChannelId.value"
        :available-languages="availableLanguages"
        :selected-language="activeLanguageCode"
        @update:selected-channel-id="onChannelChange"
        @update:selected-language="onLanguageChange" />

      <DialogRoot v-model:open="isSidebarOpen">
        <DialogPortal>
          <DialogOverlay class="sidebar-overlay" />
          <DialogContent class="sidebar-drawer">
            <DialogTitle class="sr-only">{{
              t("sidebar.speakers")
            }}</DialogTitle>
            <DialogClose
              class="sidebar-close"
              :aria-label="t('header.closeSidebar')">
              <X :size="20" />
            </DialogClose>
            <SpeakerSidebar
              :speakers="speakerList"
              :channels="channels"
              :selected-channel-id="editor.activeChannelId.value"
              :available-languages="availableLanguages"
              :selected-language="activeLanguageCode"
              @update:selected-channel-id="onChannelChange"
              @update:selected-language="onLanguageChange" />
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </main>
    <AudioPlayer
      v-if="activeAudioSrc"
      ref="audioPlayer"
      :audio-src="activeAudioSrc"
      :turns="activeTurns"
      :speakers="speakers"
      @timeupdate="onTimeUpdate"
      @play-state-change="(v: boolean) => (isPlaying = v)" />
    <div v-if="isMobile" class="mobile-selectors">
      <ChannelSelector
        v-if="channels.length > 1"
        :channels="channels"
        :selected-channel-id="editor.activeChannelId.value"
        @update:selected-channel-id="onChannelChange" />
      <SidebarSelect
        v-if="availableLanguages.length > 1"
        :items="languageItems"
        :selected-value="activeLanguageCode"
        :ariaLabel="t('sidebar.languageLabel')"
        @update:selected-value="onLanguageChange" />
    </div>
  </div>
</template>

<style scoped>
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-background);
}

.editor-body {
  display: grid;
  grid-template-columns: 1fr var(--sidebar-width);
  flex: 1;
  min-height: 0;
}

.mobile-selectors {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface);
  flex-shrink: 0;
}

.mobile-selectors > * {
  flex: 1;
  min-width: 0;
}

@media (max-width: 767px) {
  .editor-body {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- Unscoped: DialogPortal renders outside this component's DOM -->
<style>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 50;
  animation: overlay-fade-in 200ms ease;
}

.sidebar-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  z-index: 51;
  background-color: var(--color-surface);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
  animation: drawer-slide-in 250ms ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-close {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  cursor: pointer;
  z-index: 1;
}

.sidebar-close:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes drawer-slide-in {
  from {
    translate: 100% 0;
  }
  to {
    translate: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-overlay,
  .sidebar-drawer {
    animation: none;
  }
}
</style>

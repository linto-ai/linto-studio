<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import EditorHeader from "./EditorHeader.vue"
import TranscriptionPanel from "./TranscriptionPanel.vue"
import SpeakerSidebar from "./SpeakerSidebar.vue"
import SidebarDrawer from "./SidebarDrawer.vue"
import AudioPlayer from "./AudioPlayer.vue"
import SubtitleBanner from "./SubtitleBanner.vue"
import SubtitleFullscreen from "./SubtitleFullscreen.vue"
import ChannelSelector from "./ChannelSelector.vue"
import SelectionActionBar from "./SelectionActionBar.vue"
import SidebarSelect from "./atoms/SidebarSelect.vue"
import { useIsMobile } from "../composables/useIsMobile"
import { provideTurnSelection } from "../composables/useTurnSelection"
import { useEditorStore } from "../core"
import { useI18n } from "../i18n"
import * as utils from "../utils"

const props = withDefaults(
  defineProps<{
    showHeader?: boolean
  }>(),
  {
    showHeader: true,
  },
)

const editor = useEditorStore()
const { t, locale } = useI18n()
const { isMobile } = useIsMobile()
const isSidebarOpen = ref(false)

const activeTurns = computed(
  () => editor.activeChannel.value.activeTranslation.value.turns.value,
)
const speakers = editor.speakers.all

provideTurnSelection(activeTurns, speakers, editor)

const channels = computed(() => [...editor.channels.values()])
const translations = computed(() => [
  ...editor.activeChannel.value.translations.values(),
])
const activeTranslationId = computed(
  () => editor.activeChannel.value.activeTranslation.value.id,
)
const speakerList = computed(() => Array.from(speakers.values()))

const audioPlayerRef =
  useTemplateRef<InstanceType<typeof AudioPlayer>>("audioPlayer")

function onTimeUpdate(time: number) {
  if (!editor.audio) return
  editor.audio.currentTime.value = time
}

watch(
  () => editor.activeChannelId.value,
  () => {
    audioPlayerRef.value?.pause()
    if (editor.audio) {
      editor.audio.currentTime.value = 0
      editor.audio.isPlaying.value = false
    }
    isSidebarOpen.value = false
  },
)

if (editor.audio) {
  editor.audio.setSeekHandler((t) => audioPlayerRef.value?.seekTo(t))
}

const translationItems = computed(() =>
  utils.buildTranslationItems(
    translations.value,
    locale.value,
    t("sidebar.originalLanguage"),
    t("language.wildcard"),
  ),
)

function onChannelChange(channelId: string) {
  editor.setActiveChannel(channelId)
}

function onTranslationChange(translationId: string) {
  editor.activeChannel.value.setActiveTranslation(translationId)
}
</script>

<template>
  <div class="editor-layout">
    <EditorHeader
      v-if="props.showHeader"
      :title="editor.title.value"
      :duration="editor.activeChannel.value.duration"
      :language="activeTranslationId"
      :is-mobile="isMobile"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <SelectionActionBar />
    <main class="editor-body">
      <TranscriptionPanel :turns="activeTurns" :speakers="speakers" />
      <SpeakerSidebar
        v-if="!isMobile"
        :speakers="speakerList"
        :channels="channels"
        :selected-channel-id="editor.activeChannelId.value"
        :translations="translations"
        :selected-translation-id="activeTranslationId"
        @update:selected-channel-id="onChannelChange"
        @update:selected-translation-id="onTranslationChange" />

      <SidebarDrawer v-if="isMobile" v-model:open="isSidebarOpen">
        <SpeakerSidebar
          :speakers="speakerList"
          :channels="channels"
          :selected-channel-id="editor.activeChannelId.value"
          :translations="translations"
          :selected-translation-id="activeTranslationId"
          @update:selected-channel-id="onChannelChange"
          @update:selected-translation-id="onTranslationChange" />
      </SidebarDrawer>
    </main>
    <AudioPlayer
      v-if="editor.audio?.src.value"
      ref="audioPlayer"
      :audio-src="editor.audio.src.value"
      :turns="activeTurns"
      :speakers="speakers"
      @timeupdate="onTimeUpdate"
      @play-state-change="
        (v: boolean) => {
          if (editor.audio) editor.audio.isPlaying.value = v
        }
      " />
    <SubtitleBanner
      v-if="
        editor.subtitle?.isVisible.value &&
        !isMobile &&
        !editor.subtitle.isFullscreen.value
      " />
    <SubtitleFullscreen v-if="editor.subtitle?.isFullscreen.value" />
    <div
      v-if="isMobile && (channels.length > 1 || translations.length > 1)"
      class="mobile-selectors">
      <ChannelSelector
        v-if="channels.length > 1"
        :channels="channels"
        :selected-channel-id="editor.activeChannelId.value"
        @update:selected-channel-id="onChannelChange" />
      <SidebarSelect
        v-if="translations.length > 1"
        :items="translationItems"
        :selected-value="activeTranslationId"
        :ariaLabel="t('sidebar.translationLabel')"
        @update:selected-value="onTranslationChange" />
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

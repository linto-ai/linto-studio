<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import Header from "./Header.vue"
import TabBar from "./TabBar.vue"
import { TRANSCRIPTION_TAB, VERBATIM_TAB } from "./TabBar.constants"
import TranscriptionPanel from "./TranscriptionPanel.vue"
import VerbatimPanel from "./VerbatimPanel.vue"
import LLMServicePanel from "./LLMServicePanel.vue"
import SpeakerSidebar from "./SpeakerSidebar.vue"
import SidebarDrawer from "./SidebarDrawer.vue"
import AudioPlayer from "./AudioPlayer.vue"
import SubtitleBanner from "./SubtitleBanner.vue"
import SubtitleFullscreen from "./SubtitleFullscreen.vue"
import ChannelSelector from "./ChannelSelector.vue"
import TranslationSelector from "./TranslationSelector.vue"
import SelectionActionBar from "./SelectionActionBar.vue"
import { useIsMobile } from "../composables/useIsMobile"
import { provideTurnSelection } from "../composables/useTurnSelection"
import { useCore } from "../core"

const props = withDefaults(
  defineProps<{
    showHeader?: boolean
  }>(),
  {
    showHeader: true,
  },
)

const core = useCore()
const { isMobile } = useIsMobile()
const isSidebarOpen = ref(false)

const activeTab = ref<string>(TRANSCRIPTION_TAB)

const activeTurns = computed(
  () => core.activeChannel.value?.activeTranslation.value.turns.value ?? [],
)
const speakers = core.speakers.all

provideTurnSelection(activeTurns, speakers, core)

const channels = computed(() => [...core.channels.values()])
const translations = computed(() =>
  core.activeChannel.value
    ? [...core.activeChannel.value.translations.values()]
    : [],
)
const activeTranslationId = computed(
  () => core.activeChannel.value?.activeTranslation.value.id ?? "",
)
const speakerList = computed(() => Array.from(speakers.values()))

const showTranscription = computed(() => activeTab.value === TRANSCRIPTION_TAB)
const showVerbatim = computed(() => activeTab.value === VERBATIM_TAB)
const activeService = computed(() => {
  if (showTranscription.value || showVerbatim.value) return null
  return core.llmServices?.get(activeTab.value) ?? null
})

watch(activeTab, (id) => {
  if (!core.llmServices) return
  if (id === TRANSCRIPTION_TAB || id === VERBATIM_TAB) {
    core.llmServices.setActive(null)
  } else {
    core.llmServices.setActive(id)
  }
})

watch(
  () => core.llmServices?.list.value.map((s) => s.id).join("|"),
  () => {
    if (
      activeTab.value !== TRANSCRIPTION_TAB &&
      activeTab.value !== VERBATIM_TAB &&
      !core.llmServices?.get(activeTab.value)
    ) {
      activeTab.value = TRANSCRIPTION_TAB
    }
  },
)

const audioPlayerRef =
  useTemplateRef<InstanceType<typeof AudioPlayer>>("audioPlayer")

watch(
  () => core.activeChannelId.value,
  () => {
    audioPlayerRef.value?.pause()
    if (core.audio) {
      core.audio.currentTime.value = 0
      core.audio.isPlaying.value = false
    }
    isSidebarOpen.value = false
  },
)

watch(showTranscription, (visible) => {
  if (!visible) audioPlayerRef.value?.pause()
})

function onChannelChange(channelId: string) {
  core.setActiveChannel(channelId)
}

function onTranslationChange(translationId: string) {
  core.activeChannel.value?.setActiveTranslation(translationId)
}
</script>

<template>
  <div class="editor-layout">
    <Header
      v-if="props.showHeader"
      :title="core.title.value"
      :date="core.date.value"
      :duration="core.activeChannel.value?.duration ?? 0"
      :speaker-count="speakers.size"
      :is-mobile="isMobile"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <TabBar v-model="activeTab" />
    <SelectionActionBar v-if="showTranscription" />
    <main class="editor-body">
      <TranscriptionPanel
        v-if="showTranscription"
        :turns="activeTurns"
        :speakers="speakers" />
      <VerbatimPanel v-else-if="showVerbatim" />
      <LLMServicePanel
        v-else-if="activeService"
        :key="activeService.id"
        :service="activeService" />
      <TranscriptionPanel v-else :turns="activeTurns" :speakers="speakers" />
      <SpeakerSidebar
        v-if="!isMobile"
        :speakers="speakerList"
        :channels="channels"
        :selected-channel-id="core.activeChannelId.value"
        :translations="translations"
        :selected-translation-id="activeTranslationId"
        @update:selected-channel-id="onChannelChange"
        @update:selected-translation-id="onTranslationChange" />

      <SidebarDrawer v-if="isMobile" v-model:open="isSidebarOpen">
        <SpeakerSidebar
          :speakers="speakerList"
          :channels="channels"
          :selected-channel-id="core.activeChannelId.value"
          :translations="translations"
          :selected-translation-id="activeTranslationId"
          @update:selected-channel-id="onChannelChange"
          @update:selected-translation-id="onTranslationChange" />
      </SidebarDrawer>
    </main>
    <AudioPlayer
      v-if="core.audio?.src.value"
      v-show="showTranscription"
      ref="audioPlayer"
      :audio-src="core.audio.src.value" />
    <SubtitleBanner
      v-if="
        core.subtitle?.isVisible.value &&
        !isMobile &&
        !core.subtitle.isFullscreen.value
      " />
    <SubtitleFullscreen v-if="core.subtitle?.isFullscreen.value" />
    <div
      v-if="isMobile && (channels.length > 1 || translations.length > 1)"
      class="mobile-selectors">
      <ChannelSelector
        v-if="channels.length > 1"
        :channels="channels"
        :selected-channel-id="core.activeChannelId.value"
        @update:selected-channel-id="onChannelChange" />
      <TranslationSelector
        v-if="translations.length > 1"
        :translations="translations"
        :selected-translation-id="activeTranslationId"
        @update:selected-translation-id="onTranslationChange" />
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
  box-shadow: var(--shadow-md);
  align-items: end;
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

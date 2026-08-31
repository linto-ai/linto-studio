<script setup lang="ts">
import { computed, ref, watch } from "vue"
import Header from "./Header.vue"
import TabBar from "./TabBar.vue"
import { TRANSCRIPTION_TAB, VERBATIM_TAB } from "./TabBar.constants"
import TranscriptionPanel from "./TranscriptionPanel.vue"
import VerbatimPanel from "./VerbatimPanel.vue"
import SpeakerSidebar from "./SpeakerSidebar.vue"
import SidebarDrawer from "./SidebarDrawer.vue"
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
const translations = computed(
  () => core.activeChannel.value?.selectableTranslations ?? [],
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

watch(
  () => core.activeChannelId.value,
  () => {
    core.audio?.pause()
    if (core.audio) {
      core.audio.currentTime.value = 0
      core.audio.isPlaying.value = false
    }
    isSidebarOpen.value = false
  },
)

watch(showTranscription, (visible) => {
  if (!visible) core.audio?.pause()
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
      :can-ask="!!core.chat"
      :can-undo="core.transcriptionEditor?.canUndo.value ?? false"
      :can-redo="core.transcriptionEditor?.canRedo.value ?? false"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      @open-chat="core.chat?.setDrawerOpen(true)"
      @undo="core.transcriptionEditor?.undo()"
      @redo="core.transcriptionEditor?.redo()" />
    <TabBar v-model="activeTab" />
    <SelectionActionBar v-if="showTranscription" />
    <main class="editor-body">
      <TranscriptionPanel
        v-if="showTranscription"
        :turns="activeTurns"
        :speakers="speakers" />
      <VerbatimPanel v-else-if="showVerbatim" />
      <component
        :is="core.components.llmServicePanel"
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
        :show-speakers="showTranscription"
        @update:selected-channel-id="onChannelChange"
        @update:selected-translation-id="onTranslationChange" />

      <SidebarDrawer v-if="isMobile" v-model:open="isSidebarOpen">
        <SpeakerSidebar
          :speakers="speakerList"
          :channels="channels"
          :selected-channel-id="core.activeChannelId.value"
          :translations="translations"
          :selected-translation-id="activeTranslationId"
          :show-speakers="showTranscription"
          @update:selected-channel-id="onChannelChange"
          @update:selected-translation-id="onTranslationChange" />
      </SidebarDrawer>
    </main>
    <component
      :is="core.components.player"
      v-if="core.audio?.src.value"
      v-show="showTranscription"
      :audio-src="core.audio.src.value" />
    <component
      :is="core.components.subtitleBanner"
      v-if="
        core.subtitle?.isVisible.value &&
        !isMobile &&
        !core.subtitle.isFullscreen.value
      " />
    <component
      :is="core.components.subtitleFullscreen"
      v-if="core.subtitle?.isFullscreen.value" />
    <component :is="core.components.chatDrawer" v-if="core.chat" />
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

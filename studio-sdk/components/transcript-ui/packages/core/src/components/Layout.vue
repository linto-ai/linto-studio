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
import { useCore, type LLMService } from "../core"

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

const shownPanels = ref<string[]>([TRANSCRIPTION_TAB])
// The ?? never actually triggers — every shownPanels mutation keeps at least one entry — it's just satisfying noUncheckedIndexedAccess.
const activeTab = computed(() => shownPanels.value[0] ?? TRANSCRIPTION_TAB)

const isSplit = computed({
  get: () => shownPanels.value.length > 1,
  set: (value: boolean) => {
    shownPanels.value = value
      ? [...shownPanels.value, VERBATIM_TAB]
      : shownPanels.value.filter((id) => id !== VERBATIM_TAB)
  },
})

type PanelDescriptor =
  | { id: string; kind: "transcription" }
  | { id: string; kind: "verbatim" }
  | { id: string; kind: "service"; service: LLMService }

// Resolved once per render, not inline in the template: avoids calling
// core.llmServices.get() twice per item (once to guard, once to bind) with
// no type-narrowing between the two — a discriminated union the template
// just switches on instead.
const panels = computed<PanelDescriptor[]>(() =>
  shownPanels.value.map((id): PanelDescriptor => {
    if (id === TRANSCRIPTION_TAB) return { id, kind: "transcription" }
    if (id === VERBATIM_TAB) return { id, kind: "verbatim" }
    const service = core.llmServices?.get(id)
    // Unknown/vanished service id (e.g. llmServices isn't installed):
    // same fallback as the old single-tab code — show transcription rather
    // than nothing.
    return service
      ? { id, kind: "service", service }
      : { id, kind: "transcription" }
  }),
)

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
      shownPanels.value = [TRANSCRIPTION_TAB]
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
    <TabBar
      :model-value="activeTab"
      @update:model-value="(tab) => (shownPanels = [tab])" />
    <SelectionActionBar v-if="showTranscription" />
    <main
      class="editor-body"
      :class="{ 'editor-body--no-sidebar': panels.length > 1 }">
      <div
        class="editor-body__panels"
        :class="{ 'editor-body__panels--split': panels.length > 1 }">
        <template v-for="panel in panels" :key="panel.id">
          <TranscriptionPanel
            v-if="panel.kind === 'transcription'"
            :turns="activeTurns"
            :speakers="speakers" />
          <VerbatimPanel v-else-if="panel.kind === 'verbatim'" />
          <component
            :is="core.components.llmServicePanel"
            v-else
            :service="panel.service"
            v-model:split="isSplit" />
        </template>
      </div>
      <SpeakerSidebar
        v-if="!isMobile && panels.length === 1"
        :speakers="speakerList"
        :channels="channels"
        :selected-channel-id="core.activeChannelId.value"
        :translations="translations"
        :selected-translation-id="activeTranslationId"
        :show-speakers="showTranscription"
        @update:selected-channel-id="onChannelChange"
        @update:selected-translation-id="onTranslationChange" />

      <SidebarDrawer
        v-if="isMobile && panels.length === 1"
        v-model:open="isSidebarOpen">
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

/* Split mode: two panels already share the body between them, no room (or
   need) for the speaker sidebar too — see Layout's panels/isSplit state. */
.editor-body--no-sidebar {
  grid-template-columns: 1fr;
}

.editor-body__panels {
  display: flex;
  min-width: 0;
  min-height: 0;
}

.editor-body__panels > * {
  flex: 1;
  min-width: 0;
}

.editor-body__panels--split > * + * {
  border-left: 1px solid var(--color-border);
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

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue"
import Header from "./Header.vue"
import TranscriptionPanel from "./TranscriptionPanel.vue"
import SpeakerSidebar from "./SpeakerSidebar.vue"
import SidebarDrawer from "./SidebarDrawer.vue"
import AudioPlayer from "./AudioPlayer.vue"
import SubtitleBanner from "./SubtitleBanner.vue"
import SubtitleFullscreen from "./SubtitleFullscreen.vue"
import ChannelSelector from "./ChannelSelector.vue"
import SidebarSelect from "./atoms/SidebarSelect.vue"
import { useIsMobile } from "../composables/useIsMobile"
import { useCore } from "../core"
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

const core = useCore()
const { t, locale } = useI18n()
const { isMobile } = useIsMobile()
const isSidebarOpen = ref(false)

const activeTurns = computed(
  () => core.activeChannel.value?.activeTranslation.value.turns.value ?? [],
)
const speakers = core.speakers.all

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

const audioPlayerRef =
  useTemplateRef<InstanceType<typeof AudioPlayer>>("audioPlayer")

function onTimeUpdate(time: number) {
  if (!core.audio) return
  core.audio.currentTime.value = time
}

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

if (core.audio) {
  core.audio.setSeekHandler((t) => audioPlayerRef.value?.seekTo(t))
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
      :duration="core.activeChannel.value?.duration ?? 0"
      :language="activeTranslationId"
      :is-mobile="isMobile"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <main class="editor-body">
      <TranscriptionPanel :turns="activeTurns" :speakers="speakers" />
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
      ref="audioPlayer"
      :audio-src="core.audio.src.value"
      :turns="activeTurns"
      :speakers="speakers"
      @timeupdate="onTimeUpdate"
      @play-state-change="
        (v: boolean) => {
          if (core.audio) core.audio.isPlaying.value = v
        }
      " />
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

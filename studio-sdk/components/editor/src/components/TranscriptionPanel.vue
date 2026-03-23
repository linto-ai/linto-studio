<script setup lang="ts">
import { computed, ref, useTemplateRef, onMounted, onBeforeUnmount, nextTick } from "vue"
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from "reka-ui"
import { ArrowDown } from "lucide-vue-next"
import TranscriptionTurn from "./TranscriptionTurn.vue"
import EditorButton from "./atoms/EditorButton.vue"
import { useAutoScroll } from "../composables/useAutoScroll"
import { useEditorStore } from "../core"
import { useI18n } from "../i18n"
import { throttle } from "../utils"
import type { Turn, Speaker } from "../types/editor"

const props = defineProps<{
  turns: Turn[]
  speakers: Map<string, Speaker>
}>()

const { t } = useI18n()
const editor = useEditorStore()
const panelRef = useTemplateRef<HTMLElement>("panel")

const partialTurn = computed(() => {
  const text = editor.live?.partial.value ?? null
  if (text === null) return null
  return {
    id: "__partial__",
    speakerId: null,
    text,
    words: [],
    language:
      editor.activeChannel.value.activeTranslation.value.languages[0] ?? "",
    startTime: undefined,
    endTime: undefined,
  } as Turn
})

const hasLiveUpdate = computed(() => editor.live?.hasLiveUpdate.value ?? false)
const isPlaying = computed(() => editor.audio?.isPlaying.value ?? false)

const activeTranslation = computed(() => editor.activeChannel.value.activeTranslation.value)
const isLoadingHistory = computed(() => activeTranslation.value.isLoadingHistory.value)
const hasMoreHistory = computed(() => activeTranslation.value.hasMoreHistory.value)

// ── Scroll top detection + scroll preservation ──────────────────────────

const isPrepending = ref(false)
let viewport: HTMLElement | null = null

const emitScrollTop = throttle(() => {
  const translation = activeTranslation.value
  if (!translation.hasMoreHistory.value) return
  if (translation.isLoadingHistory.value) return
  if (props.turns.length === 0) return
  editor.emit("scroll:top", { translationId: translation.id })
}, 500)

function onScrollTop() {
  if (!viewport) return
  if (viewport.scrollTop < 100) {
    emitScrollTop()
  }
}

let unsubPrepend: (() => void) | undefined

onMounted(() => {
  viewport = panelRef.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null
  if (viewport) {
    viewport.addEventListener("scroll", onScrollTop, { passive: true })
  }

  unsubPrepend = editor.on("turns:prepend", () => {
    if (!viewport) return
    const prevScrollHeight = viewport.scrollHeight
    isPrepending.value = true
    nextTick(() => {
      if (!viewport) return
      const delta = viewport.scrollHeight - prevScrollHeight
      viewport.scrollTop += delta
      isPrepending.value = false
    })
  })
})

onBeforeUnmount(() => {
  if (viewport) {
    viewport.removeEventListener("scroll", onScrollTop)
    viewport = null
  }
  unsubPrepend?.()
})

const { isFollowing, resumeFollow } = useAutoScroll({ panelRef, isPrepending })
</script>

<template>
  <article ref="panel" class="transcription-panel">
    <ScrollAreaRoot class="scroll-root">
      <ScrollAreaViewport class="scroll-viewport">
        <div class="turns-container">
          <div v-if="isLoadingHistory" class="history-loading" role="status">
            <progress />
          </div>
          <div v-if="!hasMoreHistory && turns.length > 0" class="history-start">
            {{ t('transcription.historyStart') }}
          </div>
          <TranscriptionTurn
            v-for="(turn, i) in turns"
            :key="turn.id"
            :turn="turn"
            :speaker="turn.speakerId ? speakers.get(turn.speakerId) : undefined"
            :live="hasLiveUpdate && !partialTurn && i === turns.length - 1" />
          <TranscriptionTurn
            v-if="partialTurn"
            key="__partial__"
            :turn="partialTurn"
            partial />
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar class="scrollbar" orientation="vertical">
        <ScrollAreaThumb class="scrollbar-thumb" />
      </ScrollAreaScrollbar>

      <Transition name="fade-slide">
        <EditorButton
          v-if="!isFollowing && (isPlaying || hasLiveUpdate)"
          size="sm"
          class="resume-scroll-btn"
          :aria-label="t('transcription.resumeScroll')"
          @click="resumeFollow">
          <template #icon><ArrowDown :size="14" /></template>
          {{ t("transcription.resumeScroll") }}
        </EditorButton>
      </Transition>
    </ScrollAreaRoot>
  </article>
</template>

<style scoped>
.transcription-panel {
  min-height: 0;
  overflow: hidden;
  background-color: var(--color-surface);
}

.scroll-root {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scroll-viewport {
  height: 100%;
  width: 100%;
}

/* Reka ScrollArea viewport needs explicit containment */
:deep([data-reka-scroll-area-viewport]) {
  height: 100%;
  max-height: 100%;
}

.turns-container {
  max-width: 80ch;
  margin-inline: auto;
  padding: var(--spacing-lg);
}

.history-loading {
  text-align: center;
  padding: var(--spacing-md);
}

.history-loading progress {
  width: 120px;
}

.history-start {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.scrollbar {
  display: flex;
  touch-action: none;
  user-select: none;
  padding: var(--spacing-xxs);
  width: 8px;
  transition: background-color 150ms;
}

.scrollbar:hover {
  background-color: var(--color-border-light);
}

.scrollbar-thumb {
  flex: 1;
  background-color: var(--color-text-muted);
  border-radius: var(--radius-lg);
  opacity: 0.4;
  transition: opacity 150ms;
  position: relative;
}

.scrollbar-thumb:hover {
  opacity: 0.6;
}

/* Resume scroll button */
.resume-scroll-btn {
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  translate: -50% 0;
  z-index: 10;
  background: var(--glass-background);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 200ms ease,
    translate 200ms ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  translate: -50% 8px;
}

@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }
}

@media (max-width: 767px) {
  .turns-container {
    padding: var(--spacing-md);
  }
}
</style>

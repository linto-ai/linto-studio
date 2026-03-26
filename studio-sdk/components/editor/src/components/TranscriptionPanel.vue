<script setup lang="ts">
import {
  computed,
  useTemplateRef,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue"
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from "reka-ui"
import { useStickToBottom } from "vue-stick-to-bottom"
import { ArrowDown } from "lucide-vue-next"
import TranscriptionTurn from "./TranscriptionTurn.vue"
import EditorButton from "./atoms/EditorButton.vue"
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

const activeTranslation = computed(
  () => editor.activeChannel.value.activeTranslation.value,
)
const activeChannel = computed(() => editor.activeChannel.value)
const isLoadingHistory = computed(
  () => activeChannel.value.isLoadingHistory.value,
)
const hasMoreHistory = computed(() => activeChannel.value.hasMoreHistory.value)

// ── Stick to bottom ────────────────────────────────────────────────────

const { scrollRef, contentRef, isAtBottom, scrollToBottom } = useStickToBottom()

onMounted(() => {
  scrollRef.value =
    panelRef.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null
  contentRef.value = panelRef.value?.querySelector(".turns-container") ?? null
})

// ── Scroll top detection ────────────────────────────────────────────────

let viewport: HTMLElement | null = null

const emitScrollTop = throttle(() => {
  const channel = activeChannel.value
  if (!channel.hasMoreHistory.value) return
  if (channel.isLoadingHistory.value) return
  if (props.turns.length === 0) return
  editor.emit("scroll:top", { translationId: activeTranslation.value.id })
}, 500)

function onScrollTop() {
  if (!viewport) return
  if (viewport.scrollTop < 100) {
    emitScrollTop()
  }
}

watch(
  () => props.turns,
  (newTurns, oldTurns) => {
    const newLen = newTurns.length
    const oldLen = oldTurns.length
    if (
      newLen > oldLen &&
      !isAtBottom.value &&
      newTurns[0]?.id != oldTurns[0]?.id
    ) {
      const added = newLen - oldLen
      const anchorId = props.turns[added]?.id
      if (!anchorId || !scrollRef.value) return

      nextTick(() => {
        const el = scrollRef.value?.querySelector(
          `[data-turn-id="${anchorId}"]`,
        )
        el?.scrollIntoView({ block: "start", behavior: "instant" })
      })
    }
  },
  { flush: "pre" },
)

onMounted(() => {
  viewport =
    panelRef.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null
  if (viewport) {
    viewport.addEventListener("scroll", onScrollTop, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (viewport) {
    viewport.removeEventListener("scroll", onScrollTop)
    viewport = null
  }
})
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
            {{ t("transcription.historyStart") }}
          </div>
          <TranscriptionTurn
            v-for="(turn, i) in turns"
            :data-turn-id="turn.id"
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
          v-if="!isAtBottom && (isPlaying || hasLiveUpdate)"
          size="sm"
          class="resume-scroll-btn"
          :aria-label="t('transcription.resumeScroll')"
          @click="scrollToBottom()">
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
  transition: background-color var(--transition-duration);
}

.scrollbar:hover {
  background-color: var(--color-border-light);
}

.scrollbar-thumb {
  flex: 1;
  background-color: var(--color-text-muted);
  border-radius: var(--radius-lg);
  opacity: 0.4;
  transition: opacity var(--transition-duration);
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
  z-index: var(--z-sticky);
  background: var(--glass-background);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
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

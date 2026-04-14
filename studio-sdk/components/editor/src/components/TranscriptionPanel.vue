<script setup lang="ts">
import {
  computed,
  useTemplateRef,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue"
import { useStickToBottom } from "vue-stick-to-bottom"
import { ArrowDown } from "lucide-vue-next"
import TranscriptionTurn from "./TranscriptionTurn.vue"
import TranscriptionEmpty from "./TranscriptionEmpty.vue"
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
const scrollContainerRef = useTemplateRef<HTMLElement>("scrollContainer")

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
  scrollRef.value = scrollContainerRef.value
  contentRef.value =
    scrollContainerRef.value?.querySelector(".turns-container") ?? null
})

// ── Scroll top detection ────────────────────────────────────────────────

const emitScrollTop = throttle(() => {
  const channel = activeChannel.value
  if (!channel.hasMoreHistory.value) return
  if (channel.isLoadingHistory.value) return
  if (props.turns.length === 0) return
  editor.emit("scroll:top", { translationId: activeTranslation.value.id })
}, 500)

function onScrollTop() {
  const el = scrollContainerRef.value
  if (!el) return
  if (el.scrollTop < 100) {
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
  scrollContainerRef.value?.addEventListener("scroll", onScrollTop, {
    passive: true,
  })
})

onBeforeUnmount(() => {
  scrollContainerRef.value?.removeEventListener("scroll", onScrollTop)
})
</script>

<template>
  <article class="transcription-panel">
    <div ref="scrollContainer" class="scroll-container">
      <div class="turns-container">
        <div v-if="isLoadingHistory" class="history-loading" role="status">
          <progress />
        </div>
        <div v-if="!hasMoreHistory && turns.length > 0" class="history-start">
          {{ t("transcription.historyStart") }}
        </div>
        <TranscriptionEmpty
          v-if="turns.length === 0 && !isLoadingHistory && !partialTurn"
          class="transcription-empty" />
        <TranscriptionTurn
          v-for="(turn, i) in turns"
          v-memo="[turn, speakers.get(turn.speakerId ?? ''), hasLiveUpdate && !partialTurn && i === turns.length - 1]"
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
    </div>
  </article>
</template>

<style scoped>
.transcription-panel {
  min-height: 0;
  overflow: hidden;
  background-color: var(--color-surface);
}

.scroll-container {
  height: 100%;
  overflow: auto;
  position: relative;
}

.turns-container {
  max-width: 80ch;
  margin-inline: auto;
  padding: var(--spacing-lg);
}

.turns-container:has(.transcription-empty) {
  display: flex;
  flex-direction: column;
  min-height: 100%;
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

/* Resume scroll button */
.resume-scroll-btn {
  position: sticky;
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

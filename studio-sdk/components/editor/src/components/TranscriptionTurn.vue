<script setup lang="ts">
import { computed } from "vue"
import SpeakerLabel from "./SpeakerLabel.vue"
import EditorCheckbox from "./atoms/EditorCheckbox.vue"
import { useEditorStore } from "../core"
import { useTurnSelection } from "../composables/useTurnSelection"
import { useI18n } from "../i18n"
import * as utils from "../utils"
import type { Turn, Speaker } from "../types/editor"

const props = defineProps<{
  turn: Turn
  speaker?: Speaker
  partial?: boolean
  live?: boolean
}>()

const editor = useEditorStore()
const selection = useTurnSelection()
const { t } = useI18n()

const hasWords = computed(() => props.turn.words.length > 0)

const activeWordId = computed(() => {
  if (!editor.audio?.src.value || !hasWords.value) return null
  const time = editor.audio.currentTime.value
  const { startTime, endTime, words } = props.turn
  if (startTime == null || endTime == null) return null
  if (time < startTime || time > endTime) return null
  return utils.findActiveWord(words, time)
})

const isTurnActive = computed(() => {
  if (!editor.audio?.src.value) return false
  if (props.turn.startTime == null || props.turn.endTime == null) return false
  if (utils.hasWordTimestamps(props.turn.words)) return false
  const time = editor.audio.currentTime.value
  return time >= props.turn.startTime && time <= props.turn.endTime
})

const speakerColor = computed(() => props.speaker?.color ?? "transparent")

const isSelected = computed(() => selection.isSelected(props.turn.id))

const checkboxLabel = computed(() => {
  const name = props.speaker?.name ?? ""
  const key = isSelected.value ? "selection.deselect" : "selection.select"
  return t(key).replace("{name}", name)
})

function onHeaderClick(event: MouseEvent) {
  if (event.shiftKey) {
    selection.selectRange(props.turn.id)
  } else {
    selection.toggle(props.turn.id)
  }
}

function onCheckboxChange(event: MouseEvent) {
  if (event.shiftKey) {
    selection.selectRange(props.turn.id)
  } else {
    selection.toggle(props.turn.id)
  }
}
</script>

<template>
  <section
    class="turn"
    :class="{
      'turn--active': isTurnActive,
      'turn--partial': partial,
      'turn--selected': isSelected,
    }"
    :data-turn-active="isTurnActive || partial || live || undefined"
    :style="{ '--speaker-color': speakerColor }"
    :aria-selected="isSelected">
    <div v-if="!partial" class="turn-header" @click="onHeaderClick">
      <EditorCheckbox
        :model-value="isSelected"
        :aria-label="checkboxLabel"
        @click.stop="onCheckboxChange" />
      <SpeakerLabel
        :speaker="speaker"
        :start-time="turn.startTime"
        :language="turn.language" />
    </div>
    <p class="turn-text">
      <template v-if="hasWords">
        <template v-for="(word, i) in turn.words" :key="word.id">
          <span
            :class="{ 'word--active': word.id === activeWordId }"
            :data-word-active="word.id === activeWordId || undefined"
            >{{ word.text }}</span
          >{{ i < turn.words.length - 1 ? " " : "" }}
        </template>
      </template>
      <template v-else-if="turn.text">{{ turn.text }}</template>
    </p>
  </section>
</template>

<style scoped>
.turn {
  padding: var(--spacing-sm) var(--spacing-lg);
}

.turn-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
  border-radius: var(--radius-sm);
  padding: var(--spacing-xxs) 0;
}

.turn:has(.turn-header:hover) {
  background-color: var(--color-surface-hover);
}

.turn-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-primary);
}

.turn--selected {
  background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
  border-left: 3px solid var(--color-primary);
  padding-left: calc(var(--spacing-lg) - 3px);
}

.turn--active:not(.turn--selected) {
  border-left: 3px solid var(--speaker-color);
  background-color: color-mix(in srgb, var(--speaker-color) 8%, transparent);
  padding-left: calc(var(--spacing-lg) - 3px);
}

.word--active {
  text-decoration: underline;
  text-decoration-color: var(--speaker-color);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  color: var(--speaker-color);
}

.turn--partial .turn-text {
  font-style: italic;
  color: var(--color-text-muted);
  animation: partial-fade-in 200ms ease;
}

@keyframes partial-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .turn--partial .turn-text {
    animation: none;
  }
}

@media (max-width: 767px) {
  .turn {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .turn--selected,
  .turn--active:not(.turn--selected) {
    padding-left: calc(var(--spacing-md) - 3px);
  }
}
</style>

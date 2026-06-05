<script setup lang="ts">
import { computed, ref } from "vue"
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "@tiptap/vue-3"
import SpeakerLabel from "../../../components/SpeakerLabel.vue"
import SpeakerPopover from "../../../components/molecules/SpeakerPopover.vue"
import { useCore } from "../../../core"

const props = defineProps<NodeViewProps>()

const core = useCore()

const speaker = computed(() => {
  const id = props.node.attrs.speakerId
  return id ? core.speakers.all.get(id) : undefined
})

const speakerColor = computed(() => speaker.value?.color ?? "transparent")

const canEditSpeakers = computed(
  () => core.capabilities.value.speakers === "edit",
)

// Lazily mount the (heavy) Reka SpeakerPopover only on interaction. With
// thousands of turns this avoids mounting thousands of popover instances up
// front; the label looks identical until then. `openOnMount` opens it
// immediately when activated by a click without a prior hover.
const popoverMounted = ref(false)
const openOnMount = ref(false)
function activatePopover(): void {
  openOnMount.value = true
  popoverMounted.value = true
}

const isTurnActive = computed(() => {
  if (!core.audio?.src.value) return false
  const { startTime, endTime } = props.node.attrs
  if (startTime == null || endTime == null) return false
  const time = core.audio.currentTime.value
  return time >= startTime && time <= endTime
})
</script>

<template>
  <NodeViewWrapper
    as="section"
    class="turn"
    :class="{ 'turn--active': isTurnActive }"
    :style="{ '--speaker-color': speakerColor }"
    :data-turn-id="node.attrs.id">
    <div contenteditable="false" class="turn-header">
      <template v-if="canEditSpeakers">
        <SpeakerPopover
          v-if="popoverMounted"
          :turn-id="node.attrs.id"
          :current-speaker-id="node.attrs.speakerId"
          :initial-open="openOnMount">
          <SpeakerLabel
            :speaker="speaker"
            :start-time="node.attrs.startTime"
            :language="node.attrs.language" />
        </SpeakerPopover>
        <button
          v-else
          type="button"
          class="lazy-speaker-trigger"
          @pointerenter="popoverMounted = true"
          @click="activatePopover">
          <SpeakerLabel
            :speaker="speaker"
            :start-time="node.attrs.startTime"
            :language="node.attrs.language" />
        </button>
      </template>
      <SpeakerLabel
        v-else
        :speaker="speaker"
        :start-time="node.attrs.startTime"
        :language="node.attrs.language" />
    </div>
    <NodeViewContent as="p" class="turn-text" />
  </NodeViewWrapper>
</template>

<style scoped>
.turn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-left: 3px solid transparent;

  /* Skip layout/paint of off-screen turns: the browser only renders turns near
     the viewport, cutting layout cost on long transcripts (the DOM, selection,
     cursor and collab are untouched — visually identical). `auto <size>` lets
     it remember each turn's real height after first render. */
  content-visibility: auto;
  contain-intrinsic-size: auto 56px;
}

.turn-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-primary);
}

.turn--active {
  border-left: 3px solid var(--speaker-color);
  background-color: color-mix(in srgb, var(--speaker-color) 8%, transparent);
}

/* Matches SpeakerPopover's trigger so the lazy placeholder is visually
   identical before the popover mounts. */
.lazy-speaker-trigger {
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-sm);
}

.lazy-speaker-trigger:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

:deep(.word--active) {
  text-decoration: underline;
  text-decoration-color: var(--speaker-color);
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  color: var(--speaker-color);
}

@media (max-width: 767px) {
  .turn {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>

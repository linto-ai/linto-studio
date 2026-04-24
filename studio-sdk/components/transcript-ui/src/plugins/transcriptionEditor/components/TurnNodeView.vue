<script setup lang="ts">
import { computed } from "vue"
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/vue-3"
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
      <SpeakerPopover
        v-if="canEditSpeakers"
        :turn-id="node.attrs.id"
        :current-speaker-id="node.attrs.speakerId">
        <SpeakerLabel
          :speaker="speaker"
          :start-time="node.attrs.startTime"
          :language="node.attrs.language" />
      </SpeakerPopover>
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

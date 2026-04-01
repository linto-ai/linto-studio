<script setup lang="ts">
import { computed } from "vue"
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/vue-3"
import SpeakerLabel from "../../../components/SpeakerLabel.vue"
import { useEditorStore } from "../../../core"

const props = defineProps<NodeViewProps>()

const editor = useEditorStore()

const speaker = computed(() => {
  const id = props.node.attrs.speakerId
  return id ? editor.speakers.all.get(id) : undefined
})

const speakerColor = computed(() => speaker.value?.color ?? "transparent")

const isTurnActive = computed(() => {
  if (!editor.audio?.src.value) return false
  const { startTime, endTime } = props.node.attrs
  if (startTime == null || endTime == null) return false
  const time = editor.audio.currentTime.value
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
    <SpeakerLabel
      :speaker="speaker"
      :start-time="node.attrs.startTime"
      :language="node.attrs.language" />
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

@media (max-width: 767px) {
  .turn {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>

<script setup lang="ts">
import { computed } from "vue"
import { resolveIcon } from "./icons"

const props = defineProps<{
  name: string
  size?: number
  spin?: boolean
}>()

const Comp = computed(() => resolveIcon(props.name))

const style = computed(() =>
  props.size != null
    ? { width: `${props.size}px`, height: `${props.size}px` }
    : undefined,
)
</script>

<template>
  <component
    v-if="Comp"
    :is="Comp"
    :style="style"
    :class="['editor-icon', { 'editor-icon--spin': spin }]"
    aria-hidden="true" />
  <span v-else class="editor-icon editor-icon--missing" aria-hidden="true">?</span>
</template>

<style scoped>
.editor-icon {
  flex-shrink: 0;
}

.editor-icon--missing {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  font-size: 1em;
  line-height: 1;
}

.editor-icon--spin {
  animation: editor-icon-spin 1s linear infinite;
}

@keyframes editor-icon-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .editor-icon--spin {
    animation: none;
  }
}
</style>

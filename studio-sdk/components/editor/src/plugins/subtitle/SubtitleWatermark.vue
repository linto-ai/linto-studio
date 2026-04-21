<script setup lang="ts">
import { computed } from "vue"
import { useEditorStore } from "../../core"
import { parseWatermark } from "./utils/parseWatermark"

defineProps<{ visible: boolean }>()

const editor = useEditorStore()
const watermark = editor.subtitle?.watermark

const parts = computed(() => {
  if (!watermark) return []
  return parseWatermark(watermark.content.value, watermark.tokens.value)
})
</script>

<template>
  <Transition name="watermark">
    <div v-if="visible && watermark" class="watermark" aria-hidden="true">
      <template v-for="(part, i) in parts" :key="i">
        <img
          v-if="part.type === 'token'"
          :src="part.src"
          :alt="part.alt"
          class="watermark__img" />
        <span v-else>{{ part.value }}</span>
      </template>
    </div>
  </Transition>
</template>

<style scoped>
.watermark {
  position: absolute;
  right: var(--spacing-md, 16px);
  bottom: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  font-size: 1.2rem;
  color: var(--color-white, #fff);
  pointer-events: none;
  line-height: 1;
}

.watermark__img {
  height: 1em;
  vertical-align: middle;
}

.watermark-enter-active,
.watermark-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.watermark-enter-from,
.watermark-leave-to {
  opacity: 0;
  transform: translate(6px, 6px);
}

@media (prefers-reduced-motion: reduce) {
  .watermark-enter-active,
  .watermark-leave-active {
    transition: opacity 0.01s;
    transform: none;
  }
}
</style>

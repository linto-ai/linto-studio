<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { useCore } from "../core"
import { useSubtitleScroller } from "../composables/useSubtitleScroller"

const core = useCore()
const canvasRef = useTemplateRef<HTMLCanvasElement>("canvas")

const fontSize = computed(() => core.subtitle?.fontSize.value ?? 40)
const lineHeight = computed(() => 1.2 * fontSize.value)
const canvasHeight = computed(() => 2.4 * fontSize.value)

useSubtitleScroller({
  canvasRef,
  fontSize,
  lineHeight,
})
</script>

<template>
  <div class="subtitle-banner" :style="{ height: canvasHeight + 'px' }">
    <canvas ref="canvas" class="subtitle-canvas" :height="canvasHeight"></canvas>
  </div>
</template>

<style scoped>
.subtitle-banner {
  flex-shrink: 0;
  background-color: var(--color-black);
  overflow: hidden;
}

.subtitle-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

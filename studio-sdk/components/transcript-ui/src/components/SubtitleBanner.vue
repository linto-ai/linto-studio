<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { useCore } from "../core"
import { useSubtitleScroller } from "../composables/useSubtitleScroller"
import { useWatermarkCycle } from "../plugins/subtitle/useWatermarkCycle"
import SubtitleWatermark from "../plugins/subtitle/SubtitleWatermark.vue"

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

const { visible: watermarkVisible } = useWatermarkCycle(
  core.subtitle?.watermark,
)
</script>

<template>
  <div class="subtitle-banner" :style="{ height: canvasHeight + 'px' }">
    <canvas
      ref="canvas"
      class="subtitle-canvas"
      :class="{ 'subtitle-canvas--shrunk': watermarkVisible }"
      :height="canvasHeight"></canvas>
    <SubtitleWatermark :visible="watermarkVisible" />
  </div>
</template>

<style scoped>
.subtitle-banner {
  position: relative;
  flex-shrink: 0;
  background-color: var(--color-black);
  overflow: hidden;
}

.subtitle-canvas {
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
  transform-origin: top center;
}

.subtitle-canvas--shrunk {
  transform: scale(0.8) translateY(-8%);
}

@media (prefers-reduced-motion: reduce) {
  .subtitle-canvas {
    transition: none;
  }
}
</style>

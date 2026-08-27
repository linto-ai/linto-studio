<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue"
import { useCore } from "@linto-ai/transcript-ui-core"
import { useSubtitleScroller } from "./useSubtitleScroller"
import { useWatermarkCycle } from "./useWatermarkCycle"
import SubtitleWatermark from "./SubtitleWatermark.vue"

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

// The v-if in Layout mounts this component exactly when the fixed banner
// occupies the bottom of the viewport. Notify the consumer so it can reserve
// space (e.g. padding-bottom) and avoid content being hidden behind the banner.
onMounted(() => {
  core.emit("subtitle:visible", { visible: true, height: canvasHeight.value })
})

watch(canvasHeight, (height) => {
  core.emit("subtitle:visible", { visible: true, height })
})

onBeforeUnmount(() => {
  core.emit("subtitle:visible", { visible: false, height: 0 })
})
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  flex-shrink: 0;
  background-color: var(--color-black);
  overflow: hidden;
  z-index: 1001;
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

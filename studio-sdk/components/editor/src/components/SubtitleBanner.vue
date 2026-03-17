<script setup lang="ts">
import { computed, useTemplateRef } from "vue"
import { useEditorCore } from "../core"
import { useSubtitleScroller } from "../composables/useSubtitleScroller"

const editor = useEditorCore()
const canvasRef = useTemplateRef<HTMLCanvasElement>("canvas")

const fontSize = computed(() => editor.subtitle?.fontSize.value ?? 40)
const lineHeight = computed(() => 1.2 * fontSize.value)
const canvasHeight = computed(() => 2.4 * fontSize.value)

useSubtitleScroller({
  canvasRef,
  fontSize: fontSize.value,
  lineHeight: lineHeight.value,
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
  background-color: #000;
  overflow: hidden;
}

.subtitle-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

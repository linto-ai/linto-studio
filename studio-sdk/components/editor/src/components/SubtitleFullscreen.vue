<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from "vue"
import { X } from "lucide-vue-next"
import { useEditorStore } from "../core"
import { useI18n } from "../i18n"
import { useSubtitleScroller } from "../composables/useSubtitleScroller"

const editor = useEditorStore()
const { t } = useI18n()
const containerRef = useTemplateRef<HTMLDivElement>("container")
const canvasRef = useTemplateRef<HTMLCanvasElement>("canvas")

const FULLSCREEN_FONT_SIZE = 48

useSubtitleScroller({
  canvasRef,
  fontSize: FULLSCREEN_FONT_SIZE,
  lineHeight: 1.2 * FULLSCREEN_FONT_SIZE,
})

onMounted(async () => {
  const el = containerRef.value
  if (!el) return

  try {
    await el.requestFullscreen()
  } catch (err) {
    console.warn("Fullscreen API not supported:", err)
  }

  try {
    await (screen.orientation as unknown as { lock(o: string): Promise<void> }).lock("landscape")
  } catch {
    // Not supported or not allowed
  }
})

// Sync: browser exits fullscreen (Escape key) → update plugin state
function onFullscreenChange() {
  if (!document.fullscreenElement) {
    editor.subtitle?.exitFullscreen()
  }
}

onMounted(() => {
  document.addEventListener("fullscreenchange", onFullscreenChange)
})

function close() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
  }
  editor.subtitle?.exitFullscreen()
}

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", onFullscreenChange)

  try {
    ;(screen.orientation as unknown as { unlock(): void }).unlock()
  } catch {
    // Not supported
  }

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
  }
})
</script>

<template>
  <div ref="container" class="subtitle-fullscreen">
    <button
      class="subtitle-fullscreen__close"
      :aria-label="t('subtitle.exitFullscreen')"
      @click="close">
      <X :size="24" />
    </button>
    <canvas ref="canvas" class="subtitle-fullscreen__canvas"></canvas>
  </div>
</template>

<style scoped>
.subtitle-fullscreen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--color-black);
}

.subtitle-fullscreen__close {
  position: absolute;
  top: var(--spacing-md, 16px);
  right: var(--spacing-md, 16px);
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: background-color var(--transition-duration) ease;
}

.subtitle-fullscreen__close:hover,
.subtitle-fullscreen__close:focus-visible {
  background: rgba(255, 255, 255, 0.25);
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.subtitle-fullscreen__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .subtitle-fullscreen__close {
    transition: none;
  }
}
</style>

<template>
  <dialog
    ref="dialog"
    class="m-pdf-reader"
    :aria-label="title"
    @close="onNativeClose">
    <header class="m-pdf-reader__header">
      <IconButton
        icon="x"
        :label="$t('mobile.publication.close')"
        @click="close" />
      <h2 class="m-pdf-reader__title">{{ title }}</h2>
    </header>
    <div class="m-pdf-reader__body">
      <p v-if="state === 'loading'" class="m-muted m-pdf-reader__state">
        {{ $t("mobile.publication.rendering") }}
      </p>
      <p v-else-if="state === 'failed'" class="m-muted m-pdf-reader__state">
        {{ $t("mobile.publication.render_failed") }}
      </p>
      <!-- Canvases are added here by PdfPagesRenderer, never by Vue -->
      <div ref="pages" class="m-pdf-reader__pages"></div>
    </div>
    <footer class="m-pdf-reader__footer">
      <button type="button" class="m-pdf-reader__share" @click="$emit('share')">
        <PhIcon name="export" size="md" />
        {{ $t("mobile.publication.share") }}
      </button>
    </footer>
  </dialog>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import IconButton from "@/mobile/components/IconButton.vue"
import { PdfPagesRenderer } from "@/mobile/services/pdf/PdfPagesRenderer.js"

// Full screen reader of a PDF file, pages drawn with pdf.js (phones cannot
// show a PDF inline). v-model drives the native <dialog>; the watch is the
// only way to reach its imperative API. The footer hands the file to the
// phone (share sheet, save to files, download).
export default {
  name: "PdfReader",
  components: { IconButton, PhIcon },
  props: {
    value: { type: Boolean, default: false },
    file: { type: [File, Blob], default: null },
    title: { type: String, default: "" },
  },
  data() {
    return { state: "idle" }
  },
  watch: {
    value(open) {
      open ? this.open() : this.close()
    },
  },
  mounted() {
    if (this.value) this.open()
  },
  beforeDestroy() {
    this.stopRendering()
  },
  methods: {
    open() {
      if (!this.$refs.dialog.open) this.$refs.dialog.showModal()
      this.startRendering()
    },
    close() {
      if (this.$refs.dialog.open) this.$refs.dialog.close()
    },
    onNativeClose() {
      this.stopRendering()
      this.$emit("input", false)
    },
    async startRendering() {
      this.stopRendering()
      if (!this.file) return
      const renderer = new PdfPagesRenderer(this.file)
      this.renderer = renderer
      this.state = "loading"
      try {
        await renderer.render(this.$refs.pages, this.$refs.pages.clientWidth)
        if (this.renderer === renderer) this.state = "ready"
      } catch (error) {
        console.error("cannot render pdf", error)
        if (this.renderer === renderer) this.state = "failed"
      }
    },
    stopRendering() {
      this.renderer?.destroy()
      this.renderer = null
      this.$refs.pages?.replaceChildren()
      this.state = "idle"
    },
  },
}
</script>

<style scoped>
.m-pdf-reader {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: 100%;
  height: 100dvh;
  max-height: 100dvh;
  margin: 0;
  padding: 0;
  border: none;
  background: var(--m-bg);
}

.m-pdf-reader[open] {
  display: flex;
  flex-direction: column;
}

.m-pdf-reader__header {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  min-height: var(--m-header-height);
  padding: var(--m-safe-top) var(--m-space-2) 0;
  background: var(--m-surface);
  border-bottom: 1px solid var(--m-border);
}

.m-pdf-reader__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--m-font-size);
}

.m-pdf-reader__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--m-space-4);
}

.m-pdf-reader__state {
  text-align: center;
  padding: var(--m-space-6) 0;
}

.m-pdf-reader__pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-space-3);
}

.m-pdf-reader__pages :deep(canvas) {
  max-width: 100%;
  background: var(--m-surface);
  border-radius: 2px;
  box-shadow: var(--m-shadow-2);
}

.m-pdf-reader__footer {
  padding: var(--m-space-3) var(--m-space-4)
    calc(var(--m-space-3) + var(--m-safe-bottom));
  background: var(--m-surface);
  border-top: 1px solid var(--m-border);
}

.m-pdf-reader__share {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--m-space-2);
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font: inherit;
  font-weight: 600;
}
</style>

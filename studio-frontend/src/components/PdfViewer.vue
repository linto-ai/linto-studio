<template>
  <div class="pdf-viewer" :class="{ 'pdf-viewer--loading': loading }">
    <!-- Loading state -->
    <div v-if="loading" class="pdf-viewer__loading">
      <Loading :title="loadingText" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="pdf-viewer__error">
      <ph-icon name="warning" size="xl" weight="fill" class="error-icon" />
      <span>{{ error }}</span>
      <Button
        v-if="showRetry"
        variant="secondary"
        :label="$t('common.retry')"
        @click="$emit('retry')" />
    </div>

    <!-- PDF Display -->
    <iframe
      v-else-if="src"
      ref="pdfFrame"
      class="pdf-viewer__frame"
      :src="pdfSrc"
      frameborder="0"
      @load="onLoad"
      @error="onError">
    </iframe>

    <!-- Fallback when no src -->
    <div v-else class="pdf-viewer__empty">
      <span>{{ $t("publish.publication.no_preview") || "No PDF to display" }}</span>
    </div>

    <!-- Optional toolbar -->
    <div v-if="showToolbar && src && !loading && !error" class="pdf-viewer__toolbar">
      <slot name="toolbar">
        <Button
          v-if="showDownload"
          variant="tertiary"
          icon="download"
          :label="downloadLabel"
          :title="$t('common.download') || 'Download'"
          @click="download" />
      </slot>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/atoms/Loading.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "PdfViewer",
  components: {
    Loading,
    Button,
  },
  props: {
    src: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    showRetry: {
      type: Boolean,
      default: true,
    },
    showToolbar: {
      type: Boolean,
      default: false,
    },
    showDownload: {
      type: Boolean,
      default: true,
    },
    downloadLabel: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: "document.pdf",
    },
    // Hide native PDF viewer controls
    hideControls: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    pdfSrc() {
      if (!this.src) return null
      // Add parameters to hide native PDF controls
      const params = this.hideControls ? "#toolbar=0&navpanes=0&scrollbar=1" : ""
      return this.src + params
    },
  },
  methods: {
    onLoad() {
      this.$emit("load")
    },
    onError() {
      this.$emit("error")
    },
    download() {
      if (!this.src) return

      const link = document.createElement("a")
      link.href = this.src
      link.download = this.filename
      link.click()
    },
  },
}
</script>

<style scoped>
.pdf-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-viewer__frame {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.pdf-viewer__loading,
.pdf-viewer__error,
.pdf-viewer__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  color: var(--text-secondary, #666);
  font-size: 14px;
}

.pdf-viewer__error {
  color: var(--error-color, #f44336);
}

.pdf-viewer__error .error-icon {
  color: var(--error-color, #f44336);
}

.pdf-viewer__toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: var(--background-primary, white);
  border-top: 1px solid var(--border-color, #e0e0e0);
}

/* Loading overlay */
.pdf-viewer--loading .pdf-viewer__frame {
  opacity: 0.3;
}
</style>

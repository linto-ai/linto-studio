<template>
  <div class="pdf-viewer" :class="{ 'pdf-viewer--loading': loading }">
    <!-- Loading state -->
    <div v-if="loading" class="pdf-viewer__loading">
      <span class="loading-spinner"></span>
      <span v-if="loadingText">{{ loadingText }}</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="pdf-viewer__error">
      <span class="error-icon">&#9888;</span>
      <span>{{ error }}</span>
      <button v-if="showRetry" class="secondary" @click="$emit('retry')">
        {{ $t("common.retry") }}
      </button>
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
        <button
          v-if="showDownload"
          class="pdf-viewer__btn"
          :title="$t('common.download') || 'Download'"
          @click="download">
          <span class="icon download"></span>
          <span v-if="downloadLabel">{{ downloadLabel }}</span>
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PdfViewer",
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

.error-icon {
  font-size: 32px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color, #e0e0e0);
  border-top-color: var(--primary-color, #2196f3);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

.pdf-viewer__btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  background: var(--background-primary, white);
  color: var(--text-primary, #333);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pdf-viewer__btn:hover {
  background: var(--background-secondary, #f5f5f5);
  border-color: var(--primary-color, #2196f3);
  color: var(--primary-color, #2196f3);
}

.pdf-viewer__btn .icon {
  background-color: var(--text-primary, #333);
}

.pdf-viewer__btn:hover .icon {
  background-color: var(--primary-color, #2196f3);
}

/* Loading overlay */
.pdf-viewer--loading .pdf-viewer__frame {
  opacity: 0.3;
}
</style>

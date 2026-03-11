<template>
  <div class="flex1 flex col">
    <div v-if="statusIsInError" class="publish-main__empty">
      <h2>{{ $t(`publish.error_first_line.generic`) }}</h2>
      <p v-if="errorMessage" class="error-details">{{ errorMessage }}</p>
      <Button
        variant="primary"
        class="margin-top-small"
        :label="$t('common.retry')"
        @click="$emit('retry')" />
    </div>
    <PdfViewer
      v-else-if="status === 'complete' && blobUrl"
      :src="blobUrl"
      class="publish__pdf-wrapper"
      :showToolbar="false" />
    <div
      v-else-if="status === 'complete' && markdownContent"
      class="publish-main__content publish__markdown-wrapper flex col flex1">
      <!-- Editor Header with Save Button -->
      <div
        class="publish-editor-header flex align-center justify-between">
        <div class="flex align-center gap-small">
          <span
            v-if="hasChanges"
            class="unsaved-indicator">
            {{ $t("publish.editor.unsaved_changes") }}
          </span>
        </div>
        <div class="flex align-center gap-small">
        <Button
          v-if="canShowTranscript"
          :variant="showTranscript ? 'primary' : 'secondary'"
          icon="columns"
          size="sm"
          :label="$t('publish.editor.side_by_side')"
          @click="$emit('toggle-transcript')" />
        <Button
          v-if="hasChanges"
          variant="primary"
          icon="floppy-disk"
          size="sm"
          :label="$t('publish.editor.save_version')"
          @click="$emit('save-version')" />
        </div>
      </div>
      <!-- Tiptap WYSIWYG editor (always rendered, editable when allowed) -->
      <div id="markdown-editor-container" class="flex col flex1" style="min-height: 0">
        <MarkdownEditor
          ref="markdownEditor"
          :value="editableContent"
          :readonly="!editable"
          :showToolbar="editable"
          @input="onContentChange" />
      </div>
    </div>
    <div
      v-else-if="status === 'complete'"
      class="publish-main__progress flex col center-text align-center flex1 justify-center">
      <h2 class="center-text">{{ $t("publish.loading_document") }}</h2>
      <Loading />
    </div>
    <div
      v-else-if="
        status === 'queued' ||
        pdfPercentage === 'Processing 0%' ||
        status !== 'processing'
      "
      class="publish-main__progress flex col center-text align-center flex1 justify-center">
      <h2 class="center-text">{{ $t("publish.queued.title") }}</h2>
      <img
        src="/img/compass_illustration.svg"
        alt="processing"
        class="illustration" />
      <Loading block />
    </div>
    <div
      v-else-if="status === 'processing'"
      class="publish-main__progress flex col center-text align-center flex1 justify-center">
      <h2 class="center-text">
        {{ $t(`publish.generation_first_line.general`) }}
      </h2>
      <div
        class="circle-progress-bar"
        :style="{ '--progress': Math.trunc(pdfPercentage) }">
        <span>{{ pdfPercentage }}%</span>
      </div>
      <p v-if="phaseLabel" class="phase-label">{{ phaseLabel }}</p>
    </div>
    <div v-else class="publish-main__empty">
      <h2>{{ $t(`publish.error_first_line.generic`) }}</h2>
    </div>
  </div>
</template>
<script>
import MarkdownEditor from "@/components/MardownWYSIWYGEditor.vue"
import PdfViewer from "@/components/PdfViewer.vue"
import Button from "@/components/atoms/Button.vue"
import Loading from "@/components/atoms/Loading.vue"

export default {
  props: {
    status: {
      type: String,
      required: false,
    },
    blobUrl: {
      type: String,
      required: false,
    },
    pdfPercentage: {
      type: Number,
      required: false,
    },
    phase: {
      type: String,
      required: false,
      default: null,
    },
    markdownContent: {
      type: String,
      required: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      required: false,
      default: null,
    },
    showTranscript: {
      type: Boolean,
      default: false,
    },
    canShowTranscript: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      currentStatus: null,
      editableContent: "",
      originalContent: "",
      hasUserEdited: false,
      contentInitialized: false,
    }
  },
  computed: {
    statusIsInError() {
      return this.status === "error"
    },
    phaseLabel() {
      if (!this.phase) return null
      const key = `publish.phase.${this.phase}`
      const translated = this.$t(key)
      if (translated === key) {
        return this.phase.charAt(0).toUpperCase() + this.phase.slice(1).replace(/_/g, ' ')
      }
      return translated
    },
    hasChanges() {
      return this.hasUserEdited && this.editableContent !== this.originalContent
    },
  },
  watch: {
    markdownContent: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          let cleaned = this.cleanTrailingBackslashes(newVal)
          cleaned = this.stripMarkdownFences(cleaned)
          this.editableContent = cleaned
          this.originalContent = cleaned
          this.hasUserEdited = false
          this.contentInitialized = true
        }
      },
    },
  },
  methods: {
    cleanTrailingBackslashes(content) {
      if (!content) return content
      return content.replace(/\\(?=\n|$)/g, "")
    },
    stripMarkdownFences(content) {
      if (!content) return content
      return content.replace(/^`{3,}(?:markdown|md)?\s*\n/i, '').replace(/\n`{3,}\s*$/i, '')
    },
    onContentChange(content) {
      this.editableContent = content
      if (
        this.contentInitialized &&
        content !== this.originalContent
      ) {
        this.hasUserEdited = true
      }
      this.$emit("content-change", content)
    },
    getContent() {
      return this.editableContent
    },
    resetContent() {
      this.editableContent = this.originalContent
      this.hasUserEdited = false
      this.contentInitialized = true
    },
    markAsSaved() {
      this.originalContent = this.editableContent
      this.hasUserEdited = false
    },
    hasUnsavedChanges() {
      return this.hasChanges
    },
  },
  components: {
    MarkdownEditor,
    PdfViewer,
    Button,
    Loading,
  },
}
</script>

<style lang="scss" scoped>
.publish-main__content {
  min-height: 0;
}

.phase-label {
  margin-top: 1rem;
  color: var(--text-secondary, #666);
  font-size: 0.875rem;
}
</style>

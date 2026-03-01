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
      <!-- Mode Toggle Header with Save Button -->
      <div
        v-if="editable"
        class="publish-editor-header flex align-center justify-between">
        <div class="flex align-center gap-small">
          <Button
            :variant="viewMode === 'edit' ? 'primary-soft' : 'secondary'"
            :icon="viewMode === 'edit' ? 'eye' : 'pencil-simple'"
            size="sm"
            :label="viewMode === 'edit' ? $t('publish.editor.preview_mode') : $t('publish.editor.edit_mode')"
            @click="toggleMode" />
          <span
            v-if="hasChanges"
            class="unsaved-indicator">
            {{ $t("publish.editor.unsaved_changes") }}
          </span>
        </div>
        <Button
          v-if="hasChanges"
          variant="primary"
          icon="floppy-disk"
          size="sm"
          :label="$t('publish.editor.save_version')"
          @click="$emit('save-version')" />
      </div>
      <!-- Edit mode: Markdown textarea -->
      <MarkdownEditor
        v-if="viewMode === 'edit'"
        ref="markdownEditor"
        :value="editableContent"
        :readonly="!editable"
        :showToolbar="editable"
        :hideHeader="true"
        @input="onContentChange">
      </MarkdownEditor>

      <!-- Preview mode: Rendered markdown -->
      <div
        v-else
        class="markdown-preview-container flex1"
        v-html="renderedMarkdown"></div>
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
import { marked } from "marked"
import MarkdownEditor from "@/components/MardownWYSIWYGEditor.vue"
import PdfViewer from "@/components/PdfViewer.vue"
import Button from "@/components/atoms/Button.vue"
import Loading from "@/components/atoms/Loading.vue"

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

export default {
  props: {
    status: {
      type: String,
      required: false,
    }, // generating, displayed, error
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
  },
  data() {
    return {
      loading: true,
      currentStatus: null,
      viewMode: "preview", // 'edit' | 'preview'
      editableContent: "",
      originalContent: "",
      hasUserEdited: false, // Track if user has actually made edits
      contentInitialized: false, // Track if content has been initialized
      isTabSwitching: false, // Track if tab switch is in progress
    }
  },
  computed: {
    statusIsInError() {
      return this.status === "error"
    },
    phaseLabel() {
      if (!this.phase) return null
      // Try to get translated phase label, fallback to capitalized phase name
      const key = `publish.phase.${this.phase}`
      const translated = this.$t(key)
      // If translation key doesn't exist, $t returns the key itself
      if (translated === key) {
        return this.phase.charAt(0).toUpperCase() + this.phase.slice(1).replace(/_/g, ' ')
      }
      return translated
    },
    hasChanges() {
      // Only show changes if user has actually edited
      return this.hasUserEdited && this.editableContent !== this.originalContent
    },
    renderedMarkdown() {
      if (!this.editableContent) return ""
      return marked.parse(this.editableContent)
    },
  },
  watch: {
    markdownContent: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // Clean trailing backslashes (used for line breaks in markdown)
          // Since we use breaks: true in marked, they're not needed
          const cleanedContent = this.cleanTrailingBackslashes(newVal)
          this.editableContent = cleanedContent
          this.originalContent = cleanedContent
          this.hasUserEdited = false
          this.contentInitialized = true
        }
      },
    },
  },
  methods: {
    cleanTrailingBackslashes(content) {
      if (!content) return content
      // Remove trailing backslashes at end of lines (markdown line break syntax)
      // Keep double backslashes (escaped backslash)
      return content.replace(/\\(?=\n|$)/g, "")
    },
    toggleMode() {
      this.isTabSwitching = true
      this.viewMode = this.viewMode === "edit" ? "preview" : "edit"
      // Reset flag after Vue renders
      this.$nextTick(() => {
        this.isTabSwitching = false
      })
    },
    onContentChange(content) {
      this.editableContent = content
      // Only mark as edited if:
      // 1. User is in edit mode (actual user interaction)
      // 2. Content has been initialized (prevents false warning on initial load)
      // 3. Not currently switching tabs (prevents false warning on tab switch)
      // 4. Content is actually different from original
      if (
        this.viewMode === "edit" &&
        this.contentInitialized &&
        !this.isTabSwitching &&
        content !== this.originalContent
      ) {
        this.hasUserEdited = true
      }
      this.$emit("content-change", content)
    },
    // Public method to get current content
    getContent() {
      return this.editableContent
    },
    // Public method to reset changes
    resetContent() {
      this.editableContent = this.originalContent
      this.hasUserEdited = false
      this.contentInitialized = true
    },
    // Public method to mark content as saved
    markAsSaved() {
      this.originalContent = this.editableContent
      this.hasUserEdited = false
    },
    // Public method to check for unsaved changes
    hasUnsavedChanges() {
      return this.hasChanges
    },
    // Public method to set view mode from parent
    setViewMode(mode) {
      if (["edit", "preview"].includes(mode)) {
        this.viewMode = mode
      }
    },
    // Public method to get current view mode
    getViewMode() {
      return this.viewMode
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
  min-height: 0; // Important for flex scroll
}

.phase-label {
  margin-top: 1rem;
  color: var(--text-secondary, #666);
  font-size: 0.875rem;
}

.markdown-preview-container {
  flex: 1;
  overflow: auto;
  padding: 24px;
  line-height: 1.7;
  color: var(--text-primary, #333);
  background: var(--bg-primary, white);
  min-height: 0; // Important for flex scroll
}

.markdown-preview-container {
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    font-weight: 600;
    margin: 1.5em 0 0.5em;
    line-height: 1.3;
  }
  :deep(h1) {
    font-size: 1.8em;
    border-bottom: 1px solid var(--border-color, #e0e0e0);
    padding-bottom: 0.3em;
  }
  :deep(h2) {
    font-size: 1.5em;
  }
  :deep(h3) {
    font-size: 1.25em;
  }
  :deep(h4) {
    font-size: 1.1em;
  }

  :deep(p) {
    margin: 0.8em 0;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.5em;
    margin: 0.8em 0;
  }

  :deep(li) {
    margin: 0.3em 0;
  }

  :deep(blockquote) {
    border-left: 4px solid var(--primary-color, #1976d2);
    margin: 1em 0;
    padding: 0.5em 1em;
    background: var(--bg-secondary, #f5f5f5);
    color: var(--text-secondary, #555);
    border-radius: 0 4px 4px 0;
  }

  :deep(code) {
    background: var(--bg-secondary, #f5f5f5);
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-family: "Monaco", "Menlo", monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: var(--bg-secondary, #f5f5f5);
    border-radius: 6px;
    padding: 1em;
    overflow-x: auto;
    margin: 1em 0;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(hr) {
    border: none;
    border-top: 2px solid var(--border-color, #e0e0e0);
    margin: 2em 0;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;

    th,
    td {
      border: 1px solid var(--border-color, #e0e0e0);
      padding: 10px 14px;
      text-align: left;
    }

    th {
      background: var(--bg-secondary, #f5f5f5);
      font-weight: 600;
    }

    tr:nth-child(even) {
      background: var(--bg-tertiary, #fafafa);
    }
  }

  :deep(a) {
    color: var(--primary-color, #1976d2);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  :deep(strong) {
    font-weight: 600;
  }
}
</style>

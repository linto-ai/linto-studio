<template>
  <div class="flex1 flex col">
    <div v-if="statusIsInError" class="publish-main__empty">
      <h2>{{ $t(`publish.error_first_line.generic`) }}</h2>
    </div>
    <object
      v-else-if="status === 'complete' && blobUrl"
      class="publish__pdf-wrapper"
      :data="blobUrl"
      type="application/pdf"
      width="100%"
      height="500px">
      <p>Unable to display PDF file</p>
    </object>
    <div
      v-else-if="status === 'complete' && mardownContent"
      class="publish-main__content publish__markdown-wrapper flex col flex1">
      <!-- Edit/Preview Toggle Header -->
      <div v-if="editable" class="publish-editor-header flex align-center gap-small">
        <div class="publish-editor-mode-toggle flex">
          <button
            type="button"
            class="mode-btn"
            :class="{ active: isEditMode }"
            @click="setMode('edit')">
            <span class="icon edit"></span>
            {{ $t("publish.editor.edit_mode") }}
          </button>
          <button
            type="button"
            class="mode-btn"
            :class="{ active: !isEditMode }"
            @click="setMode('preview')">
            <span class="icon eye"></span>
            {{ $t("publish.editor.preview_mode") }}
          </button>
        </div>
        <div v-if="hasChanges" class="unsaved-indicator flex align-center gap-small">
          <span class="icon warning"></span>
          <span>{{ $t("publish.editor.unsaved_changes") }}</span>
        </div>
      </div>
      <!-- Editor Content -->
      <MarkdownEditor
        ref="markdownEditor"
        :value="editableContent"
        :readonly="!isEditMode || !editable"
        :showToolbar="isEditMode && editable"
        @input="onContentChange">
      </MarkdownEditor>
    </div>
    <div
      v-else-if="status === 'complete'"
      class="flex col center-text publish-main__loading align-center flex1 justify-center">
      <h2 class="center-text">{{ $t("publish.loading_document") }}</h2>
      <span class="icon loading"></span>
    </div>
    <div
      v-else-if="
        status === 'queued' ||
        pdfPercentage === 'Processing 0%' ||
        status !== 'processing'
      "
      class="flex col center-text publish-main__loading align-center flex1 justify-center">
      <h2 class="center-text">{{ $t("publish.queued.title") }}</h2>
      <img
        src="/img/compass_illustration.svg"
        alt="processing"
        class="illustration" />
      <span class="icon loading"></span>
    </div>
    <div
      v-else-if="status === 'processing'"
      class="flex col center-text publish-main__loading align-center flex1 justify-center">
      <h2 class="center-text">
        {{ $t(`publish.generation_first_line.general`) }}
      </h2>
      <div
        :class="'circle-progress-bar-' + Math.trunc(pdfPercentage)"
        class="circle-progress-bar">
        <span>{{ pdfPercentage }}%</span>
      </div>
    </div>
    <div v-else class="publish-main__empty">
      <h2>{{ $t(`publish.error_first_line.generic`) }}</h2>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import MarkdownEditor from "@/components/MardownWYSIWYGEditor.vue"

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
    mardownContent: {
      type: String,
      required: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      currentStatus: null,
      isEditMode: false,
      editableContent: "",
      originalContent: "",
    }
  },
  computed: {
    statusIsInError() {
      return this.status === "error"
    },
    hasChanges() {
      return this.editableContent !== this.originalContent
    },
  },
  watch: {
    mardownContent: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.editableContent = newVal
          this.originalContent = newVal
        }
      },
    },
  },
  methods: {
    setMode(mode) {
      this.isEditMode = mode === "edit"
    },
    onContentChange(content) {
      this.editableContent = content
      this.$emit("content-change", content)
    },
    // Public method to get current content
    getContent() {
      return this.editableContent
    },
    // Public method to reset changes
    resetContent() {
      this.editableContent = this.originalContent
    },
    // Public method to mark content as saved
    markAsSaved() {
      this.originalContent = this.editableContent
    },
    // Public method to check for unsaved changes
    hasUnsavedChanges() {
      return this.hasChanges
    },
  },
  mounted() {},
  components: { Fragment, MarkdownEditor },
}
</script>

<template>
  <div class="publication-section">
    <div class="section-header">
      <h3 class="section-title">{{ $t("publish.publication.title") }}</h3>
      <p class="section-description">
        {{ $t("publish.publication.description") }}
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="publication-loading">
      <Loading :title="$t('publish.publication.loading')" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="publication-error">
      <span class="icon warning"></span>
      <span>{{ error }}</span>
      <button class="secondary" @click="loadTemplates">
        {{ $t("common.retry") }}
      </button>
    </div>

    <!-- Content (even when templates.length === 0, we show create card) -->
    <div v-else class="publication-content">
      <!-- Templates grid -->
      <div class="templates-grid">
        <!-- Upload template card -->
        <div class="create-template-card" @click="showCreateForm = true">
          <div class="create-preview">
            <div class="create-icon-wrapper">
              <span class="icon upload create-icon"></span>
            </div>
          </div>
          <div class="create-content">
            <h4 class="create-title">
              {{ $t("publish.publication.upload_template") }}
            </h4>
            <p class="create-description">
              {{ $t("publish.publication.upload_template_hint") }}
            </p>
          </div>
        </div>

        <PublicationTemplateCard
          v-for="template in templates"
          :key="template.id"
          :template="template"
          :isSelected="selectedTemplate && selectedTemplate.id === template.id"
          @select="selectTemplate"
          @delete="handleDeleteTemplate" />
      </div>

      <!-- Export actions (shown when a template is selected) -->
      <div v-if="selectedTemplate" class="export-actions">
        <div class="selected-template-info">
          <span class="icon done"></span>
          <span
            >{{ $t("publish.publication.selected") }}:
            {{ selectedTemplate.name }}</span
          >
        </div>
        <div class="export-buttons">
          <button class="secondary" @click="exportDocument('docx')">
            <span class="icon download"></span>
            <span>{{ $t("conversation.export.docx") }}</span>
          </button>
          <button class="primary" @click="exportDocument('pdf')">
            <span class="icon download"></span>
            <span>{{ $t("conversation.export.pdf") }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div
      v-if="previewTemplate"
      class="modal-overlay"
      @click.self="closePreview">
      <div class="modal-content preview-modal">
        <div class="modal-header">
          <h3>{{ getTemplateName(previewTemplate) }}</h3>
          <button
            class="modal-close-btn"
            @click="closePreview"
            type="button"
            aria-label="Close">
            <span class="icon close"></span>
          </button>
        </div>
        <div class="modal-body preview-body">
          <!-- PDF Preview using PdfViewer component -->
          <PdfViewer
            :src="previewUrl"
            :loading="previewLoading"
            :loadingText="$t('publish.publication.generating_preview')"
            :error="previewError"
            :showRetry="true"
            :showToolbar="false"
            class="preview-pdf-viewer"
            @retry="generatePreview" />
        </div>
        <div class="modal-footer preview-footer">
          <button class="modal-btn cancel" @click="closePreview" type="button">
            {{ $t("common.cancel") }}
          </button>
          <div class="export-btns">
            <button
              class="modal-btn export docx"
              @click="downloadFromPreview('docx')"
              :disabled="!previewUrl"
              type="button">
              <span class="icon download"></span>
              DOCX
            </button>
            <button
              class="modal-btn export pdf"
              @click="downloadFromPreview('pdf')"
              :disabled="!previewUrl"
              type="button">
              <span class="icon download"></span>
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Template Modal -->
    <div
      v-if="showCreateForm"
      class="modal-overlay"
      @click.self="closeUploadModal">
      <div class="modal-content create-template-modal">
        <div class="modal-header">
          <h3>{{ $t("publish.publication.upload_template_title") }}</h3>
          <button
            class="modal-close-btn"
            @click="closeUploadModal"
            type="button">
            <span class="icon close"></span>
          </button>
        </div>
        <div class="modal-body">
          <!-- File Upload Zone -->
          <div class="form-field">
            <label>{{ $t("publish.publication.template_file") }} *</label>
            <div
              class="file-upload-zone"
              :class="{ 'has-file': newTemplate.file, 'drag-over': isDragging }"
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop">
              <input
                ref="fileInput"
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                @change="handleFileSelect"
                style="display: none" />
              <template v-if="newTemplate.file">
                <span class="icon document file-icon"></span>
                <span class="file-name">{{ newTemplate.file.name }}</span>
                <span class="file-size"
                  >({{ formatFileSize(newTemplate.file.size) }})</span
                >
                <button
                  type="button"
                  class="file-remove"
                  @click.stop="removeFile">
                  ×
                </button>
              </template>
              <template v-else>
                <span class="icon upload upload-icon"></span>
                <span class="upload-text">
                  {{ $t("publish.publication.drop_file") }}
                </span>
                <span class="upload-hint">
                  {{ $t("publish.publication.or_click") }}
                </span>
              </template>
            </div>
            <p class="field-hint" v-html="templateFormatHint"></p>
          </div>

          <div class="form-field">
            <label>{{ $t("publish.publication.template_name") }} *</label>
            <input
              type="text"
              v-model="newTemplate.name_fr"
              :placeholder="
                $t('publish.publication.template_name_placeholder')
              " />
          </div>

          <div class="form-field">
            <label>{{ $t("publish.publication.template_description") }}</label>
            <textarea
              v-model="newTemplate.description_fr"
              :placeholder="
                $t('publish.publication.template_description_placeholder')
              "
              rows="2"></textarea>
          </div>

          <div class="form-field" v-if="canCreateOrgTemplate">
            <label>{{ $t("publish.publication.template_scope") }}</label>
            <div class="scope-options">
              <label class="scope-option">
                <input
                  type="radio"
                  v-model="newTemplate.scope"
                  value="personal" />
                <span>{{ $t("publish.publication.scope_personal") }}</span>
                <span class="scope-hint">{{
                  $t("publish.publication.scope_personal_hint")
                }}</span>
              </label>
              <label class="scope-option">
                <input
                  type="radio"
                  v-model="newTemplate.scope"
                  value="organization" />
                <span>{{ $t("publish.publication.scope_organization") }}</span>
                <span class="scope-hint">{{
                  $t("publish.publication.scope_organization_hint")
                }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary" @click="closeUploadModal" type="button">
            {{ $t("common.cancel") }}
          </button>
          <button
            class="primary"
            @click="uploadTemplate"
            :disabled="!canUpload || uploading"
            type="button">
            <span v-if="uploading" class="icon loading"></span>
            <span>{{
              uploading
                ? $t("common.uploading")
                : $t("publish.publication.upload_button")
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  apiGetPublicationTemplates,
  apiExportWithTemplate,
  apiUploadPublicationTemplate,
  apiDeletePublicationTemplate,
} from "@/api/publication"
import PublicationTemplateCard from "@/components/PublicationTemplateCard.vue"
import PdfViewer from "@/components/PdfViewer.vue"
import Loading from "./atoms/Loading.vue"

export default {
  name: "PublicationSection",
  components: {
    PublicationTemplateCard,
    PdfViewer,
  },
  props: {
    jobId: {
      type: String,
      required: false,
      default: null,
    },
    organizationId: {
      type: String,
      required: false,
      default: null,
    },
    conversationName: {
      type: String,
      required: false,
      default: "export",
    },
    userRole: {
      type: String,
      required: false,
      default: "member",
    },
    versionNumber: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      error: null,
      templates: [],
      selectedTemplate: null,
      exporting: false,
      showCreateForm: false,
      uploading: false,
      isDragging: false,
      newTemplate: {
        file: null,
        name_fr: "",
        description_fr: "",
        scope: "personal",
      },
      // Preview modal
      previewTemplate: null,
      previewLoading: false,
      previewError: null,
      previewUrl: null,
    }
  },
  computed: {
    canCreateOrgTemplate() {
      // User can create org-scoped templates if they are admin or manager
      const allowedRoles = [
        "admin",
        "administrator",
        "maintainer",
        "manager",
        "meeting manager",
      ]
      return allowedRoles.includes((this.userRole || "").toLowerCase())
    },
    canUpload() {
      return (
        this.newTemplate.file &&
        this.newTemplate.name_fr &&
        this.newTemplate.name_fr.trim().length > 0
      )
    },
    templateFormatHint() {
      // Return hint text with placeholder syntax escaped for Vue
      return this.$t("publish.publication.template_format_hint")
    },
  },
  watch: {
    organizationId: {
      immediate: false,
      handler() {
        this.loadTemplates()
      },
    },
  },
  mounted() {
    this.loadTemplates()
  },
  beforeDestroy() {
    // Revoke any blob URLs to prevent memory leak
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = null
    }
  },
  methods: {
    async loadTemplates() {
      this.loading = true
      this.error = null
      try {
        this.templates = await apiGetPublicationTemplates({
          organizationId: this.organizationId,
        })
      } catch (err) {
        this.error = this.$t("publish.publication.load_error")
      } finally {
        this.loading = false
      }
    },
    selectTemplate(template) {
      // Open preview modal instead of just selecting
      this.openPreview(template)
    },
    openPreview(template) {
      this.previewTemplate = template
      this.previewError = null
      // Revoke previous blob URL if exists
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl)
        this.previewUrl = null
      }
      this.generatePreview()
    },
    closePreview() {
      this.previewTemplate = null
      this.previewLoading = false
      this.previewError = null
      // Revoke blob URL to free memory
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl)
        this.previewUrl = null
      }
    },
    async generatePreview() {
      if (!this.jobId || !this.previewTemplate) {
        this.previewError = this.$t("publish.publication.no_job_for_preview")
        return
      }

      this.previewLoading = true
      this.previewError = null

      try {
        // Fetch PDF blob for preview
        const blob = await apiExportWithTemplate(this.jobId, "pdf", {
          templateId: this.previewTemplate.id,
          versionNumber: this.versionNumber,
        })

        if (blob) {
          this.previewUrl = URL.createObjectURL(blob)
        } else {
          throw new Error("No data returned")
        }
      } catch (err) {
        console.error("Preview generation failed:", err)
        this.previewError = this.$t("publish.publication.preview_error")
      } finally {
        this.previewLoading = false
      }
    },
    async downloadFromPreview(format) {
      if (!this.jobId || !this.previewTemplate) return

      try {
        const blob = await apiExportWithTemplate(this.jobId, format, {
          templateId: this.previewTemplate.id,
          versionNumber: this.versionNumber,
        })
        if (blob) {
          this.downloadBlob(blob, format)
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.export_error"),
        })
      }
    },
    getTemplateName(template) {
      const locale = this.$i18n.locale
      if (locale.startsWith("fr") && template.name_fr) {
        return template.name_fr
      }
      return template.name_en || template.name_fr || template.name || ""
    },
    async exportDocument(format) {
      if (!this.jobId || !this.selectedTemplate) {
        return
      }

      this.exporting = true
      this.$emit("export-start", { format, template: this.selectedTemplate })

      try {
        const blob = await apiExportWithTemplate(this.jobId, format, {
          templateId: this.selectedTemplate.id,
          versionNumber: this.versionNumber,
        })

        if (blob) {
          this.downloadBlob(blob, format)
          this.$emit("export-success", {
            format,
            template: this.selectedTemplate,
          })
        } else {
          throw new Error("Export returned no data")
        }
      } catch (err) {
        this.$emit("export-error", {
          format,
          template: this.selectedTemplate,
          error: err,
        })
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.export_error"),
        })
      } finally {
        this.exporting = false
      }
    },
    downloadBlob(blob, format) {
      const validCharsRegex = /[a-zA-Z0-9-_.]/g
      const safeName =
        this.conversationName.match(validCharsRegex)?.join("") || "export"
      const filename = `${safeName}.${format}`

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    },
    // File upload methods
    triggerFileInput() {
      this.$refs.fileInput?.click()
    },
    handleFileSelect(event) {
      const file = event.target.files?.[0]
      if (file) {
        this.setFile(file)
      }
    },
    handleFileDrop(event) {
      this.isDragging = false
      const file = event.dataTransfer?.files?.[0]
      if (file) {
        this.setFile(file)
      }
    },
    setFile(file) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".docx",
      ]
      const isValidType =
        validTypes.includes(file.type) || file.name.endsWith(".docx")

      if (!isValidType) {
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.publication.invalid_file_type"),
        })
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.publication.file_too_large"),
        })
        return
      }

      this.newTemplate.file = file

      // Auto-fill name from filename if empty
      if (!this.newTemplate.name_fr) {
        const nameWithoutExt = file.name.replace(/\.docx$/i, "")
        this.newTemplate.name_fr = nameWithoutExt
      }
    },
    removeFile() {
      this.newTemplate.file = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ""
      }
    },
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + " o"
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko"
      return (bytes / (1024 * 1024)).toFixed(1) + " Mo"
    },
    closeUploadModal() {
      this.showCreateForm = false
      this.resetUploadForm()
    },
    async handleDeleteTemplate(template) {
      // Show confirmation dialog
      const templateName =
        template.name_fr || template.name_en || template.name || ""
      const confirmMessage = this.$t("publish.publication.delete_confirm", {
        name: templateName,
      })

      if (!confirm(confirmMessage)) {
        return
      }

      try {
        const success = await apiDeletePublicationTemplate(template.id)

        if (success) {
          this.$store.dispatch("system/addNotification", {
            type: "success",
            message: this.$t("publish.publication.delete_success"),
          })

          // Clear selection if deleted template was selected
          if (
            this.selectedTemplate &&
            this.selectedTemplate.id === template.id
          ) {
            this.selectedTemplate = null
          }

          // Reload templates
          await this.loadTemplates()
        } else {
          throw new Error("Delete returned false")
        }
      } catch (err) {
        console.error("Template delete error:", err)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.publication.delete_error"),
        })
      }
    },
    resetUploadForm() {
      this.newTemplate = {
        file: null,
        name_fr: "",
        description_fr: "",
        scope: "personal",
      }
      this.isDragging = false
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ""
      }
    },
    async uploadTemplate() {
      if (!this.canUpload) return

      this.uploading = true
      try {
        const uploadData = {
          file: this.newTemplate.file,
          name_fr: this.newTemplate.name_fr.trim(),
          description_fr: this.newTemplate.description_fr?.trim() || "",
          scope: this.newTemplate.scope, // "personal" or "organization"
        }

        // Always include organization_id when available (required by LLM Gateway for scoped templates)
        // For personal scope: org_id + user_id identifies a user's templates within an org
        // For organization scope: org_id alone identifies org-wide templates
        if (this.organizationId) {
          uploadData.organization_id = this.organizationId
        }

        const result = await apiUploadPublicationTemplate(uploadData)

        if (result) {
          this.$store.dispatch("system/addNotification", {
            type: "success",
            message: this.$t("publish.publication.upload_success"),
          })
          this.closeUploadModal()
          // Reload templates
          await this.loadTemplates()
        } else {
          throw new Error("Failed to upload template")
        }
      } catch (err) {
        console.error("Template upload error:", err)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.publication.upload_error"),
        })
      } finally {
        this.uploading = false
      }
    },
  },
}
</script>

<style scoped>
.publication-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px;
}

.section-header {
  margin-bottom: 4px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #333);
  margin: 0 0 6px 0;
}

.section-description {
  font-size: 14px;
  color: var(--text-secondary, #666);
  margin: 0;
  line-height: 1.5;
}

.publication-loading,
.publication-error,
.publication-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  background: var(--background-secondary, #f5f5f5);
  border-radius: 8px;
  color: var(--text-secondary, #666);
}

.publication-error {
  color: var(--error-color, #f44336);
}

.publication-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.export-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 12px;
  margin-top: 12px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.selected-template-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--success-color-dark, #2e7d32);
  font-size: 14px;
  font-weight: 500;
}

.export-buttons {
  display: flex;
  gap: 10px;
}

.export-buttons button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
}

.export-buttons button .icon {
  background-color: currentColor;
}

.export-buttons button.primary .icon {
  background-color: white;
}

.selected-template-info .icon {
  width: 20px;
  height: 20px;
  background-color: var(--success-color, #4caf50);
}

/* Create template card */
.create-template-card {
  display: flex;
  flex-direction: column;
  background: white;
  border: 2px dashed var(--border-color, #e0e0e0);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
  min-height: 260px;
}

.create-template-card:hover {
  border-color: var(--primary-color, #2196f3);
  border-style: solid;
  box-shadow: 0 4px 20px rgba(33, 150, 243, 0.15);
  transform: translateY(-2px);
}

.create-preview {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
}

.create-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  border: 2px dashed var(--border-color, #ccc);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.create-template-card:hover .create-icon-wrapper {
  background: var(--primary-color, #2196f3);
  border-color: var(--primary-color, #2196f3);
  border-style: solid;
}

.create-icon {
  width: 24px;
  height: 24px;
  background: var(--text-secondary, #666);
  transition: background 0.25s ease;
}

.create-template-card:hover .create-icon {
  background: white;
}

.create-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
}

.create-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary, #333);
}

.create-description {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content.create-template-modal {
  background: var(--background-primary, white);
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  flex-shrink: 0;
  overflow: visible;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary, #666);
  padding: 0;
  line-height: 1;
}

.modal-close:hover {
  color: var(--text-primary, #333);
}

/* Improved close button */
.modal-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: var(--background-secondary, #f5f5f5);
}

.modal-close-btn:hover .icon {
  background-color: var(--text-primary, #333);
}

.modal-close-btn .icon {
  width: 18px;
  height: 18px;
  background-color: var(--text-secondary, #666);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-body .form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-body .form-field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #333);
}

.modal-body .form-field input,
.modal-body .form-field textarea,
.modal-body .form-field select {
  padding: 10px 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.modal-body .form-field input:focus,
.modal-body .form-field textarea:focus,
.modal-body .form-field select:focus {
  outline: none;
  border-color: var(--primary-color, #2196f3);
}

.scope-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scope-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
}

.scope-option input[type="radio"] {
  margin: 0;
}

.scope-hint {
  font-size: 11px;
  color: var(--text-tertiary, #999);
  margin-left: auto;
}

/* File upload zone */
.file-upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border: 2px dashed var(--border-color, #e0e0e0);
  border-radius: 12px;
  background: var(--background-secondary, #f8f9fa);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 120px;
}

.file-upload-zone:hover {
  border-color: var(--primary-color, #2196f3);
  background: var(--primary-light, #e3f2fd);
}

.file-upload-zone.drag-over {
  border-color: var(--primary-color, #2196f3);
  background: var(--primary-light, #e3f2fd);
  border-style: solid;
}

.file-upload-zone.has-file {
  flex-direction: row;
  padding: 16px;
  min-height: auto;
  background: var(--background-primary, white);
  border-style: solid;
  border-color: var(--success-color, #4caf50);
}

.upload-icon {
  width: 32px;
  height: 32px;
  background: var(--text-secondary, #666);
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #333);
}

.upload-hint {
  font-size: 12px;
  color: var(--text-secondary, #666);
}

.file-icon {
  width: 24px;
  height: 24px;
  background: var(--success-color, #4caf50);
  flex-shrink: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary, #333);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: var(--text-secondary, #666);
}

.file-remove {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: var(--error-light, #ffebee);
  color: var(--error-color, #f44336);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.file-remove:hover {
  background: var(--error-color, #f44336);
  color: white;
}

.field-hint {
  margin: 6px 0 0 0;
  font-size: 11px;
  color: var(--text-tertiary, #999);
}

.field-hint code {
  background: var(--background-secondary, #f5f5f5);
  padding: 1px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 10px;
  color: var(--primary-color, #2196f3);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color, #e0e0e0);
}

/* Preview modal footer */
.modal-footer.preview-footer {
  justify-content: space-between;
  align-items: center;
  background: var(--background-primary, white);
}

.export-btns {
  display: flex;
  gap: 8px;
}

.modal-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.cancel {
  background: transparent;
  color: var(--text-secondary, #666);
  border: 1px solid var(--border-color, #e0e0e0);
}

.modal-btn.cancel:hover {
  background: var(--background-secondary, #f5f5f5);
  color: var(--text-primary, #333);
}

.modal-btn.export {
  background: var(--primary-color, #2196f3);
  color: white;
}

.modal-btn.export:hover:not(:disabled) {
  background: var(--primary-color-dark, #1976d2);
}

.modal-btn.export.docx {
  background: var(--background-secondary, #f5f5f5);
  color: var(--text-primary, #333);
  border: 1px solid var(--border-color, #e0e0e0);
}

.modal-btn.export.docx:hover:not(:disabled) {
  background: var(--background-tertiary, #e8e8e8);
}

.modal-btn.export.pdf {
  background: var(--primary-color, #2196f3);
  color: white;
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-btn .icon {
  width: 16px;
  height: 16px;
  background-color: currentColor;
}

.modal-btn.export.pdf .icon {
  background-color: white;
}

.modal-btn.export.docx .icon {
  background-color: var(--text-primary, #333);
}

/* Preview Modal */
.modal-content.preview-modal {
  background: var(--background-primary, white);
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  height: 85vh;
  display: flex;
  flex-direction: column;
}

.preview-body {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 16px;
  overflow: hidden;
  background: white;
}

.preview-body .preview-pdf-viewer {
  width: 100%;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preview-loading,
.preview-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary, #666);
  font-size: 14px;
}

.preview-error {
  color: var(--error-color, #f44336);
}

.loading-spinner {
  width: 40px;
  height: 40px;
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

.preview-pdf-viewer {
  width: 100%;
  height: 100%;
}
</style>

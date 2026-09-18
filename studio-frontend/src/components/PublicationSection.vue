<template>
  <div class="publication-section flex col gap-medium">
    <header v-if="!hideHeader" class="flex col gap-small">
      <h3 class="publication-section__title">
        {{ $t("publish.publication.title") }}
      </h3>
      <p class="publication-section__description">
        {{ $t("publish.publication.description") }}
      </p>
    </header>

    <Loading v-if="loading" :title="$t('publish.publication.loading')" />

    <div v-else-if="error" class="publication-section__error">
      <PhIcon name="warning" framed frameColor="neutral" />
      <span>{{ error }}</span>
      <Button
        variant="secondary"
        @click="loadTemplates"
        :label="$t('common.retry')" />
    </div>

    <div v-else class="templates-grid">
      <button
        type="button"
        class="template-card--create"
        @click="showCreateForm = true">
        <PhIcon name="file-plus" framed size="lg" />
        <span class="template-card--create__title">
          {{ $t("publish.publication.upload_template") }}
        </span>
        <span class="template-card--create__hint">
          {{ $t("publish.publication.upload_template_hint") }}
        </span>
      </button>

      <PublicationTemplateCard
        v-for="template in templates"
        :key="template.id"
        :template="template"
        :currentUserId="currentUserId"
        :canManageOrganization="canManageOrganization"
        @select="openPreview"
        @share="handleShareTemplate"
        @delete="handleDeleteTemplate" />
    </div>

    <!-- Preview Modal -->
    <Modal
      v-model="showPreviewModal"
      :title="previewTemplate ? getTemplateName(previewTemplate) : ''"
      size="lg"
      :withActionApply="false"
      :withActionCancel="false"
      customModalClass="publication-preview-modal">
      <template #content>
        <PdfViewer
          :src="previewUrl"
          :loading="previewLoading"
          :loadingText="$t('publish.publication.generating_preview')"
          :error="previewError"
          :showRetry="true"
          :showToolbar="false"
          class="preview-pdf-viewer"
          @retry="generatePreview" />
      </template>
      <template #actions-left>
        <Button
          variant="tertiary"
          @click="closePreview"
          type="button"
          icon="x-circle"
          :label="$t('common.cancel')" />
      </template>
      <template #actions-right>
        <Button
          variant="secondary"
          @click="downloadFromPreview('docx')"
          :disabled="!previewUrl"
          type="button"
          icon="download"
          label="DOCX" />
        <Button
          variant="primary"
          @click="downloadFromPreview('pdf')"
          :disabled="!previewUrl"
          type="button"
          icon="download"
          label="PDF" />
      </template>
    </Modal>

    <!-- Upload Template Modal -->
    <Modal
      v-model="showCreateForm"
      :title="$t('publish.publication.upload_template_title')"
      size="md"
      :withActionApply="false"
      @close="resetUploadForm">
      <template #content>
        <form class="flex col gap-medium" @submit.prevent="uploadTemplate">
          <PublicationTemplateHelp
            :baseTemplates="baseTemplates"
            :canManageOrganization="canManageOrganization"
            @download="handleDownloadTemplate" />

          <div class="form-field">
            <label>{{ $t("publish.publication.template_file") }} *</label>
            <div v-if="newTemplateFile" class="selected-file">
              <PhIcon name="file-doc" framed />
              <span class="selected-file__name">{{
                newTemplateFile.name
              }}</span>
              <span class="selected-file__size">
                {{ formatFileSize(newTemplateFile.size) }}
              </span>
              <Button
                variant="text"
                size="sm"
                icon="x"
                type="button"
                :title="$t('publish.publication.remove_file')"
                @click="removeFile" />
            </div>
            <Droparea
              v-else
              :accepts="[DOCX_MIME_TYPE, '.docx']"
              @drop="handleDroppedFiles"
              @error="handleDropareaError">
              <PhIcon name="file-doc" size="xl" />
              <p>{{ $t("publish.publication.drop_file") }}</p>
            </Droparea>
            <p class="form-field__hint" v-html="templateFormatHint"></p>
          </div>

          <FormInput
            v-model="nameField.value"
            :field="nameField"
            inputId="publication-template-name"
            required />

          <FormInput
            v-model="descriptionField.value"
            :field="descriptionField"
            inputId="publication-template-description"
            textarea />

          <div class="form-field" v-if="canManageOrganization">
            <label>{{ $t("publish.publication.template_scope") }}</label>
            <FormRadio :field="scopeField" v-model="scopeField.value" />
          </div>
        </form>
      </template>
      <template #actions-right>
        <Button
          variant="primary"
          @click="uploadTemplate"
          :disabled="!canUpload || uploading"
          :loading="uploading"
          type="button"
          icon="check"
          :label="$t('publish.publication.upload_button')" />
      </template>
    </Modal>
  </div>
</template>

<script>
import {
  apiGetPublicationTemplates,
  apiExportWithTemplate,
  apiUploadPublicationTemplate,
  apiDeletePublicationTemplate,
  apiUpdatePublicationTemplateScope,
  apiDownloadPublicationTemplate,
} from "@/api/publication"
import Button from "@/components/atoms/Button.vue"
import Loading from "@/components/atoms/Loading.vue"
import PhIcon from "@/components/atoms/PhIcon.vue"
import Droparea from "@/components/molecules/Droparea.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import FormRadio from "@/components/molecules/FormRadio.vue"
import Modal from "@/components/molecules/Modal.vue"
import PdfViewer from "@/components/PdfViewer.vue"
import PublicationTemplateHelp from "@/components/molecules/PublicationTemplateHelp.vue"
import PublicationTemplateCard from "@/components/PublicationTemplateCard.vue"
import EMPTY_FIELD from "@/const/emptyField.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles"
import { getTemplateDisplayName } from "@/tools/getTemplateDisplayName.js"
import { formatFileSize } from "@/tools/formatFileSize.js"

const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const MAX_TEMPLATE_SIZE = 10 * 1024 * 1024

export default {
  name: "PublicationSection",
  components: {
    Button,
    Droparea,
    FormInput,
    FormRadio,
    Loading,
    Modal,
    PdfViewer,
    PhIcon,
    PublicationTemplateCard,
    PublicationTemplateHelp,
  },
  props: {
    jobId: { type: String, default: null },
    organizationId: { type: String, default: null },
    conversationId: { type: String, default: null },
    serviceId: { type: String, default: null },
    conversationName: { type: String, default: "export" },
    hideHeader: { type: Boolean, default: false },
    versionNumber: { type: Number, default: null },
  },
  data() {
    return {
      DOCX_MIME_TYPE,
      loading: false,
      error: null,
      templates: [],
      showCreateForm: false,
      uploading: false,
      newTemplateFile: null,
      nameField: {
        ...EMPTY_FIELD,
        label: this.$t("publish.publication.template_name"),
      },
      descriptionField: {
        ...EMPTY_FIELD,
        label: this.$t("publish.publication.template_description"),
      },
      scopeField: {
        value: "personal",
        error: null,
        options: [
          {
            name: "personal",
            label: this.$t("publish.publication.scope_personal"),
            description: this.$t("publish.publication.scope_personal_hint"),
          },
          {
            name: "organization",
            label: this.$t("publish.publication.scope_organization"),
            description: this.$t("publish.publication.scope_organization_hint"),
          },
        ],
      },
      // Preview modal
      previewTemplate: null,
      previewLoading: false,
      previewError: null,
      previewUrl: null,
    }
  },
  computed: {
    showPreviewModal: {
      get() {
        return !!this.previewTemplate
      },
      set(val) {
        if (!val) this.closePreview()
      },
    },
    currentUserId() {
      return this.$store.getters["user/getUserId"]
    },
    // Maintainers and admins share templates with the whole organization
    canManageOrganization() {
      const role =
        this.$store.getters["organizations/getUserRoleInOrganization"]
      return role >= ORGANIZATION_ROLES.MAINTAINER
    },
    baseTemplates() {
      return this.templates.filter((template) => template.scope === "system")
    },
    canUpload() {
      return Boolean(this.newTemplateFile) && this.nameField.value.trim() !== ""
    },
    templateFormatHint() {
      // Placeholder syntax is HTML-escaped in the translation
      return this.$t("publish.publication.template_format_hint")
    },
  },
  watch: {
    organizationId() {
      this.loadTemplates()
    },
    serviceId() {
      this.loadTemplates()
    },
  },
  mounted() {
    this.loadTemplates()
  },
  beforeDestroy() {
    this.revokePreviewUrl()
  },
  methods: {
    formatFileSize,
    notify(type, message) {
      this.$store.dispatch("system/addNotification", { type, message })
    },
    async loadTemplates() {
      // organizationId can be unset on mount; the watcher retries once it resolves
      if (!this.organizationId) return
      this.loading = true
      this.error = null
      try {
        this.templates = await apiGetPublicationTemplates({
          organizationId: this.organizationId,
          serviceId: this.serviceId,
        })
      } catch (err) {
        this.error = this.$t("publish.publication.load_error")
      } finally {
        this.loading = false
      }
    },
    getTemplateName(template) {
      return getTemplateDisplayName(template, this.$i18n.locale)
    },
    // Preview
    openPreview(template) {
      this.$emit("preview-open")
      this.previewTemplate = template
      this.previewError = null
      this.revokePreviewUrl()
      this.generatePreview()
    },
    closePreview() {
      this.$emit("preview-close")
      this.previewTemplate = null
      this.previewLoading = false
      this.previewError = null
      this.revokePreviewUrl()
    },
    revokePreviewUrl() {
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
      const blob = await apiExportWithTemplate(
        this.conversationId,
        this.jobId,
        "pdf",
        {
          templateId: this.previewTemplate.id,
          versionNumber: this.versionNumber,
        },
      )
      if (blob) {
        this.previewUrl = URL.createObjectURL(blob)
      } else {
        this.previewError = this.$t("publish.publication.preview_error")
      }
      this.previewLoading = false
    },
    // Download from the preview, then close the preview and the parent modal
    async downloadFromPreview(format) {
      if (!this.jobId || !this.previewTemplate) return
      const template = this.previewTemplate
      const blob = await apiExportWithTemplate(
        this.conversationId,
        this.jobId,
        format,
        { templateId: template.id, versionNumber: this.versionNumber },
      )
      if (!blob) {
        this.notify("error", this.$t("publish.export_error"))
        return
      }
      const validCharsRegex = /[a-zA-Z0-9-_.]/g
      const safeName =
        this.conversationName.match(validCharsRegex)?.join("") || "export"
      this.downloadBlob(blob, `${safeName}.${format}`)
      this.notify(
        "success",
        this.$t("publish.publication.export_success", {
          format: format.toUpperCase(),
        }),
      )
      this.closePreview()
      this.$emit("export-success", { format, template })
    },
    downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    },
    // Template actions
    async handleDownloadTemplate(template) {
      const blob = await apiDownloadPublicationTemplate(
        this.organizationId,
        template.id,
      )
      if (!blob) {
        this.notify(
          "error",
          this.$t("publish.publication.download_template_error"),
        )
        return
      }
      this.downloadBlob(
        blob,
        template.file_name || `${this.getTemplateName(template)}.docx`,
      )
    },
    async handleShareTemplate({ template, shared }) {
      const updated = await apiUpdatePublicationTemplateScope(
        this.organizationId,
        template.id,
        shared ? "organization" : "personal",
      )
      if (!updated) {
        this.notify("error", this.$t("publish.publication.share_error"))
        return
      }
      this.notify(
        "success",
        this.$t(
          shared
            ? "publish.publication.share_success"
            : "publish.publication.unshare_success",
        ),
      )
      await this.loadTemplates()
    },
    async handleDeleteTemplate(template) {
      const confirmMessage = this.$t("publish.publication.delete_confirm", {
        name: this.getTemplateName(template),
      })
      if (!confirm(confirmMessage)) return

      const success = await apiDeletePublicationTemplate(
        this.organizationId,
        template.id,
      )
      if (!success) {
        this.notify("error", this.$t("publish.publication.delete_error"))
        return
      }
      this.notify("success", this.$t("publish.publication.delete_success"))
      await this.loadTemplates()
    },
    // Upload form
    handleDroppedFiles(files) {
      const file = files[0]
      if (!file) return
      if (file.size > MAX_TEMPLATE_SIZE) {
        this.notify("error", this.$t("publish.publication.file_too_large"))
        return
      }
      this.newTemplateFile = file
      if (!this.nameField.value) {
        this.nameField.value = file.name.replace(/\.docx$/i, "")
      }
    },
    handleDropareaError() {
      this.notify("error", this.$t("publish.publication.invalid_file_type"))
    },
    removeFile() {
      this.newTemplateFile = null
    },
    resetUploadForm() {
      this.newTemplateFile = null
      this.nameField.value = ""
      this.descriptionField.value = ""
      this.scopeField.value = "personal"
    },
    async uploadTemplate() {
      if (!this.canUpload || !this.organizationId || this.uploading) return
      this.uploading = true
      const result = await apiUploadPublicationTemplate({
        file: this.newTemplateFile,
        name_fr: this.nameField.value.trim(),
        description_fr: this.descriptionField.value.trim(),
        scope: this.scopeField.value,
        organization_id: this.organizationId,
        // The template is linked to the AI service it was uploaded from
        service_id: this.serviceId,
      })
      this.uploading = false
      if (!result) {
        this.notify("error", this.$t("publish.publication.upload_error"))
        return
      }
      this.notify("success", this.$t("publish.publication.upload_success"))
      this.showCreateForm = false
      this.resetUploadForm()
      await this.loadTemplates()
    },
  },
}
</script>

<style lang="scss" scoped>
.publication-section__title {
  margin: 0;
  font-size: var(--text-lg);
}

.publication-section__description {
  margin: 0;
  color: var(--text-secondary);
}

.publication-section__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--small-gap);
  padding: var(--large-gap);
  color: var(--text-secondary);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: var(--medium-gap);
}

.template-card--create {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--small-gap);
  padding: var(--medium-gap);
  min-height: 11rem;
  background: var(--background-inset-section);
  border: var(--border-button);
  border-style: dashed;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font: inherit;
  color: var(--text-primary);
  text-align: center;
  white-space: normal;

  &:hover,
  &:focus-visible {
    border-color: var(--primary-color);
    background: var(--primary-soft);
  }
}

.template-card--create__title {
  font-weight: 600;
}

.template-card--create__hint {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.selected-file {
  display: flex;
  align-items: center;
  gap: var(--small-gap);
  padding: var(--small-gap);
  border: var(--border-block);
  border-radius: var(--border-radius-sm);
}

.selected-file__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-file__size {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.form-field__hint {
  margin: var(--tiny-gap) 0 0;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.preview-pdf-viewer {
  height: 70vh;
}
</style>

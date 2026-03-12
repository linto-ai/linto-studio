<template>
  <div class="conversation-documents">
    <div class="conversation-documents__list" v-if="documents.length > 0">
      <div
        class="conversation-documents__item"
        v-for="doc in documents"
        :key="doc.documentId">
        <PhIcon :name="mimeIcon(doc.mimetype)" size="md" />
        <div class="conversation-documents__item-info">
          <span class="conversation-documents__item-name" :title="doc.filename">
            {{ doc.filename }}
          </span>
          <span class="conversation-documents__item-size">
            {{ formatFileSize(doc.size) }}
          </span>
        </div>
        <div class="conversation-documents__item-actions">
          <Button
            variant="transparent"
            icon="download-simple"
            size="sm"
            :title="$t('documents.download')"
            :loading="downloadingId === doc.documentId"
            @click="download(doc)" />
          <Button
            v-if="canEdit"
            variant="transparent"
            intent="destructive"
            icon="trash"
            size="sm"
            :title="$t('documents.delete')"
            :loading="deletingId === doc.documentId"
            @click="remove(doc)" />
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="conversation-documents__empty">
      {{ $t("documents.empty") }}
    </div>

    <div v-if="canEdit" class="conversation-documents__upload">
      <Droparea
        :accepts="acceptedMimeTypes"
        :multiple="true"
        @drop="onFilesDropped"
        @error="onDropError">
        <span>{{ $t("documents.drop_hint") }}</span>
      </Droparea>
    </div>

    <div v-if="uploading" class="conversation-documents__uploading">
      {{ $t("documents.uploading") }}
    </div>
  </div>
</template>

<script>
import {
  apiUploadDocuments,
  apiGetDocuments,
  apiDownloadDocument,
  apiDeleteDocument,
} from "@/api/conversation.js"

import {
  DOCUMENT_MIME_ICON_MAP,
  ACCEPTED_DOCUMENT_MIMETYPES,
} from "@/const/documentMimeTypes.js"
import { formatFileSize } from "@/tools/formatFileSize.js"
import { downloadBlob } from "@/tools/downloadBlob.js"

import Droparea from "@/components/molecules/Droparea.vue"

export default {
  name: "ConversationDocuments",
  components: {
    Droparea,
  },
  props: {
    conversationId: {
      type: String,
      required: true,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      documents: [],
      loading: false,
      uploading: false,
      downloadingId: null,
      deletingId: null,
      acceptedMimeTypes: ACCEPTED_DOCUMENT_MIMETYPES,
    }
  },
  watch: {
    conversationId: {
      immediate: true,
      handler(id) {
        if (id) this.fetchDocuments()
      },
    },
  },
  methods: {
    formatFileSize,
    mimeIcon(mimetype) {
      return DOCUMENT_MIME_ICON_MAP[mimetype] || "file"
    },
    async fetchDocuments() {
      this.loading = true
      const res = await apiGetDocuments(this.conversationId)
      if (res?.status === "success") {
        this.documents = res.data?.documents || []
      }
      this.loading = false
    },
    async onFilesDropped(files) {
      this.uploading = true
      const res = await apiUploadDocuments(this.conversationId, files, {
        status: "success",
        message: this.$t("documents.upload_success"),
      })
      if (res?.status === "success" && res.data?.documents) {
        this.documents = [...this.documents, ...res.data.documents]
      } else if (res?.status !== "success") {
        this.$store.dispatch(
          "system/showError",
          this.$t("documents.upload_error"),
        )
      }
      this.uploading = false
    },
    onDropError(err) {
      this.$store.dispatch("system/showError", err.msg)
    },
    async download(doc) {
      this.downloadingId = doc.documentId
      const res = await apiDownloadDocument(
        this.conversationId,
        doc.documentId,
      )
      if (res?.status === "success") {
        downloadBlob(res.data, doc.filename)
      }
      this.downloadingId = null
    },
    async remove(doc) {
      this.deletingId = doc.documentId
      const res = await apiDeleteDocument(
        this.conversationId,
        doc.documentId,
        {
          status: "success",
          message: this.$t("documents.delete_success"),
        },
      )
      if (res?.status === "success") {
        this.documents = this.documents.filter(
          (d) => d.documentId !== doc.documentId,
        )
      } else {
        this.$store.dispatch(
          "system/showError",
          this.$t("documents.delete_error"),
        )
      }
      this.deletingId = null
    },
  },
}
</script>

<style lang="scss" scoped>
.conversation-documents__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.conversation-documents__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--neutral-20);
  background: var(--background-primary);
}

.conversation-documents__item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.conversation-documents__item-name {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-documents__item-size {
  font-size: 0.75rem;
  color: var(--dark-70);
}

.conversation-documents__item-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.conversation-documents__empty {
  font-size: 0.85rem;
  color: var(--dark-70);
  padding: 8px 0;
}

.conversation-documents__upload {
  margin-top: 8px;
}

.conversation-documents__uploading {
  font-size: 0.85rem;
  color: var(--dark-70);
  padding: 4px 0;
}
</style>

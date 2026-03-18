<template>
  <Modal
    :title="$t('speaker_diarization.upload_modal_title')"
    v-model="isOpen"
    :textActionApply="$t('speaker_diarization.upload_save')"
    :disabledActionApply="uploadedFiles.length === 0 || submitting"
    :loading="submitting"
    size="md"
    @submit="submitUpload">
    <div class="voice-upload">
      <div v-if="uploadedFiles.length > 0" class="voice-upload__file-list">
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="voice-upload__file-item">
          <div class="voice-upload__file-info">
            <ph-icon name="file-audio" />
            <span>{{ file.file.name }}</span>
            <span v-if="file.duration" class="voice-upload__file-duration">
              {{ formatAudioDuration(file.duration) }}
            </span>
            <Button
              variant="tertiary"
              icon="x"
              iconWeight="regular"
              @click="removeFile(index)" />
          </div>
          <audio :src="file.url" controls class="voice-upload__audio"></audio>
        </div>
      </div>

      <Droparea
        :accepts="['audio/*']"
        :multiple="true"
        @drop="handleDropareaFiles"
        @error="handleDropareaError">
        <ph-icon name="file-audio" size="xl" />
        <p>{{ $t("speaker_diarization.drop_or_browse") }}</p>
      </Droparea>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"
import Droparea from "@/components/molecules/Droparea.vue"
import { apiCreateVoiceSignature } from "@/api/voiceSignature.js"
import { formatCompactDuration } from "@/tools/formatDuration.js"
import { audioDuration } from "@/tools/audioDuration.js"

export default {
  name: "VoiceSignatureUploadModal",
  components: { Modal, Button, Droparea },
  props: {
    value: { type: Boolean, required: true },
    organizationId: { type: String, required: true },
    collectionId: { type: String, required: true },
    labelId: { type: String, required: true },
  },
  data() {
    return {
      uploadedFiles: [],
      submitting: false,
    }
  },
  computed: {
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
        if (!value) this.resetAll()
      },
    },
  },
  methods: {
    formatAudioDuration: formatCompactDuration,
    async handleDropareaFiles(files) {
      await Promise.all(Array.from(files).map((file) => this.addFile(file)))
    },
    handleDropareaError(err) {
      this.$store.dispatch("system/addNotification", {
        message: err.msg,
        type: "error",
        timeout: 5000,
      })
    },
    async addFile(file) {
      const url = URL.createObjectURL(file)
      let duration = null
      try {
        const arrayBuffer = await file.arrayBuffer()
        duration = await audioDuration(arrayBuffer)
      } catch {
        duration = null
      }
      this.uploadedFiles.push({ file, url, duration })
    },
    removeFile(index) {
      const removed = this.uploadedFiles.splice(index, 1)
      if (removed[0]?.url) {
        URL.revokeObjectURL(removed[0].url)
      }
    },
    resetAll() {
      for (const f of this.uploadedFiles) {
        if (f.url) URL.revokeObjectURL(f.url)
      }
      this.uploadedFiles = []
    },
    async submitUpload() {
      this.submitting = true
      try {
        const results = await Promise.allSettled(
          this.uploadedFiles.map((entry) => {
            const duration = entry.duration
              ? Math.round(entry.duration)
              : undefined
            return apiCreateVoiceSignature(
              this.organizationId,
              this.collectionId,
              this.labelId,
              entry.file,
              duration,
            )
          }),
        )
        const successCount = results.filter(
          (r) => r.status === "fulfilled",
        ).length

        if (successCount > 0) {
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.upload_success", {
              count: successCount,
            }),
            type: "success",
            timeout: 5000,
          })
          this.resetAll()
          this.$emit("created")
          this.$emit("input", false)
        } else {
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.upload_error"),
            type: "error",
            timeout: 5000,
          })
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message:
            err.message || this.$t("speaker_diarization.upload_error"),
          type: "error",
          timeout: 5000,
        })
      } finally {
        this.submitting = false
      }
    },
  },
  beforeDestroy() {
    this.resetAll()
  },
}
</script>

<style lang="scss" scoped>
.voice-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__file-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__file-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
  }

  &__file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    color: var(--text-primary);
  }

  &__file-duration {
    color: var(--text-secondary);
    font-size: 13px;
    margin-left: auto;
  }

  &__audio {
    width: 100%;
  }
}
</style>

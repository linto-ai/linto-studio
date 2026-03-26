<template>
  <div class="voice-optin">
    <h3>{{ $t("speaker_diarization.optin_title") }}</h3>

    <p class="voice-optin__description">
      {{ $t("speaker_diarization.optin_description") }}
    </p>

    <div class="voice-optin__data-info">
      <p class="voice-optin__data-info-title">
        {{ $t("speaker_diarization.optin_data_stored_title") }}
      </p>
      <ul>
        <li
          v-for="(item, i) in $t('speaker_diarization.optin_data_stored_items')"
          :key="i">
          {{ item }}
        </li>
      </ul>
      <p class="voice-optin__data-info-notice">
        {{ $t("speaker_diarization.optin_data_deleted_notice") }}
      </p>
    </div>

    <div v-if="loading" class="voice-optin__loading">
      {{ $t("speaker_diarization.loading") }}
    </div>

    <template v-else>
      <!-- Voice samples section -->
      <div class="voice-optin__recordings">
        <div class="flex row gap-medium align-center">
          <h4 class="flex1">
            {{ $t("speaker_diarization.my_recordings") }}
          </h4>
          <Button
            v-if="hasSamples"
            icon="trash"
            variant="secondary"
            intent="destructive"
            size="sm"
            :label="$t('speaker_diarization.delete_all_signatures')"
            @click="showDeleteAllModal = true" />
          <Button
            @click="showRecordModal = true"
            size="sm"
            variant="primary"
            icon="microphone"
            :label="$t('speaker_diarization.record_voice')" />
        </div>

        <div
          v-if="!hasSamples"
          class="voice-optin__empty">
          <p>{{ $t("speaker_diarization.optin_no_samples") }}</p>
        </div>

        <div v-else class="voice-optin__sig-list">
          <div
            v-for="(sig, index) in signatures"
            :key="sig._id"
            class="voice-optin__sig-item">
            <span>{{ $t("speaker_diarization.signature_number", { n: index + 1 }) }}</span>
            <span class="voice-optin__sig-duration">{{
              formatAudioDuration(sig.audioDuration)
            }}</span>
            <span class="voice-optin__sig-date">{{
              formatDate(sig.created)
            }}</span>
            <div class="flex gap-small">
              <Button
                :icon="
                  playingId === sig._id ? 'stop-circle' : 'play-circle'
                "
                variant="tertiary"
                iconWeight="regular"
                @click="toggleAudio(sig)" />
              <Button
                icon="trash"
                variant="secondary"
                intent="destructive"
                iconWeight="regular"
                @click="confirmDelete(sig)" />
            </div>
          </div>
        </div>

        <audio
          ref="audioPlayer"
          class="voice-optin__hidden-audio"
          @ended="onAudioEnded"></audio>
      </div>

      <!-- Voiceprint section -->
      <div class="voice-optin__voiceprint">
        <h4>{{ $t("speaker_diarization.voiceprint_status_title") }}</h4>
        <p class="voice-optin__voiceprint-desc">
          {{ $t("speaker_diarization.voiceprint_status_desc") }}
        </p>

        <div v-if="voiceprintStatus.hasVoiceprint" class="voice-optin__voiceprint-status voice-optin__voiceprint-status--ok">
          <ph-icon name="check-circle" class="voice-optin__status-ok" size="md" />
          <div>
            <span class="voice-optin__voiceprint-label">
              {{ $t("speaker_diarization.voiceprint_computed") }}
            </span>
            <span v-if="voiceprintStatus.lastUpdate" class="voice-optin__voiceprint-hint">
              {{ $t("speaker_diarization.voiceprint_last_update", { date: formatDate(voiceprintStatus.lastUpdate) }) }}
            </span>
          </div>
        </div>

        <!-- Storage mode preference -->
        <div class="voice-optin__storage-mode">
          <div class="voice-optin__storage-toggle">
            <div>
              <span class="voice-optin__storage-label">
                {{ $t("speaker_diarization.voiceprint_storage_mode_embeddings") }}
              </span>
              <span class="voice-optin__storage-desc">
                {{ $t("speaker_diarization.voiceprint_storage_mode_embeddings_desc") }}
              </span>
            </div>
            <SwitchInput
              :value="isStorageModeEmbeddings"
              id="storage-mode-toggle"
              @input="onStorageModeToggle" />
          </div>
          <p
            v-if="isStorageModeEmbeddings && !voiceprintStatus.hasVoiceprint && hasSamples"
            class="voice-optin__storage-pending">
            <ph-icon name="clock" size="sm" />
            {{ $t("speaker_diarization.voiceprint_not_computed_desc") }}
          </p>
          <p
            v-if="isStorageModeEmbeddings"
            class="voice-optin__storage-warning">
            <ph-icon name="warning" size="sm" />
            {{ $t("speaker_diarization.voiceprint_storage_mode_warning") }}
          </p>
        </div>
      </div>

      <!-- Authorized organizations section -->
      <div class="voice-optin__orgs">
        <h4>{{ $t("speaker_diarization.optin_orgs_title") }}</h4>
        <p class="voice-optin__orgs-desc">
          {{ $t("speaker_diarization.optin_orgs_description") }}
        </p>

        <div v-if="!hasSamples" class="voice-optin__orgs-disabled">
          <ph-icon name="info" size="sm" />
          <span>{{ $t("speaker_diarization.optin_orgs_no_samples") }}</span>
        </div>

        <div v-else-if="organizations.length === 0" class="voice-optin__orgs-disabled">
          <ph-icon name="info" size="sm" />
          <span>{{ $t("speaker_diarization.optin_orgs_empty") }}</span>
        </div>

        <table v-else class="voice-optin__orgs-table">
          <thead>
            <tr>
              <th>{{ $t("speaker_diarization.optin_orgs_col_name") }}</th>
              <th style="width: 100px; text-align: center">{{ $t("speaker_diarization.optin_orgs_col_status") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="org in organizations" :key="org.organizationId">
              <td>{{ org.organizationName }}</td>
              <td class="voice-optin__orgs-switch-cell">
                <SwitchInput
                  :value="org.voiceprintEnabled"
                  :disabled="togglingOrgId === org.organizationId"
                  :id="'org-voice-' + org.organizationId"
                  @input="toggleOrg(org, $event)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Record modal -->
      <Modal
        v-model="showRecordModal"
        :title="$t('speaker_diarization.record_modal_title')"
        :textActionApply="$t('speaker_diarization.upload_save')"
        :disabledActionApply="!hasAudio || submitting"
        :loading="submitting"
        size="md"
        @submit="submitRecording">
        <div class="voice-optin__record">
          <Tabs
            :tabs="modeTabs"
            v-model="mode"
            variant="inline"
            :disabled="recording"
            @input="switchMode" />

          <!-- Record mode -->
          <template v-if="mode === 'record'">
            <div class="voice-optin__text-prompt">
              <label>{{
                $t("speaker_diarization.text_to_read_label")
              }}</label>
              <div class="voice-optin__text-to-read">
                <p>{{ promptText }}</p>
              </div>
              <button
                class="voice-optin__refresh-btn"
                @click="shufflePrompt">
                <ph-icon name="arrows-clockwise" size="sm" />
                {{ $t("speaker_diarization.change_text") }}
              </button>
            </div>

            <div class="voice-optin__controls">
              <div class="voice-optin__status">
                <span
                  v-if="recording"
                  class="voice-optin__recording-indicator"></span>
                <span v-if="recording">{{
                  $t("speaker_diarization.recording")
                }}</span>
                <span v-else-if="audioBlob">{{
                  $t("speaker_diarization.recording_complete")
                }}</span>
                <span
                  v-if="recording || audioBlob"
                  class="voice-optin__timer"
                  >{{ formattedTime }}</span
                >
              </div>

              <div class="voice-optin__buttons">
                <Button
                  v-if="!recording && !audioBlob"
                  @click="startRecording"
                  variant="primary"
                  size="sm"
                  icon="microphone"
                  :label="$t('speaker_diarization.start_recording')" />

                <Button
                  v-if="recording"
                  @click="stopRecording"
                  variant="secondary"
                  intent="destructive"
                  size="sm"
                  icon="stop"
                  :label="$t('speaker_diarization.stop_recording')" />

                <template v-if="audioBlob && !recording">
                  <audio
                    ref="recordPreview"
                    :src="audioUrl"
                    controls></audio>
                  <Button
                    @click="resetAudio"
                    variant="secondary"
                    size="sm"
                    icon="arrow-counter-clockwise"
                    :label="$t('speaker_diarization.re_record')" />
                </template>
              </div>
            </div>
          </template>

          <!-- Upload mode -->
          <template v-if="mode === 'upload'">
            <div v-if="uploadedFile" class="voice-optin__uploaded">
              <div class="voice-optin__file-info">
                <ph-icon name="file-audio" />
                <span>{{ uploadedFile.name }}</span>
                <Button
                  variant="tertiary"
                  icon="x"
                  iconWeight="regular"
                  @click="resetAudio" />
              </div>
              <audio
                ref="uploadAudioPlayer"
                :src="audioUrl"
                controls></audio>
            </div>
            <Droparea
              v-else
              :accepts="['audio/*']"
              @drop="handleDropareaFiles"
              @error="handleDropareaError">
              <ph-icon name="file-audio" size="xl" />
              <p>{{ $t("speaker_diarization.drop_or_browse") }}</p>
            </Droparea>
          </template>
        </div>
      </Modal>

      <!-- Delete confirmation -->
      <Modal
        v-model="showDeleteModal"
        :title="$t('speaker_diarization.delete_signature_title')"
        @submit="deleteSignature">
        <p>{{ $t("speaker_diarization.delete_signature_confirm") }}</p>
      </Modal>

      <Modal
        v-model="showDeleteAllModal"
        :title="$t('speaker_diarization.delete_all_signatures_title')"
        @submit="deleteAllSignatures">
        <p>{{ $t("speaker_diarization.delete_all_signatures_confirm") }}</p>
      </Modal>
    </template>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import SwitchInput from "@/components/atoms/SwitchInput.vue"
import Modal from "@/components/molecules/Modal.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import Droparea from "@/components/molecules/Droparea.vue"
import { formatDateOrDash } from "@/tools/formatDate.js"
import { STORAGE_MODE } from "@/tools/voiceprintConstants.js"
import {
  apiGetUserVoiceSamples,
  apiCreateUserVoiceSample,
  apiGetUserVoiceSampleAudio,
  apiDeleteUserVoiceSample,
  apiDeleteAllUserVoiceSamples,
  apiGetUserVoiceOrganizations,
  apiUpdateVoiceOrganization,
  apiGetVoiceprintStatus,
  apiUpdateStorageMode,
} from "@/api/userVoice.js"
import { formatDuration, formatCompactDuration } from "@/tools/formatDuration.js"
import { audioDuration } from "@/tools/audioDuration.js"
import {
  getExtensionForMimeType,
  getSupportedRecordingMimeType,
} from "@/tools/audioMimeTypes.js"
import { voiceSignaturePlaybackMixin } from "@/mixins/voiceSignaturePlayback.js"

function defaultVoiceprintStatus() {
  return { hasVoiceprint: false, storageMode: STORAGE_MODE.AUDIO, audioSamplesCount: 0, lastUpdate: null }
}

export default {
  name: "UserSettingsVoiceOptIn",
  components: { Button, SwitchInput, Modal, Tabs, Droparea },
  mixins: [voiceSignaturePlaybackMixin],
  props: {},
  data() {
    return {
      loading: false,
      signatures: [],
      organizations: [],
      voiceprintStatus: defaultVoiceprintStatus(),
      togglingOrgId: null,
      showRecordModal: false,
      showDeleteAllModal: false,
      // Recording state
      mode: "record",
      recording: false,
      audioBlob: null,
      audioUrl: null,
      uploadedFile: null,
      mediaRecorder: null,
      activeStream: null,
      audioChunks: [],
      submitting: false,
      promptIndex: 0,
      recordingTime: 0,
      recordingTimer: null,
      uploadDuration: null,
    }
  },
  computed: {
    hasSamples() {
      return this.signatures.length > 0
    },
    modeTabs() {
      return [
        {
          name: "record",
          label: this.$t("speaker_diarization.tab_record"),
          icon: "microphone",
        },
        {
          name: "upload",
          label: this.$t("speaker_diarization.tab_upload"),
          icon: "upload-simple",
        },
      ]
    },
    hasAudio() {
      return !!(this.audioBlob || this.uploadedFile)
    },
    promptTexts() {
      return this.$t("speaker_diarization.prompt_texts")
    },
    promptText() {
      const texts = this.promptTexts
      return Array.isArray(texts) ? texts[this.promptIndex] || texts[0] : ""
    },
    formattedTime() {
      return formatDuration(this.recordingTime, { compact: true }) || "00:00"
    },
    isStorageModeEmbeddings() {
      return this.voiceprintStatus.storageMode === STORAGE_MODE.EMBEDDINGS
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const [samples, orgs, vpStatus] = await Promise.all([
          apiGetUserVoiceSamples(),
          apiGetUserVoiceOrganizations(),
          apiGetVoiceprintStatus(),
        ])
        this.signatures = samples
        this.organizations = orgs
        if (vpStatus) {
          Object.assign(this.voiceprintStatus, vpStatus)
        }
      } catch (err) {
        // silent
      } finally {
        this.loading = false
      }
    },
    async deleteAllSignatures() {
      try {
        await apiDeleteAllUserVoiceSamples()
        this.signatures = []
        this.organizations.forEach((o) => { o.voiceprintEnabled = false })
        Object.assign(this.voiceprintStatus, defaultVoiceprintStatus(), {
          storageMode: this.voiceprintStatus.storageMode,
        })
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.optout_success"),
          type: "success",
          timeout: 5000,
        })
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: err.message || this.$t("speaker_diarization.optin_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    async onStorageModeToggle(enabled) {
      const newMode = enabled ? STORAGE_MODE.EMBEDDINGS : STORAGE_MODE.AUDIO
      const previous = this.voiceprintStatus.storageMode
      this.voiceprintStatus.storageMode = newMode
      try {
        await apiUpdateStorageMode(newMode)
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.voiceprint_storage_mode_updated"),
          type: "success",
          timeout: 5000,
        })
      } catch (err) {
        this.voiceprintStatus.storageMode = previous
        this.$store.dispatch("system/addNotification", {
          message: err.message || this.$t("speaker_diarization.optin_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    async toggleOrg(org, enabled) {
      if (this.togglingOrgId) return
      this.togglingOrgId = org.organizationId
      const previous = org.voiceprintEnabled
      org.voiceprintEnabled = enabled
      try {
        await apiUpdateVoiceOrganization(org.organizationId, enabled)
      } catch (err) {
        org.voiceprintEnabled = previous
        this.$store.dispatch("system/addNotification", {
          message: err.message || this.$t("speaker_diarization.optin_error"),
          type: "error",
          timeout: 5000,
        })
      } finally {
        this.togglingOrgId = null
      }
    },
    formatDate: formatDateOrDash,
    formatAudioDuration: formatCompactDuration,

    // Mixin contract: provide fetchAudioBlob and deleteSignatureApi
    fetchAudioBlob(signatureId) {
      return apiGetUserVoiceSampleAudio(signatureId)
    },
    deleteSignatureApi(signatureId) {
      return apiDeleteUserVoiceSample(signatureId)
    },
    // Override mixin: update state when a signature is deleted
    async deleteSignature() {
      if (!this.deletingSignature) return
      try {
        const res = await this.deleteSignatureApi(this.deletingSignature._id)
        if (res.status === "success") {
          this.signatures = this.signatures.filter(
            (s) => s._id !== this.deletingSignature._id,
          )
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.signature_deleted_success"),
            type: "success",
            timeout: 5000,
          })
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.signature_deleted_error"),
          type: "error",
          timeout: 5000,
        })
      }
      this.deletingSignature = null
      this.showDeleteModal = false
    },

    // --- Recording ---
    switchMode() {
      if (this.recording) return
      this.resetAudio()
    },
    shufflePrompt() {
      const texts = this.promptTexts
      if (!Array.isArray(texts) || texts.length <= 1) return
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * texts.length)
      } while (newIndex === this.promptIndex)
      this.promptIndex = newIndex
    },
    async startRecording() {
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.activeStream = stream
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: getSupportedRecordingMimeType(),
        })
        this.audioChunks = []

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) this.audioChunks.push(event.data)
        }

        this.mediaRecorder.onstop = () => {
          const mimeType = this.mediaRecorder.mimeType
          this.audioBlob = new Blob(this.audioChunks, { type: mimeType })
          this.audioUrl = URL.createObjectURL(this.audioBlob)
          this.releaseStream()
        }

        this.mediaRecorder.start()
        this.recording = true
        this.recordingTime = 0
        this.recordingTimer = setInterval(() => {
          this.recordingTime++
        }, 1000)
      } catch (err) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
          this.activeStream = null
        }
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.microphone_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    releaseStream() {
      if (this.activeStream) {
        this.activeStream.getTracks().forEach((track) => track.stop())
        this.activeStream = null
      }
    },
    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.stop()
      }
      this.recording = false
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer)
        this.recordingTimer = null
      }
    },
    handleDropareaFiles(files) {
      if (files.length > 0) this.setUploadedFile(files[0])
    },
    handleDropareaError(err) {
      this.$store.dispatch("system/addNotification", {
        message: err.msg,
        type: "error",
        timeout: 5000,
      })
    },
    async setUploadedFile(file) {
      this.resetAudio()
      this.uploadedFile = file
      this.audioUrl = URL.createObjectURL(file)
      try {
        const arrayBuffer = await file.arrayBuffer()
        this.uploadDuration = await audioDuration(arrayBuffer)
      } catch {
        this.uploadDuration = null
      }
    },
    resetAudio() {
      this.stopRecording()
      this.releaseStream()
      if (this.audioUrl) URL.revokeObjectURL(this.audioUrl)
      this.audioBlob = null
      this.audioUrl = null
      this.audioChunks = []
      this.uploadedFile = null
      this.uploadDuration = null
      this.recordingTime = 0
    },
    resetRecordModal() {
      this.resetAudio()
      this.mode = "record"
    },
    async submitRecording() {
      let audioFile
      let duration

      if (this.mode === "upload" && this.uploadedFile) {
        audioFile = this.uploadedFile
        duration = this.uploadDuration
          ? Math.round(this.uploadDuration)
          : undefined
      } else if (this.mode === "record" && this.audioBlob) {
        const extension = getExtensionForMimeType(this.audioBlob.type)
        audioFile = new File(
          [this.audioBlob],
          `voice-sample.${extension}`,
          { type: this.audioBlob.type },
        )
        duration = this.recordingTime
      } else {
        return
      }

      this.submitting = true
      try {
        await apiCreateUserVoiceSample(audioFile, duration)

        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.upload_success", { count: 1 }),
          type: "success",
          timeout: 5000,
        })

        this.resetRecordModal()
        this.showRecordModal = false
        this.signatures = await apiGetUserVoiceSamples()
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
    // stopAudio() is called by the mixin's beforeDestroy
    this.resetAudio()
  },
}
</script>

<style lang="scss" scoped>
.voice-optin {
  margin-top: 1.5rem;

  &__description {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0 0 1rem;
  }

  &__data-info {
    background: var(--neutral-10);
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    font-size: 13px;
    color: var(--text-secondary);

    ul {
      margin: 0.25rem 0 0.5rem;
      padding-left: 1.25rem;

      li {
        margin-bottom: 0.15rem;
      }
    }
  }

  &__data-info-title {
    font-weight: 600;
    margin: 0 0 0.25rem;
    color: var(--text-primary);
  }

  &__data-info-notice {
    margin: 0;
    font-style: italic;
  }

  &__loading {
    text-align: center;
    padding: 1rem;
    color: var(--text-secondary);
  }

  &__recordings {
    margin-top: 1rem;

    h4 {
      margin: 0;
      font-size: 14px;
    }
  }

  &__empty {
    text-align: center;
    padding: 1rem;
    color: var(--text-secondary);
    font-size: 14px;

    p {
      margin: 0;
    }
  }

  &__sig-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  &__sig-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
    font-size: 14px;
  }

  &__sig-duration,
  &__sig-date {
    color: var(--text-secondary);
    font-size: 13px;
  }

  &__sig-date {
    margin-left: auto;
  }

  &__hidden-audio {
    display: none;
  }

  // Voiceprint status section
  &__voiceprint {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--neutral-20);

    h4 {
      margin: 0 0 0.75rem;
      font-size: 14px;
    }
  }

  &__voiceprint-status {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
    margin-bottom: 0.75rem;

    &--ok {
      background: var(--green-soft, #e8f5e9);
      border-color: var(--green-chart, #4caf50);
    }
  }

  &__voiceprint-desc {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 0.75rem;
  }

  &__voiceprint-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
  }

  &__voiceprint-hint {
    display: block;
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 0.15rem;
  }

  &__status-ok {
    color: var(--green-chart, #4caf50);
  }

  &__storage-mode {
    margin-top: 0.75rem;
  }

  &__storage-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem;
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
  }

  &__storage-label {
    font-weight: 500;
    font-size: 14px;
    display: block;
  }

  &__storage-desc {
    font-size: 12px;
    color: var(--text-secondary);
    display: block;
    margin-top: 0.15rem;
  }

  &__storage-pending {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    margin: 0.5rem 0 0;
    background: var(--primary-soft, #e3f2fd);
    border: 1px solid var(--primary-hard, #1976d2);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text-primary);
  }

  &__storage-warning {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    margin: 0.5rem 0 0;
    background: var(--orange-soft, #fff3e0);
    border: 1px solid var(--orange-chart, #ff9800);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text-primary);
  }

  // Organizations section
  &__orgs {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--neutral-20);

    h4 {
      margin: 0 0 0.25rem;
      font-size: 14px;
    }
  }

  &__orgs-desc {
    color: var(--text-secondary);
    font-size: 13px;
    margin: 0 0 0.75rem;
  }

  &__orgs-disabled {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--neutral-10);
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-secondary);
  }

  &__orgs-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    th,
    td {
      padding: 0.6rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--neutral-20);
      vertical-align: middle;
    }

    th {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      padding: 0.4rem 0.75rem;
    }

    td {
      font-size: 14px;
    }

    tbody tr:hover {
      background: var(--neutral-10);
    }
  }

  &__orgs-switch-cell {
    text-align: center;
    display: flex;
    justify-content: center;
  }

  // Record modal styles
  &__record {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__text-prompt {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      font-size: 14px;
    }
  }

  &__text-to-read {
    background: var(--neutral-10);
    border: 1px solid var(--neutral-20);
    border-radius: 8px;
    padding: 1rem;
    font-size: 16px;
    line-height: 1.6;
    color: var(--text-primary);
    font-style: italic;
  }

  &__refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: var(--primary-hard);
    cursor: pointer;
    font-size: 13px;
    padding: 0;
    align-self: flex-start;

    &:hover {
      text-decoration: underline;
    }
  }

  &__controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  &__status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    color: var(--text-secondary);
  }

  &__recording-indicator {
    width: 10px;
    height: 10px;
    background: var(--red-chart);
    border-radius: 50%;
    animation: pulse 1s infinite;
  }

  &__timer {
    font-family: monospace;
    font-size: 14px;
    color: var(--text-primary);
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;

    audio {
      width: 100%;
    }
  }

  &__uploaded {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    audio {
      width: 100%;
    }
  }

  &__file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    color: var(--text-primary);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>

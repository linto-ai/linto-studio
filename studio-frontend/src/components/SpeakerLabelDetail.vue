<template>
  <div>
    <div class="flex row gap-medium align-center">
      <button class="label-detail__back" @click="$emit('back')">
        <ph-icon name="arrow-left" size="md" />
        {{ $t("speaker_diarization.back_to_labels") }}
      </button>
    </div>

    <div v-if="loading" class="label-detail__loading">
      {{ $t("speaker_diarization.loading") }}
    </div>

    <template v-else-if="displayName">
      <div class="flex row gap-medium align-center" style="margin-top: 1rem">
        <h2 class="flex1">
          <span v-if="readOnly || !editingName">{{ displayName }}</span>
          <input
            v-else
            v-model="editName"
            type="text"
            class="label-detail__edit-input"
            @keyup.enter="saveName"
            @keyup.escape="cancelEditName" />
        </h2>
        <template v-if="!readOnly">
          <Button
            v-if="!editingName"
            icon="pencil-simple"
            variant="tertiary"
            iconWeight="regular"
            @click="startEditName" />
          <template v-else>
            <Button
              icon="check"
              variant="tertiary"
              iconWeight="regular"
              @click="saveName" />
            <Button
              icon="x"
              variant="secondary"
              iconWeight="regular"
              @click="cancelEditName" />
          </template>
          <Button
            @click="showUploadModal = true"
            size="sm"
            variant="primary"
            icon="upload-simple"
            :label="$t('speaker_diarization.upload_audio')" />
        </template>
      </div>

      <div class="label-detail__summary">
        <span>
          {{ $t("speaker_diarization.signatures_count") }}:
          {{ signatures.length }}
        </span>
        <span>
          {{ $t("speaker_diarization.total_duration") }}:
          {{ formatAudioDuration(totalDuration) }}
        </span>
      </div>

      <div v-if="!readOnly" class="label-detail__recommendation">
        <ph-icon name="info" size="sm" />
        <span>{{ $t("speaker_diarization.audio_recommendation") }}</span>
      </div>

      <div v-if="signatures.length === 0" class="label-detail__empty">
        <ph-icon name="waveform" size="xl" />
        <p>{{ $t("speaker_diarization.signatures_empty") }}</p>
      </div>

      <table v-else class="label-detail__table">
        <thead>
          <tr>
            <th style="width: 30%">
              {{ $t("speaker_diarization.audio_file") }}
            </th>
            <th style="width: 20%">
              {{ $t("speaker_diarization.duration") }}
            </th>
            <th style="width: 30%">
              {{ $t("speaker_diarization.created_at") }}
            </th>
            <th style="width: 20%">
              {{ $t("speaker_diarization.actions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sig, index) in signatures" :key="sig._id">
            <td>{{ $t("speaker_diarization.signature_number", { n: index + 1 }) }}</td>
            <td>{{ formatAudioDuration(sig.audioDuration) }}</td>
            <td>{{ formatDate(sig.created) }}</td>
            <td>
              <div class="flex gap-small">
                <Button
                  :icon="
                    playingId === sig._id ? 'stop-circle' : 'play-circle'
                  "
                  variant="tertiary"
                  iconWeight="regular"
                  @click="toggleAudio(sig)" />
                <Button
                  v-if="!readOnly"
                  icon="trash"
                  variant="secondary"
                  intent="destructive"
                  iconWeight="regular"
                  @click="confirmDelete(sig)" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <audio
        ref="audioPlayer"
        class="label-detail__hidden-audio"
        @ended="onAudioEnded"></audio>

      <VoiceSignatureUploadModal
        v-if="!readOnly"
        v-model="showUploadModal"
        :organizationId="organizationId"
        :collectionId="collectionId"
        :labelId="labelId"
        @created="fetchData" />

      <Modal
        v-if="!readOnly"
        v-model="showDeleteModal"
        :title="$t('speaker_diarization.delete_signature_title')"
        @submit="deleteSignature">
        <p>{{ $t("speaker_diarization.delete_signature_confirm") }}</p>
      </Modal>
    </template>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import Modal from "@/components/molecules/Modal.vue"
import VoiceSignatureUploadModal from "@/components/VoiceSignatureUploadModal.vue"
import {
  apiGetVoiceSignatures,
  apiGetVoiceSignatureAudio,
  apiDeleteVoiceSignature,
} from "@/api/voiceSignature.js"
import {
  apiGetOptedInMemberSignatures,
  apiGetOptedInMemberSignatureAudio,
} from "@/api/speakerLabelCollection.js"
import { apiGetSpeakerLabel, apiUpdateSpeakerLabel } from "@/api/speakerLabel.js"
import { formatDateOrDash } from "@/tools/formatDate.js"
import { formatCompactDuration } from "@/tools/formatDuration.js"
import { voiceSignaturePlaybackMixin } from "@/mixins/voiceSignaturePlayback.js"

export default {
  name: "SpeakerLabelDetail",
  components: { Button, Modal, VoiceSignatureUploadModal },
  mixins: [voiceSignaturePlaybackMixin],
  props: {
    organizationId: { type: String, required: true },
    collectionId: { type: String, required: true },
    // For custom collections: label ID
    labelId: { type: String, default: null },
    // For org collections: member info (read-only mode)
    memberId: { type: String, default: null },
    memberName: { type: String, default: "" },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      label: null,
      signatures: [],
      loading: false,
      showUploadModal: false,
      editingName: false,
      editName: "",
    }
  },
  computed: {
    displayName() {
      if (this.readOnly) return this.memberName
      return this.label?.name
    },
    totalDuration() {
      return this.signatures.reduce(
        (sum, s) => sum + (s.audioDuration || 0),
        0,
      )
    },
  },
  watch: {
    labelId() {
      this.label = null
      this.signatures = []
      this.fetchData()
    },
    memberId() {
      this.label = null
      this.signatures = []
      this.fetchData()
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        if (this.readOnly) {
          this.signatures = await apiGetOptedInMemberSignatures(
            this.organizationId,
            this.collectionId,
            this.memberId,
          )
        } else {
          const [label, signatures] = await Promise.all([
            apiGetSpeakerLabel(
              this.organizationId,
              this.collectionId,
              this.labelId,
            ),
            apiGetVoiceSignatures(
              this.organizationId,
              this.collectionId,
              this.labelId,
            ),
          ])
          this.label = label
          this.signatures = signatures
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.fetch_error"),
          type: "error",
          timeout: 5000,
        })
      } finally {
        this.loading = false
      }
    },
    formatDate: formatDateOrDash,
    formatAudioDuration: formatCompactDuration,
    // Mixin contract: provide fetchAudioBlob and deleteSignatureApi
    fetchAudioBlob(signatureId) {
      if (this.readOnly) {
        return apiGetOptedInMemberSignatureAudio(
          this.organizationId,
          this.collectionId,
          this.memberId,
          signatureId,
        )
      }
      return apiGetVoiceSignatureAudio(
        this.organizationId,
        this.collectionId,
        this.labelId,
        signatureId,
      )
    },
    deleteSignatureApi(signatureId) {
      if (this.readOnly) return Promise.resolve({ status: "error" })
      return apiDeleteVoiceSignature(
        this.organizationId,
        this.collectionId,
        this.labelId,
        signatureId,
      )
    },
    startEditName() {
      this.editingName = true
      this.editName = this.label.name
    },
    cancelEditName() {
      this.editingName = false
      this.editName = ""
    },
    async saveName() {
      if (!this.editName.trim()) return
      try {
        const res = await apiUpdateSpeakerLabel(
          this.organizationId,
          this.collectionId,
          this.labelId,
          { name: this.editName.trim() },
        )
        if (res.status === "success") {
          this.label.name = this.editName.trim()
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.label_updated_success"),
            type: "success",
            timeout: 5000,
          })
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.label_updated_error"),
          type: "error",
          timeout: 5000,
        })
      }
      this.editingName = false
    },
  },
}
</script>

<style lang="scss" scoped>
.label-detail {
  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: var(--primary-hard);
    cursor: pointer;
    font-size: 14px;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }

  &__loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }

  &__summary {
    display: flex;
    gap: 1.5rem;
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0.5rem 0 1rem;
  }

  &__recommendation {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    margin-bottom: 1rem;
    background: var(--blue-soft, #e3f2fd);
    border: 1px solid var(--blue-chart, #2196f3);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-primary);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 3rem;
    color: var(--text-secondary);

    p {
      margin: 0;
      font-size: 14px;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    table-layout: fixed;

    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--neutral-20);
      height: 2.75rem;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    th {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      height: auto;
      padding: 0.4rem 0.75rem;
    }

    td {
      font-size: 14px;
    }

    tbody tr:hover {
      background: var(--neutral-10);
    }
  }

  &__edit-input {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--primary-hard);
    border-radius: 4px;
    font-size: 1em;
    background: var(--background-primary);
    color: var(--text-primary);
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
    }
  }

  &__hidden-audio {
    display: none;
  }
}
</style>

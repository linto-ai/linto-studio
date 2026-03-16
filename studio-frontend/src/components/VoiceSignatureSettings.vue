<template>
  <div>
    <div class="flex row gap-medium align-center">
      <h2 class="flex1">{{ $t("voice_signatures.title") }}</h2>
      <Button
        @click="showRecordModal = true"
        size="sm"
        variant="primary"
        icon="microphone"
        :label="$t('voice_signatures.add_signature')" />
    </div>

    <p class="voice-signatures__description">
      {{ $t("voice_signatures.description") }}
    </p>

    <div v-if="loading" class="voice-signatures__loading">
      {{ $t("voice_signatures.loading") }}
    </div>

    <div
      v-else-if="signatures.length === 0"
      class="voice-signatures__empty">
      <ph-icon name="microphone-slash" size="xl" />
      <p>{{ $t("voice_signatures.empty") }}</p>
    </div>

    <table v-else class="voice-signatures__table">
      <thead>
        <tr>
          <th style="width: 40%">{{ $t("voice_signatures.speaker_name") }}</th>
          <th style="width: 15%">{{ $t("voice_signatures.duration") }}</th>
          <th style="width: 25%">{{ $t("voice_signatures.created_at") }}</th>
          <th style="width: 20%">{{ $t("voice_signatures.actions") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="signature in signatures" :key="signature._id">
          <td>
            <span v-if="editingId !== signature._id">{{
              signature.speakerName
            }}</span>
            <input
              v-else
              v-model="editName"
              type="text"
              class="voice-signatures__edit-input"
              @keyup.enter="saveEdit(signature._id)"
              @keyup.escape="cancelEdit" />
          </td>
          <td>{{ formatAudioDuration(signature.audioDuration) }}</td>
          <td>{{ formatDate(signature.created) }}</td>
          <td>
            <div class="flex gap-small">
              <template v-if="editingId !== signature._id">
                <Button
                  :icon="
                    playingId === signature._id
                      ? 'stop-circle'
                      : 'play-circle'
                  "
                  variant="tertiary"
                  iconWeight="regular"
                  @click="toggleAudio(signature)" />
                <Button
                  icon="pencil-simple"
                  variant="tertiary"
                  iconWeight="regular"
                  @click="startEdit(signature)" />
                <Button
                  icon="trash"
                  variant="secondary"
                  intent="destructive"
                  iconWeight="regular"
                  @click="confirmDelete(signature)" />
              </template>
              <template v-else>
                <Button
                  icon="check"
                  variant="tertiary"
                  iconWeight="regular"
                  @click="saveEdit(signature._id)" />
                <Button
                  icon="x"
                  variant="secondary"
                  iconWeight="regular"
                  @click="cancelEdit" />
                <span class="voice-signatures__action-spacer"></span>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <audio
      ref="audioPlayer"
      class="voice-signatures__hidden-audio"
      @ended="onAudioEnded"></audio>

    <VoiceSignatureRecordModal
      v-model="showRecordModal"
      :organizationId="organizationId"
      @created="fetchSignatures" />

    <Modal
      v-model="showDeleteModal"
      :title="$t('voice_signatures.modal_delete.title')"
      @submit="deleteSignature">
      <p v-if="deletingSignature">
        {{
          $t("voice_signatures.modal_delete.content", {
            name: deletingSignature.speakerName,
          })
        }}
      </p>
    </Modal>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import Modal from "@/components/molecules/Modal.vue"
import VoiceSignatureRecordModal from "@/components/VoiceSignatureRecordModal.vue"
import {
  apiGetVoiceSignatures,
  apiUpdateVoiceSignature,
  apiDeleteVoiceSignature,
  apiGetVoiceSignatureAudio,
} from "@/api/voiceSignature.js"
import { formatDuration } from "@/tools/formatDuration.js"

export default {
  name: "VoiceSignatureSettings",
  components: { Button, Modal, VoiceSignatureRecordModal },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      signatures: [],
      loading: false,
      showRecordModal: false,
      showDeleteModal: false,
      deletingSignature: null,
      editingId: null,
      editName: "",
      playingId: null,
    }
  },
  mounted() {
    this.fetchSignatures()
  },
  methods: {
    async fetchSignatures() {
      this.loading = true
      try {
        this.signatures = await apiGetVoiceSignatures(this.organizationId)
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("voice_signatures.fetch_error"),
          type: "error",
          timeout: 5000,
        })
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return date
        ? new Date(date).toLocaleDateString(this.$i18n.locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-"
    },
    formatAudioDuration(seconds) {
      return formatDuration(seconds, { compact: true }) || "-"
    },
    async toggleAudio(signature) {
      // If already playing this signature, stop it
      if (this.playingId === signature._id) {
        this.stopAudio()
        return
      }

      // Stop any currently playing audio
      if (this.playingId) {
        this.stopAudio()
      }

      try {
        const audio = this.$refs.audioPlayer
        const res = await apiGetVoiceSignatureAudio(
          this.organizationId,
          signature._id,
        )
        if (res?.status === "success") {
          if (audio.src) URL.revokeObjectURL(audio.src)
          audio.src = URL.createObjectURL(res.data)
          audio.play()
          this.playingId = signature._id
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("voice_signatures.playback_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    stopAudio() {
      const audio = this.$refs.audioPlayer
      if (audio) {
        audio.pause()
        audio.currentTime = 0
        if (audio.src) {
          URL.revokeObjectURL(audio.src)
          audio.removeAttribute("src")
        }
      }
      this.playingId = null
    },
    onAudioEnded() {
      this.stopAudio()
    },
    startEdit(signature) {
      this.editingId = signature._id
      this.editName = signature.speakerName
    },
    cancelEdit() {
      this.editingId = null
      this.editName = ""
    },
    async saveEdit(signatureId) {
      if (!this.editName.trim()) return

      try {
        const res = await apiUpdateVoiceSignature(
          this.organizationId,
          signatureId,
          { speakerName: this.editName.trim() },
        )

        if (res.status === "success") {
          const idx = this.signatures.findIndex((s) => s._id === signatureId)
          if (idx !== -1) {
            this.$set(this.signatures, idx, {
              ...this.signatures[idx],
              speakerName: this.editName.trim(),
            })
          }
          this.$store.dispatch("system/addNotification", {
            message: this.$t("voice_signatures.updated_success"),
            type: "success",
            timeout: 5000,
          })
          this.cancelEdit()
        } else {
          this.$store.dispatch("system/addNotification", {
            message: res.message || this.$t("voice_signatures.updated_error"),
            type: "error",
            timeout: 5000,
          })
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("voice_signatures.updated_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    confirmDelete(signature) {
      this.deletingSignature = signature
      this.showDeleteModal = true
    },
    async deleteSignature() {
      if (!this.deletingSignature) return

      try {
        const res = await apiDeleteVoiceSignature(
          this.organizationId,
          this.deletingSignature._id,
        )

        if (res.status === "success") {
          this.signatures = this.signatures.filter(
            (s) => s._id !== this.deletingSignature._id,
          )
          this.$store.dispatch("system/addNotification", {
            message: this.$t("voice_signatures.deleted_success"),
            type: "success",
            timeout: 5000,
          })
        } else {
          this.$store.dispatch("system/addNotification", {
            message: this.$t("voice_signatures.deleted_error"),
            type: "error",
            timeout: 5000,
          })
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("voice_signatures.deleted_error"),
          type: "error",
          timeout: 5000,
        })
      }

      this.deletingSignature = null
      this.showDeleteModal = false
    },
  },
  beforeDestroy() {
    this.stopAudio()
  },
}
</script>

<style lang="scss" scoped>
.voice-signatures {
  &__description {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0.5rem 0 1.5rem;
  }

  &__loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
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
    font-size: 14px;
    background: var(--background-primary);
    color: var(--text-primary);
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
    }
  }

  &__action-spacer {
    display: inline-block;
    width: var(--btn-icon-size, 32px);
    height: var(--btn-icon-size, 32px);
  }

  &__hidden-audio {
    display: none;
  }
}
</style>

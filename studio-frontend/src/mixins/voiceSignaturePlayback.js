/**
 * Mixin for audio playback and voice signature deletion.
 * Used by SpeakerLabelDetail and UserSettingsVoiceOptIn.
 *
 * Requirements:
 * - Component must have a <audio ref="audioPlayer" @ended="onAudioEnded"> element
 * - Component must provide a `fetchAudioBlob(signatureId)` method that returns a blob response
 * - Component must provide a `deleteSignatureApi(signatureId)` method that performs the API delete
 * - Component must have `signatures` array in data
 */
export const voiceSignaturePlaybackMixin = {
  data() {
    return {
      playingId: null,
      showDeleteModal: false,
      deletingSignature: null,
    }
  },
  methods: {
    async toggleAudio(sig) {
      if (this.playingId === sig._id) {
        this.stopAudio()
        return
      }
      if (this.playingId) this.stopAudio()
      try {
        const audio = this.$refs.audioPlayer
        const res = await this.fetchAudioBlob(sig._id)
        if (res?.status === "success") {
          if (audio.src) URL.revokeObjectURL(audio.src)
          audio.src = URL.createObjectURL(res.data)
          audio.play()
          this.playingId = sig._id
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.playback_error"),
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
    confirmDelete(sig) {
      this.deletingSignature = sig
      this.showDeleteModal = true
    },
    async deleteSignature() {
      if (!this.deletingSignature) return
      try {
        const res = await this.deleteSignatureApi(this.deletingSignature._id)
        if (res.status === "success") {
          this.signatures = this.signatures.filter(
            (s) => s._id !== this.deletingSignature._id,
          )
          this.$store.dispatch("system/addNotification", {
            message: this.$t(
              "speaker_diarization.signature_deleted_success",
            ),
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
  },
  beforeDestroy() {
    this.stopAudio()
  },
}

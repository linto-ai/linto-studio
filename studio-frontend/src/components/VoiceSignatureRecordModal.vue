<template>
  <Modal
    :title="$t('voice_signatures.modal_record.title')"
    v-model="isOpen"
    :textActionApply="$t('voice_signatures.modal_record.save')"
    :disabledActionApply="!hasAudio || !speakerName || submitting"
    :loading="submitting"
    size="md"
    @submit="submitRecording">
    <div class="voice-record">
      <div class="voice-record__prompt">
        <label>{{ $t("voice_signatures.modal_record.speaker_name") }}</label>
        <input
          type="text"
          v-model="speakerName"
          :placeholder="
            $t('voice_signatures.modal_record.speaker_name_placeholder')
          "
          :disabled="recording"
          class="voice-record__input" />
      </div>

      <Tabs
        :tabs="modeTabs"
        v-model="mode"
        variant="inline"
        :disabled="recording"
        @input="switchMode" />

      <!-- Record mode -->
      <template v-if="mode === 'record'">
        <div class="voice-record__text-prompt">
          <label>{{
            $t("voice_signatures.modal_record.text_to_read_label")
          }}</label>
          <div class="voice-record__text-to-read">
            <p>{{ promptText }}</p>
          </div>
          <button class="voice-record__refresh-btn" @click="shufflePrompt">
            <ph-icon name="arrows-clockwise" size="sm" />
            {{ $t("voice_signatures.modal_record.change_text") }}
          </button>
        </div>

        <div class="voice-record__controls">
          <div class="voice-record__status">
            <span
              v-if="recording"
              class="voice-record__recording-indicator"></span>
            <span v-if="recording">{{
              $t("voice_signatures.modal_record.recording")
            }}</span>
            <span v-else-if="audioBlob">{{
              $t("voice_signatures.modal_record.recording_complete")
            }}</span>
            <span
              v-if="recording || audioBlob"
              class="voice-record__timer"
              >{{ formattedTime }}</span
            >
          </div>

          <div class="voice-record__buttons">
            <Button
              v-if="!recording && !audioBlob"
              @click="startRecording"
              variant="primary"
              size="sm"
              :disabled="!speakerName"
              icon="microphone"
              :label="$t('voice_signatures.modal_record.start_recording')" />

            <Button
              v-if="recording"
              @click="stopRecording"
              variant="secondary"
              intent="destructive"
              size="sm"
              icon="stop"
              :label="$t('voice_signatures.modal_record.stop_recording')" />

            <template v-if="audioBlob && !recording">
              <audio ref="audioPlayer" :src="audioUrl" controls></audio>
              <Button
                @click="resetAudio"
                variant="secondary"
                size="sm"
                icon="arrow-counter-clockwise"
                :label="$t('voice_signatures.modal_record.re_record')" />
            </template>
          </div>
        </div>
      </template>

      <!-- Upload mode -->
      <template v-if="mode === 'upload'">
        <div v-if="uploadedFile" class="voice-record__uploaded">
          <div class="voice-record__file-info">
            <ph-icon name="file-audio" />
            <span>{{ uploadedFile.name }}</span>
            <Button
              variant="tertiary"
              icon="x"
              iconWeight="regular"
              @click="resetAudio" />
          </div>
          <audio ref="uploadAudioPlayer" :src="audioUrl" controls></audio>
        </div>
        <Droparea
          v-else
          :accepts="['audio/*']"
          @drop="handleDropareaFiles"
          @error="handleDropareaError">
          <ph-icon name="file-audio" size="xl" />
          <p>{{ $t("voice_signatures.modal_record.drop_or_browse") }}</p>
        </Droparea>
      </template>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import Droparea from "@/components/molecules/Droparea.vue"
import { apiCreateVoiceSignature } from "@/api/voiceSignature.js"
import { formatDuration } from "@/tools/formatDuration.js"
import { audioDuration } from "@/tools/audioDuration.js"

const MIME_EXTENSION_MAP = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
}

function getExtensionForMimeType(mimeType) {
  for (const [mime, ext] of Object.entries(MIME_EXTENSION_MAP)) {
    if (mimeType.includes(mime)) return ext
  }
  return "webm"
}

export default {
  name: "VoiceSignatureRecordModal",
  components: { Modal, Button, Tabs, Droparea },
  props: {
    value: { type: Boolean, required: true },
    organizationId: { type: String, required: true },
  },
  data() {
    return {
      mode: "record",
      speakerName: "",
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
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
        if (!value) this.resetAll()
      },
    },
    modeTabs() {
      return [
        {
          name: "record",
          label: this.$t("voice_signatures.modal_record.tab_record"),
          icon: "microphone",
        },
        {
          name: "upload",
          label: this.$t("voice_signatures.modal_record.tab_upload"),
          icon: "upload-simple",
        },
      ]
    },
    hasAudio() {
      return !!(this.audioBlob || this.uploadedFile)
    },
    promptTexts() {
      return this.$t("voice_signatures.modal_record.prompt_texts")
    },
    promptText() {
      const texts = this.promptTexts
      return Array.isArray(texts) ? texts[this.promptIndex] || texts[0] : ""
    },
    formattedTime() {
      return formatDuration(this.recordingTime, { compact: true }) || "00:00"
    },
  },
  methods: {
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

    // -- Recording --
    async startRecording() {
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.activeStream = stream
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: this.getSupportedMimeType(),
        })
        this.audioChunks = []

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data)
          }
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
          message: this.$t("voice_signatures.modal_record.microphone_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    getSupportedMimeType() {
      const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ]
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) return type
      }
      return ""
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

    // -- Upload --
    handleDropareaFiles(files) {
      if (files.length > 0) {
        this.setUploadedFile(files[0])
      }
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

    // -- Common --
    resetAudio() {
      this.stopRecording()
      this.releaseStream()
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl)
      }
      this.audioBlob = null
      this.audioUrl = null
      this.audioChunks = []
      this.uploadedFile = null
      this.uploadDuration = null
      this.recordingTime = 0
    },
    resetAll() {
      this.resetAudio()
      this.speakerName = ""
      this.mode = "record"
    },
    async submitRecording() {
      if (!this.speakerName) return

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
          `voice-signature.${extension}`,
          { type: this.audioBlob.type },
        )
        duration = this.recordingTime
      } else {
        return
      }

      this.submitting = true
      try {
        await apiCreateVoiceSignature(
          this.organizationId,
          this.speakerName,
          audioFile,
          duration,
        )

        this.$store.dispatch("system/addNotification", {
          message: this.$t("voice_signatures.created_success"),
          type: "success",
          timeout: 5000,
        })

        this.resetAll()
        this.$emit("created")
        this.$emit("input", false)
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message:
            err.message || this.$t("voice_signatures.created_error"),
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
.voice-record {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &__prompt {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      font-size: 14px;
    }
  }

  &__input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--neutral-40);
    border-radius: 4px;
    font-size: 14px;
    background: var(--background-primary);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--primary-hard);
    }
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

<template>
  <div class="form-field flex col gap-medium">
    <!-- <h3>Uploaded media</h3> -->
    <!-- File list -->
    <ul class="audio-upload-list" v-if="value && value.length > 0">
      <li
        v-for="(field, index) of value"
        :key="field.file.lastModified + field.file.name">
        <!-- TODO: find a real unique key (this one is quite good), cannot be index because of possible deletion -->
        <FormInput :field="field" v-model="field.value" :disabled="disabled">
          <button class="btn black" @click="deleteFile(index, $event)">
            <span class="icon delete"></span>
          </button>
          <button
            class="btn black"
            @click="
              index == indexPlaying ? stopFile($event) : playFile(index, $event)
            ">
            <span
              :class="`icon ${
                index == indexPlaying ? 'pause' : 'play'
              }`"></span>
          </button>
        </FormInput>
      </li>
    </ul>

    <!-- form to add file -->
    <div class="audio-upload-form">
      <div>
        <input
          type="radio"
          id="media-type-file"
          value="file"
          v-model="mediaType"
          :disabled="disabled" />
        <label for="media-type-file">
          {{ $t("conversation.media.file_label") }}
        </label>
        <input
          type="radio"
          id="media-type-mic"
          value="mic"
          v-model="mediaType"
          :disabled="disabled" />
        <label for="media-type-mic">
          {{ $t("conversation.media.microphone_label") }}
        </label>
      </div>

      <div style="margin-top: 0.5rem">
        <ConversationCreateUpload
          v-if="mediaType === 'file'"
          :disabled="disabled"
          @input="uploadFile"
          :multipleFiles="multipleFiles" />
        <ConversationCreateRecord
          v-if="mediaType === 'mic'"
          :disabled="disabled"
          @input="recordFile" />
      </div>
    </div>
  </div>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField"
import { generateFileField } from "@/tools/generateFileField.js"

import ConversationCreateUpload from "@/components/ConversationCreateUpload.vue"
import ConversationCreateRecord from "@/components/ConversationCreateRecord.vue"
import FormInput from "@/components/FormInput.vue"

export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      required: true,
    },
  },
  data() {
    return {
      mediaType: "file",
      indexPlaying: -1,
      multipleFiles: true, //process.env.VUE_APP_MULTIFILE == "true",
    }
  },
  beforeDestroy() {
    this.stopFile()
  },
  methods: {
    uploadFile(file) {
      if (this.multipleFiles) {
        this.AddMultipleFiles(file)
      } else {
        this.AddSingleFile(file)
      }
    },
    recordFile(file) {
      if (this.multipleFiles) {
        this.AddMultipleFiles(file)
      } else {
        this.AddSingleFile(file)
      }
    },
    AddMultipleFiles(file) {
      if (typeof file === "object" && file.length !== undefined) {
        const filesArray = Array.from(file)
        this.$emit("input", [
          ...this.value,
          ...filesArray.map((f) =>
            generateFileField(this.removeFileExtension(f.name), f)
          ),
        ])
      } else {
        this.$emit("input", [
          ...this.value,
          generateFileField(this.removeFileExtension(file.name), file),
        ])
      }
    },
    AddSingleFile(file) {
      this.stopFile()
      if (typeof file === "object" && file.length !== undefined) {
        this.$emit("input", [
          generateFileField(this.removeFileExtension(file[0].name), file[0]),
        ])
      } else {
        this.$emit("input", [
          generateFileField(this.removeFileExtension(file.name), file),
        ])
      }
    },
    deleteFile(index, event) {
      if (this.disabled) return

      event?.preventDefault()
      if (this.indexPlaying === index) {
        this.stopFile()
      }
      this.value.splice(index, 1)
      this.$emit("input", this.value)
    },
    playFile(index, event) {
      event?.preventDefault()
      const file = this.value[index].file
      this.stopFile()
      this.audio = new Audio(URL.createObjectURL(file))
      this.audio.onended = () => {
        this.stopFile()
      }
      this.indexPlaying = index
      this.audio.play()
    },
    stopFile(event) {
      event?.preventDefault()
      if (this.audio) {
        this.audio.pause()
        URL.revokeObjectURL(this.value[this.indexPlaying].file)
        this.audio = null
      }
      this.indexPlaying = -1
    },
    removeFileExtension(filename) {
      return filename.replace(/\.[^/.]+$/, "")
    },
  },
  components: {
    ConversationCreateUpload,
    ConversationCreateRecord,
    FormInput,
  },
}
</script>

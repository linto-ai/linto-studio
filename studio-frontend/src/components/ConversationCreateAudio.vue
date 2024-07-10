<template>
  <div class="form-field flex gap-medium">
    <!-- <h3>Uploaded media</h3> -->
    <!-- File list -->
    <ul class="audio-upload-list flex1" v-if="value && value.length > 0">
      <!-- TODO: find a real unique key (hash + date upload ?) -->
      <ConversationCreateFileLine
        v-for="(field, index) of value"
        :key="field.id"
        :field="field"
        :isPlaying="index === indexPlaying"
        :disabled="disabled"
        @deleteFile="deleteFile(index, $event)"
        @playFile="playFile(index, $event)"
        @stopFile="stopFile($event)" />
    </ul>

    <div class="flex audio-upload-form flex1">
      <ConversationCreateUpload
        v-if="mode === 'file'"
        class="flex1"
        :disabled="disabled"
        @input="uploadFile"
        :multipleFiles="multipleFiles" />
      <ConversationCreateRecord
        v-else
        class="flex1"
        :disabled="disabled"
        @input="recordFile" />
    </div>
  </div>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField"
import { generateFileField } from "@/tools/generateFileField.js"

import ConversationCreateUpload from "@/components/ConversationCreateUpload.vue"
import ConversationCreateRecord from "@/components/ConversationCreateRecord.vue"
import FormInput from "@/components/FormInput.vue"
import ConversationCreateFileLine from "@/components/ConversationCreateFileLine.vue"

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
    mode: {
      type: String,
      required: false,
      default: "file",
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
      if (this.disabled) return
      if (this.multipleFiles) {
        this.AddMultipleFiles(file)
      } else {
        this.AddSingleFile(file)
      }
    },
    recordFile(file) {
      if (this.disabled) return
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

      if (this.indexPlaying === index) {
        this.stopFile()
      }
      this.value.splice(index, 1)
      this.$emit("input", this.value)
    },
    playFile(index, event) {
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
    ConversationCreateFileLine,
  },
}
</script>

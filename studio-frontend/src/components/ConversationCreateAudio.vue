<template>
  <div class="flex col gap-small">
    <ul class="audio-upload-list flex col gap-small" v-if="value.length > 0">
      <ConversationCreateFileLine
        v-for="field of value"
        :key="field.id"
        :field="field"
        :duration="durations[field.id]"
        :isPlaying="field.id === playingFileId"
        @rename="renameFile(field, $event)"
        @delete="deleteFile(field)"
        @toggle-playback="togglePlayback(field)" />
    </ul>

    <div class="flex audio-upload-form subSection">
      <ConversationCreateUpload class="flex1" multipleFiles @input="addFiles" />
    </div>
  </div>
</template>
<script>
import { generateFileField } from "@/tools/fields/generateFileField.js"
import { removeFileExtension } from "@/tools/removeFileExtension.js"

import ConversationCreateUpload from "@/components/ConversationCreateUpload.vue"
import ConversationCreateFileLine from "@/components/ConversationCreateFileLine.vue"

export default {
  components: {
    ConversationCreateUpload,
    ConversationCreateFileLine,
  },
  props: {
    value: { type: Array, required: true },
    // Seconds by file id. null when unknown or not read yet.
    durations: { type: Object, required: true },
  },
  data() {
    return {
      playingFileId: null,
    }
  },
  beforeDestroy() {
    this.stopPlayback()
  },
  methods: {
    addFiles(files) {
      const addedFields = files.map((file) =>
        generateFileField(removeFileExtension(file.name), file),
      )
      this.$emit("input", [...this.value, ...addedFields])
    },
    renameFile(field, name) {
      this.$emit(
        "input",
        this.value.map((other) =>
          other === field ? { ...other, value: name } : other,
        ),
      )
    },
    deleteFile(field) {
      if (field.id === this.playingFileId) this.stopPlayback()
      this.$emit(
        "input",
        this.value.filter((other) => other !== field),
      )
    },
    togglePlayback(field) {
      const wasPlaying = field.id === this.playingFileId
      this.stopPlayback()
      if (!wasPlaying) this.startPlayback(field)
    },
    startPlayback(field) {
      this.audioUrl = URL.createObjectURL(field.file)
      this.audio = new Audio(this.audioUrl)
      this.audio.onended = this.stopPlayback
      this.audio.onerror = this.stopPlayback
      this.playingFileId = field.id
      this.audio.play().catch((error) => console.error(error))
    },
    stopPlayback() {
      this.playingFileId = null
      if (!this.audio) return
      this.audio.onended = null
      this.audio.onerror = null
      this.audio.pause()
      URL.revokeObjectURL(this.audioUrl)
      this.audio = null
      this.audioUrl = null
    },
  },
}
</script>

<template>
  <li class="file-line flex align-center gap-medium">
    <FileThumbnail :file="field.file" />

    <FormInput
      v-if="isRenaming"
      class="file-line__content flex1 no-margin"
      v-model="editedName"
      :field="nameField"
      focus
      inputFullWidth
      withConfirmation
      confirmWithoutChange
      @on-confirm="confirmRename"
      @on-cancel="closeRename" />
    <div v-else class="file-line__content flex1 flex col">
      <div class="flex align-center gap-small">
        <span class="file-line__name" :title="field.value">
          {{ field.value }}
        </span>
        <Button
          ref="renameButton"
          class="file-line__rename"
          type="button"
          variant="text"
          size="sm"
          icon="pencil-simple"
          :aria-label="renameLabel"
          :title="renameLabel"
          @click="startRename" />
      </div>
      <span class="file-line__details">{{ details }}</span>
    </div>

    <Button
      class="file-line__playback"
      type="button"
      variant="text"
      iconWeight="fill"
      :icon="isPlaying ? 'pause' : 'play'"
      :aria-label="playbackLabel"
      :title="playbackLabel"
      @click="$emit('toggle-playback')" />
    <Button
      type="button"
      variant="text"
      intent="destructive"
      icon="trash"
      :aria-label="deleteLabel"
      :title="deleteLabel"
      @click="$emit('delete')" />
  </li>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField.js"
import { computeFileDetails } from "@/tools/transcriptionCreate/computeFileDetails.js"

import FileThumbnail from "@/components/transcriptionCreate/FileThumbnail.vue"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  components: { FileThumbnail, FormInput },
  props: {
    field: { type: Object, required: true },
    // Seconds. null when unknown or not read yet.
    duration: { type: Number, default: null },
    isPlaying: { type: Boolean, default: false },
  },
  data() {
    return {
      isRenaming: false,
      editedName: this.field.value,
    }
  },
  computed: {
    details() {
      return computeFileDetails(
        this.field.file,
        this.duration,
        this.$i18n.locale,
      )
    },
    nameField() {
      return {
        ...EMPTY_FIELD,
        customParams: {
          "aria-label": this.$t("transcription_create.file.name"),
        },
      }
    },
    renameLabel() {
      return this.$t("transcription_create.file.rename", {
        name: this.field.value,
      })
    },
    playbackLabel() {
      const action = this.isPlaying ? "pause" : "play"
      return this.$t(`transcription_create.file.${action}`, {
        name: this.field.value,
      })
    },
    deleteLabel() {
      return this.$t("transcription_create.file.delete", {
        name: this.field.value,
      })
    },
  },
  methods: {
    startRename() {
      this.editedName = this.field.value
      this.isRenaming = true
    },
    confirmRename() {
      const name = this.editedName.trim()
      if (name && name !== this.field.value) this.$emit("rename", name)
      this.closeRename()
    },
    closeRename() {
      this.isRenaming = false
      this.$nextTick(this.focusRenameButton)
    },
    // The button that had the focus is gone with the field.
    focusRenameButton() {
      this.$refs.renameButton.$el.focus()
    },
  },
}
</script>
<style lang="scss" scoped>
.file-line {
  margin: 0;
  padding: var(--small-gap) var(--medium-gap) var(--small-gap) var(--small-gap);
  border: var(--border-block);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-1);
  margin: 0;
}

// Shorter than the thumbnail in both states, which keeps the card height when
// renaming. min-width lets long names shrink instead of pushing the buttons out.
.file-line__content {
  min-width: 0;
}

.file-line__name {
  min-width: 0;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.file-line__rename {
  flex-shrink: 0;
}

.file-line__playback {
  --btn-text: var(--primary-color);
  --btn-hover-text: var(--primary-color);
}

.file-line__details {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>

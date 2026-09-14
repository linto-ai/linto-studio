<template>
  <BottomSheet
    :value="value"
    :title="recording ? recording.name : ''"
    @input="$emit('input', $event)">
    <form
      v-if="renaming"
      class="m-actions__rename"
      @submit.prevent="submitRename">
      <input
        v-model="newName"
        type="text"
        required
        maxlength="200"
        :aria-label="$t('mobile.record.name')" />
      <button type="submit" class="m-actions__confirm">
        {{ $t("mobile.common.confirm") }}
      </button>
    </form>
    <div v-else class="m-actions__list">
      <ListRow
        v-if="canSend"
        icon="upload-simple"
        :label="$t('mobile.queue.send_now')"
        :chevron="false"
        @click="$emit('send', recording)" />
      <ListRow
        icon="pencil-simple"
        :label="$t('mobile.queue.rename')"
        :chevron="false"
        @click="startRename" />
      <ListRow
        icon="trash"
        :label="$t('mobile.queue.delete')"
        :chevron="false"
        danger
        @click="$emit('remove', recording)" />
    </div>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"

export default {
  name: "RecordingActionsSheet",
  components: { BottomSheet, ListRow },
  props: {
    value: { type: Boolean, default: false },
    recording: { type: Object, default: null },
  },
  data() {
    return { renaming: false, newName: "" }
  },
  computed: {
    canSend() {
      return this.recording && this.recording.status !== "uploading"
    },
  },
  watch: {
    value(open) {
      if (!open) this.renaming = false
    },
  },
  methods: {
    startRename() {
      this.newName = this.recording.name
      this.renaming = true
    },
    submitRename() {
      this.$emit("rename", { recording: this.recording, name: this.newName })
      this.renaming = false
    },
  },
}
</script>

<style scoped>
.m-actions__list {
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}

.m-actions__rename {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-actions__rename input {
  font: inherit;
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
}

.m-actions__confirm {
  min-height: 48px;
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
}
</style>

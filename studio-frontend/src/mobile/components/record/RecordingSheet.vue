<template>
  <BottomSheet
    :value="value"
    :title="recording ? recording.name : ''"
    @input="$emit('input', $event)">
    <template v-if="recording">
      <form
        v-if="renaming"
        class="m-recording__rename"
        @submit.prevent="submitRename">
        <input
          v-model="newName"
          type="text"
          required
          maxlength="200"
          :aria-label="$t('mobile.record.name')" />
        <button type="submit" class="m-recording__confirm">
          {{ $t("mobile.common.confirm") }}
        </button>
      </form>
      <template v-else>
        <p class="m-muted">{{ statusLine }}</p>
        <RecordingPlayer
          v-if="value"
          :recording-id="recording.id"
          :mime-type="recording.mimeType" />
        <RecordingServerLinks
          v-if="value && recording.conversationId"
          :conversation-id="recording.conversationId"
          @share-document="$emit('share-document', $event)" />
        <div class="m-recording__actions">
          <ListRow
            v-if="recording.status === 'error'"
            icon="arrow-clockwise"
            :label="$t('mobile.library.retry')"
            :chevron="false"
            @click="$emit('retry', recording)" />
          <ListRow
            icon="share-network"
            :label="$t('mobile.library.share_audio')"
            :chevron="false"
            @click="$emit('share-audio', recording)" />
          <ListRow
            icon="pencil-simple"
            :label="$t('mobile.queue.rename')"
            :chevron="false"
            @click="startRename" />
          <ListRow
            icon="trash"
            :label="
              $t(
                pending
                  ? 'mobile.library.cancel_upload'
                  : 'mobile.library.discard_audio',
              )
            "
            :hint="pending ? '' : $t('mobile.library.discard_hint')"
            :chevron="false"
            danger
            @click="$emit('remove', recording)" />
        </div>
      </template>
    </template>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import RecordingPlayer from "@/mobile/components/record/RecordingPlayer.vue"
import RecordingServerLinks from "@/mobile/components/record/RecordingServerLinks.vue"
import { describeRecordingStatus } from "@/mobile/tools/describeRecordingStatus.js"

// One entry of the library: the local audio, what the server holds for
// it, and the actions on the entry.
export default {
  name: "RecordingSheet",
  components: { BottomSheet, ListRow, RecordingPlayer, RecordingServerLinks },
  props: {
    value: { type: Boolean, default: false },
    recording: { type: Object, default: null },
    online: { type: Boolean, default: true },
  },
  data() {
    return { renaming: false, newName: "" }
  },
  computed: {
    pending() {
      return this.recording.status !== "uploaded"
    },
    statusLine() {
      const status = describeRecordingStatus(this.recording, this.online)
      return this.$t(status.label, { progress: this.recording.progress || 0 })
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
.m-recording__rename {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-recording__rename input {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-recording__confirm {
  min-height: 48px;
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
}

.m-recording__actions {
  border-radius: var(--m-radius);
  overflow: hidden;
  background: var(--m-surface-muted);
}
</style>

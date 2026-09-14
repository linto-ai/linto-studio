<template>
  <li class="m-pending">
    <div class="m-pending__line">
      <div class="m-pending__body">
        <span class="m-pending__name">{{ recording.name }}</span>
        <span class="m-muted">{{ details }}</span>
      </div>
      <span
        class="m-pending__status"
        :class="`m-pending__status--${status.tone}`">
        <PhIcon :name="status.icon" size="xs" />
        {{ statusLabel }}
      </span>
      <IconButton
        icon="dots-three-vertical"
        :label="$t('mobile.queue.actions')"
        @click="$emit('open-actions', recording)" />
    </div>
    <progress
      v-if="recording.status === 'uploading'"
      class="m-pending__progress"
      :value="recording.progress || 0"
      max="100"></progress>
    <p v-if="errorMessage" class="m-pending__error">{{ errorMessage }}</p>
  </li>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import IconButton from "@/mobile/components/IconButton.vue"
import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { formatFileSize } from "@/mobile/tools/formatFileSize.js"
import { describeRecordingStatus } from "@/mobile/tools/describeRecordingStatus.js"

export default {
  name: "PendingRecordingItem",
  components: { PhIcon, IconButton },
  props: {
    recording: { type: Object, required: true },
    online: { type: Boolean, default: true },
  },
  computed: {
    details() {
      const duration = formatDurationShort(this.recording.durationMs || 0)
      const size = formatFileSize(this.recording.sizeBytes || 0)
      return `${duration} · ${size}`
    },
    status() {
      return describeRecordingStatus(this.recording, this.online)
    },
    statusLabel() {
      return this.$t(this.status.label, {
        progress: this.recording.progress || 0,
      })
    },
    errorMessage() {
      const error = this.recording.error
      if (this.recording.status !== "error" || !error) return ""
      return this.$t(`mobile.queue.error_${error.code}`, {
        maxSize: error.maxSize,
      })
    },
  },
}
</script>

<style scoped>
.m-pending {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-2);
  padding: var(--m-space-3) var(--m-space-2) var(--m-space-3) var(--m-space-4);
  border-bottom: 1px solid var(--m-divider);
}

.m-pending:last-child {
  border-bottom: none;
}

.m-pending__line {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
}

.m-pending__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-pending__name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-pending__status {
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-1);
  padding: 2px var(--m-space-2);
  border-radius: var(--m-radius-round);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: var(--m-info-soft);
  color: var(--m-info);
}

.m-pending__status--warning {
  background: var(--m-warning-soft);
  color: var(--m-warning-text);
}

.m-pending__status--danger {
  background: var(--m-danger-soft);
  color: var(--m-danger);
}

.m-pending__progress {
  width: 100%;
  height: 4px;
  accent-color: var(--m-primary);
}

.m-pending__error {
  margin: 0;
  font-size: var(--m-font-size-sm);
  color: var(--m-danger);
}
</style>

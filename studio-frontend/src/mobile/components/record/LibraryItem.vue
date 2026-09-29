<template>
  <li class="m-library-item">
    <button
      type="button"
      class="m-library-item__main"
      @click="$emit('open', recording)">
      <span class="m-library-item__body">
        <span class="m-library-item__name">{{ recording.name }}</span>
        <span class="m-muted">{{ details }}</span>
        <span v-if="errorMessage" class="m-library-item__error">
          {{ errorMessage }}
        </span>
      </span>
      <span
        class="m-library-item__status"
        :class="`m-library-item__status--${status.tone}`">
        <PhIcon :name="status.icon" size="xs" />
        {{ statusLabel }}
      </span>
      <PhIcon name="caret-right" size="sm" class="m-muted" />
    </button>
    <progress
      v-if="recording.status === 'uploading'"
      class="m-library-item__progress"
      :value="recording.progress || 0"
      max="100"></progress>
  </li>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { formatFileSize } from "@/mobile/tools/formatFileSize.js"
import { formatMediaDate } from "@/mobile/tools/formatMediaDate.js"
import { describeRecordingStatus } from "@/mobile/tools/describeRecordingStatus.js"

export default {
  name: "LibraryItem",
  components: { PhIcon },
  props: {
    recording: { type: Object, required: true },
    online: { type: Boolean, default: true },
  },
  computed: {
    details() {
      const date = formatMediaDate(
        new Date(this.recording.createdAt).toISOString(),
        this.$i18n.locale,
      )
      const duration = formatDurationShort(this.recording.durationMs || 0)
      const size = formatFileSize(this.recording.sizeBytes || 0)
      return `${date} · ${duration} · ${size}`
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
.m-library-item + .m-library-item {
  border-top: 1px solid var(--m-divider);
}

.m-library-item__main {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  min-height: 64px;
  padding: var(--m-space-2) var(--m-space-3);
  border: none;
  background: transparent;
  text-align: left;
  font: inherit;
  color: inherit;
}

.m-library-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--m-font-size-sm);
}

.m-library-item__name {
  font-size: var(--m-font-size);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m-library-item__error {
  color: var(--m-danger);
}

.m-library-item__status {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-1);
  padding: 2px var(--m-space-2);
  border-radius: var(--m-radius-round);
  font-size: 11px;
  font-weight: 600;
  background: var(--m-info-soft);
  color: var(--m-info);
}

.m-library-item__status--success {
  background: var(--m-primary-soft);
  color: var(--m-primary);
}

.m-library-item__status--warning {
  background: var(--m-warning-soft);
  color: var(--m-warning-text);
}

.m-library-item__status--danger {
  background: var(--m-danger-soft);
  color: var(--m-danger);
}

.m-library-item__progress {
  display: block;
  width: calc(100% - 2 * var(--m-space-3));
  height: 4px;
  margin: 0 var(--m-space-3) var(--m-space-2);
  accent-color: var(--m-primary);
}
</style>

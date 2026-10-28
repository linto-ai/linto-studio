<template>
  <div class="m-credit">
    <p class="m-credit__pill">
      <PhIcon name="clock" size="xs" />
      <i18n path="mobile.record.credit_remaining" tag="span">
        <template #minutes>
          <strong>{{ remaining }}</strong>
        </template>
      </i18n>
    </p>
    <p v-if="cached" class="m-muted m-credit__sync">
      <i18n path="mobile.record.credit_synced" tag="span">
        <template #date>
          <time :datetime="syncedAtIso">{{ syncedAtLabel }}</time>
        </template>
      </i18n>
    </p>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"

// Transcription minutes left, under the record button. A value remembered
// from an earlier read (offline) is approximate and says when it was read.
export default {
  name: "TranscriptionCreditPill",
  components: { PhIcon },
  props: {
    minutes: { type: Number, required: true },
    syncedAt: { type: Number, required: true },
    cached: { type: Boolean, default: false },
  },
  computed: {
    remaining() {
      const duration = formatDurationShort(this.minutes * 60_000)
      return this.cached ? `~${duration}` : duration
    },
    syncedAtIso() {
      return new Date(this.syncedAt).toISOString()
    },
    syncedAtLabel() {
      return new Intl.DateTimeFormat(this.$i18n.locale, {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(this.syncedAt)
    },
  },
}
</script>

<style scoped>
.m-credit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-space-2);
}

.m-credit__pill {
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-2);
  margin: 0;
  padding: var(--m-space-2) var(--m-space-4);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-round);
  background: var(--m-surface);
  font-size: var(--m-font-size-sm);
}

.m-credit__sync {
  margin: 0;
  font-size: var(--m-font-size-sm);
  text-align: center;
}
</style>

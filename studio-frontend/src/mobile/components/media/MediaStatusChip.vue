<template>
  <span class="m-media-status" :class="`m-media-status--${tone}`">
    <PhIcon :name="icon" size="xs" />
    {{ label }}
  </span>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import { mediaProgressMixin } from "@/mixins/mediaProgress.js"

// "Prêt", "Transcription 63 %", "Erreur": the job state of a media, with
// an icon so the color is never alone.
export default {
  name: "MediaStatusChip",
  components: { PhIcon },
  mixins: [mediaProgressMixin],
  props: {
    media: { type: Object, required: true },
  },
  computed: {
    tone() {
      if (this.status === "done") return "ok"
      if (this.status === "error") return "danger"
      return "info"
    },
    icon() {
      if (this.status === "done") return "check"
      if (this.status === "error") return "warning-circle"
      return "hourglass"
    },
    label() {
      if (this.status === "done") return this.$t("mobile.media.status_done")
      if (this.status === "error") return this.$t("mobile.media.status_error")
      if (this.status === "pending")
        return this.$t("mobile.media.status_pending")
      return this.$t(`mobile.media.step_${this.status}`, {
        progress: Math.floor(this.progress),
      })
    },
  },
}
</script>

<style scoped>
.m-media-status {
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

.m-media-status--ok {
  background: var(--m-primary-soft);
  color: var(--m-primary);
}

.m-media-status--danger {
  background: var(--m-danger-soft);
  color: var(--m-danger);
}
</style>

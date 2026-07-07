<template>
  <NotificationBanner
    v-if="visible"
    :variant="variant"
    :icon="icon"
    align="start"
    role="alert"
    class="microphone-status-banner">
    <span class="microphone-status-banner__message">
      {{ $t(`microphone_status.banner.${status}`) }}
    </span>
    <Button
      v-if="status === 'connection_lost'"
      variant="primary"
      size="sm"
      :label="$t('microphone_status.action_retry')"
      @click="$emit('retry')" />
    <Button
      v-else-if="status === 'mic_lost'"
      variant="primary"
      size="sm"
      :label="$t('microphone_status.action_reconfigure')"
      @click="$emit('reconfigure')" />
  </NotificationBanner>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

const BANNER_STATUSES = ["connection_lost", "mic_lost", "mic_interrupted"]

export default {
  name: "MicrophoneStatusBanner",
  components: { NotificationBanner },
  props: {
    // microphoneStatus value; the banner renders only for recovery states.
    status: { type: String, required: true },
  },
  computed: {
    visible() {
      return BANNER_STATUSES.includes(this.status)
    },
    variant() {
      return this.status === "mic_interrupted" ? "warning" : "error"
    },
    icon() {
      return this.status === "connection_lost"
        ? "wifi-slash"
        : "microphone-slash"
    },
  },
}
</script>

<style scoped>
.microphone-status-banner {
  margin: 0.5rem;
  width: calc(100% - 1rem) !important;
}

.microphone-status-banner__message {
  flex: 1;
  min-width: 0;
}
</style>

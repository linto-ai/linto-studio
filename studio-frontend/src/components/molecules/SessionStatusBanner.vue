<template>
  <NotificationBanner
    v-if="banner === 'websocket_reconnecting'"
    variant="warning"
    icon="wifi-slash"
    align="start"
    role="alert"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{ $t("websocket.live_feed_interrupted") }}
    </span>
    <PhIcon name="spinner" animation="spin" size="sm" />
  </NotificationBanner>

  <NotificationBanner
    v-else-if="banner === 'websocket_failed'"
    variant="error"
    icon="wifi-slash"
    align="start"
    role="alert"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{ $t("websocket.live_feed_failed") }}
    </span>
    <Button
      variant="primary"
      size="sm"
      :label="$t('websocket.action_retry')"
      @click="$emit('retry-websocket')" />
  </NotificationBanner>

  <NotificationBanner
    v-else-if="banner === 'websocket_restored'"
    variant="success"
    icon="wifi-high"
    align="start"
    role="status"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{ $t("websocket.restored") }}
    </span>
  </NotificationBanner>

  <MicrophoneStatusBanner
    v-else-if="banner === 'microphone'"
    :status="microphoneStatus"
    @retry="$emit('retry-microphone')"
    @reconfigure="$emit('reconfigure-microphone')" />
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import MicrophoneStatusBanner from "@/components/molecules/MicrophoneStatusBanner.vue"
import { resolveSessionBanner } from "@/tools/resolveSessionBanner.js"

const RESTORED_FLASH_DURATION = 3000

// Single banner slot for a live session view: websocket outage first,
// microphone trouble second (see resolveSessionBanner for the rationale).
export default {
  name: "SessionStatusBanner",
  components: { NotificationBanner, MicrophoneStatusBanner },
  props: {
    // ApiEventWebSocket status: idle | connecting | connected | reconnecting | failed
    websocketStatus: { type: String, required: true },
    // microphoneStatus value from sessionMicrophoneMixin ("idle" when the
    // view has no microphone at all).
    microphoneStatus: { type: String, default: "idle" },
  },
  data() {
    return {
      showRestored: false,
      restoredTimer: null,
    }
  },
  computed: {
    banner() {
      const banner = resolveSessionBanner(
        this.websocketStatus,
        this.microphoneStatus,
      )
      if (banner) return banner
      return this.showRestored ? "websocket_restored" : null
    },
  },
  watch: {
    websocketStatus(newStatus, oldStatus) {
      this.clearRestoredTimer()
      const wasRecovering =
        oldStatus === "reconnecting" || oldStatus === "failed"
      if (newStatus === "connected" && wasRecovering) {
        this.showRestored = true
        this.restoredTimer = setTimeout(() => {
          this.showRestored = false
        }, RESTORED_FLASH_DURATION)
      } else {
        this.showRestored = false
      }
    },
  },
  beforeDestroy() {
    this.clearRestoredTimer()
  },
  methods: {
    clearRestoredTimer() {
      if (this.restoredTimer) {
        clearTimeout(this.restoredTimer)
        this.restoredTimer = null
      }
    },
  },
}
</script>

<style scoped>
.session-status-banner {
  margin: 0.5rem;
  width: calc(100% - 1rem) !important;
}

.session-status-banner__message {
  flex: 1;
  min-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  .session-status-banner :deep(svg) {
    animation: none;
  }
}
</style>

<template>
  <div v-if="visible" class="websocket-status-dot" role="status">
    <button
      v-if="status === 'failed'"
      type="button"
      class="websocket-status-dot__dot websocket-status-dot__dot--failed"
      :title="$t('websocket.reconnect_failed')"
      @click="$emit('retry')">
      <PhIcon name="wifi-slash" size="sm" />
      <span class="websocket-status-dot__label">
        {{ $t("websocket.label_failed") }}
      </span>
    </button>
    <span
      v-else-if="status === 'reconnecting'"
      class="websocket-status-dot__dot websocket-status-dot__dot--reconnecting"
      :title="$t('websocket.reconnecting')">
      <PhIcon name="spinner" animation="spin" size="sm" />
      <span class="websocket-status-dot__label">
        {{ $t("websocket.label_reconnecting") }}
      </span>
    </span>
    <span
      v-else
      class="websocket-status-dot__dot websocket-status-dot__dot--restored">
      <PhIcon name="check" size="sm" color="var(--success-color)" />
      <span class="websocket-status-dot__label">
        {{ $t("websocket.restored") }}
      </span>
    </span>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

const RESTORED_FLASH_DURATION = 2000

export default {
  name: "WebsocketStatusDot",
  components: { PhIcon },
  props: {
    // ApiEventWebSocket status: idle | connecting | connected | reconnecting | failed
    status: { type: String, required: true },
  },
  data() {
    return {
      showRestored: false,
      restoredTimer: null,
      //status: "connected",
    }
  },
  computed: {
    visible() {
      return (
        this.status === "reconnecting" ||
        this.status === "failed" ||
        this.showRestored
      )
    },
  },
  watch: {
    status(newStatus, oldStatus) {
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

<style lang="scss" scoped>
.websocket-status-dot {
  position: fixed;
  bottom: calc(var(--subtitle-reserve, 0px) + 20px);
  right: 20px;
  z-index: 9998;
}

.websocket-status-dot__dot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--small-gap);
  height: 40px;
  border-radius: 20px;
  border: 1px solid var(--neutral-40);
  background: var(--background-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 0 14px;

  &--reconnecting {
    color: var(--warning-text);
    border-color: var(--warning-color);
    background: var(--warning-soft);
  }

  &--failed {
    color: var(--danger-color);
    border-color: var(--danger-color);
    background: var(--danger-soft);
    cursor: pointer;

    // Inverted on hover/focus: solid = action, soft = state.
    &:hover,
    &:focus-visible {
      color: var(--danger-contrast);
      background: var(--danger-color);
    }
  }

  &--restored {
    color: var(--dark-90);
    border-color: var(--success-color);
    background: var(--success-soft);
  }
}

.websocket-status-dot__label {
  font-size: var(--text-sm);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .websocket-status-dot :deep(svg) {
    animation: none;
  }
}
</style>

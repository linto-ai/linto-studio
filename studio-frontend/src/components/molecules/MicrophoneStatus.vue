<template>
  <div
    class="microphone-status"
    :class="[
      `microphone-status--${status}`,
      { 'microphone-status--speaking': speaking },
    ]">
    <PhIcon :name="icon" size="xs" class="microphone-status__icon" />
    <span class="microphone-status__dot"></span>
    <span class="microphone-status__label">
      {{ $t(`microphone_status.${status}`) }}
    </span>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

const MUTED_ICON_STATUSES = ["muted", "mic_lost"]

export default {
  name: "MicrophoneStatus",
  components: { PhIcon },
  props: {
    // One of the microphoneStatus values computed by sessionMicrophoneMixin
    // (recording, muted, connecting, reconnecting, connection_lost, mic_lost,
    // mic_interrupted). "idle" should be filtered out by the parent.
    status: { type: String, required: true },
    speaking: { type: Boolean, default: false },
  },
  computed: {
    icon() {
      return MUTED_ICON_STATUSES.includes(this.status)
        ? "microphone-slash"
        : "microphone"
    },
  },
}
</script>

<style scoped>
.microphone-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--neutral-40);
  border-radius: 999px;
  padding: 0.15rem 0.6rem;
  white-space: nowrap;
}

.microphone-status__icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.microphone-status__dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--neutral-40);
  flex-shrink: 0;
  /* Smooth the VAD speaking/silent flips (1s hangover would strobe). */
  transition: background-color 150ms ease-out;
}

.microphone-status__label {
  font-variant-caps: all-petite-caps;
  letter-spacing: 0.04em;
  font-size: var(--text-sm);
}

/* Recording: the chip stays red permanently (state marker); the dot is the
   live VAD feedback — red while the user speaks, grey while silent. */
.microphone-status--recording {
  border-color: var(--red-chart);
  background: var(--danger-soft);
}
.microphone-status--recording.microphone-status--speaking
  .microphone-status__dot {
  background: var(--red-chart);
}

.microphone-status--connecting .microphone-status__dot,
.microphone-status--reconnecting .microphone-status__dot {
  background: var(--warning-color);
  animation: microphone-status-blink 1.1s infinite;
}
.microphone-status--mic_interrupted .microphone-status__dot {
  background: var(--warning-color);
}

.microphone-status--connection_lost,
.microphone-status--mic_lost {
  border-color: var(--danger-color);
  background: var(--danger-soft);
}
.microphone-status--connection_lost .microphone-status__dot,
.microphone-status--mic_lost .microphone-status__dot {
  background: var(--danger-color);
}

@keyframes microphone-status-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .microphone-status__dot {
    animation: none !important;
  }
}

/* Compact on narrow layouts: icon + dot only (same breakpoint as SessionStatus) */
@container main (width < 1000px) {
  .microphone-status__label {
    display: none;
  }
}
</style>

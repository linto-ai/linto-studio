<template>
  <div
    class="microphone-placeholder flex1"
    :class="[
      `microphone-placeholder--${status}`,
      { 'microphone-placeholder--speaking': speaking },
    ]">
    <button
      type="button"
      class="microphone-placeholder__circle"
      :disabled="!toggleable"
      :aria-label="toggleLabel"
      :title="toggleable ? toggleLabel : null"
      @click="$emit('toggle')">
      <PhIcon :name="icon" :size="64" />
    </button>
    <div class="microphone-placeholder__title">
      {{ $t(`microphone_status.${status}`) }}
    </div>
    <p class="microphone-placeholder__sub">
      {{ $t(`microphone_status.description.${status}`) }}
    </p>
    <div class="microphone-placeholder__actions">
      <Button
        v-if="status === 'connection_lost'"
        variant="primary"
        :label="$t('microphone_status.action_retry')"
        @click="$emit('retry')" />
      <Button
        v-else-if="status === 'mic_lost'"
        variant="primary"
        :label="$t('microphone_status.action_reconfigure')"
        @click="$emit('reconfigure')" />
    </div>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

const MUTED_ICON_STATUSES = ["muted", "mic_lost"]
// Broken states: the circle is inert, recovery goes through the action buttons.
const NON_TOGGLEABLE_STATUSES = ["mic_lost", "connection_lost"]

export default {
  name: "MicrophonePlaceholder",
  components: { PhIcon },
  props: {
    status: { type: String, required: true },
    speaking: { type: Boolean, default: false },
  },
  computed: {
    icon() {
      return MUTED_ICON_STATUSES.includes(this.status)
        ? "microphone-slash"
        : "microphone"
    },
    toggleable() {
      return !NON_TOGGLEABLE_STATUSES.includes(this.status)
    },
    toggleLabel() {
      return this.status === "muted"
        ? this.$t("quick_session.live.start_microphone_button")
        : this.$t("quick_session.live.mute_microphone_button")
    },
  },
}
</script>

<style scoped>
.microphone-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
}

.microphone-placeholder__circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--neutral-40);
  color: var(--text-secondary);
  background: none;
  padding: 0;
  position: relative;
}

/* Sonar ring (ported from the late RecordingIndicator): a ring radiating
   outward while fading, driven by the VAD. transform/opacity only — the
   original animated padding (layout on every frame). */
.microphone-placeholder__circle::after {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 8px solid color-mix(in srgb, var(--red-chart) 25%, transparent);
  opacity: 0;
  pointer-events: none;
}

.microphone-placeholder--recording.microphone-placeholder--speaking
  .microphone-placeholder__circle::after {
  animation: microphone-placeholder-sonar 1.5s infinite;
}

.microphone-placeholder__circle:enabled {
  cursor: pointer;
}

.microphone-placeholder__circle:enabled:hover {
  background: var(--neutral-10, rgba(128, 128, 128, 0.08));
}

.microphone-placeholder__circle:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 3px;
}

.microphone-placeholder__title {
  font-size: 1.1rem;
  font-weight: 600;
}

.microphone-placeholder__sub {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  max-width: 42ch;
  text-align: center;
  margin: 0;
}

.microphone-placeholder__actions {
  display: flex;
  gap: 0.6rem;
}

.microphone-placeholder--recording .microphone-placeholder__circle {
  border-color: var(--red-chart);
  color: var(--red-chart);
}

.microphone-placeholder--connecting .microphone-placeholder__circle,
.microphone-placeholder--reconnecting .microphone-placeholder__circle {
  border-color: var(--warning-color);
  border-style: dashed;
  color: var(--warning-color);
}
.microphone-placeholder--mic_interrupted .microphone-placeholder__circle {
  border-color: var(--warning-color);
  color: var(--warning-color);
}

.microphone-placeholder--connection_lost .microphone-placeholder__circle,
.microphone-placeholder--mic_lost .microphone-placeholder__circle {
  border-color: var(--danger-color);
  color: var(--danger-color);
}

@keyframes microphone-placeholder-sonar {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.35);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .microphone-placeholder__circle,
  .microphone-placeholder__circle::after {
    animation: none !important;
  }
}
</style>

<template>
  <div class="m-record">
    <button
      type="button"
      class="m-record__button"
      :class="`m-record__button--${state}`"
      :disabled="state === 'denied' || state === 'blocked'"
      :aria-label="label"
      @click="$emit('click')">
      <PhIcon :name="icon" size="auto" weight="fill" class="m-record__icon" />
    </button>
    <span class="m-record__label">{{ label }}</span>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import { RECORD_BUTTON_STATES } from "@/mobile/const/recordButtonStates.js"

// The big round button. Its state decides color, icon and label; the label
// is always written under it so the color is never the only signal.
export default {
  name: "RecordButton",
  components: { PhIcon },
  props: {
    state: {
      type: String,
      default: "idle",
      validator: (value) => value in RECORD_BUTTON_STATES,
    },
  },
  computed: {
    icon() {
      return RECORD_BUTTON_STATES[this.state].icon
    },
    label() {
      return this.$t(RECORD_BUTTON_STATES[this.state].label)
    },
  },
}
</script>

<style scoped>
.m-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-space-3);
}

.m-record__button {
  width: 168px;
  height: 168px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--m-on-primary);
  background: var(--m-primary);
  box-shadow:
    0 0 0 12px var(--m-primary-soft),
    var(--m-shadow-3);
  transition: background 150ms ease;
}

.m-record__button:active {
  transform: scale(0.97);
}

.m-record__button--recording {
  background: var(--m-danger);
  box-shadow:
    0 0 0 12px var(--m-danger-soft),
    var(--m-shadow-3);
}

.m-record__button--paused {
  background: var(--m-warning);
  color: var(--m-text);
  box-shadow:
    0 0 0 12px var(--m-warning-soft),
    var(--m-shadow-3);
}

.m-record__button:disabled {
  background: var(--m-border);
  color: var(--m-text-muted);
  box-shadow: none;
}

.m-record__icon {
  width: 72px;
  height: 72px;
}

.m-record__label {
  font-size: var(--m-font-size-lg);
  font-weight: 600;
}
</style>

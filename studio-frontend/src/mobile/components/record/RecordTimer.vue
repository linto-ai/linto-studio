<template>
  <div class="m-timer" :class="{ 'm-timer--paused': paused }" role="timer">
    <span class="m-timer__value">{{ display }}</span>
    <span v-if="paused" class="m-timer__hint">{{
      $t("mobile.record.paused")
    }}</span>
  </div>
</template>

<script>
import { formatTimer } from "@/mobile/tools/formatTimer.js"

export default {
  name: "RecordTimer",
  props: {
    elapsedMs: { type: Number, required: true },
    paused: { type: Boolean, default: false },
  },
  computed: {
    display() {
      return formatTimer(this.elapsedMs)
    },
  },
}
</script>

<style scoped>
.m-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-space-1);
}

.m-timer__value {
  font-size: 44px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.m-timer--paused .m-timer__value {
  color: var(--m-text-muted);
}

.m-timer__hint {
  font-size: var(--m-font-size-sm);
  color: var(--m-warning-text);
  font-weight: 600;
}
</style>

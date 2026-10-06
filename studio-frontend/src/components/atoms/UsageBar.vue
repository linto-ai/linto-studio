<template>
  <progress
    class="usage-bar"
    :class="`usage-bar--${appearance}`"
    :value="Math.min(value, safeMax)"
    :max="safeMax"></progress>
</template>

<script>
import { computeUsageStatus } from "@/tools/computeUsageStatus"

// How much of a quota or a pack is used: the bar always fills with what is
// consumed, and turns warning then danger as it nears the limit. Shared by
// the quota tiles and the pack cards so that the bar means the same thing
// everywhere.
export default {
  name: "UsageBar",
  props: {
    // Consumed amount
    value: { type: Number, default: 0 },
    max: { type: Number, required: true },
    // status: colored by how close to the limit; neutral: grey, for a usage
    // that no longer counts (a spent pack)
    tone: {
      type: String,
      default: "status",
      validator: (value) => ["status", "neutral"].includes(value),
    },
  },
  computed: {
    safeMax() {
      return Math.max(1, this.max)
    },
    appearance() {
      if (this.tone === "neutral") return "neutral"
      return computeUsageStatus(this.value, this.max)
    },
  },
}
</script>

<style lang="scss" scoped>
.usage-bar {
  --usage-bar-fill: var(--success-color);
  display: block;
  width: 100%;
  height: 6px;
  border: none;
  border-radius: 3px;
  overflow: hidden;
  appearance: none;
  background: var(--neutral-30);

  &::-webkit-progress-bar {
    background: var(--neutral-30);
  }

  &::-webkit-progress-value {
    border-radius: 3px;
    background: var(--usage-bar-fill);
  }

  &::-moz-progress-bar {
    border-radius: 3px;
    background: var(--usage-bar-fill);
  }

  &--warning {
    --usage-bar-fill: var(--warning-color);
  }

  &--danger {
    --usage-bar-fill: var(--danger-color);
  }

  &--neutral {
    --usage-bar-fill: var(--neutral-40);
  }
}
</style>

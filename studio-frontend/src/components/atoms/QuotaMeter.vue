<template>
  <div class="quota-meter">
    <div class="quota-meter__head">
      <span class="quota-meter__label field-label">{{ label }}</span>
      <span class="quota-meter__value">{{ displayValue }}</span>
    </div>
    <progress
      class="quota-meter__bar"
      :class="statusClass"
      :value="progressValue"
      :max="progressMax"></progress>
  </div>
</template>

<script>
import { formatMinutesDuration } from "@/tools/formatMinutesDuration"

export default {
  name: "QuotaMeter",
  props: {
    label: { type: String, required: true },
    used: { type: Number, default: 0 },
    // null/undefined limit means unlimited
    limit: { type: Number, default: null },
    unit: { type: String, default: "count" }, // "minutes" | "count"
  },
  computed: {
    isUnlimited() {
      return this.limit === null || this.limit === undefined
    },
    percent() {
      if (this.isUnlimited) return 0
      return Math.min(
        100,
        Math.round((this.used / Math.max(1, this.limit)) * 100),
      )
    },
    progressValue() {
      return this.isUnlimited ? 1 : this.used
    },
    progressMax() {
      return this.isUnlimited ? 1 : Math.max(1, this.limit)
    },
    // Mirrors the seat-status thresholds used across the billing UI.
    statusClass() {
      if (this.isUnlimited) return "unlimited"
      if (this.percent >= 100) return "danger"
      if (this.percent >= 80) return "warning"
      return "success"
    },
    displayValue() {
      if (this.isUnlimited) return this.$t("billing.unlimited")
      return `${this.formatAmount(this.used)} / ${this.formatAmount(this.limit)}`
    },
  },
  methods: {
    formatAmount(value) {
      return this.unit === "minutes" ? formatMinutesDuration(value) : value
    },
  },
}
</script>

<style lang="scss" scoped>
.quota-meter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  &__head {
    display: flex;
    justify-content: space-between;
    gap: 0.5em;
    font-size: 0.85rem;
  }

  &__value {
    font-weight: 400;
    font-family: var(--font-family-mono);
    font-variant-numeric: tabular-nums;
    color: var(--text-secondary);
  }

  &__bar {
    width: 100%;
    height: 6px;
    border: none;
    border-radius: 3px;
    overflow: hidden;

    &::-webkit-progress-bar {
      background: var(--neutral-30);
      border-radius: 3px;
    }
    &::-moz-progress-bar {
      border-radius: 3px;
    }

    &.success::-webkit-progress-value {
      background: var(--success-color);
    }
    &.success::-moz-progress-bar {
      background: var(--success-color);
    }

    &.warning::-webkit-progress-value {
      background: var(--warning-color);
    }
    &.warning::-moz-progress-bar {
      background: var(--warning-color);
    }

    &.danger::-webkit-progress-value {
      background: var(--danger-color);
    }
    &.danger::-moz-progress-bar {
      background: var(--danger-color);
    }

    &.unlimited::-webkit-progress-value {
      background: var(--success-color);
      opacity: 0.5;
    }
    &.unlimited::-moz-progress-bar {
      background: var(--success-color);
      opacity: 0.5;
    }
  }
}
</style>

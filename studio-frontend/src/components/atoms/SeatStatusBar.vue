<template>
  <div class="seat-status-bar">
    <div class="seat-status-bar__bar" role="img" :aria-label="ariaLabel">
      <span
        v-for="(segment, index) in segmentsWithWidth"
        :key="index"
        class="seat-status-bar__segment"
        :class="`seat-status-bar__segment--${segment.color}`"
        :style="{ width: segment.width + '%' }"></span>
    </div>
    <ul class="seat-status-bar__legend">
      <li
        v-for="(segment, index) in segments"
        :key="index"
        class="seat-status-bar__legend-item">
        <span
          class="seat-status-bar__dot"
          :class="`seat-status-bar__dot--${segment.color}`"
          aria-hidden="true"></span>
        <span>{{ segment.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// Generic segmented status bar: each segment is a { value, color, label }
// passed in by the caller, who owns the thresholds/wording (e.g. seats under
// 80% / near / at limit). The bar itself has no business logic.
export default {
  name: "SeatStatusBar",
  props: {
    // [{ value: Number, color: "success" | "warning" | "danger", label: String }]
    segments: {
      type: Array,
      required: true,
    },
  },
  computed: {
    total() {
      return this.segments.reduce((sum, s) => sum + (s.value || 0), 0)
    },
    segmentsWithWidth() {
      return this.segments.map((segment) => ({
        ...segment,
        width: this.total > 0 ? ((segment.value || 0) / this.total) * 100 : 0,
      }))
    },
    ariaLabel() {
      return this.segments.map((s) => s.label).join(", ")
    },
  },
}
</script>

<style lang="scss" scoped>
.seat-status-bar {
  &__bar {
    display: flex;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    background: var(--neutral-30);
  }

  &__segment {
    height: 100%;

    &--success {
      background: var(--success-color);
    }
    &--warning {
      background: var(--warning-color);
    }
    &--danger {
      background: var(--danger-color);
    }
  }

  &__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25em 0.75em;
    list-style: none;
    margin: 0.4em 0 0;
    padding: 0;
    font-size: 0.78rem;
    color: var(--text-secondary);
  }

  &__legend-item {
    display: flex;
    align-items: center;
    gap: 0.4em;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &--success {
      background: var(--success-color);
    }
    &--warning {
      background: var(--warning-color);
    }
    &--danger {
      background: var(--danger-color);
    }
  }
}
</style>

<template>
  <div class="timeline-segmented" role="img" :aria-label="ariaLabel">
    <div v-if="label || showPercentage" class="timeline-segmented__header">
      <span v-if="label" class="timeline-segmented__label">{{ label }}</span>
      <span v-if="showPercentage" class="timeline-segmented__percentage">
        {{ totalPercentage }}%
      </span>
    </div>
    <div class="timeline-segmented__bar" :style="{ height: barHeight }">
      <div
        v-for="(item, index) in flexItems"
        :key="index"
        :class="
          item.type === 'spacer'
            ? 'timeline-segmented__spacer flex'
            : 'timeline-segmented__segment-wrapper flex'
        "
        :style="{ flexBasis: item.width + '%' }">
        <Tooltip
          class="flex1"
          v-if="item.segment"
          :text="
            typeof item.segment.tooltip === 'string'
              ? item.segment.tooltip
              : null
          "
          position="top"
          :delay="100">
          <div
            class="timeline-segmented__segment"
            :class="segmentClass(item.segment)" />
          <template
            v-if="
              item.segment.tooltip && typeof item.segment.tooltip === 'object'
            "
            #content>
            <div class="timeline-segmented__tooltip-content">
              <div
                v-for="(value, key) in item.segment.tooltip"
                :key="key"
                class="timeline-segmented__tooltip-row">
                <span class="timeline-segmented__tooltip-key">{{ key }}</span>
                <span class="timeline-segmented__tooltip-value">{{
                  value
                }}</span>
              </div>
            </div>
          </template>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from "@/components/atoms/Tooltip.vue"

export default {
  name: "TimelineSegmented",
  components: {
    Tooltip,
  },
  props: {
    /**
     * Array of segments to display
     * Each segment: {
     *   left: number (%),
     *   width: number (%),
     *   active?: boolean,
     *   type?: string,
     *   tooltip?: string | { [key: string]: string }
     * }
     */
    segments: {
      type: Array,
      default: () => [],
    },
    /**
     * Optional label displayed above the bar
     */
    label: {
      type: String,
      default: "",
    },
    /**
     * Show total active percentage
     */
    showPercentage: {
      type: Boolean,
      default: true,
    },
    /**
     * Height of the bar
     */
    barHeight: {
      type: String,
      default: "8px",
    },
    /**
     * Aria label for accessibility
     */
    ariaLabel: {
      type: String,
      default: "",
    },
  },
  computed: {
    totalPercentage() {
      return Math.round(
        this.segments
          .filter((s) => s.active !== false)
          .reduce((sum, s) => sum + (s.width || 0), 0),
      )
    },
    flexItems() {
      if (!this.segments.length) return []

      // Sort segments by left position
      const sorted = [...this.segments].sort(
        (a, b) => (a.left || 0) - (b.left || 0),
      )
      const items = []
      let currentPos = 0

      for (const segment of sorted) {
        const left = segment.left || 0
        const width = segment.width || 0

        // Add spacer if there's a gap
        if (left > currentPos) {
          items.push({ type: "spacer", width: left - currentPos })
        }

        // Add segment
        items.push({ type: "segment", width, segment })
        currentPos = left + width
      }

      return items
    },
  },
  methods: {
    segmentClass(segment) {
      const classes = []
      if (segment.active !== false) {
        classes.push("timeline-segmented__segment--active")
      }
      if (segment.type) {
        classes.push(`timeline-segmented__segment--${segment.type}`)
      }
      return classes
    },
  },
}
</script>

<style lang="scss" scoped>
.timeline-segmented {
  width: 100%;
}

.timeline-segmented__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-segmented__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.timeline-segmented__percentage {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-color);
}

.timeline-segmented__bar {
  display: flex;
  width: 100%;
  border-radius: 4px;
  background: var(--neutral-20);
  overflow: hidden;
}

.timeline-segmented__spacer,
.timeline-segmented__segment-wrapper {
  flex-shrink: 0;
  height: 100%;
}

.timeline-segmented__segment-wrapper {
  cursor: default;
}

.timeline-segmented__segment {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  transition: transform 0.15s ease;

  &:hover {
    transform: scaleY(1.5);
  }

  &--active {
    background: linear-gradient(
      90deg,
      var(--primary-color),
      var(--primary-hard, var(--primary-color))
    );
  }

  // Type variants
  &--success {
    background: var(--success-color, #22c55e);
  }

  &--warning {
    background: var(--warning-color, #f59e0b);
  }

  &--danger {
    background: var(--danger-color, #ef4444);
  }
}

.timeline-segmented__tooltip-content {
  padding: 0.25rem;
}

.timeline-segmented__tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.75rem;
  line-height: 1.4;

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
}

.timeline-segmented__tooltip-key {
  color: var(--text-secondary);
}

.timeline-segmented__tooltip-value {
  font-weight: 600;
  color: var(--text-primary);
}

@media (prefers-reduced-motion: reduce) {
  .timeline-segmented__segment {
    transition: none;

    &:hover {
      transform: none;
    }
  }
}
</style>

<template>
  <span class="balance-bar" aria-hidden="true">
    <span
      v-for="(segment, index) in visibleSegments"
      :key="index"
      class="balance-bar__segment"
      :class="`balance-bar__segment--${segment.pattern}`"
      :style="{ flexGrow: segment.total }">
      <span
        class="balance-bar__fill"
        :style="{ width: `${computeFillPercent(segment)}%` }"></span>
    </span>
  </span>
</template>

<script>
// What is left of a balance made of several sources (a plan quota, packs):
// one segment per source, as wide as the source is large, filled with what
// it still holds. Decorative: the figures next to it carry the information,
// and the pattern of a segment matches the swatch of its line of figures.
// The fill color comes from --balance-bar-fill (primary color by default).
export default {
  name: "BalanceBar",
  props: {
    // [{ remaining, total, pattern: "solid" | "hatched" }], in reading order
    segments: { type: Array, required: true },
  },
  computed: {
    visibleSegments() {
      return this.segments.filter((segment) => segment.total > 0)
    },
  },
  methods: {
    computeFillPercent(segment) {
      return Math.min(100, (segment.remaining / segment.total) * 100)
    },
  },
}
</script>

<style lang="scss" scoped>
.balance-bar {
  --balance-bar-fill-color: var(--balance-bar-fill, var(--primary-color));
  display: flex;
  gap: 3px;
  width: 100%;
  height: 6px;

  // Never empty-looking: an empty balance still shows its grey track
  &:empty {
    border-radius: 3px;
    background: var(--neutral-30);
  }

  &__segment {
    flex-basis: 0;
    // A small quota next to a large pack stays readable
    min-width: 1.5rem;
    overflow: hidden;
    border-radius: 3px;
    background: var(--neutral-30);
  }

  &__fill {
    display: block;
    height: 100%;
    background: var(--balance-bar-fill-color);
  }

  &__segment--hatched &__fill {
    background: repeating-linear-gradient(
      -45deg,
      var(--balance-bar-fill-color) 0 3px,
      transparent 3px 5px
    );
  }
}
</style>

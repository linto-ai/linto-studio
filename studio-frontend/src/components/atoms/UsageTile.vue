<template>
  <div class="usage-tile">
    <span class="usage-tile__label">{{ label }}</span>
    <strong class="usage-tile__value">{{ value }}</strong>
    <span v-if="detail" class="usage-tile__detail">{{ detail }}</span>
    <!-- Bottom-anchored extra content (a progress bar, an expiry line…). -->
    <div v-if="$slots.default" class="usage-tile__footer">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "UsageTile",
  props: {
    label: { type: String, required: true },
    // Pre-formatted, so the tile stays agnostic of units and locales.
    value: { type: String, required: true },
    detail: { type: String, default: null },
  },
}
</script>

<style lang="scss" scoped>
.usage-tile {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  padding: 0.75em;
  border: 1px solid var(--neutral-20);
  border-radius: 4px;
  background: var(--background-primary);

  &__label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  &__value {
    font-size: 1.25rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__detail {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  &__footer {
    margin-top: auto;
    padding-top: 0.5em;
  }
}
</style>

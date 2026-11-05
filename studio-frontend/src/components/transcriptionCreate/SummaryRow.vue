<template>
  <div class="summary-row flex gap-small">
    <dt class="summary-row__label flex align-center gap-small">
      <span class="summary-row__icon flex">
        <PhIcon v-if="icon" :name="icon" size="sm" />
      </span>
      {{ label }}
    </dt>
    <dd class="summary-row__value flex col flex1">
      <slot></slot>
    </dd>
  </div>
</template>
<script>
export default {
  name: "SummaryRow",
  props: {
    label: { type: String, required: true },
    // Without one, the label stays aligned with those of the other rows: the
    // row then reads as a detail of the one above.
    icon: { type: String, default: null },
  },
}
</script>
<style lang="scss" scoped>
.summary-row:nth-child(1) {
  border-top: 0px solid;
}

.summary-row {
  box-sizing: border-box;
  align-items: center;
  min-height: 60px;
  border-top: var(--border-block);
}

.summary-row__label {
  flex: 0 0 12rem;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

// The width of the small icon.
.summary-row__icon {
  flex: 0 0 1.25rem;
}

.summary-row__value {
  margin: 0;
  gap: var(--tiny-gap);
  min-width: 0;
  font-weight: 600;
}
</style>

<template>
  <div class="summary-row flex gap-small">
    <dt class="summary-row__label">{{ label }}</dt>
    <dd class="summary-row__value flex col flex1">
      <slot>{{ value }}</slot>
    </dd>
    <slot name="action">
      <Button
        v-if="withEdit"
        class="summary-row__edit"
        type="button"
        variant="link"
        size="sm"
        :disabled="disabled"
        :aria-label="$t('transcription_create.summary.edit_row', { label })"
        @click="$emit('edit')">
        {{ $t("transcription_create.summary.edit") }}
      </Button>
    </slot>
  </div>
</template>
<script>
export default {
  name: "SummaryRow",
  props: {
    label: { type: String, required: true },
    // A plain value: the default slot takes over for anything richer
    value: { type: String, default: "" },
    // Offers the button emitting "edit"
    withEdit: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
  },
}
</script>
<style lang="scss" scoped>
.summary-row:nth-child(1) {
  border-top: 0px solid;
}

.summary-row {
  align-items: baseline;
  border-top: var(--border-block);
  padding: 0.5rem 0rem;
}

.summary-row__label {
  flex: 0 0 9rem;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

// A button centers itself by default: here, it follows the row's text.
.summary-row__edit {
  align-self: baseline;
}

.summary-row__value {
  margin: 0;
  gap: var(--tiny-gap);
  min-width: 0;
  font-weight: 600;
}
</style>

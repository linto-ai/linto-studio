<template>
  <!-- How many items are selected, and the way to start over. -->
  <div
    class="popover-list-selection-footer flex align-center gap-small"
    @click.stop>
    <!-- A live result: screen readers hear the count change. -->
    <output
      class="popover-list-selection-footer__count flex1 text-cut"
      aria-live="polite">
      {{ $tc(countKey, count) }}
    </output>
    <!-- Enter belongs to the button here, not to the highlighted item. -->
    <Button
      class="popover-list-selection-footer__clear"
      type="button"
      variant="link"
      size="sm"
      :label="$t('popover_list.clear_selection')"
      :disabled="count === 0"
      @keydown.enter.native.stop
      @click="$emit('clear')" />
  </div>
</template>
<script>
export default {
  name: "PopoverListSelectionFooter",
  props: {
    count: { type: Number, required: true },
    // Translation of the whole sentence, in three forms (none | one | many)
    countKey: { type: String, required: true },
  },
}
</script>
<style lang="scss" scoped>
.popover-list-selection-footer {
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding: var(--tiny-gap) 0.75rem;
  border-top: 1px solid var(--neutral-20);
  background: var(--background-app);
}

.popover-list-selection-footer__count {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.popover-list-selection-footer__clear {
  flex-shrink: 0;
}
</style>

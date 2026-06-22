<template>
  <!-- Single-choice segmented toggle (a radio group, not tabs): no panel,
       mutually exclusive options, sized to its content. -->
  <div class="segmented" role="radiogroup" :aria-label="ariaLabel">
    <button
      v-for="opt in options"
      :key="opt.name"
      type="button"
      role="radio"
      class="segmented__option"
      :class="{ 'segmented__option--active': opt.name === value }"
      :aria-checked="opt.name === value"
      :disabled="disabled"
      @click.stop="$emit('input', opt.name)">
      {{ opt.label }}
    </button>
  </div>
</template>
<script>
export default {
  name: "SegmentedControl",
  props: {
    // Currently selected option name (v-model).
    value: { default: null },
    // [{ name, label }]
    options: { type: Array, required: true },
    disabled: { type: Boolean, default: false },
    ariaLabel: { type: String, default: undefined },
  },
}
</script>
<style lang="scss" scoped>
// Mirrors the inline-tabs look: white track, neutral border, primary-bordered
// selected segment. Height matches form inputs/selects (40.5px).
.segmented {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 40.5px;
  gap: 0.25rem;
  padding: 2px;
  background: var(--background-primary);
  border: 1px solid var(--neutral-30);
  border-radius: 4px;
  box-sizing: border-box;

  &__option {
    appearance: none;
    cursor: pointer;
    padding: 0.35rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 3px;
    background: transparent;
    font-size: var(--text-sm);
    font-weight: 600;
    line-height: 1.2;
    color: var(--text-secondary);
    transition:
      background 0.12s ease,
      color 0.12s ease,
      border-color 0.12s ease;
    height: 100%;
    display: flex;

    // Neutralize the global button hover (translateY + shadow). Scoped styles
    // are unlayered, so they win over the @layer base `button:hover` rule.
    &:hover:not(:disabled) {
      transform: none;
      box-shadow: none;
    }

    &:hover:not(:disabled):not(.segmented__option--active) {
      color: var(--text-primary);
    }

    &--active {
      color: var(--primary-color);
      background: var(--primary-soft);
      border-color: var(--primary-color);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>

<template>
  <div
    class="input-box"
    :class="{
      'input-box--disabled': disabled,
      'input-box--error': error,
      'input-box--fullwidth': fullwidth,
    }">
    <label
      v-if="$scopedSlots.prefix || $slots.prefix"
      :for="inputId"
      class="input-box__prefix">
      <slot name="prefix"></slot>
    </label>
    <slot></slot>
  </div>
</template>

<script>
/**
 * InputItem — presentational "input group" shell.
 *
 * Renders a bordered box (with the standard focus-within ring) holding an
 * optional leading `prefix` slot and a consumer-provided control passed in the
 * default slot. The shell owns only the BOX look; it strips the slotted
 * control's own border/background via `:deep(.input-box__input)` so the input
 * visually merges into the box. Mark the slotted input with the class
 * `input-box__input` to receive that reset.
 *
 * Orchestration (label, error message, v-model, confirmation buttons) stays in
 * the parent (e.g. FormInput); this component is purely visual.
 */
export default {
  name: "InputItem",
  props: {
    // Id of the slotted control, so the prefix <label> focuses it on click.
    inputId: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    fullwidth: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
.input-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-sizing: border-box;
  height: 40.5px; // match the app-wide input height (forms.scss base)
  min-width: 10rem;
  max-width: 20rem;
  padding: 0 0.75rem;
  border: var(--border-input);
  border-radius: var(--border-radius-sm);
  background-color: var(--background-primary);
  color: var(--text-primary);
  // Mirror FormInput's input transition exactly (animates border, ring AND the
  // keyboard-focus outline together) so the focus animation matches.
  transition: all 0.2s ease;

  &:hover:not(.input-box--disabled) {
    border-color: var(--neutral-40);
  }

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-soft);
  }

  &--fullwidth {
    width: 100%;
    min-width: 0;
    max-width: none;
  }

  &--disabled {
    background-color: var(--neutral-10);
    border-color: var(--neutral-20);
    cursor: not-allowed;
  }

  &--error {
    border-color: var(--danger-color);

    &:focus-within {
      border-color: var(--danger-color);
      box-shadow: 0 0 0 3px var(--danger-soft);
    }
  }

  // Match FormInput's keyboard-focus affordance: the inner input's own
  // `:focus-visible` outline is stripped (it would hug the borderless text),
  // so mirror it on the box instead, only for keyboard focus.
  &:has(.input-box__input:focus-visible) {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
}

.input-box__prefix {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  margin: 0;
  line-height: 0;
  color: var(--text-secondary);
  cursor: text; // clicking the icon focuses the input (via `for`)
}

// Strip the slotted control so it merges into the box. `:deep` is unlayered, so
// it overrides the `@layer base` bare-`input` rules. The leading `.input-box`
// is required: it lifts specificity to (0,3,0) so the strip also beats the
// consumer's own scoped `.form-field__input[data-v]` (0,2,0) rule, which would
// otherwise win on source order and keep the input's border.
.input-box :deep(.input-box__input) {
  flex: 1 1 0%;
  width: 100%;
  min-width: 0;
  max-width: none;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  outline: none;
  transition: none;
}

.input-box :deep(.input-box__input:focus),
.input-box :deep(.input-box__input:focus-visible) {
  outline: none;
  box-shadow: none;
}

@media (prefers-reduced-motion: reduce) {
  .input-box {
    transition: none;
  }
}

@media (prefers-contrast: high) {
  .input-box {
    border-width: 2px;
  }
}
</style>

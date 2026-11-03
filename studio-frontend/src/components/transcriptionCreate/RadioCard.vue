<template>
  <!-- One choice of a list, as a card holding a native radio button. With an
       icon, the card shows it instead of the radio button. -->
  <label
    class="radio-card flex gap-small"
    :class="icon ? 'radio-card--icon col justify-center' : 'align-center'">
    <input
      type="radio"
      :name="name"
      :value="choiceValue"
      :checked="value === choiceValue"
      :disabled="disabled"
      @change="$emit('input', choiceValue)" />
    <ph-icon v-if="icon" :name="icon" size="lg" />
    <span class="flex col">
      <span class="radio-card__label">{{ label }}</span>
      <span v-if="description" class="radio-card__description">
        {{ description }}
      </span>
    </span>
  </label>
</template>
<script>
export default {
  name: "RadioCard",
  props: {
    // Name of the radio group
    name: { type: String, required: true },
    value: { type: [String, Number], default: null },
    choiceValue: { type: [String, Number], required: true },
    label: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
}
</script>
<style lang="scss" scoped>
.radio-card {
  padding: var(--medium-gap);
  border: var(--border-block);
  border-radius: var(--border-radius-sm);
  cursor: pointer;

  &:hover {
    background: var(--neutral-10);
  }

  // The selected border stays the same width: nothing moves.
  &:has(:checked) {
    border-color: var(--primary-color);
    //box-shadow: inset 0 0 0 1px var(--primary-color);
    background: var(--primary-soft);
  }

  &:has(:focus-visible) {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  &:has(:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  input {
    flex-shrink: 0;
    accent-color: var(--primary-color);
  }
}

.radio-card--icon {
  position: relative;
  flex: 1 1 0;
  align-items: center;
  min-width: 6rem;
  text-align: center;

  &:has(:checked) {
    color: var(--primary-color);
  }

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
}

.radio-card__label {
  font-weight: 600;
  color: var(--text-primary);
}

.radio-card__description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}
</style>

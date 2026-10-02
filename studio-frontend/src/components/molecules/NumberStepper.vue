<template>
  <div class="number-stepper flex align-center gap-small" role="group">
    <Button
      type="button"
      size="sm"
      icon="minus"
      class="number-stepper__button"
      :aria-label="decrementLabel"
      :title="decrementLabel"
      :disabled="isAtMin"
      @click="decrement" />
    <input
      ref="input"
      class="number-stepper__value"
      type="number"
      inputmode="numeric"
      step="1"
      :min="min"
      :max="max"
      :value="value"
      v-bind="$attrs"
      @input="followTypedValue"
      @change="commitTypedValue" />
    <Button
      type="button"
      size="sm"
      icon="plus"
      class="number-stepper__button"
      :aria-label="incrementLabel"
      :title="incrementLabel"
      :disabled="isAtMax"
      @click="increment" />
  </div>
</template>
<script>
import { clampNumber } from "@/tools/clampNumber"

// Integer counter (v-model). Attributes (id, aria-labelledby…) land on the
// input so the caller can label it.
export default {
  name: "NumberStepper",
  inheritAttrs: false,
  props: {
    value: { type: Number, required: true },
    min: { type: Number, default: 0 },
    // null: no maximum
    max: { type: Number, default: null },
    decrementLabel: { type: String, required: true },
    incrementLabel: { type: String, required: true },
  },
  computed: {
    isAtMin() {
      return this.value <= this.min
    },
    isAtMax() {
      return this.max !== null && this.value >= this.max
    },
  },
  methods: {
    decrement() {
      this.stepBy(-1)
    },
    increment() {
      this.stepBy(1)
    },
    // The button reaching a bound gets disabled, which drops keyboard focus:
    // hand it over to the input
    stepBy(delta) {
      const nextValue = clampNumber(this.value + delta, this.min, this.max)
      this.emitValue(nextValue)
      if (nextValue === this.min || nextValue === this.max) {
        this.$refs.input.focus()
      }
    },
    // Follows typing and native arrow keys while the value is complete and
    // in range; anything else waits for the change event.
    followTypedValue({ target }) {
      if (target.value !== "" && target.validity.valid) {
        this.emitValue(target.valueAsNumber)
      }
    },
    // The input is rewritten by hand: when the clamped value equals the
    // current one, Vue has nothing to re-render.
    commitTypedValue({ target }) {
      const typedValue = Math.round(target.valueAsNumber)
      const nextValue = Number.isNaN(typedValue)
        ? this.value
        : clampNumber(typedValue, this.min, this.max)
      target.value = nextValue
      this.emitValue(nextValue)
    },
    emitValue(nextValue) {
      if (nextValue !== this.value) this.$emit("input", nextValue)
    },
  },
}
</script>

<style lang="scss" scoped>
.number-stepper__button {
  --btn-padding: var(--small-gap);
  aspect-ratio: 1;
}

.number-stepper__value {
  width: 3ch;
  min-width: 0;
  height: auto;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: var(--text-2xl);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: center;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: var(--border-radius-sm);
  }
}
</style>

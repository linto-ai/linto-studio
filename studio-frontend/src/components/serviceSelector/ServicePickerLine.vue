<template>
  <!-- One selectable model in the picker list. Presentational: it renders the
       shared header and emits `pick` on click. Security-locked rows never emit. -->
  <div
    class="service-picker-line"
    :class="{ 'service-picker-line--disabled': disabled }"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled"
    :selected="selected"
    @click="onClick">
    <ServiceHeader
      :value="value"
      :recommended="recommended"
      :disabled="disabled" />
  </div>
</template>
<script>
import ServiceHeader from "./ServiceHeader.vue"

export default {
  props: {
    value: {
      required: true,
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    // The model does not meet the chosen confidentiality level.
    disabled: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      if (this.disabled) return
      this.$emit("pick")
    },
  },
  components: { ServiceHeader },
}
</script>
<style lang="scss" scoped>
.service-picker-line {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid var(--neutral-20);

  &:last-child {
    border-bottom: none;
  }

  &[selected] {
    background: var(--primary-soft);
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>

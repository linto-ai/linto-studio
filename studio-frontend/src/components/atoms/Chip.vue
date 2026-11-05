<template>
  <div
    class="chip"
    :class="{ 'chip--removable': removable }"
    :primary="primary"
    :soft="soft"
    :red="red"
    :yellow="yellow"
    :style="style">
    <span class="chip__value text-cut">{{ value }}</span>
    <button
      v-if="removable"
      class="chip__remove custom flex align-center"
      type="button"
      :aria-label="removeLabel"
      :title="removeLabel"
      :disabled="disabled"
      @click.stop="$emit('remove')">
      <PhIcon name="x" weight="bold" :size="12" />
    </button>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
export default {
  name: "Chip",
  props: {
    value: { type: String, default: "" },
    // Offers a button emitting "remove", named by removeLabel
    removable: { type: Boolean, default: false },
    removeLabel: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
    soft: { type: Boolean, default: false },
    red: { type: Boolean, default: false },
    yellow: { type: Boolean, default: false },
    color: { type: String, default: null },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    style() {
      const res = {}
      if (this.color) {
        res.color = this.color
      }
      return res
    },
  },
  components: { Fragment },
}
</script>

<style lang="scss" scoped>
.chip {
  display: inline-block;
  border: 1px solid var(--neutral-30);
  border-radius: 50px;
  padding: 0 0.5rem;
  background-color: var(--background-primary);
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;

  &[primary] {
    //border: 2px solid;
    background-color: var(--primary-color);
    color: var(--primary-contrast);
  }

  // Mixed with the text color: the primary color alone isn't readable on its
  // soft background, in light as in dark themes.
  &[soft] {
    background-color: var(--primary-soft);
    border-color: color-mix(
      in srgb,
      var(--primary-color) 30%,
      var(--primary-soft)
    );
    color: color-mix(in srgb, var(--primary-color) 50%, var(--text-primary));
  }

  &--removable {
    display: inline-flex;
    align-items: center;
    gap: var(--tiny-gap);
    min-width: 0;
  }

  &[red] {
    background-color: var(--danger-soft);
    border-color: var(--danger-color);
    color: var(--danger-color);
  }

  &[yellow] {
    background-color: var(--warning-soft);
    border-color: var(--warning-color);
    color: var(--warning-text);
  }
}

.chip__value {
  min-width: 0;
}

.chip__remove {
  flex-shrink: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
}
</style>

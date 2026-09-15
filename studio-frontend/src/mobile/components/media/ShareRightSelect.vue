<template>
  <select
    class="m-right-select"
    :value="value"
    :disabled="disabled"
    :aria-label="label"
    @change="$emit('input', Number($event.target.value))">
    <option v-if="!known" :value="value">
      {{ $t("mobile.share.custom_right") }}
    </option>
    <option v-for="right in rights" :key="right.value" :value="right.value">
      {{ right.txt }}
    </option>
  </select>
</template>

<script>
import RIGHTS_LIST from "@/const/rigthsList.js"

// The right levels of the classic RIGHTS_LIST as a native select. A value
// outside the list (a bitmask set elsewhere) is shown as "custom".
export default {
  name: "ShareRightSelect",
  props: {
    value: { type: Number, required: true },
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    rights() {
      return RIGHTS_LIST((key) => this.$t(key))
    },
    known() {
      return this.rights.some((right) => right.value === this.value)
    },
  },
}
</script>

<style scoped>
.m-right-select {
  font: inherit;
  font-size: var(--m-font-size-sm);
  color: var(--m-text);
  min-height: var(--m-tap);
  max-width: 44vw;
  padding: 0 var(--m-space-2);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-right-select:disabled {
  color: var(--m-text-muted);
  background: var(--m-surface-muted);
}
</style>

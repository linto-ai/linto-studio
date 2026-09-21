<template>
  <button
    type="button"
    class="m-icon-button"
    :aria-label="label"
    v-on="$listeners">
    <PhIcon :name="icon" :size="size" :weight="weight" />
  </button>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Square 44px tap target around a single icon. The label is mandatory: the
// icon alone means nothing to a screen reader. Listeners are forwarded to
// the native button so @click works on the component.
export default {
  name: "IconButton",
  components: { PhIcon },
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    size: { type: String, default: "md" },
    weight: { type: String, default: "regular" },
  },
}
</script>

<style scoped>
.m-icon-button {
  width: var(--m-tap);
  height: var(--m-tap);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--m-radius-sm);
  background: transparent;
  color: var(--m-text);
}

.m-icon-button:active {
  background: var(--m-divider);
}
</style>

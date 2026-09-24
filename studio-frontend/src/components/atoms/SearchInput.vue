<template>
  <InputItem :inputId="inputId" :disabled="disabled" :fullwidth="fullwidth">
    <template #prefix>
      <PhIcon name="magnifying-glass" size="sm" />
    </template>
    <input
      :id="inputId"
      class="input-box__input search-input__control"
      type="search"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="label"
      @input="onInput" />
  </InputItem>
</template>

<script>
import { generateId } from "@/tools/generateId.js"
import InputItem from "./InputItem.vue"
import PhIcon from "./PhIcon.vue"

export default {
  name: "SearchInput",
  components: { InputItem, PhIcon },
  props: {
    value: { type: String, default: "" },
    // Accessible name: the field shows a placeholder, never a visible label.
    label: { type: String, required: true },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    fullwidth: { type: Boolean, default: false },
  },
  data() {
    return { inputId: generateId() }
  },
  methods: {
    onInput(event) {
      this.$emit("input", event.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-input__control {
  flex: 1;
  min-width: 0;
}
</style>

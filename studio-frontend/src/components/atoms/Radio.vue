<template>
  <div class="custom-radio flex">
    <input
      type="radio"
      :id="id"
      :name="name"
      :checked="value"
      :disabled="disabled"
      :value="radioValue"
      v-model="_value" />
    <label :for="id">
      <span class="custom-radio__check"></span>
    </label>
  </div>
</template>
<script>
export default {
  name: "Radio",
  props: {
    // global value shared by the radio button
    value: { type: [String, Object, Number], default: null },
    id: { type: String, default: "" },
    // value which will be set when this radio is selected
    radioValue: { type: [String, Object, Number], default: null },
    disabled: { type: Boolean, default: false },
    name: { type: String, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(value) {
        if (this.disabled) return
        this.$emit("input", value)
      },
    },
  },
}
</script>

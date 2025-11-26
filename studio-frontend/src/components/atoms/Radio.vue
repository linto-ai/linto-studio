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
import { Fragment } from "vue-fragment"
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
  components: { Fragment },
}
</script>

<style lang="scss" scoped>
.custom-radio {
  input {
    display: none;
  }

  label {
    border: 1px solid var(--neutral-40);
    height: 20px;
    width: 20px;
    border-radius: 16px;
    box-sizing: border-box;
    padding: 4px;
    margin: 0;
    background-color: var(--neutral-10);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input:checked + label {
    .custom-radio__check {
      width: 100%;
      height: 100%;
      border-radius: 24px;
      background-color: var(--primary-color);
    }

    border-color: var(--primary-color);
  }
}
</style>

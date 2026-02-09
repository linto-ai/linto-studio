<template>
  <div class="custom-checkbox flex" :class="{ indeterminate }">
    <input
      ref="checkbox"
      type="checkbox"
      :id="id"
      :name="name"
      :checked="value"
      :disabled="disabled"
      :value="checkboxValue"
      v-model="_value" />
    <label :for="id">
      <span class="custom-checkbox__check"></span>
    </label>
  </div>
</template>
<script>
export default {
  name: "Checkbox",
  props: {
    value: { type: [Boolean, Array], default: false },
    id: {
      type: String,
      default: () => Math.random().toString(36).substring(2, 11),
    },
    name: { type: String, default: "" },
    checkboxValue: { type: [String, Object, Number], default: null },
    disabled: { type: Boolean, default: false },
    indeterminate: { type: Boolean, default: false },
  },
  data() {
    return {}
  },
  mounted() {
    this.updateIndeterminate()
  },
  watch: {
    indeterminate() {
      this.updateIndeterminate()
    },
  },
  methods: {
    updateIndeterminate() {
      if (this.$refs.checkbox) {
        this.$refs.checkbox.indeterminate = this.indeterminate
      }
    },
  },
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
  components: {},
}
</script>

<style lang="scss" scoped>
.custom-checkbox {
  input {
    display: none;
  }

  label {
    border: 1px solid var(--neutral-40);
    height: 16px;
    width: 16px;
    margin: 0;
    background-color: var(--neutral-10);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
  }

  input:checked + label {
    .custom-checkbox__check {
      width: 4px;
      height: 10px;
      border: solid var(--primary-contrast);
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      position: relative;
      bottom: 2px;
    }

    border-color: var(--primary-color);
    background-color: var(--primary-color);
  }

  input:disabled + label {
    background-color: var(--neutral-20);
    border: 1px solid var(--neutral-40);
  }

  &.indeterminate label {
    border-color: var(--primary-color);
    background-color: var(--primary-color);

    .custom-checkbox__check {
      width: 8px;
      height: 2px;
      background-color: var(--primary-contrast);
    }
  }
}
</style>

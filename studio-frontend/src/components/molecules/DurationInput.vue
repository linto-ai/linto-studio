<template>
  <FormInput :field="countUnit" v-model="countUnit.value">
    <template #content-after-input>
      <select v-model="unit.value" class="duration-input__step-selector">
        <option v-for="step of steps" :value="step">
          {{ $tc(`duration_input.${step}`, countUnit.value) }}
        </option>
      </select>
    </template>
  </FormInput>
</template>
<script>
import { bus } from "@/main.js"
import EMPTY_FIELD from "@/const/emptyField"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    field: {
      type: Object,
      required: true,
    },
    steps: {
      type: Array,
      default: () => {
        return ["h", "d", "y"]
      },
    },
  },
  data() {
    return {
      countUnit: {
        ...EMPTY_FIELD,
        ...this.field,
        type: "number",
        value: 1,
        customParams: {
          min: 1,
        },
      },
      unit: {
        ...EMPTY_FIELD,
        value: "d",
      },
    }
  },
  mounted() {},
  methods: {},
  components: {
    FormInput,
  },
  watch: {
    value: {
      handler(value) {
        const unit = value.slice(-1)
        const countUnit = value.slice(0, -1)
        this.unit.value = unit
        this.countUnit.value = countUnit
      },
      immediate: true,
    },
    "countUnit.value"() {
      const duration = this.countUnit.value + this.unit.value
      console.log("upd 1", duration)
      this.$emit("input", duration)
    },
    "unit.value"() {
      const duration = this.countUnit.value + this.unit.value
      console.log("upd 2", duration)
      this.$emit("input", duration)
    },
  },
}
</script>

<style lang="scss" scoped>
.duration-input__step-selector {
  min-width: auto;
}
</style>

<template>
  <div class="flex gap-medium align-bottom metadata-editor-line">
    <!-- <legend>Meta-donnée {{ this.index + 1 }}</legend> -->
    <FormInput
      :field="fieldName"
      @input="updateName"
      class="flex1 metadata-line__key"
      inputFullWidth>
      <!-- <template v-slot:content-after-input>
        <span class="metadata-line__separator">:</span>
      </template> -->
    </FormInput>
    <FormInput
      :field="fieldValue"
      @input="updateValue"
      class="flex1 metadata-line__value"
      inputFullWidth>
      <template v-slot:content-after-input> </template
    ></FormInput>
    <div>
      <button class="only-icon" @click="deleteRow">
        <span class="icon trash"></span>
      </button>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import EMPTY_FIELD from "@/const/emptyField"
import FormInput from "@/components/FormInput.vue"

export default {
  props: {
    value: {
      type: Array, // [key, value]
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    fieldName() {
      return {
        ...EMPTY_FIELD,
        label:
          this.$t("session.settings_page.metadata.key_label") +
          " " +
          (this.index + 1),
        value: this.value[0],
      }
    },
    fieldValue() {
      return {
        ...EMPTY_FIELD,
        label:
          this.$t("session.settings_page.metadata.value_label") +
          " " +
          (this.index + 1),
        value: this.value[1],
      }
    },
  },
  methods: {
    deleteRow() {
      this.$emit("onDelete")
    },
    updateName(value) {
      this.$emit("input", [value, this.value[1]])
    },
    updateValue(value) {
      if (this.value[0]) {
        this.$emit("input", [this.value[0], value])
      }
    },
  },
  components: {
    FormInput,
  },
}
</script>

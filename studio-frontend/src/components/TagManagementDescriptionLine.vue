<template>
  <!-- <div class="flex tag-description-line gap-small flex1">
    <label>Description:</label>
    <input
      class="flex1 fullwidth"
      type="text"
      :value="description"
      placeholder="Ajouter une description" />
  </div> -->
  <FormInput
    :field="descriptionField"
    @input="onDescriptionChange"
    inline
    withConfirmation />
</template>
<script>
import { bus } from "@/main.js"
import EMPTY_FIELD from "@/const/emptyField"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  props: {
    description: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      descriptionField: {
        ...EMPTY_FIELD,
        value: this.description,
        placeholder: this.$t("manage_tags.description_placeholder"),
        //label: "Description",
      },
    }
  },
  mounted() {},
  methods: {
    onDescriptionChange(value) {
      this.$emit("submit", value)
    },
  },
  computed: {
    contentEditableProperty() {
      // to support old ESR versions (not for a long time, firefox 140 is the last ESR, released on June 24, 2025 )
      if (navigator.userAgent.indexOf("Firefox") > -1) {
        const version = navigator.userAgent.split("Firefox/")[1]
        if (parseInt(version) < 139) {
          return "true"
        }
      }
      return "plaintext-only"
    },
  },
  watch: {
    description(newValue) {
      this.descriptionField.value = newValue
    },
  },
  components: { FormInput },
}
</script>
<style lang="scss" scoped>
.tag-description-line {
  label {
    color: var(--text-secondary);
  }
  input {
    padding: 0;
    height: fit-content;
    border: 0px solid;
    border-bottom: var(--border-input);
    border-radius: 0;
  }
}
</style>

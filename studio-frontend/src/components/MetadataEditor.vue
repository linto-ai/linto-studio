<template>
  <div class="subSection metadata-container flex col gap-small">
    <MetadataEditorLine
      v-for="(pairs, index) in value"
      :key="index"
      :index="index"
      :value="pairs"
      @onDelete="deletePair(index)"
      @input="updatePairs($event, index)"></MetadataEditorLine>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import FormInput from "@/components/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import MetadataEditorLine from "@/components/MetadataEditorLine.vue"
export default {
  props: {
    field: {
      type: Object, // field.value is a list of [key, value] (from Object.entries())
      required: true,
    },
  },
  data() {
    return {
      defaultKey: "",
      defaultValue: "",
    }
  },
  mounted() {},
  methods: {
    updatePairs(newPairs, index) {
      // maybe not necessary and more optimized to do shallow copy instead but it's safer (and more idiomatic with the emit('input')) to use structuredClone
      const newValue = structuredClone(this.field.value)
      newValue[index] = newPairs
      this.$emit("input", newValue)
    },
    deletePair(index) {
      const newValue = structuredClone(this.field.value)
      newValue.splice(index, 1)
      this.$emit("input", newValue)
    },
  },
  computed: {
    value: {
      get: function () {
        return [...this.field.value, [this.defaultKey, this.defaultValue]]
      },
      set: function (value) {
        console.log("changed", value)
        //this.$emit("input", value)
      },
    },
  },
  components: {
    FormInput,
    MetadataEditorLine,
  },
}
</script>

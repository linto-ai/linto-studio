<template>
  <Modal isForm title="create token" v-model="isOpen">
    <FormInput :field="name" v-model="name.value" />
  </Modal>
</template>
<script>
import { bus } from "@/main.js"
import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"

export default {
  props: {
    value: { type: Boolean, required: true },
  },
  data() {
    return {
      name: {
        ...EMPTY_FIELD,
        label: "name",
      },
    }
  },
  mounted() {},
  methods: {},
  computed: {
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  components: {
    Modal,
    FormInput,
  },
}
</script>

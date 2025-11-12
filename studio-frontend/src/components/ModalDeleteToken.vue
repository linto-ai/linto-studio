<template>
  <Modal
    :title="title"
    v-model="isOpen"
    withActionDelete
    :withActionApply="false"
    @delete="$emit('delete', token.userId)">
    {{
      $t("api_tokens_settings.modal_delete.content", {
        name: this.token.firstname,
      })
    }}
  </Modal>
</template>
<script>
import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  props: {
    value: { type: Boolean, required: true },
    token: { type: Object, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    title() {
      return this.$t("api_tokens_settings.modal_delete.title", {
        name: this.token.firstname,
      })
    },
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

<style lang="scss" scoped>
.modal-view-token__loading {
  height: 50px;
}
</style>

<template>
  <Modal
    :title="title"
    v-model="isOpen"
    withActionDelete
    :withActionApply="false"
    @delete="$emit('delete', token._id)">
    {{
      $t("api_tokens_settings.modal_delete.content", {
        name: this.token.firstname,
      })
    }}
  </Modal>
</template>
<script>
import { bus } from "@/main.js"
import { mapGetters } from "vuex"

import { apiGetToken } from "@/api/token"
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
    ...mapGetters("organizations", {
      organizationId: "getCurrentOrganizationScope",
    }),
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

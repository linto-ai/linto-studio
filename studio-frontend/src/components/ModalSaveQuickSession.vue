<template>
  <Modal
    :title="$t('quick_session.modal_save.title')"
    v-model="isOpen"
    @submit="save"
    isForm
    :textActionApply="$t('quick_session.modal_save.confirm')">
    <FormInput :field="nameField" v-model="nameField.value" />
  </Modal>
</template>
<script>
import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import { mapActions, mapGetters } from "vuex"

export default {
  props: {
    value: { type: Boolean, required: true },
    placeholder: { type: String, default: "" },
  },
  data() {
    return {
      nameField: {
        ...EMPTY_FIELD,
        label: this.$t("quick_session.modal_save.name"),
        placeholder: this.placeholder,
      },
    }
  },
  mounted() {},
  methods: {
    ...mapActions("quickSession", ["saveQuickSession"]),
    async save() {
      await this.saveQuickSession(this.nameField.value || this.placeholder)
    },
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    isOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  watch: {
    placeholder(value) {
      this.nameField.placeholder = value
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

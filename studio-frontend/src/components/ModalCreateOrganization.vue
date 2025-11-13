<template>
  <ModalNew
    v-model="isOpen"
    isForm
    @on-cancel="($event) => this.$emit('on-cancel')"
    small
    :title="$t('modal_create_organization.title')"
    :with-action-cancel="false"
    :with-action-apply="false">
    <FormInput
      v-model="orgaName.value"
      :field="orgaName"
      inputId="organisation-name"
      required />

    <template v-slot:actions-right>
      <Button
        variant="secondary"
        @click="$emit('on-cancel')"
        :disabled="state === 'sending'">
        {{ $t("modal.cancel") }}
      </Button>
      <Button
        variant="primary"
        type="submit"
        @click="createOrganisation"
        :disabled="state === 'sending'"
        :loading="state === 'sending'">
        {{ $t("modal_create_organization.action_btn") }}
      </Button>
    </template>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main.js"
import EMPTY_FIELD from "@/const/emptyField"
import { testFieldEmpty } from "@/tools/fields/testEmpty.js"
import { formsMixin } from "@/mixins/forms.js"

import FormInput from "@/components/molecules/FormInput.vue"
import Button from "@/components/atoms/Button.vue"
import { apiCreateOrganisation } from "../api/organisation"
import ModalNew from "@/components/molecules/Modal.vue"

export default {
  mixins: [formsMixin],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fields: ["orgaName"],
      orgaName: {
        ...EMPTY_FIELD,
        value: "",
        testField: testFieldEmpty,
        autocomplete: "off",
        label: this.$t("modal_create_organization.label_name"),
      },
      state: "idle",
    }
  },
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
  methods: {
    ...mapActions("organizations", ["fetchOrganizations"]),
    async createOrganisation() {
      // Clear previous errors
      this.orgaName.error = null

      if (this.testFields()) {
        this.state = "sending"
        let res = await apiCreateOrganisation({ name: this.orgaName.value })
        if (res.status == "error") {
          this.orgaName.error = this.$t(
            "organisation.create.error_already_exists",
          )
          this.state = "idle"
          // Don't close the modal, just show the error
        } else {
          await this.fetchOrganizations()
          this.$emit("on-confirm", res)
          this.state = "idle"
          // Close modal on success
          this.isOpen = false
        }
      }
      // If validation fails, don't close the modal
    },
  },
  components: { Fragment, FormInput, ModalNew, Button },
}
</script>

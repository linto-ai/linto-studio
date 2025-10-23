<template>
  <Modal
    isForm
    :title="$t('api_tokens_settings.modal_create.title')"
    v-model="isOpen"
    @submit="createToken">
    <FormInput :field="name" v-model="name.value" />
    <FormInput :field="role">
      <template #custom-input="slotProps">
        <OrgaRoleSelector v-model="role.value" :id="slotProps.id" />
      </template>
    </FormInput>
    <DurationInput :field="expiration" v-model="expiration.value" />
  </Modal>
</template>
<script>
import { bus } from "@/main.js"
import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import OrgaRoleSelector from "./molecules/OrgaRoleSelector.vue"
import { apiCreateToken } from "@/api/token.js"
import { mapGetters } from "vuex"
import DurationInput from "@/components/molecules/DurationInput.vue"

export default {
  props: {
    value: { type: Boolean, required: true },
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      name: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.token_name_label"),
      },
      role: {
        ...EMPTY_FIELD,
        value: 1,
        label: this.$t("api_tokens_settings.token_role_label"),
      },
      expiration: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.modal_create.expiration_label"),
        value: "30d",
        customParams: {
          min: 1,
        },
      },
    }
  },
  mounted() {},
  methods: {
    async createToken() {
      const expiration = this.expiration.value
      const req = await apiCreateToken(this.organizationId, {
        name: this.name.value,
        role: this.role.value,
        expiration,
      })

      if (req.status == "success") {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.token_created"),
          type: "success",
          timeout: 5000,
        })
        this.$emit("handleTokenCreated", req.value)
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.token_created_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
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
  components: {
    Modal,
    FormInput,
    OrgaRoleSelector,
    DurationInput,
  },
}
</script>

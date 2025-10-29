<template>
  <Modal
    isForm
    :title="$t('backoffice.token_list.modal_create.title')"
    v-model="isOpen"
    @submit="createToken">
    <FormInput :field="name" v-model="name.value" />
    <div class="flex col gap-small form-field">
      <label>{{
        $t("backoffice.token_list.modal_create.platform_role")
      }}</label>
      <FormCheckbox
        :field="organization_initiator_field"
        v-model="organization_initiator_field.value" />
      <FormCheckbox
        :field="session_operator_field"
        v-model="session_operator_field.value" />
      <FormCheckbox
        :field="system_administrator_field"
        v-model="system_administrator_field.value" />
      <FormCheckbox
        :field="super_administrator_field"
        v-model="super_administrator_field.value" />
    </div>
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
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import { apiCreatePlatformToken } from "@/api/admin"
import { platformRoleMixin } from "@/mixins/platformRole.js"

export default {
  mixins: [platformRoleMixin],
  props: {
    value: { type: Boolean, required: true },
  },
  data() {
    return {
      name: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.token_name_label"),
      },
      organization_initiator_field: {
        label: this.$t("platform_role.organization_initiator"),
        value: false,
        error: null,
        disabled: false,
      },
      session_operator_field: {
        label: this.$t("platform_role.session_operator"),
        value: false,
        error: null,
        disabled: false,
      },
      system_administrator_field: {
        label: this.$t("platform_role.system_administrator"),
        value: false,
        error: null,
        disabled: false,
      },
      super_administrator_field: {
        label: this.$t("platform_role.super_administrator"),
        value: false,
        error: null,
        disabled: false,
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
      const role_value = this.computeRoleValue({
        USER: true,
        ORGANIZATION_INITIATOR: this.organization_initiator_field.value,
        SESSION_OPERATOR: this.session_operator_field.value,
        SYSTEM_ADMINISTRATOR: this.system_administrator_field.value,
        SUPER_ADMINISTRATOR: this.super_administrator_field.value,
      })

      const req = await apiCreatePlatformToken(this.organizationId, {
        name: this.name.value,
        role: role_value,
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
    FormCheckbox,
  },
}
</script>

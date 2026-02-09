<template>
  <Modal
    isForm
    :title="$t('backoffice.token_list.modal_create.title')"
    v-model="isOpen"
    @submit="createToken">
    <FormInput :field="name" v-model="name.value" />
    <PlatformRoleSelector
      :field="platformRoleField"
      v-model="platformRoleField.value" />
    <DurationInput :field="expiration" v-model="expiration.value" />
  </Modal>
</template>
<script>
import { bus } from "@/main.js"
import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import { apiCreateToken } from "@/api/token.js"
import { mapGetters } from "vuex"
import DurationInput from "@/components/molecules/DurationInput.vue"
import { apiCreatePlatformToken } from "@/api/admin"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import PlatformRoleSelector from "./molecules/PlatformRoleSelector.vue"

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
      platformRoleField: {
        value: 1,
        label: this.$t("backoffice.token_list.modal_create.platform_role"),
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
      const role_value = this.platformRoleField.value

      const req = await apiCreatePlatformToken({
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
    DurationInput,
    PlatformRoleSelector,
  },
}
</script>

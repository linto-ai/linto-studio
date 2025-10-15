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
    <FormInput :field="stepExpiration" v-model="stepExpiration.value">
      <template #content-after-input>
        <select v-model="unitExpiration.value">
          <option value="h">
            {{
              $tc(
                "api_tokens_settings.expiration_steps.hour",
                stepExpiration.value,
              )
            }}
          </option>
          <option value="d">
            {{
              $tc(
                "api_tokens_settings.expiration_steps.day",
                stepExpiration.value,
              )
            }}
          </option>
          <option value="m">
            {{ $t("api_tokens_settings.expiration_steps.month") }}
          </option>
          <option value="y">
            {{
              $tc(
                "api_tokens_settings.expiration_steps.year",
                stepExpiration.value,
              )
            }}
          </option>
        </select>
      </template>
    </FormInput>
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
import formatDateTimeToIso from "../tools/date/formatDateTimeToIso"

export default {
  props: {
    value: { type: Boolean, required: true },
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
      stepExpiration: {
        ...EMPTY_FIELD,
        type: "number",
        label: this.$t("api_tokens_settings.modal_create.expiration_label"),
        value: 30,
        customParams: {
          min: 1,
        },
      },
      unitExpiration: {
        ...EMPTY_FIELD,
        value: "d",
      },
      // expirationDate: {
      //   ...EMPTY_FIELD,
      //   value: formatDateTimeToIso(
      //     new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      //   ),
      //   label: this.$t("api_tokens_settings.token_expiration_date_label"),
      //   type: "datetime-local",
      //   customParams: {
      //     min: formatDateTimeToIso(new Date()),
      //   },
      // },
    }
  },
  mounted() {},
  methods: {
    async createToken() {
      const expiration = `${this.stepExpiration.value}${this.unitExpiration.value}`
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
    ...mapGetters("organizations", {
      organizationId: "getCurrentOrganizationScope",
    }),
  },
  components: {
    Modal,
    FormInput,
    OrgaRoleSelector,
  },
}
</script>

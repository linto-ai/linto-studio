<template>
  <Modal
    :title="title"
    v-model="isOpen"
    @submit="renewToken"
    isForm
    :textActionApply="$t('api_tokens_settings.modal_renew.confirm')">
    <DurationInput :field="expiration" v-model="expiration.value" />
  </Modal>
</template>
<script>
import { mapGetters } from "vuex"

import Modal from "@/components/molecules/Modal.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import getDurationFromSecond from "../tools/date/getDurationFromSecond"
import DurationInput from "@/components/molecules/DurationInput.vue"
import EMPTY_FIELD from "@/const/emptyField"
import { apiRenewToken } from "@/api/token"

export default {
  props: {
    value: { type: Boolean, required: true },
    token: { type: Object, required: true },
  },
  data() {
    return {
      expiration: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.modal_renew.expiration_label"),
        value: "0d",
        customParams: {
          min: 1,
        },
      },
    }
  },
  mounted() {},
  methods: {
    async renewToken() {
      const expiration = this.expiration.value
      const req = await apiRenewToken(this.organizationId, this.token.userId, {
        expiration,
      })

      if (req.status == "success") {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.token_renew_success"),
          type: "success",
          timeout: 5000,
        })
        this.$emit("handleTokenRenew", req.value)
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.token_renew_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
  },
  computed: {
    title() {
      return this.$t("api_tokens_settings.modal_renew.title", {
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
  watch: {
    token: {
      handler(value) {
        this.expiration.value = getDurationFromSecond(
          value.expiresIn / 1000 || 3600,
        )
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    Modal,
    FormInput,
    DurationInput,
  },
}
</script>

<style lang="scss" scoped>
.modal-view-token__loading {
  height: 50px;
}
</style>

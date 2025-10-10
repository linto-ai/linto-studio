<template>
  <Modal
    :title="title"
    v-model="isOpen"
    :withActionCancel="false"
    textActionApply="ok">
    <div v-if="loading" class="modal-view-token__loading relative">
      <Loading />
    </div>
    <div v-else-if="error" class="modal-view-token__error">
      {{ error }}
    </div>
    <div v-else class="modal-view-token__content">
      <FormInput :field="keyField" readonly code>
        <template #content-after-input>
          <Button :icon="iconCopy" @click="copy" />
        </template>
      </FormInput>
    </div>
  </Modal>
</template>
<script>
import { bus } from "@/main.js"
import { mapGetters } from "vuex"

import { apiGetToken } from "@/api/token"
import Modal from "@/components/molecules/Modal.vue"
import EMPTY_FIELD from "@/const/emptyField"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  props: {
    value: { type: Boolean, required: true },
    token: { type: Object, required: true },
  },
  data() {
    return {
      loading: true,
      tokenData: null,
      error: null,
      keyField: {
        ...EMPTY_FIELD,
        label: this.$t("api_tokens_settings.token_key_label"),
      },
      iconCopy: "copy",
    }
  },
  mounted() {
    this.fetchTokenData()
  },
  methods: {
    async fetchTokenData() {
      this.loading = true
      const req = await apiGetToken(this.organizationId, this.token._id)
      if (req.status == "success") {
        this.tokenData = req.data
        this.keyField.value = this.tokenData.auth_token
      } else {
        this.error = this.$t("api_tokens_settings.error_fetching_token_details")
      }
      this.loading = false
    },
    copy() {
      const value = this.keyField.value
      navigator.clipboard.writeText(value)
      this.iconCopy = "check"
      setTimeout(() => {
        this.iconCopy = "copy"
      }, 2000)
    },
  },
  computed: {
    title() {
      return this.token.firstname
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

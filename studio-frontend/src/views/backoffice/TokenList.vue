<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.token_list.title')"
        :add_button_label="$t('backoffice.token_list.add_token_button')"
        @on-create="showModalCreateToken" />
    </template>
    <GenericTableRequest
      ref="table"
      idKey="userId"
      :fetchMethod="fetchMethod"
      :columns="columns"
      :initSortListDirection="sortListDirection"
      :initSortListKey="sortListKey">
      <template #cell-role="{ value }">
        <PlatformRoleSelector v-model="value" readonly />
      </template>
      <template #cell-actions="{ value, id, element }" class="flex gap-small">
        <div class="flex gap-small">
          <Button
            icon="eye"
            variant="tertiary"
            @click="viewToken(id, element)"
            iconWeight="regular" />
          <CopyButton :value="getValue(id, element)" />
          <Button
            icon="arrows-clockwise"
            variant="tertiary"
            @click="renewToken(id, element)" />
          <Button
            icon="trash"
            variant="secondary"
            intent="destructive"
            iconWeight="regular"
            @click="deleteToken(id, element)" />
        </div>
      </template>
    </GenericTableRequest>
    <ModalViewToken
      v-if="selectedToken"
      :token="selectedToken"
      :fetchFunction="fetchToken"
      v-model="isModalViewTokenOpen" />
    <ModalCreateSystemToken
      v-model="isModalCreateTokenOpen"
      @handleTokenCreated="handleTokenCreated" />
    <ModalDeleteToken
      v-if="selectedToken"
      v-model="isModalDeleteTokenOpen"
      :token="selectedToken"
      @delete="confirmDelete" />
    <ModalRenewSystemToken
      v-if="selectedToken"
      v-model="isModalRenewTokenOpen"
      :token="selectedToken"
      @handleTokenRenew="handleTokenRenew" />
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import ApiTokenTable from "@/components/ApiTokenTable.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import {
  apiGetAllTokens,
  apiDeletePlatformToken,
  apiGetDetailToken,
} from "@/api/admin"
import PlatformRoleSelector from "@/components/molecules/PlatformRoleSelector.vue"
import { platformRoleMixin } from "@/mixins/platformRole"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalCreateSystemToken from "@/components/ModalCreateSystemToken.vue"
import ModalDeleteToken from "@/components/ModalDeleteToken.vue"
import ModalRenewSystemToken from "@/components/ModalRenewSystemToken.vue"
import ModalViewToken from "@/components/ModalViewToken.vue"

export default {
  mixins: [platformRoleMixin],
  props: {},
  data() {
    return {
      columns: [
        {
          key: "firstname",
          label: this.$t("api_tokens_settings.token_name_label"),
          width: "auto",
        },
        {
          key: "role",
          label: this.$t("api_tokens_settings.token_platform_role_label"),
          width: "1fr",
        },
        {
          key: "createdAt",
          label: this.$t("api_tokens_settings.token_creation_date_label"),
          width: "auto",
          transformValue: this.formatDate,
        },
        {
          key: "expiresAt",
          label: this.$t("api_tokens_settings.token_expiration_date_label"),
          width: "auto",
          transformValue: this.formatDate,
        },
        {
          key: "actions",
          width: "auto",
        },
      ],
      sortListDirection: "asc",
      sortListKey: "createdAt",
      selectedToken: null,
      isModalCreateTokenOpen: false,
      isModalDeleteTokenOpen: false,
      isModalRenewTokenOpen: false,
      isModalViewTokenOpen: false,
    }
  },
  mounted() {},
  methods: {
    fetchMethod: apiGetAllTokens,
    async fetchToken() {
      const req = await apiGetDetailToken(this.selectedToken.userId)
      if (req.status == "success") {
        return req.data
      } else {
        throw new Error(req.message)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    viewToken(id, element) {
      this.selectedToken = element
      this.isModalViewTokenOpen = true
    },
    deleteToken(id, element) {
      this.selectedToken = element
      this.isModalDeleteTokenOpen = true
    },
    async confirmDelete() {
      const res = await apiDeletePlatformToken(this.selectedToken.userId)
      if (res.status === "success") {
        this.$refs.table.removeElement(this.selectedToken.userId)
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.delete_success"),
          type: "success",
        })
      } else {
        console.error("Error deleting token:", res)
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.delete_error"),
          type: "error",
        })
      }
    },
    renewToken(id, element) {
      this.selectedToken = element
      this.isModalRenewTokenOpen = true
    },
    handleTokenRenew(newToken) {
      this.$refs.table.updateElement(newToken.user_id, newToken)
    },
    getValue(id) {
      return async () => {
        const res = await apiGetDetailToken(id)
        if (res.status == "success") {
          return res.data.auth_token
        } else {
          throw "error getting token"
        }
      }
    },
    showModalCreateToken() {
      this.isModalCreateTokenOpen = true
    },
    handleTokenCreated() {
      this.$refs.table.reset()
    },
  },
  components: {
    MainContentBackoffice,
    ApiTokenTable,
    GenericTableRequest,
    PlatformRoleSelector,
    HeaderTable,
    ModalCreateSystemToken,
    ModalDeleteToken,
    ModalRenewSystemToken,
    ModalViewToken,
  },
}
</script>

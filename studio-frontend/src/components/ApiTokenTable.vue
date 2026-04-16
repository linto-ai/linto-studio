<template>
  <div>
    <GenericTable
      :columns="columns"
      :content="decoratedTokens"
      :loading="loading"
      :sortListKey="sortListKey"
      :sortListDirection="sortListDirection"
      :rowClass="rowClass"
      idKey="userId"
      @list_sort_by="sortBy">
      <template #cell-firstname="{ element }">
        {{ element.firstname }}
      </template>
      <template #cell-organizationRole="{ element }">
        <OrgaRoleSelector v-model="element.organizationRole" readonly />
      </template>
      <template #cell-createdAt="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-expiresAt="{ value, element }">
        <div class="flex gap-small align-center">
          <span>{{ formatDate(value) }}</span>
          <Chip
            v-if="element.expired"
            red
            :value="$t('api_tokens_settings.token_expired')" />
          <Chip
            v-else-if="element.expiringSoon"
            yellow
            :value="$t('api_tokens_settings.token_expiring_soon')" />
        </div>
      </template>
      <template #cell-actions="{ element }">
        <div class="flex gap-small">
          <Button
            icon="eye"
            variant="tertiary"
            @click="openViewModal(element)"
            iconWeight="regular" />
          <CopyButton :value="() => fetchTokenValue(element)" />
          <Button
            icon="arrows-clockwise"
            variant="tertiary"
            @click="openRenewModal(element)" />
          <Button
            icon="trash"
            variant="secondary"
            intent="destructive"
            iconWeight="regular"
            @click="openDeleteModal(element)" />
        </div>
      </template>
    </GenericTable>
    <ModalViewToken
      v-if="selectedToken"
      :fetchFunction="fetchToken"
      :token="selectedToken"
      v-model="showViewModal"
      @close="closeViewModal" />
    <ModalDeleteToken
      v-if="selectedToken"
      v-model="showDeleteModal"
      :token="selectedToken"
      @delete="confirmDelete"
      @close="closeDeleteModal" />
    <ModalRenewToken
      v-if="selectedToken"
      v-model="showRenewModal"
      :token="selectedToken"
      :organizationId="organizationId"
      @handleTokenRenew="$emit('handleTokenRenew')"
      @close="closeRenewModal" />
  </div>
</template>

<script>
import { apiGetToken } from "@/api/token"
import Chip from "@/components/atoms/Chip.vue"
import GenericTable from "@/components/molecules/GenericTable.vue"
import OrgaRoleSelector from "./molecules/OrgaRoleSelector.vue"
import ModalDeleteToken from "./ModalDeleteToken.vue"
import ModalRenewToken from "./ModalRenewToken.vue"
import ModalViewToken from "./ModalViewToken.vue"
import { formatDateLocale } from "@/tools/formatDate"
import { isTokenExpiringSoon } from "@/tools/isTokenExpiringSoon"

export default {
  props: {
    tokenList: {
      type: Array,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
    sortListKey: {
      type: String,
      required: true,
    },
    sortListDirection: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showViewModal: false,
      showDeleteModal: false,
      showRenewModal: false,
      selectedToken: null,
    }
  },
  computed: {
    columns() {
      return [
        { key: "firstname", label: this.$t("api_tokens_settings.token_name_label"), width: "1fr" },
        { key: "organizationRole", label: this.$t("api_tokens_settings.token_role_label"), width: "auto" },
        { key: "createdAt", label: this.$t("api_tokens_settings.token_creation_date_label"), width: "auto" },
        { key: "expiresAt", label: this.$t("api_tokens_settings.token_expiration_date_label"), width: "auto" },
        { key: "actions", label: this.$t("api_tokens_settings.token_actions_label"), width: "auto" },
      ]
    },
    decoratedTokens() {
      const now = Date.now()
      return this.tokenList.map((token) => ({
        ...token,
        expiringSoon: isTokenExpiringSoon(token, now),
      }))
    },
  },
  methods: {
    formatDate: formatDateLocale,
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
    rowClass(line) {
      if (line.expired) return "token-row-expired"
      if (line.expiringSoon) return "token-row-expiring"
      return ""
    },
    openViewModal(token) {
      this.selectedToken = token
      this.showViewModal = true
    },
    openDeleteModal(token) {
      this.selectedToken = token
      this.showDeleteModal = true
    },
    openRenewModal(token) {
      this.selectedToken = token
      this.showRenewModal = true
    },
    closeViewModal() {
      this.showViewModal = false
      this.selectedToken = null
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.selectedToken = null
    },
    closeRenewModal() {
      this.showRenewModal = false
      this.selectedToken = null
    },
    confirmDelete(tokenId) {
      this.$emit("delete-token", tokenId)
      this.closeDeleteModal()
    },
    async fetchToken() {
      const req = await apiGetToken(
        this.organizationId,
        this.selectedToken.userId,
      )
      if (req.status == "success") {
        return req.data
      } else {
        throw new Error(req.message)
      }
    },
    async fetchTokenValue(token) {
      const req = await apiGetToken(this.organizationId, token.userId)
      if (req.status == "success") {
        return req.data.auth_token
      } else {
        throw new Error("Failed to fetch token details")
      }
    },
  },
  components: {
    Chip,
    GenericTable,
    OrgaRoleSelector,
    ModalViewToken,
    ModalDeleteToken,
    ModalRenewToken,
  },
}
</script>

<style lang="scss">
.table-grid tr.token-row-expired > td {
  background-color: var(--danger-soft);
}
.table-grid tr.token-row-expiring > td {
  background-color: var(--warning-soft);
}
</style>

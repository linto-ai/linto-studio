<template>
  <div>
    <table
      class="table-grid"
      style="grid-template-columns: auto 1fr auto auto auto; width: 100%">
      <ApiTokenTableHeader
        @list_sort_by="sortBy"
        :sortListKey="sortListKey"
        :sortListDirection="sortListDirection" />
      <tbody>
        <div class="table-loader" v-if="loading">
          <Loading />
        </div>
        <ApiTokenTableLine
          v-for="token in tokenList"
          v-model="p_selectedTokens"
          :key="token.id"
          :token="token"
          @view-token="openViewModal"
          @delete-token="openDeleteModal"
          @renew-token="openRenewModal" />
      </tbody>
    </table>
    <ModalViewToken
      v-if="selectedToken"
      :organizationId="organizationId"
      v-model="showViewModal"
      :token="selectedToken"
      @close="closeViewModal" />
    <ModalDeleteToken
      v-if="selectedToken"
      v-model="showDeleteModal"
      :organizationId="organizationId"
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
import ApiTokenTableHeader from "./ApiTokenTableHeader.vue"
import ApiTokenTableLine from "./ApiTokenTableLine.vue"
import ModalDeleteToken from "./ModalDeleteToken.vue"
import ModalRenewToken from "./ModalRenewToken.vue"
import ModalViewToken from "./ModalViewToken.vue"
// import DeleteTokenModal from "./DeleteTokenModal.vue"
import Loading from "@/components/atoms/Loading.vue"

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
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
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
  },
  computed: {
    p_selectedTokens: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  components: {
    ApiTokenTableHeader,
    ApiTokenTableLine,
    ModalViewToken,
    ModalDeleteToken,
    ModalRenewToken,
    Loading,
  },
}
</script>

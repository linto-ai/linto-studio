<template>
  <div>
    <div class="flex row gap-medium">
      <h2 class="flex1">{{ $t("api_tokens_settings.title") }}</h2>
      <Button
        @click="createToken"
        size="sm"
        variant="primary"
        :label="$t('api_tokens_settings.create_token')" />
    </div>
    <ApiTokenTable
      :tokenList="apiTokens"
      :linkTo="linkTo"
      :value="selectedTokens"
      :sortListKey="sortKey"
      :sortListDirection="sortDirection"
      :loading="loading"
      @list_sort_by="handleSort"
      @delete-token="deleteToken"
      @input="updateSelectedTokens" />
    <ModalCreateToken
      v-model="showCreateModal"
      @close="closeCreateModal"
      @handleTokenCreated="handleTokenCreated" />
  </div>
</template>

<script>
import { bus } from "@/main.js"
import { listToken, apiDeleteToken } from "@/api/token.js"
import ApiTokenTable from "./ApiTokenTable.vue"
import ModalCreateToken from "./ModalCreateToken.vue"
import Button from "@/components/atoms/Button.vue"
import { mapGetters } from "vuex"

export default {
  props: {},
  data() {
    return {
      apiTokens: [],
      selectedTokens: [],
      sortKey: "name",
      sortDirection: "asc",
      loading: false,
      showCreateModal: false,
      linkTo: {
        name: "api-token-detail",
        params: { id: "id" },
      },
    }
  },
  mounted() {
    this.fetchTokens()
  },
  computed: {
    ...mapGetters("organizations", {
      organizationId: "getCurrentOrganizationScope",
    }),
  },
  methods: {
    async fetchTokens() {
      this.loading = true
      const response = await listToken(this.organizationId)
      this.apiTokens = response
      this.loading = false
    },
    createToken() {
      this.showCreateModal = true
    },
    closeCreateModal() {
      this.showCreateModal = false
    },
    handleTokenCreated() {
      this.closeCreateModal()
      this.fetchTokens()
    },
    handleSort(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
      } else {
        this.sortKey = key
        this.sortDirection = "asc"
      }
      this.sortTokens()
    },
    sortTokens() {
      this.apiTokens.sort((a, b) => {
        let comparison = 0
        if (a[this.sortKey] > b[this.sortKey]) {
          comparison = 1
        } else if (a[this.sortKey] < b[this.sortKey]) {
          comparison = -1
        }
        return this.sortDirection === "asc" ? comparison : -comparison
      })
    },
    async deleteToken(tokenUserId) {
      const res = await apiDeleteToken(this.organizationId, tokenUserId)
      if (res.status === "success") {
        this.apiTokens = this.apiTokens.filter(
          (token) => token.userId !== tokenUserId,
        )
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.delete_success"),
          type: "success",
          timeout: 5000,
        })
      } else {
        console.error("Error deleting token:", res)
        this.$store.dispatch("system/addNotification", {
          message: this.$t("api_tokens_settings.delete_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    updateSelectedTokens(selected) {
      this.selectedTokens = selected
    },
  },
  components: {
    ApiTokenTable,
    ModalCreateToken,
    Button,
  },
}
</script>

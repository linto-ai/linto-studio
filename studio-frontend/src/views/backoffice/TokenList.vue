<template>
  <MainContentBackoffice>
    <GenericTableRequest
      :fetchMethod="fetchMethod"
      :columns="columns"
      :sortListDirection="sortListDirection"
      :sortListKey="sortListKey" />
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import ApiTokenTable from "@/components/ApiTokenTable.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import { apiGetAllTokens } from "@/api/admin"

export default {
  props: {},
  data() {
    return {
      tokenList: [],
      loading: false,
      columns: [
        {
          key: "firstname",
          label: this.$t("api_tokens_settings.token_name_label"),
          width: "auto",
        },
        {
          key: "role",
          label: this.$t("api_tokens_settings.token_role_label"),
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
      ],
      sortListDirection: "asc",
      sortListKey: "createdAt",
    }
  },
  mounted() {
    this.fetchMethod()
  },
  methods: {
    fetchMethod: apiGetAllTokens,
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
  },
  components: {
    MainContentBackoffice,
    ApiTokenTable,
    GenericTableRequest,
  },
}
</script>

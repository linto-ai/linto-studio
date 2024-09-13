<template>
  <MainContentBackoffice :loading="loading">
    <HeaderTable
      :title="$t('backoffice.organisation_list.title')"
      :count="count"
      :add_button_label="
        $t('backoffice.organisation_list.add_organisation_button')
      "></HeaderTable>
    <div class="backoffice-listing-container">
      <OrganizationTable
        :organizationList="organizationList"
        :linkTo="{ name: 'backoffice-organizationDetail' }" />
    </div>
  </MainContentBackoffice>
</template>
<script>
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import { apiGetAllOrganizations } from "@/api/admin.js"
import HeaderTable from "../../components/HeaderTable.vue"
import OrganizationTable from "../../components/OrganizationTable.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      organizationList: [],
    }
  },
  mounted() {
    this.fetchAllOrganizations()
  },
  methods: {
    async fetchAllOrganizations() {
      this.loading = true
      this.organizationList = await apiGetAllOrganizations()
      this.loading = false
    },
  },
  computed: {
    count() {
      return this.organizationList.length
    },
  },
  components: { MainContentBackoffice, OrganizationTable, HeaderTable },
}
</script>

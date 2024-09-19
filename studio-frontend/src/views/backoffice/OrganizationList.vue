<template>
  <MainContentBackoffice :loading="loading">
    <HeaderTable
      :title="$t('backoffice.organisation_list.title')"
      :count="count"
      @on-create="showModalCreateOrganization"
      :add_button_label="
        $t('backoffice.organisation_list.add_organisation_button')
      "></HeaderTable>
    <div class="backoffice-listing-container">
      <OrganizationTable
        :organizationList="organizationList"
        :linkTo="{ name: 'backoffice-organizationDetail' }"
        v-model="selectedOrganizations" />
    </div>
    <Pagination
      :pages="totalPagesNumber"
      v-model="currentPageNb"
      v-if="count > 0"></Pagination>
    <ModalCreateOrganization
      @on-confirm="newOrganization"
      @on-cancel="hideModalCreateOrganization"
      v-if="modalCreateOrganizationIsVisible"></ModalCreateOrganization>
  </MainContentBackoffice>
</template>
<script>
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import { apiGetAllOrganizations } from "@/api/admin.js"

import HeaderTable from "@/components/HeaderTable.vue"
import OrganizationTable from "@/components/OrganizationTable.vue"
import ModalCreateOrganization from "@/components/ModalCreateOrganization.vue"
import Pagination from "@/components/Pagination.vue"
export default {
  props: {},
  data() {
    return {
      loading: true,
      organizationList: [],
      count: 0,
      modalCreateOrganizationIsVisible: false,
      selectedOrganizations: [],
      totalPagesNumber: 0,
      currentPageNb: 0,
    }
  },
  mounted() {
    this.fetchAllOrganizations()
  },
  methods: {
    async fetchAllOrganizations() {
      this.loading = true
      const req = await apiGetAllOrganizations(this.currentPageNb)
      this.organizationList = req.list
      this.count = req.count
      this.totalPagesNumber = Math.ceil(req.count / 10) + 1
      this.loading = false
    },
    showModalCreateOrganization() {
      this.modalCreateOrganizationIsVisible = true
    },
    hideModalCreateOrganization() {
      this.modalCreateOrganizationIsVisible = false
    },
    newOrganization(res) {
      this.organizationList.unshift(res.data)
      this.hideModalCreateOrganization()
    },
  },
  computed: {},
  watch: {
    currentPageNb() {
      this.fetchAllOrganizations()
    },
  },
  components: {
    MainContentBackoffice,
    OrganizationTable,
    HeaderTable,
    ModalCreateOrganization,
    Pagination,
  },
}
</script>

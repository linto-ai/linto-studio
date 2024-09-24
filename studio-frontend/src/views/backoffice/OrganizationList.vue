<template>
  <MainContentBackoffice :loading="loading">
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.organisation_list.title')"
        :count="count"
        v-bind:search.sync="search"
        @on-create="showModalCreateOrganization"
        :add_button_label="
          $t('backoffice.organisation_list.add_organisation_button')
        "></HeaderTable>
    </template>

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
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { debounceMixin } from "@/mixins/debounce.js"

import HeaderTable from "@/components/HeaderTable.vue"
import OrganizationTable from "@/components/OrganizationTable.vue"
import ModalCreateOrganization from "@/components/ModalCreateOrganization.vue"
import Pagination from "@/components/Pagination.vue"
export default {
  mixins: [platformRoleMixin, debounceMixin],
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
      search: "",
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
    this.debouncedFetchAllOrganizations()
  },
  methods: {
    async fetchAllOrganizations(search, signal) {
      return await apiGetAllOrganizations(
        this.currentPageNb,
        {},
        search,
        signal,
      )
    },
    async debouncedFetchAllOrganizations() {
      this.loading = true
      const req = await this.debouncedSearch(
        this.fetchAllOrganizations.bind(this),
        this.search,
      )
      this.organizationList = req.list
      this.count = req.count
      this.totalPagesNumber = Math.ceil(req.count / 10)
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
    search() {
      this.debouncedFetchAllOrganizations()
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

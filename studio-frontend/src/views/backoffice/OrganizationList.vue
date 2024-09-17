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
        :linkTo="{ name: 'backoffice-organizationDetail' }" />
    </div>
    <ModalCreateOrganization
      @on-confirm="newOrganization"
      @on-cancel="hideModalCreateOrganization"
      v-if="modalCreateOrganizationIsVisible"></ModalCreateOrganization>
  </MainContentBackoffice>
</template>
<script>
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import { apiGetAllOrganizations } from "@/api/admin.js"
import HeaderTable from "../../components/HeaderTable.vue"
import OrganizationTable from "../../components/OrganizationTable.vue"
import ModalCreateOrganization from "../../components/ModalCreateOrganization.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      organizationList: [],
      modalCreateOrganizationIsVisible: false,
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
  computed: {
    count() {
      return this.organizationList.length
    },
  },
  components: {
    MainContentBackoffice,
    OrganizationTable,
    HeaderTable,
    ModalCreateOrganization,
  },
}
</script>

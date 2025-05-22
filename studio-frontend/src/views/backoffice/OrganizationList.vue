<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.organisation_list.title')"
        :count="count"
        v-bind:search.sync="search"
        @on-create="showModalCreateOrganization"
        @on-delete="showModalDeleteMultipleOrganizations"
        :remove_button_label="
          $tc(
            'backoffice.organisation_list.remove_organisation_button',
            selectedOrganizations.length,
          )
        "
        :add_button_label="
          $t('backoffice.organisation_list.add_organisation_button')
        ">
        <template v-slot:right-header>
          <button
            v-if="showPersonalOrganizations"
            @click="changeShowPersonalOrganizations">
            <span class="icon show"></span>
            <span class="label">
              {{
                $t("backoffice.organisation_list.personal_organizations_shown")
              }}
            </span>
          </button>
          <button v-else @click="changeShowPersonalOrganizations">
            <span class="icon hide"></span>
            <span class="label">
              {{
                $t("backoffice.organisation_list.personal_organizations_hidden")
              }}
            </span>
          </button>
        </template>
      </HeaderTable>
    </template>

    <div class="backoffice-listing-container">
      <OrganizationTable
        :loading="loading"
        :organizationList="organizationList"
        :linkTo="{ name: 'backoffice-organizationDetail' }"
        :sortListKey="sortListKey"
        :sortListDirection="sortListDirection"
        @list_sort_by="sortBy"
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

    <ModalDeleteMultipleOrganizations
      @on-close="hideModalDeleteMultipleOrganizations"
      @on-confirm="reload"
      :selectedOrganizations="selectedOrganizations"
      v-if="
        modalDeleteMultipleOrganizationsIsVisible
      "></ModalDeleteMultipleOrganizations>
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
import Pagination from "@/components/molecules/pagination.vue"
import ModalDeleteMultipleOrganizations from "@/components/ModalDeleteMultipleOrganizations.vue"
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
      sortListKey: "name",
      sortListDirection: "asc",
      showPersonalOrganizations: false,
      modalDeleteMultipleOrganizationsIsVisible: false,
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
        {
          sortField: this.sortListKey,
          sortOrder: this.sortListDirection === "asc" ? 1 : -1,
          hidePersonal: !this.showPersonalOrganizations,
        },
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
    sortBy(key) {
      if (key === this.sortListKey) {
        this.sortListDirection =
          this.sortListDirection === "desc" ? "asc" : "desc"
      } else {
        this.sortListDirection = "desc"
      }
      this.sortListKey = key
      this.debouncedFetchAllOrganizations()
    },
    changeShowPersonalOrganizations() {
      this.showPersonalOrganizations = !this.showPersonalOrganizations
      this.debouncedFetchAllOrganizations()
    },
    showModalDeleteMultipleOrganizations() {
      this.modalDeleteMultipleOrganizationsIsVisible = true
    },
    hideModalDeleteMultipleOrganizations() {
      this.modalDeleteMultipleOrganizationsIsVisible = false
    },
    reload() {
      this.hideModalDeleteMultipleOrganizations()
      this.debouncedFetchAllOrganizations()
      this.selectedOrganizations = []
    },
  },
  computed: {},
  watch: {
    currentPageNb() {
      this.debouncedFetchAllOrganizations()
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
    ModalDeleteMultipleOrganizations,
  },
}
</script>

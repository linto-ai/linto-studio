<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.organisation_list.title')"
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
          <Button
            v-if="showPersonalOrganizations"
            @click="changeShowPersonalOrganizations"
            iconWeight="regular"
            icon="eye"
            :label="
              $t('backoffice.organisation_list.personal_organizations_shown')
            "></Button>
          <Button
            v-else
            @click="changeShowPersonalOrganizations"
            iconWeight="regular"
            icon="eye-slash"
            :label="
              $t('backoffice.organisation_list.personal_organizations_hidden')
            "></Button>
        </template>
      </HeaderTable>
    </template>

    <div class="flex1 flex col gap-medium">
      <GenericTableRequest
        ref="table"
        idKey="_id"
        selectable
        :selectedRows="selectedOrganizations"
        @update:selectedRows="selectedOrganizations = $event"
        :fetchMethod="fetchOrganizations"
        :fetchMethodParams="fetchMethodParams"
        :columns="columns"
        :initSortListDirection="'asc'"
        :initSortListKey="'name'">
        <template #header-personal>
          <ph-icon name="user" />
        </template>

        <template #cell-personal="{ value }">
          <span v-if="value" class="icon apply" />
          <span v-else class="icon close" />
        </template>

        <template #cell-created="{ value, id }">
          <router-link :to="orgDetailRoute(id)">
            {{ formatDate(value) }}
          </router-link>
        </template>

        <template #cell-name="{ value, id }">
          <router-link :to="orgDetailRoute(id)">{{ value }}</router-link>
        </template>

        <template #cell-userNumber="{ element }">
          {{ element.users ? element.users.length : 0 }}
        </template>

        <template #cell-actions="{ id }">
          <Button
            @click="$router.push(orgDetailRoute(id))"
            variant="secondary"
            icon="pencil"
            :label="$t('orga_table.edit_button_label')" />
        </template>
      </GenericTableRequest>
    </div>

    <ModalCreateOrganization
      @on-confirm="newOrganization"
      @on-cancel="hideModalCreateOrganization"
      v-model="modalCreateOrganizationIsVisible"
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
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { apiGetAllOrganizations } from "@/api/admin.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalCreateOrganization from "@/components/ModalCreateOrganization.vue"
import ModalDeleteMultipleOrganizations from "@/components/ModalDeleteMultipleOrganizations.vue"

export default {
  mixins: [platformRoleMixin],
  data() {
    return {
      selectedOrganizations: [],
      modalCreateOrganizationIsVisible: false,
      modalDeleteMultipleOrganizationsIsVisible: false,
      search: "",
      showPersonalOrganizations: false,
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
  },
  computed: {
    fetchMethodParams() {
      return {
        search: this.search,
        hidePersonal: !this.showPersonalOrganizations,
      }
    },
    columns() {
      return [
        { key: "personal", label: "", width: "auto" },
        {
          key: "created",
          label: this.$t("orga_table.header.creation_date"),
          width: "auto",
        },
        {
          key: "name",
          label: this.$t("orga_table.header.name"),
          width: "1fr",
        },
        {
          key: "userNumber",
          label: this.$t("orga_table.header.userNumber"),
          width: "1fr",
        },
        { key: "actions", label: "", width: "auto" },
      ]
    },
  },
  methods: {
    fetchOrganizations(page, { sortField, sortOrder, search, hidePersonal }) {
      return apiGetAllOrganizations(
        page,
        { sortField, sortOrder, hidePersonal },
        search,
      )
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : "-"
    },
    orgDetailRoute(organizationId) {
      return {
        name: "backoffice-organizationDetail",
        params: { organizationId },
      }
    },
    changeShowPersonalOrganizations() {
      this.showPersonalOrganizations = !this.showPersonalOrganizations
    },
    showModalCreateOrganization() {
      this.modalCreateOrganizationIsVisible = true
    },
    hideModalCreateOrganization() {
      this.modalCreateOrganizationIsVisible = false
    },
    newOrganization() {
      this.hideModalCreateOrganization()
      this.$refs.table.reset()
    },
    showModalDeleteMultipleOrganizations() {
      this.modalDeleteMultipleOrganizationsIsVisible = true
    },
    hideModalDeleteMultipleOrganizations() {
      this.modalDeleteMultipleOrganizationsIsVisible = false
    },
    reload() {
      this.hideModalDeleteMultipleOrganizations()
      this.selectedOrganizations = []
      this.$refs.table.reset()
    },
  },
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    ModalCreateOrganization,
    ModalDeleteMultipleOrganizations,
  },
}
</script>

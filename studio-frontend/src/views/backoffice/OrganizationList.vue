<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.organisation_list.title')"
        :search="search"
        :count="totalCount"
        @update:search="updateSearch"
        :disableDelete="selectedOrganizations.length === 0"
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
        "></HeaderTable>
    </template>

    <div class="flex1 flex col gap-medium">
      <Tabs
        v-if="isCloud"
        v-model="activeTab"
        :tabs="tabs"
        variant="secondary" />
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
          <Tooltip
            :text="
              value
                ? $t('backoffice.organisation_list.personal_organization')
                : $t('backoffice.organisation_list.group_organization')
            "
            position="bottom">
            <ph-icon :name="value ? 'user' : 'users-three'" color="neutral" />
          </Tooltip>
        </template>

        <template #cell-created="{ value, id }">
          <router-link :to="orgDetailRoute(id)">
            {{ formatDate(value) }}
          </router-link>
        </template>

        <template #cell-name="{ value, id }">
          <router-link :to="orgDetailRoute(id)">{{ value }}</router-link>
        </template>

        <template #cell-plan="{ value }">
          <div v-if="value" class="flex col">
            <span class="flex gap-small align-center">
              {{ planLabel(value) }}
              <Tag v-if="value.source === 'manual'" size="sm">
                {{ $t("orga_table.plan.manual") }}
              </Tag>
            </span>
            <span v-if="planDateText(value)" class="small-text">
              {{ planDateText(value) }}
            </span>
          </div>
        </template>

        <template #cell-userNumber="{ element }">
          {{ element.users ? element.users.length : 0 }}
        </template>

        <template #cell-actions="{ id }">
          <div class="flex gap-small">
            <Button
              @click="viewAsOrganization(id)"
              variant="secondary"
              icon="eye"
              size="sm"
              :label="$t('impersonation.browse_button_label')" />
            <Button
              @click="$router.push(orgDetailRoute(id))"
              variant="secondary"
              icon="pencil"
              size="sm"
              :label="$t('orga_table.edit_button_label')" />
          </div>
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
import { mapGetters } from "vuex"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { impersonationMixin } from "@/mixins/impersonation.js"
import { debounceMixin } from "@/mixins/debounce.js"
import { apiGetAllOrganizations, apiCountOrganizations } from "@/api/admin.js"
import { getEnv } from "@/tools/getEnv"
import { getPlanDisplayName } from "@/tools/backoffice/getPlanDisplayName.js"
import { computePlanDate } from "@/tools/backoffice/computePlanDate.js"
import { ORGANIZATION_TABS } from "@/const/organizationPlan.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalCreateOrganization from "@/components/ModalCreateOrganization.vue"
import ModalDeleteMultipleOrganizations from "@/components/ModalDeleteMultipleOrganizations.vue"
import Tabs from "@/components/molecules/Tabs.vue"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

export default {
  mixins: [platformRoleMixin, impersonationMixin, debounceMixin],
  data() {
    return {
      selectedOrganizations: [],
      modalCreateOrganizationIsVisible: false,
      modalDeleteMultipleOrganizationsIsVisible: false,
      search: "",
      isCloud: IS_MODE_CLOUD,
      activeTab: "free",
      totalCount: undefined,
      tabCounts: {},
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
    this.refreshCounts()
  },
  computed: {
    ...mapGetters("billing", ["plans"]),
    fetchMethodParams() {
      if (!this.isCloud) return { search: this.search }
      return {
        search: this.search,
        ...ORGANIZATION_TABS[this.activeTab].query,
      }
    },
    tabs() {
      return Object.entries(ORGANIZATION_TABS).map(([name, { icon }]) => ({
        name,
        icon,
        count: this.tabCounts[name],
        label: this.$t(`backoffice.organisation_list.tab.${name}`),
      }))
    },
    columns() {
      const columns = [
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
      ]
      if (this.isCloud) {
        columns.push({
          key: "plan",
          label: this.$t("orga_table.header.plan"),
          width: "auto",
          sortable: false,
        })
      }
      columns.push(
        {
          key: "userNumber",
          label: this.$t("orga_table.header.userNumber"),
          width: "1fr",
        },
        { key: "actions", label: "", width: "auto" },
      )
      return columns
    },
  },
  methods: {
    fetchOrganizations(page, { search, ...params }) {
      return apiGetAllOrganizations(page, params, search)
    },
    updateSearch(search) {
      this.search = search
      this.refreshCounts()
    },
    async refreshCounts() {
      const counts = await this.debouncedSearch(this.fetchCounts, this.search)
      if (!counts) return
      // HeaderTable hides an undefined count, not a null one
      this.totalCount = counts.total ?? undefined
      this.tabCounts = counts.tabs
    },
    // Resolves to null when a newer search aborted this one
    async fetchCounts(search, signal) {
      const [total, tabs] = await Promise.all([
        apiCountOrganizations({}, search, signal),
        this.isCloud ? this.fetchTabCounts(search, signal) : {},
      ])
      return signal.aborted ? null : { total, tabs }
    },
    async fetchTabCounts(search, signal) {
      const names = Object.keys(ORGANIZATION_TABS)
      const counts = await Promise.all(
        names.map((name) =>
          apiCountOrganizations(ORGANIZATION_TABS[name].query, search, signal),
        ),
      )
      return Object.fromEntries(names.map((name, i) => [name, counts[i]]))
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : "-"
    },
    planLabel(plan) {
      return getPlanDisplayName(this.plans, plan.planKey)
    },
    planDateText(plan) {
      const planDate = computePlanDate(plan)
      if (!planDate) return ""
      return this.$t(planDate.key, { date: this.formatDate(planDate.date) })
    },
    orgDetailRoute(organizationId) {
      return {
        name: "backoffice-organizationDetail",
        params: { organizationId },
      }
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
      this.refreshCounts()
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
      this.refreshCounts()
    },
  },
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    ModalCreateOrganization,
    ModalDeleteMultipleOrganizations,
    Tabs,
  },
}
</script>

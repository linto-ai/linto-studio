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
          <IsCloud>
            <PopoverList
              :items="planFilterItems"
              v-model="planFilter"
              color="neutral"
              :aria-label="
                $t('backoffice.organisation_list.plan_filter_label')
              " />
          </IsCloud>
          <Button
            v-if="showPersonalOrganizations"
            @click="changeShowPersonalOrganizations"
            iconWeight="regular"
            icon="user"
            :label="
              $t('backoffice.organisation_list.personal_organizations_shown')
            "></Button>
          <Button
            v-else
            @click="changeShowPersonalOrganizations"
            iconWeight="regular"
            icon="users-three"
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
              <Tag v-if="value.state === 'expired'" size="sm">
                {{ $t("orga_table.plan.expired") }}
              </Tag>
              <Tag v-else-if="value.mode !== 'normal'" size="sm">
                {{ $t("billing.mode." + value.mode) }}
              </Tag>
              <Tag v-else-if="value.source === 'manual'" size="sm">
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
import { apiGetAllOrganizations } from "@/api/admin.js"
import { getEnv } from "@/tools/getEnv"
import { buildPlanFilterQuery } from "@/tools/backoffice/buildPlanFilterQuery.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalCreateOrganization from "@/components/ModalCreateOrganization.vue"
import ModalDeleteMultipleOrganizations from "@/components/ModalDeleteMultipleOrganizations.vue"
import IsCloud from "@/components/atoms/IsCloud.vue"

const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

export default {
  mixins: [platformRoleMixin, impersonationMixin],
  data() {
    return {
      selectedOrganizations: [],
      modalCreateOrganizationIsVisible: false,
      modalDeleteMultipleOrganizationsIsVisible: false,
      search: "",
      showPersonalOrganizations: false,
      planFilter: "all",
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
  },
  computed: {
    ...mapGetters("billing", ["plans"]),
    fetchMethodParams() {
      return {
        search: this.search,
        hidePersonal: !this.showPersonalOrganizations,
        ...buildPlanFilterQuery(this.planFilter),
      }
    },
    // The expired variant exists for team plans only (collaboration)
    planFilterItems() {
      const items = [
        {
          value: "all",
          text: this.$t("backoffice.organisation_list.plan_filter.all"),
        },
      ]
      for (const plan of this.plans) {
        items.push({ value: plan.planKey, text: plan.displayName })
      }
      for (const plan of this.plans) {
        if (!plan.entitlements?.collaboration?.value) continue
        items.push({
          value: `${plan.planKey}:expired`,
          text: this.$t("backoffice.organisation_list.plan_filter.expired", {
            plan: plan.displayName,
          }),
        })
      }
      return items
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
      if (IS_MODE_CLOUD) {
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
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : "-"
    },
    planLabel(plan) {
      const known = this.plans.find((p) => p.planKey === plan.planKey)
      return known ? known.displayName : plan.planKey
    },
    planDateText(plan) {
      if (plan.renewsAt) {
        return this.$t("orga_table.plan.renews_on", {
          date: this.formatDate(plan.renewsAt),
        })
      }
      if (!plan.endsAt) return ""
      const key = plan.state === "expired" ? "ended_on" : "ends_on"
      return this.$t(`orga_table.plan.${key}`, {
        date: this.formatDate(plan.endsAt),
      })
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
    IsCloud,
  },
}
</script>

<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable :title="$t('backoffice.activity_list.title')" />
    </template>
    <Tabs
      :tabs="tabs"
      v-model="currentTab"
      variant="secondary"
      style="padding-bottom: 0.5rem">
      <template #end>
        <KpiExportDropdown
          :exportFn="exportActivityFn"
          :filenamePrefix="activityFilenamePrefix" />
      </template>
    </Tabs>
    <SessionsKpi
      v-if="currentTab === 'sessions_kpi'"
      :organizationId="selectedOrganization">
      <template #toolbar-start>
        <FormInput
          :field="{
            label: $t('backoffice.dashboard.filters.organization'),
            error: null,
          }"
          style="max-width: 300px">
          <template #custom-input>
            <PopoverList
              :items="organizationItems"
              :value="selectedOrganization"
              @input="selectedOrganization = $event"
              searchable
              full-width
              :overlay="false"
              color="neutral" />
          </template>
        </FormInput>
      </template>
    </SessionsKpi>
    <div class="flex1 flex col gap-medium" v-else>
      <UserSelector
        v-model="selecteduser"
        :label="$t('activity_list.user_filter_label')" />
      <GenericTableRequest
        ref="table"
        idKey="_id"
        :fetchMethod="fetchMethod"
        :fetchMethodParams="fetchMethodParams"
        :columns="columns"
        :initSortListDirection="sortListDirection"
        :initSortListKey="sortListKey">
        <template #cell-user.role.value="{ value }">
          <PlatformRoleSelector v-model="value" readonly compact v-if="value" />
        </template>

        <template #cell-organization.role.value="{ value }">
          <OrgaRoleSelector v-model="value" readonly v-if="value" />
        </template>

        <template #cell-http.method="{ value }">
          <HttpMethodChip :HttpMethod="value" v-if="value" />
        </template>

        <template #cell-http.url="{ value }">
          <FormatedUrl :url="value" v-if="value" />
        </template>

        <template #cell-user.info="{ value, element }">
          <UserInfoInline
            :user="value"
            :userId="value._id"
            v-if="value"
            :impersonatedBy="element.user?.impersonatedBy"
            :showImage="false" />
        </template>

        <template #cell-action="{ value }">
          <span
            class="saas-event"
            :class="`saas-event--${saasActionVariant(value)}`">
            {{ saasActionLabel(value) }}
          </span>
        </template>

        <template #cell-saas="{ element }">
          <span class="saas-detail">{{ saasDetail(element) }}</span>
        </template>
      </GenericTableRequest>
    </div>
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import { exportKpiSessions } from "@/api/kpi"
import {
  apiGetHttpActivityLogs,
  apiGetSessionActivityLogs,
  apiGetBackofficeActivityLogs,
  apiGetKeysActivityLogs,
  apiGetSaasActivityLogs,
  apiGetAllOrganizations,
  apiExportActivityLogs,
  ACTIVITY_SCOPE_BY_TAB,
} from "@/api/admin.js"
import { getEnv } from "@/tools/getEnv"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import PlatformRoleSelector from "@/components/molecules/PlatformRoleSelector.vue"
import OrgaRoleSelector from "@/components/molecules/OrgaRoleSelector.vue"
import HttpMethodChip from "@/components/atoms/HttpMethodChip.vue"
import FormatedUrl from "@/components/atoms/FormatedUrl.vue"
import UserSelector from "@/components/molecules/UserSelector.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import SessionsKpi from "@/components/SessionsKpi.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import KpiExportDropdown from "@/components/KpiExportDropdown.vue"
import { timeToHMS } from "@/tools/timeToHMS"

// SaaS event action -> i18n leaf (underscored; action strings contain dots).
const SAAS_ACTION_KEY = {
  "subscription.created": "subscription_created",
  "subscription.updated": "subscription_updated",
  "plan.changed": "plan_changed",
  "subscription.canceled": "subscription_canceled",
  "subscription.ended": "subscription_ended",
  "payment.succeeded": "payment_succeeded",
  "payment.failed": "payment_failed",
  "seats.changed": "seats_changed",
  "billing.exempt.enabled": "exempt_enabled",
  "billing.exempt.disabled": "exempt_disabled",
  "quota.exceeded": "quota_exceeded",
  "feature.denied": "feature_denied",
  "subscription.suspended": "subscription_suspended",
  "billing.user.purged": "user_purged",
}

const IS_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

export default {
  props: {},
  data() {
    return {
      sortListDirection: "desc",
      sortListKey: "timestamp",
      tabs: [
        {
          name: "ressources",
          label: this.$t("activity_list.tabs.ressources"),
          icon: "list",
        },
        {
          name: "keys",
          label: this.$t("activity_list.tabs.tokens"),
          icon: "key",
        },
        {
          name: "backoffice",
          label: this.$t("activity_list.tabs.backoffice"),
          icon: "graduation-cap",
        },
        // {
        //   name: "sessions",
        //   label: this.$t("activity_list.tabs.sessions"),
        //   icon: "broadcast",
        // },
        ...(IS_CLOUD
          ? [
              {
                name: "billing",
                label: this.$t("activity_list.tabs.billing"),
                icon: "credit-card",
              },
            ]
          : []),
        {
          name: "sessions_kpi",
          label: this.$t("activity_list.tabs.sessions_kpi"),
          icon: "broadcast",
        },
      ],
      currentTab: "ressources",
      selecteduser: null,
      selectedOrganization: null,
      organizations: [],
    }
  },
  mounted() {
    this.loadFiltersFromUrl()
    this.fetchOrganizations()
  },
  computed: {
    fetchMethodParams() {
      return {
        userId: this.selecteduser?._id,
      }
    },
    columns() {
      switch (this.currentTab) {
        case "ressources":
        case "keys":
          return [
            ...this.genericColumns,
            ...this.platformColumns,
            ...this.orgaColumns,
            ...this.httpColumns,
          ]
        case "backoffice":
          return [
            ...this.genericColumns,
            ...this.platformColumns,
            ...this.httpColumns,
          ]
        case "billing":
          return this.saasColumns
        case "sessions":
          return [...this.genericColumns, ...this.sessionColumns]
      }
    },
    genericColumns() {
      return [
        {
          key: "timestamp",
          label: this.$t("activity_list.time_label"),
          width: "auto",
          transformValue: (value) => {
            return new Date(value).toLocaleString()
          },
        },
        {
          key: "user.info",
          label: this.$t("activity_list.user_label"),
          width: "auto",
        },
      ]
    },
    orgaColumns() {
      return [
        {
          key: "organization.info.name",
          label: this.$t("activity_list.organization_name_label"),
          width: "auto",
        },
        {
          key: "organization.role.value",
          label: this.$t("activity_list.organization_role_label"),
          width: "auto",
        },
      ]
    },
    platformColumns() {
      return [
        {
          key: "user.role.value",
          label: this.$t("activity_list.platform_role_label"),
          width: "auto",
        },
      ]
    },
    httpColumns() {
      return [
        {
          key: "http.method",
          label: this.$t("activity_list.http_method_label"),
          width: "auto",
        },
        {
          key: "http.status",
          label: this.$t("activity_list.http_status_label"),
          width: "auto",
        },
        {
          key: "http.url",
          label: this.$t("activity_list.http_endpoint_label"),
          width: "1fr",
        },
      ]
    },
    sessionColumns() {
      return [
        {
          key: "session.name",
          label: this.$t("activity_list.session_name_label"),
          width: "auto",
        },
        {
          key: "session.sessionId",
          label: this.$t("activity_list.session_id_label"),
          width: "auto",
        },
        {
          key: "socket.totalWatchTime",
          label: this.$t("activity_list.watch_time_label"),
          width: "auto",
          transformValue: timeToHMS,
        },
        {
          key: "socket.connectionCount",
          label: this.$t("activity_list.connection_count_label"),
          width: "auto",
        },
      ]
    },
    saasColumns() {
      return [
        {
          key: "timestamp",
          label: this.$t("activity_list.time_label"),
          width: "auto",
          transformValue: (value) => new Date(value).toLocaleString(),
        },
        {
          key: "action",
          label: this.$t("activity_list.saas.event_label"),
          width: "auto",
        },
        {
          key: "organization.info.name",
          label: this.$t("activity_list.organization_name_label"),
          width: "auto",
        },
        {
          key: "user.info",
          label: this.$t("activity_list.user_label"),
          width: "auto",
        },
        {
          key: "saas",
          label: this.$t("activity_list.saas.details_label"),
          width: "1fr",
          sortable: false,
        },
      ]
    },
    organizationItems() {
      const allOption = {
        id: null,
        name: this.$t("backoffice.dashboard.filters.all_organizations"),
      }
      const orgItems = this.organizations.map((org) => ({
        id: org._id,
        name: org.name,
      }))
      return [allOption, ...orgItems]
    },
    fetchMethod() {
      switch (this.currentTab) {
        case "ressources":
          return apiGetHttpActivityLogs
        case "backoffice":
          return apiGetBackofficeActivityLogs
        case "keys":
          return apiGetKeysActivityLogs
        case "billing":
          return apiGetSaasActivityLogs
        case "sessions":
          return apiGetSessionActivityLogs
          break
      }
    },
    activityFilenamePrefix() {
      return this.currentTab === "sessions_kpi"
        ? "kpi-sessions"
        : `activity-${this.currentTab}`
    },
  },
  watch: {
    currentTab() {
      this.updateUrlParams()
    },
    selectedOrganization() {
      this.updateUrlParams()
    },
  },
  methods: {
    updateUrlParams() {
      const query = {}
      if (this.currentTab !== "ressources") query.tab = this.currentTab
      if (this.currentTab === "sessions_kpi" && this.selectedOrganization)
        query.org = this.selectedOrganization
      this.$router.replace({ query }).catch(() => {})
    },
    loadFiltersFromUrl() {
      const { tab, org } = this.$route.query
      if (tab && this.tabs.some((t) => t.name === tab)) this.currentTab = tab
      if (org) this.selectedOrganization = org
    },
    async fetchOrganizations() {
      const res = await apiGetAllOrganizations(0, { pageSize: 1000 })
      this.organizations = res.list || []
    },
    exportActivityFn(format) {
      if (this.currentTab === "sessions_kpi") {
        return exportKpiSessions(format, {
          organizationId: this.selectedOrganization,
        })
      }

      const scope = ACTIVITY_SCOPE_BY_TAB[this.currentTab] || {}
      return apiExportActivityLogs(format, {
        source: scope.source,
        scope: scope.scope,
        activity: scope.activity,
        userId: this.selecteduser?._id,
      })
    },
    saasActionLabel(action) {
      const key = SAAS_ACTION_KEY[action]
      return key ? this.$t(`activity_list.saas.actions.${key}`) : action || "—"
    },
    saasActionVariant(action) {
      if (action === "payment.failed") return "error"
      if (
        action === "quota.exceeded" ||
        action === "feature.denied" ||
        action === "subscription.suspended" ||
        action === "billing.user.purged"
      )
        return "warning"
      if (
        action === "subscription.canceled" ||
        action === "subscription.ended" ||
        action === "billing.exempt.disabled"
      )
        return "neutral"
      return "success"
    },
    saasDetail(row) {
      const d = (row && row.saas) || {}
      const a = row && row.action
      const fmtMoney = (cents, currency) => {
        if (cents == null) return ""
        const cur = (currency || "eur").toUpperCase()
        return `${(cents / 100).toFixed(2)} ${cur}`
      }
      switch (a) {
        case "plan.changed":
          return `${d.fromPlanKey || "?"} → ${d.toPlanKey || "?"}`
        case "seats.changed":
          return (
            `${d.fromSeats ?? "?"} → ${d.toSeats ?? "?"} ` +
            this.$t("activity_list.saas.seats_unit") +
            (d.prorated ? ` · ${this.$t("activity_list.saas.prorated")}` : "")
          )
        case "payment.succeeded":
        case "payment.failed":
          return fmtMoney(d.amount, d.currency)
        case "subscription.created":
        case "subscription.canceled":
        case "subscription.ended":
        case "billing.exempt.enabled":
        case "billing.exempt.disabled":
          return d.planKey || ""
        case "quota.exceeded":
          return `${d.capability || ""}: ${Math.round(d.used || 0)}/${
            d.limit ?? "∞"
          }${d.unit === "seconds" ? "s" : ""}`
        case "feature.denied":
          return d.capability || ""
        case "subscription.suspended":
          return `${d.fromStatus || "?"} → ${d.status || "unpaid"}`
        case "billing.user.purged":
          return `${d.usageRowsAnonymized ?? 0} ${this.$t(
            "activity_list.saas.rows_anonymized",
          )}`
        default:
          return row && row.message ? row.message : ""
      }
    },
  },
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    Tabs,
    PlatformRoleSelector,
    OrgaRoleSelector,
    HttpMethodChip,
    FormatedUrl,
    UserSelector,
    UserInfoInline,
    SessionsKpi,
    FormInput,
    KpiExportDropdown,
  },
}
</script>
<style lang="scss" scoped>
.saas-event {
  display: inline-block;
  padding: 0.1em 0.6em;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  &--success {
    background: var(--success-background, #e6f6ee);
    color: var(--success-color, #1c7d4d);
  }
  &--warning {
    background: var(--warning-background, #fdf3e3);
    color: var(--warning-color, #9a6700);
  }
  &--error {
    background: var(--error-background, #fdeaea);
    color: var(--error-color, #c0392b);
  }
  &--neutral {
    background: var(--neutral-20, #eceef1);
    color: var(--neutral-70, #555);
  }
}
.saas-detail {
  font-variant-numeric: tabular-nums;
  color: var(--neutral-70, #555);
}
</style>

<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable :title="$t('backoffice.activity_list.title')" />
    </template>
    <Tabs :tabs="tabs" v-model="currentTab" secondary></Tabs>
    <SessionsKpi v-if="currentTab == 'sessions_kpi'" />
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

        <template #cell-user.info="{ value }">
          <UserInfoInline
            :user="value"
            :userId="value._id"
            v-if="value"
            :showImage="false" />
        </template>
      </GenericTableRequest>
    </div>
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import {
  apiGetHttpActivityLogs,
  apiGetSessionActivityLogs,
  apiGetBackofficeActivityLogs,
  apiGetKeysActivityLogs,
} from "@/api/admin.js"

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
import { timeToHMS } from "@/tools/timeToHMS"

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
        {
          name: "sessions",
          label: this.$t("activity_list.tabs.sessions"),
          icon: "broadcast",
        },
        {
          name: "sessions_kpi",
          label: this.$t("activity_list.tabs.sessions_kpi"),
          icon: "chart-pie",
        },
      ],
      currentTab: "ressources",
      selecteduser: null,
    }
  },
  mounted() {},
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
    fetchMethod() {
      switch (this.currentTab) {
        case "ressources":
          return apiGetHttpActivityLogs
        case "backoffice":
          return apiGetBackofficeActivityLogs
        case "keys":
          return apiGetKeysActivityLogs
        case "sessions":
          return apiGetSessionActivityLogs
          break
      }
    },
  },
  methods: {},
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
  },
}
</script>

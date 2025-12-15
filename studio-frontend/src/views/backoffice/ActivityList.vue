<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable :title="$t('backoffice.activity_list.title')" />
    </template>
    <Tabs :tabs="tabs" v-model="currentTab" secondary></Tabs>
    <div class="flex1 flex col gap-medium">
      <UserSelector v-model="selecteduser" label="Filtrer par utilisateur" />
      <GenericTableRequest
        ref="table"
        idKey="_id"
        :fetchMethod="fetchMethod"
        :fetchMethodParams="fetchMethodParams"
        :columns="columns"
        :initSortListDirection="sortListDirection"
        :initSortListKey="sortListKey">
        <template #cell-user.role.value="{ value }">
          <PlatformRoleSelector v-model="value" readonly compact />
        </template>

        <template #cell-organization.role.value="{ value }">
          <OrgaRoleSelector v-model="value" readonly v-if="value" />
        </template>

        <template #cell-http.method="{ value }">
          <HttpMethodChip :HttpMethod="value" />
        </template>

        <template #cell-http.url="{ value }">
          <FormatedUrl :url="value" />
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

export default {
  props: {},
  data() {
    return {
      sortListDirection: "desc",
      sortListKey: "timestamp",
      tabs: [
        { name: "sessions", label: "Session" },
        { name: "ressources", label: "Ressources" },
        { name: "keys", label: "Accès aux clés d'api" },
        { name: "backoffice", label: "Backoffice" },
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
        case "backoffice":
        case "keys":
          return this.httpColumns
        case "sessions":
          return this.sessionColumns
      }
    },
    httpColumns() {
      return [
        // {
        //   key: "scope",
        //   label: this.$t("activity_list.scope_label"),
        //   width: "auto",
        // },
        {
          key: "level",
          label: this.$t("activity_list.level_label"),
          width: "auto",
        },
        {
          key: "user.info.email",
          label: this.$t("activity_list.user_email_label"),
          width: "auto",
        },
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
        {
          key: "user.role.value",
          label: this.$t("activity_list.platform_role_label"),
          width: "auto",
        },
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
          key: "scope",
          label: this.$t("activity_list.scope_label"),
          width: "auto",
        },
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
  },
}
</script>

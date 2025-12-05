<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable :title="$t('backoffice.activity_list.title')" />
    </template>
    <Tabs :tabs="tabs" v-model="currentTab" secondary></Tabs>
    <GenericTableRequest
      ref="table"
      idKey="_id"
      :fetchMethod="fetchMethod"
      :columns="columns"
      :initSortListDirection="sortListDirection"
      :initSortListKey="sortListKey">
    </GenericTableRequest>
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import {
  apiGetHttpActivityLogs,
  apiGetSessionActivityLogs,
} from "@/api/admin.js"
import Tabs from "@/components/molecules/Tabs.vue"

export default {
  props: {},
  data() {
    return {
      sortListDirection: "asc",
      sortListKey: "createdAt",
      tabs: [
        { name: "session", label: "Session" },
        { name: "http", label: "Http" },
      ],
      currentTab: "http",
    }
  },
  mounted() {},
  computed: {
    columns() {
      if (this.currentTab == "http") {
        return this.httpColumns
      } else {
        return this.sessionColumns
      }
    },
    httpColumns() {
      return [
        {
          key: "scope",
          label: this.$t("activity_list.scope_label"),
          width: "auto",
        },
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
      if (this.currentTab == "http") {
        return apiGetHttpActivityLogs
      } else {
        return apiGetSessionActivityLogs
      }
    },
  },
  methods: {},
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    Tabs,
  },
}
</script>

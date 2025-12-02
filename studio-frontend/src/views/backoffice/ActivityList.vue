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
import { apiGetHttpActivityLogs } from "@/api/admin.js"
import Tabs from "@/components/molecules/Tabs.vue"

export default {
  props: {},
  data() {
    return {
      columns: [
        {
          key: "scope",
          label: this.$t("backoffice.activity_list.scope_label"),
          width: "auto",
        },
        {
          key: "level",
          label: this.$t("backoffice.activity_list.level_label"),
          width: "auto",
        },
        {
          key: "http",
          label: this.$t("backoffice.activity_list.http_label"),
          width: "auto",
        },
      ],
      sortListDirection: "asc",
      sortListKey: "createdAt",
      tabs: [
        { name: "session", label: "session" },
        { name: "http", label: "http" },
      ],
      currentTab: "http",
    }
  },
  mounted() {},
  methods: {
    fetchMethod: apiGetHttpActivityLogs,
  },
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    Tabs,
  },
}
</script>

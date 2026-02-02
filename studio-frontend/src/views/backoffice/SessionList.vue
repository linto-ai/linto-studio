<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable
        :title="$t('session_list.title')"
        @on-delete="showModalDeleteSessions"
        :disableDelete="selectedSessions.length === 0"
        :remove_button_label="
          $tc('session_list.remove_session_button', selectedSessions.length)
        " />
    </template>

    <div class="flex1 flex col gap-medium">
      <GenericTableRequest
        ref="table"
        idKey="id"
        selectable
        :selectedRows="selectedSessions"
        @update:selectedRows="selectedSessions = $event"
        :fetchMethod="fetchMethod"
        :fetchMethodParams="fetchMethodParams"
        :columns="columns"
        :initSortListDirection="sortListDirection"
        :initSortListKey="sortListKey">
        <template #cell-status="{ element }">
          <SessionStatus :session="element" small withText />
        </template>

        <template #cell-visibility="{ value }">
          <Chip :value="visibilityLabel(value)" v-if="value" />
        </template>

        <template #cell-startDate="{ element }">
          {{ formatDate(element.startTime || element.scheduleOn) }}
        </template>

        <template #cell-channels="{ value }">
          <Badge v-if="value">{{ value.length }}</Badge>
        </template>
      </GenericTableRequest>
    </div>

    <ModalDeleteSessions
      @on-close="hideModalDeleteSessions"
      @on-confirm="reload"
      :selectedSessions="selectedSessions"
      v-if="modalDeleteSessionsIsVisible" />
  </MainContentBackoffice>
</template>

<script>
import { apiGetAdminSessions } from "@/api/admin.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import SessionStatus from "@/components/SessionStatus.vue"
import Chip from "@/components/atoms/Chip.vue"
import Badge from "@/components/atoms/Badge.vue"
import ModalDeleteSessions from "@/components/ModalDeleteSessions.vue"

export default {
  data() {
    return {
      sortListDirection: "desc",
      sortListKey: "scheduleOn",
      selectedSessions: [],
      modalDeleteSessionsIsVisible: false,
    }
  },
  computed: {
    fetchMethodParams() {
      return {}
    },
    fetchMethod() {
      return apiGetAdminSessions
    },
    columns() {
      return [
        {
          key: "name",
          label: this.$t("session_list.columns.name"),
          width: "1fr",
        },
        {
          key: "status",
          label: this.$t("session_list.columns.status"),
          width: "auto",
        },
        {
          key: "organizationId",
          label: this.$t("session_list.columns.organization"),
          width: "auto",
        },
        {
          key: "visibility",
          label: this.$t("session_list.columns.visibility"),
          width: "auto",
        },
        {
          key: "startDate",
          label: this.$t("session_list.columns.start_date"),
          width: "auto",
        },
        {
          key: "endOn",
          label: this.$t("session_list.columns.end_date"),
          width: "auto",
          transformValue: (value) => {
            return value ? new Date(value).toLocaleString() : "-"
          },
        },
        {
          key: "channels",
          label: this.$t("session_list.columns.channels"),
          width: "auto",
        },
      ]
    },
  },
  methods: {
    visibilityLabel(visibility) {
      return this.$t(`session_list.visibility.${visibility}`)
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleString() : "-"
    },
    showModalDeleteSessions() {
      this.modalDeleteSessionsIsVisible = true
    },
    hideModalDeleteSessions() {
      this.modalDeleteSessionsIsVisible = false
    },
    reload() {
      this.hideModalDeleteSessions()
      this.selectedSessions = []
      this.$refs.table.reset()
    },
  },
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    SessionStatus,
    Chip,
    Badge,
    ModalDeleteSessions,
  },
}
</script>

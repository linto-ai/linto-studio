<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.transcriber_profile_list.title')"
        @on-create="showModalCreateTranscriberProfile"
        @on-delete="deleteSelectedProfiles"
        :add_button_label="
          $t(
            'backoffice.transcriber_profile_list.add_transcriber_profile_button',
          )
        "
        :remove_button_label="
          $tc(
            'backoffice.transcriber_profile_list.remove_transcriber_profile_button',
            selectedProfiles.length,
          )
        ">
        <template v-slot:right-header>
          <Button
            v-if="showAllProfiles"
            @click="changeShowAllProfiles"
            variant="secondary"
            icon="eye"
            iconWeight="regular"
            :label="
              $t('backoffice.transcriber_profile_list.all_profiles_shown')
            " />
          <Button
            v-else
            @click="changeShowAllProfiles"
            variant="secondary"
            icon="eye-slash"
            iconWeight="regular"
            :label="
              $t('backoffice.transcriber_profile_list.global_profiles_shown')
            " />
        </template>
      </HeaderTable>
    </template>
    <NotificationBanner
      class="small-margin-bottom"
      variant="warning"
      v-if="!showAllProfiles">
      {{ $t("backoffice.transcriber_profile_list.warning_global.line_1") }}
    </NotificationBanner>
    <GenericTableRequest
      ref="table"
      idKey="id"
      selectable
      :selectedRows="selectedProfiles"
      @update:selectedRows="selectedProfiles = $event"
      :fetchMethod="fetchTranscriberProfiles"
      :fetchMethodParams="fetchMethodParams"
      :columns="columns"
      :initSortListDirection="sortListDirection"
      :initSortListKey="sortListKey">
      <template #cell-organizationId="{ value }">
        <span v-if="value" class="icon apply" />
        <span v-else class="icon close" />
      </template>
      <template #cell-config.name="{ value, id }">
        <span class="clickable" @click="editProfile(id)">{{ value }}</span>
      </template>
      <template #cell-config.description="{ value, id }">
        <span class="clickable" @click="editProfile(id)">{{ value }}</span>
      </template>
      <template #cell-config.languages="{ value, id }">
        <span class="clickable" @click="editProfile(id)">
          {{ value?.map((l) => l.candidate).join(", ") || "\u2014" }}
        </span>
      </template>
      <template #cell-actions="{ id }">
        <Button
          @click="editProfile(id)"
          variant="secondary"
          icon="pencil"
          :label="$t('backoffice.transcriber_profile_list.edit_button')" />
      </template>
    </GenericTableRequest>

    <ModalTranscriberProfile
      v-if="showModal"
      :transcriberProfileId="editProfileId"
      @on-confirm="onModalConfirm"
      @on-cancel="closeModal"
      @on-delete="onModalDelete" />
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"

import {
  apiAdminGetTranscriberProfiles,
  apiAdminDeleteTranscriberProfile,
} from "@/api/admin.js"

import bulkRequest from "@/tools/bulkRequest.js"
import { sortArray } from "@/tools/sortList.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalTranscriberProfile from "@/components/ModalTranscriberProfile.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"

export default {
  data() {
    return {
      columns: [
        {
          key: "organizationId",
          label: "",
          width: "auto",
        },
        {
          key: "config.name",
          label: this.$t("session.profile_selector.labels.name"),
          width: "1fr",
        },
        {
          key: "config.description",
          label: this.$t("session.profile_selector.labels.description"),
          width: "1fr",
        },
        {
          key: "config.languages",
          label: this.$t("session.profile_selector.labels.languages"),
          width: "1fr",
          transformValue: (langs) =>
            langs?.map((l) => l.candidate).join(", ") || "\u2014",
        },
        {
          key: "actions",
          label: "",
          width: "auto",
        },
      ],
      selectedProfiles: [],
      showModal: false,
      editProfileId: null,
      sortListKey: "config.name",
      sortListDirection: "asc",
      showAllProfiles: false,
    }
  },
  methods: {
    changeShowAllProfiles() {
      this.showAllProfiles = !this.showAllProfiles
    },
    async fetchTranscriberProfiles(pageNumber, { sortField, sortOrder, showAllProfiles }) {
      const allProfiles = await apiAdminGetTranscriberProfiles()
      let filtered = showAllProfiles
        ? allProfiles
        : allProfiles.filter((t) => !t.organizationId)
      filtered = sortArray(filtered, sortField, sortOrder === 1 ? "asc" : "desc")
      return { list: filtered, count: filtered.length }
    },
    showModalCreateTranscriberProfile() {
      this.editProfileId = null
      this.showModal = true
    },
    editProfile(profileId) {
      this.editProfileId = profileId
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editProfileId = null
    },
    onModalConfirm() {
      this.closeModal()
      this.$refs.table.reset()
    },
    onModalDelete() {
      this.closeModal()
      this.$refs.table.reset()
    },
    async deleteSelectedProfiles() {
      const req = await bulkRequest(
        apiAdminDeleteTranscriberProfile,
        this.selectedProfiles.map((id) => [id]),
        (count) => {
          this.$store.dispatch(
            "system/removeNotificationById",
            "profile-deletion-loading",
          )
          this.$store.dispatch("system/addNotification", {
            message: this.$i18n.t(
              "backoffice.transcriber_profile_list.bulk_remove_loading_notification",
              { count, total: this.selectedProfiles.length },
            ),
            type: "loading",
            timeout: -1,
            id: "profile-deletion-loading",
          })
        },
      )
      this.$store.dispatch(
        "system/removeNotificationById",
        "profile-deletion-loading",
      )
      if (req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$i18n.t(
            "backoffice.transcriber_profile_list.bulk_remove_success_notification",
          ),
        })
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "backoffice.transcriber_profile_list.bulk_remove_error_notification",
          ),
        })
      }
      this.$refs.table.reset()
      this.selectedProfiles = []
    },
  },
  computed: {
    fetchMethodParams() {
      return { showAllProfiles: this.showAllProfiles }
    },
  },
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    ModalTranscriberProfile,
    NotificationBanner,
  },
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}
</style>

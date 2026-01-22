<template>
  <MainContentBackoffice :loading="loading">
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.transcriber_profile_list.title')"
        :count="count"
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
    <div class="backoffice-listing-container">
      <TranscriberProfileTable
        @list_sort_by="sortBy"
        @edit="editProfile"
        :sortListKey="sortListKey"
        :sortListDirection="sortListDirection"
        :transcriberProfilesList="sortedTranscriberProfiles"
        :loading="loading"
        v-model="selectedProfiles" />
    </div>

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
import TranscriberProfileTable from "@/components/TranscriberProfileTable.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalTranscriberProfile from "@/components/ModalTranscriberProfile.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import { debounceMixin } from "@/mixins/debounce.js"

export default {
  mixins: [debounceMixin],
  props: {},
  data() {
    return {
      loading: true,
      transcriberProfiles: [],
      selectedProfiles: [],
      search: "",
      showModal: false,
      editProfileId: null,
      sortListKey: "config.name",
      sortListDirection: "asc",
      showAllProfiles: false,
    }
  },
  mounted() {
    this.debouncedFetchTranscriberProfiles()
  },
  methods: {
    changeShowAllProfiles() {
      this.showAllProfiles = !this.showAllProfiles
      this.debouncedFetchTranscriberProfiles()
    },
    async fetchTranscriberProfiles() {
      const res = await apiAdminGetTranscriberProfiles()
      return res
    },
    async debouncedFetchTranscriberProfiles() {
      this.loading = true
      const res = await this.debouncedSearch(
        this.fetchTranscriberProfiles.bind(this),
        this.search,
      )
      if (!this.showAllProfiles) {
        this.transcriberProfiles = res.filter((t) => !t.organizationId)
      } else {
        this.transcriberProfiles = res
      }
      this.loading = false
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
      this.debouncedFetchTranscriberProfiles()
    },
    onModalDelete() {
      this.closeModal()
      this.debouncedFetchTranscriberProfiles()
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
        this.debouncedFetchTranscriberProfiles()
        this.selectedProfiles = []
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "backoffice.transcriber_profile_list.bulk_remove_error_notification",
          ),
        })
        this.debouncedFetchTranscriberProfiles()
        this.selectedProfiles = []
      }
    },
    sortBy(key) {
      if (key === this.sortListKey) {
        this.sortListDirection =
          this.sortListDirection === "desc" ? "asc" : "desc"
      } else {
        this.sortListDirection = "desc"
      }
      this.sortListKey = key
    },
  },
  computed: {
    count() {
      return this.transcriberProfiles.length
    },
    sortedTranscriberProfiles() {
      let res = sortArray(
        this.transcriberProfiles,
        this.sortListKey,
        this.sortListDirection,
      )
      return res
    },
  },
  components: {
    MainContentBackoffice,
    TranscriberProfileTable,
    HeaderTable,
    ModalTranscriberProfile,
    NotificationBanner,
  },
}
</script>

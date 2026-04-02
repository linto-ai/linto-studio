<template>
  <section>
    <div class="flex gap-medium small-margin-bottom align-center">
      <h2 style="width: auto">
        {{ $t("organisation.transcriber_profiles.title") }}
      </h2>
      <Button
        @click="showModalCreateTranscriberProfile"
        variant="primary"
        icon="plus"
        :label="
          $t(
            'backoffice.transcriber_profile_list.add_transcriber_profile_button',
          )
        " />
      <Button
        @click="deleteSelectedProfiles"
        :disabled="selectedProfiles.length === 0"
        variant="secondary"
        intent="destructive"
        icon="trash"
        :label="
          $tc(
            'backoffice.transcriber_profile_list.remove_transcriber_profile_button',
            selectedProfiles.length,
          )
        " />
    </div>
    <div v-if="transcriberProfiles.length === 0 && !loading" class="">
      {{ $t("organisation.transcriber_profiles.no_profiles") }}
    </div>
    <div v-else>
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
      :organizationId="organizationId"
      :transcriberProfileId="editProfileId"
      @on-confirm="onModalConfirm"
      @on-cancel="closeModal"
      @on-delete="onModalDelete" />
  </section>
</template>
<script>
import { bus } from "@/main.js"
import { apiGetTranscriberProfilesByOrganization } from "@/api/session.js"
import { sortArray } from "@/tools/sortList.js"

import { apiAdminDeleteTranscriberProfile } from "@/api/admin.js"
import bulkRequest from "@/tools/bulkRequest.js"

import TranscriberProfileTable from "@/components/TranscriberProfileTable.vue"
import ModalTranscriberProfile from "@/components/ModalTranscriberProfile.vue"
export default {
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
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
    }
  },
  mounted() {
    this.fetchTranscriberProfiles()
  },
  methods: {
    sortBy(key) {
      this.sortListKey = key
      this.sortListDirection = this.sortListDirection === "asc" ? "desc" : "asc"
    },
    async fetchTranscriberProfiles() {
      this.loading = true
      const res = await apiGetTranscriberProfilesByOrganization(
        this.organizationId,
        true,
      )
      this.transcriberProfiles = res
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
    onModalConfirm() {
      this.showModal = false
      this.editProfileId = null
      this.fetchTranscriberProfiles()
    },
    onModalDelete() {
      this.showModal = false
      this.editProfileId = null
      this.fetchTranscriberProfiles()
    },
    closeModal() {
      this.showModal = false
      this.editProfileId = null
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
      this.selectedProfiles = []
      this.fetchTranscriberProfiles()
    },
  },
  computed: {
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
    TranscriberProfileTable,
    ModalTranscriberProfile,
  },
}
</script>

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
        "></HeaderTable>
    </template>

    <div class="backoffice-listing-container">
      <TranscriberProfileTable
        @list_sort_by="sortBy"
        :sortListKey="sortListKey"
        :sortListDirection="sortListDirection"
        :transcriberProfilesList="sortedTranscriberProfiles"
        :loading="loading"
        :linkTo="{ name: 'backoffice-transcriberProfileDetail' }"
        v-model="selectedProfiles" />
    </div>

    <ModalCreateTranscriberProfiles
      v-if="showModalCreate"
      @on-confirm="confirmCreation"
      @on-cancel="cancelCreation"
      @close="showModalCreate = false" />
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import {
  apiGetTranscriberProfiles,
  apiDeleteTranscriberProfile,
} from "@/api/session.js"
import bulkRequest from "@/tools/bulkRequest.js"
import { sortArray } from "@/tools/sortList.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import TranscriberProfileTable from "@/components/TranscriberProfileTable.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalCreateTranscriberProfiles from "@/components/ModalCreateTranscriberProfiles.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      transcriberProfiles: [],
      selectedProfiles: [],
      search: "",
      showModalCreate: false,
      sortListKey: "config.name",
      sortListDirection: "asc",
    }
  },
  mounted() {
    this.fetchTranscriberProfiles()
  },
  methods: {
    async fetchTranscriberProfiles() {
      this.loading = true
      const res = await apiGetTranscriberProfiles()
      this.transcriberProfiles = res
      this.loading = false
    },
    showModalCreateTranscriberProfile() {
      this.showModalCreate = true
    },
    confirmCreation() {
      this.showModalCreate = false
      this.fetchTranscriberProfiles()
    },
    cancelCreation() {
      this.showModalCreate = false
    },
    async deleteSelectedProfiles() {
      const req = await bulkRequest(
        apiDeleteTranscriberProfile,
        this.selectedProfiles.map((id) => [id]),
        (count) => {
          bus.$emit("app_notif", {
            status: "loading",
            message: this.$i18n.t(
              "backoffice.transcriber_profile_list.bulk_remove_loading_notification",
              { count, total: this.selectedProfiles.length },
            ),
            timeout: -1,
            cantBeClosed: true,
          })
        },
      )

      if (req.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$i18n.t(
            "backoffice.transcriber_profile_list.bulk_remove_success_notification",
          ),
        })
        this.fetchTranscriberProfiles()
        this.selectedProfiles = []
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "backoffice.transcriber_profile_list.bulk_remove_error_notification",
          ),
        })
        this.fetchTranscriberProfiles()
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
      console.log("res", res)
      return res
    },
  },
  components: {
    MainContentBackoffice,
    TranscriberProfileTable,
    HeaderTable,
    ModalCreateTranscriberProfiles,
  },
}
</script>

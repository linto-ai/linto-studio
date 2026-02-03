<template>
  <section>
    <div class="flex gap-medium small-margin-bottom">
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
      <!-- <button @click="showModalCreateTranscriberProfile">
        <span class="icon plus"></span>
        <span class="label">{{
          $t(
            "backoffice.transcriber_profile_list.add_transcriber_profile_button",
          )
        }}</span>
      </button> -->
    </div>
    <div v-if="transcriberProfiles.length === 0 && !loading" class="">
      {{ $t("organisation.transcriber_profiles.no_profiles") }}
    </div>
    <div v-else>
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
      :organizationId="organizationId"
      @on-confirm="confirmCreation"
      @on-cancel="cancelCreation" />
  </section>
</template>
<script>
import { bus } from "@/main.js"
import { apiGetTranscriberProfilesByOrganization } from "@/api/session.js"
import { sortArray } from "@/tools/sortList.js"

import { apiAdminDeleteTranscriberProfile } from "@/api/admin.js"

import TranscriberProfileTable from "@/components/TranscriberProfileTable.vue"
import ModalCreateTranscriberProfiles from "@/components/ModalTranscriberProfile.vue"
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
      showModalCreate: false,
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
        apiAdminDeleteTranscriberProfile,
        this.selectedProfiles.map((profile) => profile.id),
      )
      if (req) {
        this.fetchTranscriberProfiles()
      }
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
    ModalCreateTranscriberProfiles,
  },
}
</script>

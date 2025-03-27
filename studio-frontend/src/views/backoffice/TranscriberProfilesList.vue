<template>
  <MainContentBackoffice :loading="loading">
    <template v-slot:header>
      <HeaderTable
        :title="$t('backoffice.transcriber_profile_list.title')"
        :count="count"
        @on-create="showModalCreateTranscriberProfile"
        :add_button_label="
          $t(
            'backoffice.transcriber_profile_list.add_transcriber_profile_button',
          )
        "></HeaderTable>
    </template>

    <div class="backoffice-listing-container">
      <TranscriberProfileTable
        :transcriberProfilesList="transcriberProfiles"
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
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import { apiGetTranscriberProfiles } from "@/api/session.js"
import TranscriberProfileTable from "@/components/TranscriberProfileTable.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalCreateTranscriberProfiles from "../../components/ModalCreateTranscriberProfiles.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      transcriberProfiles: [],
      selectedProfiles: [],
      search: "",
      showModalCreate: false,
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
  },
  computed: {
    count() {
      return this.transcriberProfiles.length
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

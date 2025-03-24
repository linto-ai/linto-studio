<template>
  <MainContentBackoffice :loading="loading">
    <div class="backoffice-listing-container">
      <TranscriberProfileTable
        :transcriberProfilesList="transcriberProfiles"
        :loading="loading"
        v-model="selectedProfiles" />
    </div>
  </MainContentBackoffice>
</template>
<script>
import { bus } from "@/main.js"
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import { apiGetTranscriberProfiles } from "@/api/session.js"
import TranscriberProfileTable from "@/components/TranscriberProfileTable.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      transcriberProfiles: [],
      selectedProfiles: [],
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
  },
  components: {
    MainContentBackoffice,
    TranscriberProfileTable,
  },
}
</script>

<template>
  <MainContentBackoffice :loading="loading">
    <div class="flex gap-medium">
      <StatCard :count="usersCount" title="Users" icon="profile" />
      <StatCard :count="organizationCount" title="Organizations" icon="work" />
    </div>
  </MainContentBackoffice>
</template>
<script>
import { apiGetAllUsers, apiGetAllOrganizations } from "@/api/admin.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import StatCard from "@/components/StatCard.vue"
export default {
  props: {},
  data() {
    return {
      loading: true,
      usersCount: 0,
      organizationCount: 0,
    }
  },
  mounted() {
    this.fetchAll()
  },
  methods: {
    async fetchAll() {
      this.loading = true
      await this.countUsers()
      await this.countOrganizations()
      this.loading = false
    },
    async countUsers() {
      const req = await apiGetAllUsers()
      this.usersCount = req.count
    },
    async countOrganizations() {
      const req = await apiGetAllOrganizations()
      this.organizationCount = req.count
    },
  },
  computed: {},
  components: { MainContentBackoffice, StatCard },
}
</script>

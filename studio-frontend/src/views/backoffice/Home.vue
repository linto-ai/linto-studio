<template>
  <MainContentBackoffice :loading="loading">
    <div class="flex gap-medium">
      <StatCard :count="userCount" title="Users" icon="profile" />
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
      users: [],
      organizationList: [],
    }
  },
  mounted() {
    this.fetchAll()
  },
  methods: {
    async fetchAll() {
      this.loading = true
      await this.fetchAllUsers()
      await this.fetchAllOrganizations()
      this.loading = false
    },
    async fetchAllUsers() {
      this.users = await apiGetAllUsers()
    },
    async fetchAllOrganizations() {
      this.organizationList = await apiGetAllOrganizations()
    },
  },
  computed: {
    userCount() {
      return this.users.length
    },
    organizationCount() {
      return this.organizationList.length
    },
  },
  components: { MainContentBackoffice, StatCard },
}
</script>

<template>
  <MainContentBackoffice :loading="loading">
    <HeaderTable
      :title="$t('backoffice.user_list.title')"
      :count="count"
      :add_button_label="
        $t('backoffice.user_list.add_user_button')
      "></HeaderTable>
    <div class="backoffice-listing-container">
      <UserTable :users="users" />
    </div>
  </MainContentBackoffice>
</template>
<script>
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UserTable from "@/components/UserTable.vue"
import { apiGetUsers } from "@/api/user.js"
import HeaderTable from "../../components/HeaderTable.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      users: [],
    }
  },
  mounted() {
    this.fetchAllUsers()
  },
  methods: {
    async fetchAllUsers() {
      this.loading = true
      this.users = await apiGetUsers()
      this.loading = false
    },
  },
  computed: {
    count() {
      return this.users.length
    },
  },
  components: { MainContentBackoffice, UserTable, HeaderTable },
}
</script>

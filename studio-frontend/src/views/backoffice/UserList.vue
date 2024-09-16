<template>
  <MainContentBackoffice :loading="loading">
    <HeaderTable
      :title="$t('backoffice.user_list.title')"
      :count="count"
      :remove_button_label="
        $tc('backoffice.user_list.remove_user_button', selectedUsers.length)
      "
      :add_button_label="
        $t('backoffice.user_list.add_user_button')
      "></HeaderTable>
    <div class="backoffice-listing-container">
      <UserTable
        :users="users"
        :linkTo="{ name: 'backoffice-userDetail' }"
        v-model="selectedUsers" />
    </div>
  </MainContentBackoffice>
</template>
<script>
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UserTable from "@/components/UserTable.vue"
import { apiGetAllUsers } from "@/api/admin.js"
import HeaderTable from "../../components/HeaderTable.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      users: [],
      selectedUsers: [],
    }
  },
  mounted() {
    this.fetchAllUsers()
  },
  methods: {
    async fetchAllUsers() {
      this.loading = true
      this.users = await apiGetAllUsers()
      this.loading = false
    },
  },
  computed: {
    count() {
      return this.users.length
    },
  },
  watch: {
    selectedUsers() {
      console.log(this.selectedUsers)
    },
  },
  components: { MainContentBackoffice, UserTable, HeaderTable },
}
</script>

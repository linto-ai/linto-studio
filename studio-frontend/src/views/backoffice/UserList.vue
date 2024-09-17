<template>
  <MainContentBackoffice :loading="loading">
    <HeaderTable
      @on-delete="showModalDeleteUsers"
      :title="$t('backoffice.user_list.title')"
      :count="count"
      :disableDelete="selectedUsers.length === 0"
      :remove_button_label="
        $tc('backoffice.user_list.remove_user_button', selectedUsers.length)
      "></HeaderTable>
    <div class="backoffice-listing-container">
      <UserTable
        :users="users"
        :linkTo="{ name: 'backoffice-userDetail' }"
        v-model="selectedUsers" />
    </div>
    <ModalDeleteUsers
      @on-close="hideModalDeleteUsers"
      @on-confirm="reload"
      :selectedUsers="selectedUsers"
      v-if="modalDeleteUsersIsVisible"></ModalDeleteUsers>
  </MainContentBackoffice>
</template>
<script>
import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UserTable from "@/components/UserTable.vue"
import { apiGetAllUsers } from "@/api/admin.js"
import HeaderTable from "../../components/HeaderTable.vue"
import ModalDeleteUsers from "../../components/ModalDeleteUsers.vue"

export default {
  props: {},
  data() {
    return {
      loading: true,
      users: [],
      selectedUsers: [],
      modalDeleteUsersIsVisible: false,
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
    showModalDeleteUsers() {
      this.modalDeleteUsersIsVisible = true
    },
    hideModalDeleteUsers() {
      this.modalDeleteUsersIsVisible = false
    },
    reload() {
      this.hideModalDeleteUsers()
      this.fetchAllUsers()
    },
  },
  computed: {
    count() {
      return this.users.length
    },
  },
  components: {
    MainContentBackoffice,
    UserTable,
    HeaderTable,
    ModalDeleteUsers,
  },
}
</script>

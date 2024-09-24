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
    <Pagination
      :pages="totalPagesNumber"
      v-model="currentPageNb"
      v-if="count > 0"></Pagination>
    <ModalDeleteUsers
      @on-close="hideModalDeleteUsers"
      @on-confirm="reload"
      :selectedUsers="selectedUsers"
      v-if="modalDeleteUsersIsVisible"></ModalDeleteUsers>
  </MainContentBackoffice>
</template>
<script>
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { apiGetAllUsers } from "@/api/admin.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import UserTable from "@/components/UserTable.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalDeleteUsers from "@/components/ModalDeleteUsers.vue"
import Pagination from "@/components/Pagination.vue"

export default {
  mixins: [platformRoleMixin],
  props: {},
  data() {
    return {
      loading: true,
      users: [],
      count: 0,
      selectedUsers: [],
      modalDeleteUsersIsVisible: false,
      currentPageNb: 0,
      totalPagesNumber: 0,
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
    this.fetchAllUsers()
  },
  methods: {
    async fetchAllUsers() {
      this.loading = true
      const req = await apiGetAllUsers(this.currentPageNb)
      this.users = req.list
      this.count = req.count
      this.totalPagesNumber = Math.ceil(req.count / 10)
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
  computed: {},
  watch: {
    currentPageNb() {
      this.fetchAllUsers()
    },
  },
  components: {
    MainContentBackoffice,
    UserTable,
    HeaderTable,
    ModalDeleteUsers,
    Pagination,
  },
}
</script>

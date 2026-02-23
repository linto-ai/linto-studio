<template>
  <MainContentBackoffice>
    <template v-slot:header>
      <HeaderTable
        v-bind:search.sync="search"
        @on-delete="showModalDeleteUsers"
        @on-create="showModalAddUser"
        :title="$t('backoffice.user_list.title')"
        :disableDelete="selectedUsers.length === 0"
        :remove_button_label="
          $tc('backoffice.user_list.remove_user_button', selectedUsers.length)
        "
        :add_button_label="
          $t('backoffice.user_list.add_user_button')
        "></HeaderTable>
    </template>

    <div class="flex1 flex col gap-medium">
      <GenericTableRequest
        ref="table"
        idKey="_id"
        selectable
        :selectedRows="selectedUsers"
        @update:selectedRows="selectedUsers = $event"
        :fetchMethod="fetchUsers"
        :fetchMethodParams="fetchMethodParams"
        :columns="columns"
        :initSortListDirection="'asc'"
        :initSortListKey="'email'">
        <template #cell-created="{ value, id }">
          <router-link :to="userDetailRoute(id)">
            {{ formatDate(value) }}
          </router-link>
        </template>

        <template #cell-email="{ value, id }">
          <router-link :to="userDetailRoute(id)">{{ value }}</router-link>
        </template>

        <template #cell-firstname="{ value, id }">
          <router-link :to="userDetailRoute(id)">{{ value }}</router-link>
        </template>

        <template #cell-lastname="{ value, id }">
          <router-link :to="userDetailRoute(id)">{{ value }}</router-link>
        </template>

        <template #cell-role="{ value, id }">
          <router-link :to="userDetailRoute(id)" class="flex flex1 gap-small">
            <span class="flex1">{{ platformRoleName(value) }}</span>
            <span>({{ value }})</span>
          </router-link>
        </template>

        <template #cell-actions="{ id }">
          <Button
            @click="$router.push(userDetailRoute(id))"
            variant="secondary"
            icon="pencil"
            :label="$t('user_table.edit_button_label')" />
        </template>
      </GenericTableRequest>
    </div>

    <ModalDeleteUsers
      @on-close="hideModalDeleteUsers"
      @on-confirm="reload"
      :selectedUsers="selectedUsers"
      v-if="modalDeleteUsersIsVisible"></ModalDeleteUsers>

    <ModalCreateUser
      @on-confirm="reload"
      @on-close="hideModalAddUser"
      v-if="modalAddUserIsVisible"></ModalCreateUser>
  </MainContentBackoffice>
</template>
<script>
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { apiGetAllUsers } from "@/api/admin.js"

import MainContentBackoffice from "@/components/MainContentBackoffice.vue"
import GenericTableRequest from "@/components/molecules/GenericTableRequest.vue"
import HeaderTable from "@/components/HeaderTable.vue"
import ModalDeleteUsers from "@/components/ModalDeleteUsers.vue"
import ModalCreateUser from "@/components/ModalCreateUser.vue"

export default {
  mixins: [platformRoleMixin],
  data() {
    return {
      selectedUsers: [],
      modalDeleteUsersIsVisible: false,
      modalAddUserIsVisible: false,
      search: "",
    }
  },
  mounted() {
    if (!this.isAtLeastSystemAdministrator) {
      this.$router.push({ name: "not_found" })
    }
  },
  computed: {
    fetchMethodParams() {
      return { search: this.search }
    },
    columns() {
      return [
        {
          key: "created",
          label: this.$t("user_table.header.creation_date"),
          width: "auto",
        },
        {
          key: "email",
          label: this.$t("user_table.header.email"),
          width: "1fr",
        },
        {
          key: "firstname",
          label: this.$t("user_table.header.firstname"),
          width: "1fr",
        },
        {
          key: "lastname",
          label: this.$t("user_table.header.lastname"),
          width: "1fr",
        },
        {
          key: "role",
          label: this.$t("user_table.header.platform_role"),
          width: "1fr",
        },
        {
          key: "actions",
          label: "",
          width: "auto",
        },
      ]
    },
  },
  methods: {
    fetchUsers(page, { sortField, sortOrder, search }) {
      return apiGetAllUsers(page, { sortField, sortOrder }, search)
    },
    platformRoleName(role) {
      switch (true) {
        case this.roleIsSuperAdministrator(role):
          return this.$t("platform_role.super_administrator")
        case this.roleIsSystemAdministrator(role):
          return this.$t("platform_role.system_administrator")
        case this.roleIsSessionOperator(role):
          return this.$t("platform_role.session_operator")
        case this.roleIsOrganizationInitiator(role):
          return this.$t("platform_role.organization_initiator")
        default:
          return "–"
      }
    },
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString() : "-"
    },
    userDetailRoute(userId) {
      return { name: "backoffice-userDetail", params: { userId } }
    },
    showModalDeleteUsers() {
      this.modalDeleteUsersIsVisible = true
    },
    showModalAddUser() {
      this.modalAddUserIsVisible = true
    },
    hideModalDeleteUsers() {
      this.modalDeleteUsersIsVisible = false
    },
    hideModalAddUser() {
      this.modalAddUserIsVisible = false
    },
    reload() {
      this.hideModalDeleteUsers()
      this.hideModalAddUser()
      this.selectedUsers = []
      this.$refs.table.reset()
    },
  },
  components: {
    MainContentBackoffice,
    GenericTableRequest,
    HeaderTable,
    ModalDeleteUsers,
    ModalCreateUser,
  },
}
</script>
